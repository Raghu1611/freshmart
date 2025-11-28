import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { priceDropAlertTemplate } from '../utils/emailTemplates.js';

// Create new product
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, unit, originalPrice } = req.body;

        let images = [];
        let imageUrl = '';

        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
            imageUrl = images[0]; // Set primary image
        }

        const product = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            unit,
            originalPrice,
            imageUrl,
            images
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error while creating product', error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const { category, limit } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        let productsQuery = Product.find(query).sort({ createdAt: -1 });

        if (limit) {
            productsQuery = productsQuery.limit(Number(limit));
        }

        const products = await productsQuery;

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

// Get single product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, unit, originalPrice } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const oldPrice = product.price;
        const newPrice = Number(price);

        product.name = name || product.name;
        product.price = newPrice || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.unit = unit || product.unit;
        product.originalPrice = originalPrice || product.originalPrice;

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            product.images = newImages;
            product.imageUrl = newImages[0];
        }

        const updatedProduct = await product.save();

        // Check for price drop and send alerts to ALL users
        if (newPrice < oldPrice) {
            try {
                const allUsers = await User.find({});
                console.log(`Price dropped for ${product.name}. Broadcasting alert to ALL ${allUsers.length} registered users.`);

                // Send emails asynchronously to ALL users
                allUsers.forEach(async (user) => {
                    if (!user.email) return;

                    try {
                        const emailHtml = priceDropAlertTemplate(updatedProduct, oldPrice, newPrice, user);
                        await sendEmail({
                            to: user.email,
                            subject: `🔥 Price Drop Alert: ${updatedProduct.name} is now cheaper!`,
                            html: emailHtml
                        });
                        console.log(`Price alert sent to ${user.email}`);
                    } catch (emailError) {
                        console.error(`Failed to send price alert to ${user.email}:`, emailError);
                    }
                });
            } catch (err) {
                console.error("Error fetching users for price alert:", err);
            }
        }

        res.status(200).json({
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Subscribe to Price Alert
export const subscribeToPriceAlert = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { email } = req.body;
        const userId = req.user ? req.user._id : null;

        // Check if already subscribed
        const isSubscribed = product.priceAlertSubscribers.find(
            sub => sub.email === email || (userId && sub.user && sub.user.toString() === userId.toString())
        );

        if (isSubscribed) {
            return res.status(400).json({ message: 'You are already subscribed to alerts for this product.' });
        }

        product.priceAlertSubscribers.push({
            user: userId,
            email: email
        });

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Successfully subscribed to price alerts!'
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new review
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        console.log(`Creating review for product ${req.params.id} by user ${req.user?._id}`);

        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                console.log('Product already reviewed by this user');
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name || 'Anonymous',
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            console.log('Review saved successfully');
            res.status(201).json({ message: 'Review added' });
        } else {
            console.log('Product not found');
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
