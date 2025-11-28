import express from 'express';
import {
    register,
    verifyEmailAndSetPassword,
    login,
    forgotPassword,
    resetPassword,
    createAdminUser
} from '../controllers/authController.js';

const router = express.Router();

// Temporary: Setup Admin
router.get('/setup-admin', createAdminUser);

// Register - Send verification email
router.post('/register', register);

// Verify email and set password
router.post('/verify-email', verifyEmailAndSetPassword);

// Login
router.post('/login', login);

// Forgot password - Send OTP
router.post('/forgot-password', forgotPassword);

// Reset password with OTP
router.post('/reset-password', resetPassword);

export default router;
