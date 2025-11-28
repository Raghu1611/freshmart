import User from '../models/User.js';
import { sendEmail, generateOTP } from '../utils/email.js';
import { passwordResetConfirmationTemplate, accountCreatedTemplate } from '../utils/emailTemplates.js';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -resetPasswordOTP -resetPasswordExpiry -verificationToken -verificationTokenExpiry');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// Update email
export const updateEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body;

        if (!newEmail || !password) {
            return res.status(400).json({ message: 'New email and password are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Check if new email already exists
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use by another account' });
        }

        const oldEmail = user.email;
        user.email = newEmail;
        await user.save();

        // Send confirmation email to new address
        const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Updated - FreshMart</title>
        </head>
        <body style="margin: 0; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: #ffffff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
                        <span style="font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FM</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">FreshMart</h1>
                </div>
                <div style="background: #10b981; width: 100px; height: 100px; border-radius: 50%; margin: -50px auto 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);">
                    <span style="color: #ffffff; font-size: 60px; font-weight: bold;">✓</span>
                </div>
                <div style="padding: 0 40px 40px;">
                    <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 20px; font-weight: 600;">Email Address Updated! 📧</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
                        Your FreshMart account email has been successfully updated.
                    </p>
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                        <div style="color: #1e40af; font-weight: 600; font-size: 16px; margin-bottom: 10px;">Update Details</div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(59, 130, 246, 0.1);">
                            <span style="color: #3b82f6; font-weight: 500;">Previous Email:</span>
                            <span style="color: #1e40af; font-weight: 600;">${oldEmail}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(59, 130, 246, 0.1);">
                            <span style="color: #3b82f6; font-weight: 500;">New Email:</span>
                            <span style="color: #1e40af; font-weight: 600;">${newEmail}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                            <span style="color: #3b82f6; font-weight: 500;">Status:</span>
                            <span style="color: #1e40af; font-weight: 600;">✅ Confirmed</span>
                        </div>
                    </div>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
                        If you didn't make this change, please contact our support team immediately.
                    </p>
                </div>
                <div style="background: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #667eea; font-weight: 600; font-size: 16px; margin: 5px 0;">FreshMart - Fresh Groceries Delivered</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">© 2025 FreshMart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await sendEmail({
            to: newEmail,
            subject: '✅ Email Address Updated - FreshMart',
            html: emailHtml
        });

        res.status(200).json({
            message: 'Email updated successfully',
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Update email error:', error);
        res.status(500).json({ message: 'Server error while updating email' });
    }
};

// Update password with current password
export const updatePasswordWithCurrent = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Find user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Check if new password is same as current
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password must be different from current password' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Send confirmation email
        const confirmationHtml = passwordResetConfirmationTemplate(user.email);

        await sendEmail({
            to: user.email,
            subject: '✅ Password Updated Successfully - FreshMart',
            html: confirmationHtml
        });

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};

// Request OTP for password update
export const requestPasswordUpdateOTP = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetPasswordOTP = otp;
        user.resetPasswordExpiry = otpExpiry;
        await user.save();

        // Send OTP email
        const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Update OTP - FreshMart</title>
        </head>
        <body style="margin: 0; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: #ffffff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
                        <span style="font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FM</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Password Update Request</h1>
                </div>
                <div style="padding: 40px;">
                    <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 20px; font-weight: 600;">Update Your Password 🔐</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
                        You requested to update your password. Use the OTP code below to verify and set your new password:
                    </p>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 8px;">${otp}</div>
                    </div>
                    <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-bottom: 20px;">
                        This OTP expires in 15 minutes
                    </p>
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                            ⚠️ <strong>Important:</strong> If you didn't request this, please ignore this email and secure your account.
                        </p>
                    </div>
                </div>
                <div style="background: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #667eea; font-weight: 600; font-size: 16px; margin: 5px 0;">FreshMart</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">© 2025 FreshMart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const emailResult = await sendEmail({
            to: user.email,
            subject: '🔐 Password Update OTP - FreshMart',
            html: emailHtml
        });

        if (!emailResult.success) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.status(200).json({
            message: 'OTP sent to your email successfully',
            email: user.email
        });

    } catch (error) {
        console.error('Request OTP error:', error);
        res.status(500).json({ message: 'Server error while sending OTP' });
    }
};

// Update password with OTP
export const updatePasswordWithOTP = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;

        if (!otp || !newPassword) {
            return res.status(400).json({ message: 'OTP and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Find user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP request exists
        if (!user.resetPasswordOTP) {
            return res.status(400).json({
                message: 'No OTP request found. Please request a new OTP.',
                errorType: 'NO_OTP_REQUEST'
            });
        }

        // Check if OTP has expired
        if (user.resetPasswordExpiry < Date.now()) {
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.',
                errorType: 'OTP_EXPIRED'
            });
        }

        // Check if OTP matches
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP code. Please check and try again.',
                errorType: 'INVALID_OTP'
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordExpiry = null;
        await user.save();

        // Send confirmation email
        const confirmationHtml = passwordResetConfirmationTemplate(user.email);

        await sendEmail({
            to: user.email,
            subject: '✅ Password Updated Successfully - FreshMart',
            html: confirmationHtml
        });

        res.status(200).json({ message: 'Password updated successfully using OTP' });

    } catch (error) {
        console.error('Update password with OTP error:', error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};
