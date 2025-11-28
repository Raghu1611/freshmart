import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PageTransition from '../../components/PageTransition';

const OrderSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Confetti animation on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <PageTransition variant="scale" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 w-32 h-32 bg-green-400 rounded-full animate-ping opacity-20"></div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                                <p className="text-lg font-bold text-gray-900">#{Math.floor(Math.random() * 1000000)}</p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                                <p className="text-lg font-bold text-gray-900">3-5 Days</p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Confirmation Sent</p>
                                <p className="text-lg font-bold text-gray-900">Email</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Message */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-left">
                                <p className="font-semibold text-blue-900 mb-1">What's Next?</p>
                                <p className="text-sm text-blue-800">
                                    We've sent a confirmation email with your order details. You can track your order status in your account dashboard.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/orders')}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Track Order
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-4 bg-white text-gray-700 font-semibold border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {/* Social Share */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">Share your purchase</p>
                        <div className="flex justify-center gap-4">
                            <button className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                <span className="text-xl">📘</span>
                            </button>
                            <button className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                                <span className="text-xl">📷</span>
                            </button>
                            <button className="w-10 h-10 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                                <span className="text-xl">💬</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default OrderSuccess;
