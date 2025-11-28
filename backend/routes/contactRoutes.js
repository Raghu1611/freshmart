import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Contact form submission
router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create transporter using Gmail or your email service
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">New Contact Form Submission</h2>
                    
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                    </div>
                    
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Message:</h3>
                        <p style="color: #4b5563; line-height: 1.6;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 12px;">
                        <p>This email was sent from the FreshMart contact form.</p>
                        <p>Reply directly to this email to respond to ${name}.</p>
                    </div>
                </div>
            `
        };

        // Confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting FreshMart',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #16a34a; margin: 0;">FreshMart</h1>
                        <p style="color: #6b7280; margin: 5px 0;">Fresh, Organic, Delivered</p>
                    </div>
                    
                    <h2 style="color: #374151;">Thank You for Reaching Out!</h2>
                    
                    <p style="color: #4b5563; line-height: 1.6;">Hi ${name},</p>
                    
                    <p style="color: #4b5563; line-height: 1.6;">
                        We've received your message and our team will get back to you as soon as possible, 
                        usually within 24 hours.
                    </p>
                    
                    <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0;">
                        <p style="margin: 0; color: #15803d;"><strong>Your Message:</strong></p>
                        <p style="margin: 10px 0 0 0; color: #4b5563;">${message}</p>
                    </div>
                    
                    <p style="color: #4b5563; line-height: 1.6;">
                        In the meantime, feel free to browse our fresh products and special offers!
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" 
                           style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                            Shop Now
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 12px; text-align: center;">
                        <p>© ${new Date().getFullYear()} FreshMart. All rights reserved.</p>
                        <p>123 Grocery St, Market City, ST 12345</p>
                    </div>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

export default router;
