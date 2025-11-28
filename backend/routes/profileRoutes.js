import express from 'express';
import {
    getProfile,
    updateEmail,
    updatePasswordWithCurrent,
    requestPasswordUpdateOTP,
    updatePasswordWithOTP
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, getProfile);
router.put('/update-email', authenticate, updateEmail);
router.put('/update-password', authenticate, updatePasswordWithCurrent);
router.post('/request-password-otp', authenticate, requestPasswordUpdateOTP);
router.put('/update-password-otp', authenticate, updatePasswordWithOTP);

export default router;
