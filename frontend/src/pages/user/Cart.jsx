import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PageTransition from '../../components/PageTransition';
import { API_URL } from '../../config';

const getImageUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    return `${API_URL.replace('/api', '')}${path}`;
};

const Cart = () => {
    const { cart: cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = subtotal * 0.1;
        const shipping = subtotal > 50 ? 0 : 5;
        return subtotal + tax + shipping;
    };



    if (cartItems.length === 0) {
        return (
            <PageTransition variant="scale" className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20 text-center">
                <div className="w-32 h-32 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
                <p className="text-lg text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => navigate('/shop')}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                    Start Shopping
                </button>
            </PageTransition>
        );
    }

    return (
        <PageTransition variant="slideRight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-gray-200">
                <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
                <span className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-full">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-5">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex gap-6">
                                {/* Image */}
                                <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                    <img
                                        src={getImageUrl(item.imageUrl || item.images?.[0])}
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                    <p className="text-sm text-gray-500">{item.unit}</p>

                                    {item.stock < 10 && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                            Only {item.stock} left!
                                        </span>
                                    )}

                                    {/* Quantity Controls - Mobile */}
                                    <div className="flex items-center gap-3 mt-4 lg:hidden">
                                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="text-lg font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-green-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <p className="text-2xl font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity - Desktop */}
                                <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl h-fit">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-green-500 hover:text-white hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="text-lg font-semibold text-gray-900 w-10 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        disabled={item.quantity >= item.stock}
                                        className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-green-500 hover:text-white hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Price - Desktop */}
                                <div className="hidden lg:block text-right">
                                    <p className="text-2xl font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeItem(item._id)}
                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:scale-110 transition-all"
                                    aria-label="Remove item"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-5">
                        {/* Summary Card */}
                        <div className="bg-white p-7 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Tax (10%)</span>
                                    <span className="font-semibold">${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-semibold">
                                        {calculateSubtotal() > 50 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            '$5.00'
                                        )}
                                    </span>
                                </div>

                                {calculateSubtotal() < 50 && (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-blue-900">
                                            Add ${(50 - calculateSubtotal()).toFixed(2)} more for FREE shipping!
                                        </span>
                                    </div>
                                )}

                                <div className="h-px bg-gray-200 my-4"></div>

                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-3xl text-green-600">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate('/shop')}
                                className="w-full mt-3 px-6 py-4 bg-white text-gray-700 font-semibold border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300"
                            >
                                Continue Shopping
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600 mb-3">We accept</p>
                                <div className="flex justify-center gap-3 text-2xl">
                                    <span>💳</span>
                                    <span>🏦</span>
                                    <span>📱</span>
                                </div>
                            </div>
                        </div>

                        {/* Promo Code Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Have a promo code?</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                                />
                                <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Cart;
