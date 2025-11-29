import axios from 'axios';

export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log('Attempting to send email to:', to);
        console.log('Email API URL present:', !!process.env.EMAIL_API_URL);
        console.log('Verify API Key present:', !!process.env.VERIFY_API_KEY);

        const response = await axios.post(
            process.env.EMAIL_API_URL,
            {
                to,
                subject,
                html
            },
            {
                headers: {
                    'x-api-key': process.env.VERIFY_API_KEY
                }
            }
        );

        console.log('Email sent successfully');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Email sending failed details:');
        console.error('Message:', error.message);
        console.error('Response data:', error.response?.data);
        console.error('Status:', error.response?.status);
        return { success: false, error: error.message };
    }
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
