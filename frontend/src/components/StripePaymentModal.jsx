import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CheckoutForm = ({ orderId, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/order-success',
                },
                redirect: 'if_required'
            });

            if (error) {
                setMessage(error.message);
                setIsLoading(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Verify with backend
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/orders/verify-payment', {
                    paymentIntentId: paymentIntent.id,
                    orderId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onSuccess();
            } else {
                setMessage('Payment processing...');
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            setMessage('Payment verification failed. Please contact support.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <PaymentElement />
            {message && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{message}</div>}
            <div className="flex flex-col gap-3">
                <button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

const StripePaymentModal = ({ clientSecret, stripePublishableKey, orderId, onSuccess, onClose }) => {
    // Initialize Stripe Promise inside component to ensure key is available
    // Note: In production, loadStripe should be called outside render to avoid recreating Stripe object
    // But here key comes from props, so we memoize or just load it.
    // Since key might change (if different envs), loading here is acceptable for this flow.
    const [stripePromise] = useState(() => loadStripe(stripePublishableKey));

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#10B981',
            },
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {clientSecret && stripePublishableKey ? (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm orderId={orderId} onSuccess={onSuccess} onClose={onClose} />
                    </Elements>
                ) : (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Initializing payment...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StripePaymentModal;
