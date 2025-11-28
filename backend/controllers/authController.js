import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail, generateOTP, generateVerificationToken } from '../utils/email.js';
import { passwordResetConfirmationTemplate, accountCreatedTemplate } from '../utils/emailTemplates.js';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register - Step 1: Send verification email
export const register = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists and is verified' });
        }

        // If user exists and is not verified, check if token is still valid
        if (user && !user.isVerified) {
            if (user.verificationTokenExpiry && user.verificationTokenExpiry > Date.now()) {
                const remainingTime = Math.ceil((user.verificationTokenExpiry - Date.now()) / 1000 / 60);
                return res.status(400).json({
                    message: `Verification email already sent. Please check your inbox. Link expires in ${remainingTime} minutes.`,
                    tokenExpired: false,
                    expiresIn: remainingTime
                });
            }
        }

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        if (user && !user.isVerified) {
            // Token is expired, update with new token
            user.verificationToken = verificationToken;
            user.verificationTokenExpiry = verificationTokenExpiry;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                email,
                verificationToken,
                verificationTokenExpiry,
                isVerified: false
            });
        }

        // Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FreshMart</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f0fdf4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🛒 FreshMart</h1>
                            <p style="margin: 10px 0 0; color: #dcfce7; font-size: 16px;">Your Online Grocery Store</p>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Welcome to FreshMart! 🎉</h2>
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thank you for registering with us! We're excited to have you join our community of smart shoppers.
                            </p>
                            <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                To complete your registration and start shopping, please verify your email address by clicking the button below:
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                                            Verify My Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 10px; color: #9ca3af; font-size: 13px; text-align: center;">
                                This verification link will expire in 30 minutes
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Features Section -->
                    <tr>
                        <td style="padding: 0 30px 40px;">
                            <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-top: 20px;">
                                <h3 style="margin: 0 0 20px; color: #1f2937; font-size: 18px; font-weight: 600; text-align: center;">What You'll Love About FreshMart</h3>
                                
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="50%" style="padding: 15px; vertical-align: top;">
                                            <div style="text-align: center;">
                                                <div style="font-size: 32px; margin-bottom: 10px;">🥬</div>
                                                <h4 style="margin: 0 0 8px; color: #1f2937; font-size: 15px; font-weight: 600;">Fresh Produce</h4>
                                                <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">Farm-fresh fruits and vegetables delivered daily</p>
                                            </div>
                                        </td>
                                        <td width="50%" style="padding: 15px; vertical-align: top;">
                                            <div style="text-align: center;">
                                                <div style="font-size: 32px; margin-bottom: 10px;">🚚</div>
                                                <h4 style="margin: 0 0 8px; color: #1f2937; font-size: 15px; font-weight: 600;">Fast Delivery</h4>
                                                <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">Same-day and next-day delivery options</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="50%" style="padding: 15px; vertical-align: top;">
                                            <div style="text-align: center;">
                                                <div style="font-size: 32px; margin-bottom: 10px;">💰</div>
                                                <h4 style="margin: 0 0 8px; color: #1f2937; font-size: 15px; font-weight: 600;">Best Prices</h4>
                                                <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">Exclusive deals and seasonal discounts</p>
                                            </div>
                                        </td>
                                        <td width="50%" style="padding: 15px; vertical-align: top;">
                                            <div style="text-align: center;">
                                                <div style="font-size: 32px; margin-bottom: 10px;">✨</div>
                                                <h4 style="margin: 0 0 8px; color: #1f2937; font-size: 15px; font-weight: 600;">Quality Assured</h4>
                                                <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">100% quality guarantee on all products</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                Happy Shopping! 🛍️
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © 2024 FreshMart. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

        const emailResult = await sendEmail({
            to: email,
            subject: 'Verify Your Email Address',
            html: emailHtml
        });

        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.status(200).json({
            message: 'Verification email sent successfully. Please check your inbox.',
            email: email
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Verify Email and Set Password
export const verifyEmailAndSetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find user with valid token
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        // Set password and verify user
        user.password = password;
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        // Send account created confirmation email
        const welcomeHtml = accountCreatedTemplate(user.email);

        await sendEmail({
            to: user.email,
            subject: '🎉 Welcome to FreshMart - Your Account is Ready!',
            html: welcomeHtml
        });

        // Generate JWT token
        const authToken = generateToken(user._id);

        res.status(200).json({
            message: 'Email verified and password set successfully',
            token: authToken,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user
        const user = await User.findOne({ email, isVerified: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email address' });
        }

        // Generate OTP
        const otp = generateOTP();
        const resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetPasswordOTP = otp;
        user.resetPasswordExpiry = resetPasswordExpiry;
        await user.save();

        // Send OTP email
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - FreshMart</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f0fdf4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🛒 FreshMart</h1>
                            <p style="margin: 10px 0 0; color: #dcfce7; font-size: 16px;">Your Online Grocery Store</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Password Reset Request 🔐</h2>
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password. Use the OTP code below to complete the process:
                            </p>
                            
                            <!-- OTP Box -->
                            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 2px dashed #22c55e; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                                <h1 style="margin: 0; color: #22c55e; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                            </div>
                            
                            <p style="margin: 20px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                                Enter this code on the password reset page to set a new password.
                            </p>
                            
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    ⚠️ <strong>Important:</strong> This OTP will expire in 15 minutes. If you didn't request this, please ignore this email.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                Stay secure! 🔒
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © 2024 FreshMart. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

        const emailResult = await sendEmail({
            to: email,
            subject: 'Password Reset OTP',
            html: emailHtml
        });

        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.status(200).json({
            message: 'OTP sent successfully. Please check your email.',
            email: email
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error during password reset request' });
    }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Step 1: First check if user exists with this email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'No account found with this email address',
                errorType: 'EMAIL_NOT_FOUND'
            });
        }

        // Step 2: Check if user has requested password reset
        if (!user.resetPasswordOTP) {
            return res.status(400).json({
                message: 'No password reset request found. Please request a new OTP.',
                errorType: 'NO_RESET_REQUEST'
            });
        }

        // Step 3: Check if OTP has expired
        if (user.resetPasswordExpiry < Date.now()) {
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.',
                errorType: 'OTP_EXPIRED'
            });
        }

        // Step 4: Finally, check if OTP matches
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP code. Please check and try again.',
                errorType: 'INVALID_OTP'
            });
        }

        // All validations passed - Update password
        user.password = newPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordExpiry = null;
        await user.save();

        // Send password reset confirmation email
        const confirmationHtml = passwordResetConfirmationTemplate(user.email);

        await sendEmail({
            to: user.email,
            subject: '✅ Password Updated Successfully - FreshMart',
            html: confirmationHtml
        });

        res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
};

// Temporary: Create Admin User
export const createAdminUser = async (req, res) => {
    try {
        const adminEmail = 'admin@freshmart.com';
        const adminPassword = 'admin123';

        let user = await User.findOne({ email: adminEmail });

        if (user) {
            user.role = 'admin';
            user.isVerified = true;
            user.password = adminPassword; // Will be hashed by pre-save hook
            await user.save();
            return res.status(200).json({ message: 'Admin user updated successfully', email: adminEmail });
        }

        user = await User.create({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isVerified: true
        });

        res.status(201).json({ message: 'Admin user created successfully', email: adminEmail });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Error creating admin user', error: error.message });
    }
};
