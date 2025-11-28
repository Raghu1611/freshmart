import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';
import { useCart } from '../../context/CartContext';
import StripePaymentModal from '../../components/StripePaymentModal';
import { API_URL } from '../../config';

const getImageUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    return `${API_URL.replace('/api', '')}${path}`;
};

const Checkout = () => {
    const navigate = useNavigate();
    const { cart: cartItems, clearCart } = useCart();
    const [processing, setProcessing] = useState(false);
    const [stripeModalOpen, setStripeModalOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [stripePublishableKey, setStripePublishableKey] = useState('');
    const [currentOrderId, setCurrentOrderId] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        landmark: '',
        addressType: 'home',
        paymentMethod: 'cod',
        notes: ''
    });

    const [errors, setErrors] = useState({});



    const calculateSubtotal = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((total, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = subtotal * 0.1;
        const shipping = subtotal > 50 ? 0 : 5;
        return subtotal + tax + shipping;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        // Alternative phone is optional but validate if provided
        if (formData.alternatePhone.trim() && !/^\d{10}$/.test(formData.alternatePhone.replace(/\D/g, ''))) {
            newErrors.alternatePhone = 'Alternative phone must be 10 digits';
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{6}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'ZIP code must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCODOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    alternatePhone: formData.alternatePhone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                    landmark: formData.landmark,
                    addressType: formData.addressType
                },
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                notes: formData.notes,
                totalAmount: calculateTotal()
            };

            await axios.post('http://localhost:5000/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            clearCart();

            toast.success('Order placed successfully!');
            navigate('/order-success');
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Failed to place order. Please try again.');
            throw error;
        }
    };

    const handleOnlinePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            toast.loading('Initiating payment...', { id: 'payment-init' });

            const orderResponse = await axios.post('http://localhost:5000/api/orders/create-payment', {
                items: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    alternatePhone: formData.alternatePhone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                    landmark: formData.landmark,
                    addressType: formData.addressType
                },
                notes: formData.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.dismiss('payment-init');

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create payment order');
            }

            setClientSecret(orderResponse.data.clientSecret);
            setStripePublishableKey(orderResponse.data.stripePublishableKey);
            setCurrentOrderId(orderResponse.data.orderId);
            setStripeModalOpen(true);
            setProcessing(false); // Stop processing spinner on button, let modal handle it

        } catch (error) {
            toast.dismiss('payment-init');
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
            setProcessing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }

        if (!validateForm()) {
            const firstError = document.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setProcessing(true);

        try {
            if (formData.paymentMethod === 'cod') {
                await handleCODOrder();
            } else if (formData.paymentMethod === 'online') {
                await handleOnlinePayment();
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setProcessing(false);
        }
    };



    if (cartItems.length === 0) {
        return (
            <PageTransition variant="scale" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-12">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-8">Please add items to your cart before checking out.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/shop')}
                                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                🛍️ Browse Products
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-all"
                            >
                                View Cart
                            </button>
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition variant="slideRight" className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-3">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600 text-lg">Complete your order in just a few steps</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">SSL Secured Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                                        <p className="text-sm text-gray-500">We'll use this to contact you about your order</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            placeholder="9876543210"
                                        />
                                        {errors.phone && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Alternative Phone (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.alternatePhone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            placeholder="9123456789"
                                        />
                                        {errors.alternatePhone && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.alternatePhone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                                        <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                                    </div>
                                </div>

                                {/* Address Type Selector */}
                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-4">
                                        Save Address As
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { type: 'home', icon: '🏠', label: 'Home' },
                                            { type: 'work', icon: '💼', label: 'Work' },
                                            { type: 'other', icon: '📍', label: 'Other' }
                                        ].map(({ type, icon, label }) => (
                                            <label
                                                key={type}
                                                className={`relative flex flex-col items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.addressType === type
                                                    ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                                                    : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="addressType"
                                                    value={type}
                                                    checked={formData.addressType === type}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span className="text-3xl mb-2">{icon}</span>
                                                <span className={`text-sm font-bold ${formData.addressType === type ? 'text-green-700' : 'text-gray-700'
                                                    }`}>
                                                    {label}
                                                </span>
                                                {formData.addressType === type && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Complete Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="4"
                                            className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all resize-none text-gray-900 font-medium ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                }`}
                                            placeholder="House/Flat No., Building Name, Street, Area"
                                        />
                                        {errors.address && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Landmark (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all hover:border-green-300 text-gray-900 font-medium"
                                            placeholder="E.g., Near City Mall, Behind ABC School"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                placeholder="Mumbai"
                                            />
                                            {errors.city && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                placeholder="Maharashtra"
                                            />
                                            {errors.state && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.state}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                PIN Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                maxLength="6"
                                                className={`w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all text-gray-900 font-medium ${errors.zipCode ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                placeholder="400001"
                                            />
                                            {errors.zipCode && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.zipCode}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-600 font-medium cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                                        <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className={`relative flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod'
                                        ? 'border-green-500 bg-green-50 shadow-lg'
                                        : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">💵</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 text-lg block">Cash on Delivery</span>
                                                <span className="text-sm text-gray-600">Pay when you receive your order</span>
                                            </div>
                                        </div>
                                        {formData.paymentMethod === 'cod' && (
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </label>

                                    <label className={`relative flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'online'
                                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">💳</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 text-lg block">Online Payment</span>
                                                <span className="text-sm text-gray-600">Credit/Debit Card, UPI & more</span>
                                            </div>
                                        </div>
                                        {formData.paymentMethod === 'online' && (
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-4">
                                    Special Instructions (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all resize-none hover:border-green-300 text-gray-900 font-medium"
                                    placeholder="E.g., Please ring the doorbell, Call before delivery, Fragile items, etc."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <img
                                            src={getImageUrl(item.imageUrl || item.images?.[0])}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-xl"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
                                            <p className="text-xs text-gray-600 mb-2">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-green-600">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-gray-200 pt-6 space-y-4">
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-bold">₹{calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Tax (10%)</span>
                                    <span className="font-bold">₹{(calculateSubtotal() * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Delivery</span>
                                    <span className="font-bold">
                                        {calculateSubtotal() > 50 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            '₹5.00'
                                        )}
                                    </span>
                                </div>
                                <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                        ₹{calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full mt-8 px-6 py-5 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        🛒 Place Order
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full mt-4 px-6 py-4 text-gray-700 font-bold border-2 border-gray-300 rounded-2xl hover:border-green-500 hover:text-green-600 hover:shadow-lg transition-all"
                            >
                                ← Back to Cart
                            </button>

                            <div className="mt-8 pt-6 border-t-2 border-gray-200">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-bold text-gray-900">Secure Checkout</p>
                                        <p className="text-xs">Your data is protected with SSL encryption</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {stripeModalOpen && (
                <StripePaymentModal
                    clientSecret={clientSecret}
                    stripePublishableKey={stripePublishableKey}
                    orderId={currentOrderId}
                    onSuccess={() => {
                        setStripeModalOpen(false);
                        clearCart();
                        toast.success('🎉 Payment successful!');
                        navigate('/order-success');
                    }}
                    onClose={() => {
                        setStripeModalOpen(false);
                        setProcessing(false);
                    }}
                />
            )}
        </PageTransition>
    );
};

export default Checkout;
