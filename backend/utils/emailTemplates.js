// Professional Email Templates for FreshMart

export const passwordResetConfirmationTemplate = (userEmail) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Updated Successfully - FreshMart</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 40px 20px;
                line-height: 1.6;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
                opacity: 0.3;
            }
            .logo {
                background: #ffffff;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                position: relative;
                z-index: 1;
            }
            .logo-text {
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .header-title {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .success-icon {
                background: #10b981;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                margin: -50px auto 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
                position: relative;
                z-index: 2;
            }
            .success-icon::before {
                content: '✓';
                color: #ffffff;
                font-size: 60px;
                font-weight: bold;
            }
            .content {
                padding: 0 40px 40px;
            }
            .greeting {
                font-size: 20px;
                color: #1f2937;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .message {
                color: #4b5563;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 20px;
            }
            .info-box {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 30px 0;
                border-radius: 8px;
            }
            .info-box-title {
                color: #1e40af;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            .info-box-title::before {
                content: 'ℹ️';
                margin-right: 8px;
                font-size: 20px;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(59, 130, 246, 0.1);
            }
            .info-item:last-child {
                border-bottom: none;
            }
            .info-label {
                color: #3b82f6;
                font-weight: 500;
            }
            .info-value {
                color: #1e40af;
                font-weight: 600;
            }
            .security-tips {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-left: 4px solid #f59e0b;
                padding: 20px;
                margin: 30px 0;
                border-radius: 8px;
            }
            .security-tips-title {
                color: #92400e;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            .security-tips-title::before {
                content: '🔒';
                margin-right: 8px;
                font-size: 20px;
            }
            .security-tips ul {
                margin: 0;
                padding-left: 20px;
            }
            .security-tips li {
                color: #78350f;
                margin: 8px 0;
                font-size: 14px;
            }
            .button-container {
                text-align: center;
                margin: 40px 0;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
            }
            .footer {
                background: #f9fafb;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer-text {
                color: #6b7280;
                font-size: 14px;
                margin: 5px 0;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
            }
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #e5e7eb, transparent);
                margin: 30px 0;
            }
            @media only screen and (max-width: 600px) {
                body {
                    padding: 20px 10px;
                }
                .content {
                    padding: 0 20px 20px;
                }
                .header {
                    padding: 30px 20px;
                }
                .header-title {
                    font-size: 24px;
                }
                .greeting {
                    font-size: 18px;
                }
                .message {
                    font-size: 14px;
                }
                .footer {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">
                    <span class="logo-text">FM</span>
                </div>
                <h1 class="header-title">FreshMart</h1>
            </div>

            <!-- Success Icon -->
            <div class="success-icon"></div>

            <!-- Content -->
            <div class="content">
                <h2 class="greeting">Password Updated Successfully! 🎉</h2>
                
                <p class="message">
                    Hello,
                </p>
                
                <p class="message">
                    Great news! Your FreshMart account password has been successfully updated. You can now use your new password to access your account and continue enjoying fresh groceries delivered to your doorstep.
                </p>

                <!-- Info Box -->
                <div class="info-box">
                    <div class="info-box-title">Update Details</div>
                    <div class="info-item">
                        <span class="info-label">Account Email:</span>
                        <span class="info-value">${userEmail}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Updated On:</span>
                        <span class="info-value">${currentDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value">✅ Confirmed</span>
                    </div>
                </div>

                <p class="message">
                    If you didn't make this change, please contact our support team immediately to secure your account.
                </p>

                <!-- Security Tips -->
                <div class="security-tips">
                    <div class="security-tips-title">Security Tips</div>
                    <ul>
                        <li>Never share your password with anyone</li>
                        <li>Use a strong, unique password for your account</li>
                        <li>Enable two-factor authentication if available</li>
                        <li>Change your password regularly for better security</li>
                        <li>Be cautious of phishing emails and suspicious links</li>
                    </ul>
                </div>

                <div class="divider"></div>

                <!-- Call to Action -->
                <div class="button-container">
                    <a href="${process.env.FRONTEND_URL || 'https://freshmart-frontend-xi.vercel.app'}/login" class="button">
                        Login to Your Account →
                    </a>
                </div>

                <p class="message" style="text-align: center; color: #9ca3af; font-size: 14px;">
                    Questions? We're here to help! Contact our support team anytime.
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p class="footer-text" style="font-weight: 600; color: #667eea; font-size: 16px;">
                    FreshMart - Fresh Groceries Delivered
                </p>
                <p class="footer-text">
                    Your trusted partner for quality groceries
                </p>
                
                <div class="social-links">
                    <a href="#">Help Center</a> ·
                    <a href="#">Privacy Policy</a> ·
                    <a href="#">Terms of Service</a>
                </div>
                
                <p class="footer-text" style="margin-top: 20px; font-size: 12px;">
                    © 2025 FreshMart. All rights reserved.
                </p>
                <p class="footer-text" style="font-size: 12px; color: #9ca3af;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Verification Email Template (existing template improved)
export const verificationEmailTemplate = (verificationLink, email) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - FreshMart</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 40px 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
            }
            .logo {
                background: #ffffff;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            .logo-text {
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .header-title {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .content {
                padding: 40px;
            }
            .greeting {
                font-size: 20px;
                color: #1f2937;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .message {
                color: #4b5563;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 20px;
            }
            .button-container {
                text-align: center;
                margin: 40px 0;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            }
            .footer {
                background: #f9fafb;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer-text {
                color: #6b7280;
                font-size: 14px;
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">
                    <span class="logo-text">FM</span>
                </div>
                <h1 class="header-title">Welcome to FreshMart!</h1>
            </div>
            <div class="content">
                <h2 class="greeting">Verify Your Email Address</h2>
                <p class="message">Thank you for registering with FreshMart! Click the button below to verify your email and set up your password.</p>
                <div class="button-container">
                    <a href="${verificationLink}" class="button">Verify Email Address →</a>
                </div>
                <p class="message" style="text-align: center; color: #9ca3af; font-size: 14px;">
                    Link expires in 30 minutes
                </p>
            </div>
            <div class="footer">
                <p class="footer-text" style="font-weight: 600; color: #667eea; font-size: 16px;">FreshMart</p>
                <p class="footer-text">© 2025 FreshMart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// OTP Email Template (existing template improved)
export const otpEmailTemplate = (otp, email) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP - FreshMart</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 40px 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
            }
            .logo {
                background: #ffffff;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            .logo-text {
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .header-title {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .content {
                padding: 40px;
            }
            .greeting {
                font-size: 20px;
                color: #1f2937;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .message {
                color: #4b5563;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 20px;
            }
            .otp-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 48px;
                font-weight: bold;
                color: #ffffff;
                letter-spacing: 8px;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .footer {
                background: #f9fafb;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer-text {
                color: #6b7280;
                font-size: 14px;
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">
                    <span class="logo-text">FM</span>
                </div>
                <h1 class="header-title">Password Reset Request</h1>
            </div>
            <div class="content">
                <h2 class="greeting">Reset Your Password</h2>
                <p class="message">You requested to reset your password. Use the OTP code below:</p>
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                </div>
                <p class="message" style="text-align: center; color: #9ca3af; font-size: 14px;">
                    This OTP expires in 15 minutes
                </p>
            </div>
            <div class="footer">
                <p class="footer-text" style="font-weight: 600; color: #667eea; font-size: 16px;">FreshMart</p>
                <p class="footer-text">© 2025 FreshMart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Account Created Successfully Email Template
export const accountCreatedTemplate = (userEmail) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FreshMart - Account Created!</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 40px 20px;
                line-height: 1.6;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
                opacity: 0.3;
            }
            .logo {
                background: #ffffff;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                position: relative;
                z-index: 1;
            }
            .logo-text {
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .header-title {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .celebration-banner {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 20px;
                text-align: center;
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
            .content {
                padding: 40px;
            }
            .greeting {
                font-size: 24px;
                color: #1f2937;
                margin-bottom: 20px;
                font-weight: 700;
                text-align: center;
            }
            .message {
                color: #4b5563;
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 20px;
            }
            .info-box {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 30px 0;
                border-radius: 8px;
            }
            .info-box-title {
                color: #1e40af;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            .info-box-title::before {
                content: '👤';
                margin-right: 8px;
                font-size: 20px;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(59, 130, 246, 0.1);
            }
            .info-item:last-child {
                border-bottom: none;
            }
            .info-label {
                color: #3b82f6;
                font-weight: 500;
            }
            .info-value {
                color: #1e40af;
                font-weight: 600;
            }
            .features-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 30px 0;
            }
            .feature-card {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                border: 2px solid #f59e0b;
            }
            .feature-icon {
                font-size: 36px;
                margin-bottom: 10px;
            }
            .feature-title {
                color: #92400e;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .feature-desc {
                color: #78350f;
                font-size: 12px;
                line-height: 1.4;
            }
            .quick-start {
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border-left: 4px solid #10b981;
                padding: 20px;
                margin: 30px 0;
                border-radius: 8px;
            }
            .quick-start-title {
                color: #065f46;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            .quick-start-title::before {
                content: '🚀';
                margin-right: 8px;
                font-size: 20px;
            }
            .quick-start ol {
                margin: 0;
                padding-left: 20px;
            }
            .quick-start li {
                color: #064e3b;
                margin: 8px 0;
                font-size: 14px;
                line-height: 1.6;
            }
            .button-container {
                text-align: center;
                margin: 40px 0;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
            }
            .footer {
                background: #f9fafb;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer-text {
                color: #6b7280;
                font-size: 14px;
                margin: 5px 0;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
            }
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #e5e7eb, transparent);
                margin: 30px 0;
            }
            @media only screen and (max-width: 600px) {
                body {
                    padding: 20px 10px;
                }
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 30px 20px;
                }
                .header-title {
                    font-size: 24px;
                }
                .greeting {
                    font-size: 20px;
                }
                .message {
                    font-size: 14px;
                }
                .features-grid {
                    grid-template-columns: 1fr;
                }
                .footer {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">
                    <span class="logo-text">FM</span>
                </div>
                <h1 class="header-title">FreshMart</h1>
            </div>

            <!-- Celebration Banner -->
            <div class="celebration-banner">
                🎉 Welcome to FreshMart! 🎉
            </div>

            <!-- Content -->
            <div class="content">
                <h2 class="greeting">Your Account is Ready!</h2>
                
                <p class="message">
                    Congratulations! Your FreshMart account has been successfully created and verified. 
                    You're now part of our growing community of smart shoppers who enjoy fresh groceries 
                    delivered right to their doorstep.
                </p>

                <!-- Account Info Box -->
                <div class="info-box">
                    <div class="info-box-title">Account Details</div>
                    <div class="info-item">
                        <span class="info-label">Email Address:</span>
                        <span class="info-value">${userEmail}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Created On:</span>
                        <span class="info-value">${currentDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value">✅ Active & Verified</span>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🥬</div>
                        <div class="feature-title">Fresh Produce</div>
                        <div class="feature-desc">Farm-fresh fruits & vegetables daily</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🚚</div>
                        <div class="feature-title">Fast Delivery</div>
                        <div class="feature-desc">Same-day & next-day options</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💰</div>
                        <div class="feature-title">Best Prices</div>
                        <div class="feature-desc">Exclusive deals & discounts</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">✨</div>
                        <div class="feature-title">Quality Assured</div>
                        <div class="feature-desc">100% satisfaction guarantee</div>
                    </div>
                </div>

                <!-- Quick Start Guide -->
                <div class="quick-start">
                    <div class="quick-start-title">Quick Start Guide</div>
                    <ol>
                        <li>Browse our wide selection of fresh groceries and essentials</li>
                        <li>Add your favorite items to the cart</li>
                        <li>Choose your delivery time and address</li>
                        <li>Complete your order and enjoy doorstep delivery!</li>
                    </ol>
                </div>

                <div class="divider"></div>

                <!-- Call to Action -->
                <div class="button-container">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">
                        Start Shopping Now →
                    </a>
                </div>

                <p class="message" style="text-align: center; color: #9ca3af; font-size: 14px;">
                    Need help? Our customer support team is always ready to assist you!
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p class="footer-text" style="font-weight: 600; color: #667eea; font-size: 16px;">
                    FreshMart - Fresh Groceries Delivered
                </p>
                <p class="footer-text">
                    Your trusted partner for quality groceries
                </p>
                
                <div class="social-links">
                    <a href="#">Help Center</a> ·
                    <a href="#">Privacy Policy</a> ·
                    <a href="#">Terms of Service</a>
                </div>
                
                <p class="footer-text" style="margin-top: 20px; font-size: 12px;">
                    © 2025 FreshMart. All rights reserved.
                </p>
                <p class="footer-text" style="font-size: 12px; color: #9ca3af;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Order Confirmation Email Template
export const orderConfirmationTemplate = (order, user) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const itemsHtml = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center;">
                <img src="${item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/50'}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                <div>
                    <div style="font-weight: 600; color: #333;">${item.product.name}</div>
                    <div style="font-size: 12px; color: #777;">Qty: ${item.quantity}</div>
                </div>
            </div>
            <div style="font-weight: 600; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - FreshMart</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .order-summary { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-weight: bold; border-top: 2px solid #eee; margin-top: 10px; }
            .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background-color: #DEF7EC; color: #03543F; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .btn { display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmed! 🎉</h1>
                <p>Thank you for your purchase</p>
            </div>
            <div class="content">
                <p>Hi ${user.name},</p>
                <p>We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
                
                <div style="margin: 20px 0;">
                    <span class="status-badge">Order #${order._id.toString().slice(-6).toUpperCase()}</span>
                    <span style="float: right; color: #666; font-size: 14px;">${orderDate}</span>
                </div>

                <div class="order-summary">
                    <h3 style="margin-top: 0; color: #333;">Order Summary</h3>
                    ${itemsHtml}
                    
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 5px;">
                            <span>Subtotal</span>
                            <span>₹${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 5px;">
                            <span>Tax</span>
                            <span>₹${order.tax.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 5px;">
                            <span>Shipping</span>
                            <span>₹${order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Total</span>
                            <span style="color: #10B981; font-size: 18px;">₹${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <h3 style="color: #333;">Shipping Address</h3>
                    <p style="color: #666; line-height: 1.6;">
                        ${order.shippingAddress.fullName}<br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}<br>
                        Phone: ${order.shippingAddress.phone}
                    </p>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" class="btn">View Order Details</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2025 FreshMart. All rights reserved.</p>
                <p>Need help? Contact support@freshmart.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Order Status Update Email Template
export const orderStatusUpdateTemplate = (order, user) => {
    const statusColors = {
        pending: '#F59E0B',
        confirmed: '#10B981',
        processing: '#3B82F6',
        shipped: '#8B5CF6',
        delivered: '#059669',
        cancelled: '#EF4444'
    };

    const statusMessages = {
        pending: 'Your order is currently pending.',
        confirmed: 'Your order has been confirmed and is being processed.',
        processing: 'We are currently packing your order.',
        shipped: 'Great news! Your order is on its way.',
        delivered: 'Your order has been delivered. Enjoy!',
        cancelled: 'Your order has been cancelled.'
    };

    const color = statusColors[order.orderStatus] || '#3B82F6';
    const message = statusMessages[order.orderStatus] || `Your order status has been updated to ${order.orderStatus}.`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update - FreshMart</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background-color: ${color}; padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .status-box { background-color: #f9fafb; border-left: 5px solid ${color}; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .btn { display: inline-block; background-color: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Update 📦</h1>
                <p>Order #${order._id.toString().slice(-6).toUpperCase()}</p>
            </div>
            <div class="content">
                <p>Hi ${user.name},</p>
                
                <div class="status-box">
                    <h2 style="margin-top: 0; color: ${color}; text-transform: capitalize;">${order.orderStatus}</h2>
                    <p style="margin-bottom: 0;">${message}</p>
                </div>

                <p>You can track your order status by clicking the button below.</p>

                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" class="btn">Track Order</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2025 FreshMart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Price Drop Alert Email Template
export const priceDropAlertTemplate = (product, oldPrice, newPrice, user) => {
    const savings = oldPrice - newPrice;
    const percentage = Math.round((savings / oldPrice) * 100);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Price Drop Alert - FreshMart</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
            .content { padding: 30px; text-align: center; }
            .product-image { width: 150px; height: 150px; object-fit: contain; margin: 20px auto; border-radius: 8px; }
            .price-box { background-color: #FEF2F2; border: 2px dashed #EF4444; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .old-price { text-decoration: line-through; color: #6B7280; font-size: 16px; }
            .new-price { color: #EF4444; font-size: 32px; font-weight: 800; margin: 5px 0; }
            .savings-badge { background-color: #EF4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-top: 5px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .btn { display: inline-block; background-color: #EF4444; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Price Drop Alert! 📉</h1>
                <p>Good news! An item you're watching is now cheaper.</p>
            </div>
            <div class="content">
                <p style="font-size: 16px; color: #374151;">Hi ${user.name || 'Shopper'},</p>
                <p style="color: #6B7280;">The price for <strong>${product.name}</strong> has just dropped!</p>
                
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">

                <div class="price-box">
                    <div class="old-price">Was ₹${oldPrice}</div>
                    <div class="new-price">Now ₹${newPrice}</div>
                    <div class="savings-badge">Save ${percentage}% (₹${savings})</div>
                </div>

                <p>Hurry! This price might not last long.</p>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/product/${product._id}" class="btn">Buy Now</a>
            </div>
            <div class="footer">
                <p>You received this email because you subscribed to price alerts for this product.</p>
                <p>&copy; 2025 FreshMart. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
