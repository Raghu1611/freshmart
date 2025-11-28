import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, Leaf, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import PageTransition from '../../components/PageTransition';

const ResetPassword = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (/^\d$/.test(char) && index < 6) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        const lastFilledIndex = newOtp.findIndex(val => val === '');
        if (lastFilledIndex !== -1) {
            inputRefs[lastFilledIndex].current?.focus();
        } else {
            inputRefs[5].current?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        const email = localStorage.getItem('resetEmail');

        if (otpValue.length !== 6) {
            return toast.error('Please enter all 6 digits');
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        setLoading(true);

        try {
            await axios.post('/api/auth/reset-password', {
                email,
                otp: otpValue,
                newPassword: password
            });
            toast.success('Password reset successfully! 🎉');
            localStorage.removeItem('resetEmail');
            navigate('/login');
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Reset failed';

            if (message.includes('expired')) {
                toast.error('OTP has expired. Please request a new one.');
            } else if (message.includes('Invalid OTP')) {
                toast.error('Invalid OTP. Please check properly.');
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
                    Reset Password
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    Enter OTP and set your new password
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                            Enter 6-Digit OTP
                        </label>
                        <div className="flex justify-center gap-2 mb-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">OTP expires in 15 minutes</p>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-gray-400" size={20} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-gray-400" size={20} />
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
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
                                <span>Resetting...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                <span>Reset Password</span>
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

export default ResetPassword;
