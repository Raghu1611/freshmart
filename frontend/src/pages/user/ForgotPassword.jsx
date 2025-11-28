import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, Leaf, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import PageTransition from '../../components/PageTransition';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/auth/forgot-password', { email });
            localStorage.setItem('resetEmail', email);
            toast.success('OTP sent to your email! 📧');
            setTimeout(() => navigate('/reset-password'), 1500);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to send OTP';

            if (message.includes('not found')) {
                toast.error('No account found with this email');
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition variant="scale" className="flex items-center justify-center min-h-[85vh] py-10 px-4 transition-colors duration-300">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-green-100 dark:border-gray-700 transition-colors duration-300">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Leaf className="text-white" size={40} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Forgot Password?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    No worries! We'll send you a reset OTP
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="text-gray-400" size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <span className="font-semibold">Note:</span> You'll receive a 6-digit OTP valid for 15 minutes.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Send OTP</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="mt-8 text-center">
                    <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-semibold">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </PageTransition>
    );
};

export default ForgotPassword;
