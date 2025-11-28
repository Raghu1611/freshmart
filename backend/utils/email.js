import axios from 'axios';

export const sendEmail = async ({ to, subject, html }) => {
    try {
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

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Email sending error:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
