import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { mockRazorpayInstance, MOCK_RAZORPAY_CONFIG } from './mockRazorpay.js';

dotenv.config();

// Check if we should use mock mode (when no credentials are provided)
const useMockMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_XXXXXXXXXX';

// Initialize Razorpay instance (real or mock)
export const razorpayInstance = useMockMode
    ? mockRazorpayInstance
    : new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

export const RAZORPAY_CONFIG = useMockMode
    ? MOCK_RAZORPAY_CONFIG
    : {
        key_id: process.env.RAZORPAY_KEY_ID,
        currency: 'INR',
        company_name: 'FreshMart',
        company_logo: 'https://your-logo-url.com/logo.png',
        theme_color: '#10B981'
    };

// Log which mode we're using
if (useMockMode) {
    console.log('🧪 Using MOCK Razorpay for testing (no credentials needed)');
} else {
    console.log('💳 Using REAL Razorpay with credentials');
}

