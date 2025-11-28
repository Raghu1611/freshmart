// Mock Razorpay for Development/Testing
// This simulates Razorpay without needing actual credentials

export const mockRazorpayInstance = {
    orders: {
        create: async (options) => {
            // Simulate Razorpay order creation
            console.log('📦 Mock Razorpay: Creating order...', options);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Return mock Razorpay order
            return {
                id: `order_mock_${Date.now()}`,
                entity: 'order',
                amount: options.amount,
                amount_paid: 0,
                amount_due: options.amount,
                currency: options.currency || 'INR',
                receipt: options.receipt,
                status: 'created',
                attempts: 0,
                notes: options.notes || {},
                created_at: Math.floor(Date.now() / 1000)
            };
        }
    }
};

export const MOCK_RAZORPAY_CONFIG = {
    key_id: 'rzp_test_MOCK_KEY_FOR_DEVELOPMENT',
    currency: 'INR',
    company_name: 'FreshMart',
    company_logo: '/logo.png',
    theme_color: '#10B981'
};

// Mock signature generation for testing
export const generateMockSignature = (orderId, paymentId) => {
    const crypto = require('crypto');
    const text = `${orderId}|${paymentId}`;
    return crypto.createHash('sha256').update(text).digest('hex');
};
