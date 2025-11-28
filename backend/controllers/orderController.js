import Order from '../models/Order.js';
import crypto from 'crypto';
import Stripe from 'stripe';
import { sendEmail } from '../utils/email.js';
import { orderConfirmationTemplate, orderStatusUpdateTemplate } from '../utils/emailTemplates.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create COD Order
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, notes, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Calculate amounts
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const shippingCost = subtotal > 50 ? 0 : 5;

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
            orderStatus: 'pending',
            notes,
            subtotal,
            tax,
            shippingCost,
            totalAmount: subtotal + tax + shippingCost
        });

        await order.populate('items.product');

        // Send confirmation email
        try {
            const emailHtml = orderConfirmationTemplate(order, req.user);
            await sendEmail({
                to: req.user.email,
                subject: 'Order Confirmation - FreshMart',
                html: emailHtml
            });
            console.log(`Order confirmation email sent to ${req.user.email}`);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the order if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create Stripe Payment Intent & Order
export const createPaymentOrder = async (req, res) => {
    try {
        const { items, shippingAddress, notes } = req.body;

        // Calculate amounts
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const shippingCost = subtotal > 50 ? 0 : 5;
        const totalAmount = subtotal + tax + shippingCost;

        // Stripe minimum amount validation (50 cents USD ≈ ₹50)
        const MINIMUM_AMOUNT_INR = 50;
        if (totalAmount < MINIMUM_AMOUNT_INR) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount for online payment is ₹${MINIMUM_AMOUNT_INR}. Your cart total is ₹${totalAmount.toFixed(2)}. Please add more items or use Cash on Delivery.`
            });
        }

        // Create Stripe PaymentIntent
        // Note: UPI requires activation at https://dashboard.stripe.com/account/payments/settings
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Amount in paise/cents
            currency: 'inr',
            payment_method_types: ['card'], // Card payments (UPI needs dashboard activation)
            metadata: {
                userId: req.user._id.toString(),
                notes: notes || ''
            }
        });

        // Create order in database in pending state
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            paymentMethod: 'online',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            notes,
            subtotal,
            tax,
            shippingCost,
            totalAmount,
            paymentDetails: {
                stripePaymentIntentId: paymentIntent.id
            }
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            orderId: order._id,
            stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        console.error('Create payment order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// Verify Stripe Payment
export const verifyPayment = async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        if (!paymentIntentId || !orderId) {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        // Verify payment status with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }

        // Update the order
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: 'completed',
                orderStatus: 'confirmed',
                'paymentDetails.stripePaymentIntentId': paymentIntentId,
                'paymentDetails.paymentStatus': paymentIntent.status
            },
            { new: true }
        ).populate('items.product').populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send confirmation email
        try {
            const emailHtml = orderConfirmationTemplate(order, order.user);
            await sendEmail({
                to: order.user.email,
                subject: 'Order Confirmation - FreshMart',
                html: emailHtml
            });
            console.log(`Order confirmation email sent to ${order.user.email}`);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification error',
            error: error.message
        });
    }
};

// Get all orders for user
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single order
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user (unless admin)
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { cancelReason } = req.body;
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Can only cancel pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
        }

        order.orderStatus = 'cancelled';
        order.cancelledDate = new Date();
        order.cancelReason = cancelReason || 'Cancelled by user';

        await order.save();

        // Send status update email
        try {
            const emailHtml = orderStatusUpdateTemplate(order, order.user);
            await sendEmail({
                to: order.user.email,
                subject: 'Order Cancelled - FreshMart',
                html: emailHtml
            });
            console.log(`Order cancellation email sent to ${order.user.email}`);
        } catch (emailError) {
            console.error('Failed to send cancellation email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        ).populate('user', 'name email').populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Send status update email
        try {
            const emailHtml = orderStatusUpdateTemplate(order, order.user);
            await sendEmail({
                to: order.user.email,
                subject: `Order Update: ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)} - FreshMart`,
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
