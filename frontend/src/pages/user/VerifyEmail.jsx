import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Loader2, Leaf, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import PageTransition from '../../components/PageTransition';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error('Invalid verification link');
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/auth/verify-email', {
                token,
                password
            });

            // Store both user and token
            login(response.data.user);
            localStorage.setItem('token', response.data.token);

            toast.success('Account verified successfully! 🎉');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Verification failed';

            if (message.includes('expired') || message.includes('Invalid')) {
                setTokenExpired(true);
                toast.error('Verification link has expired. Please register again.');
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    if (tokenExpired) {
        return (
            <PageTransition variant="scale" className="flex items-center justify-center min-h-[85vh] py-10 px-4 transition-colors duration-300">
                <div
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-red-100 dark:border-red-900/30 text-center transition-colors duration-300"
                >
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-600 dark:text-red-400" size={40} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Link Expired</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        This verification link has expired. Please register again with your email to receive a new verification link.
                    </p>

                    <div className="space-y-3">
                        <Link
                            to="/register"
                            className="block w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Register Again
                        </Link>
                        <Link
                            to="/login"
                            className="block text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm font-semibold"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition variant="scale" className="flex items-center justify-center min-h-[85vh] py-10 px-4 transition-colors duration-300">
            <div
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-10 border border-green-100 dark:border-gray-700 transition-colors duration-300"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Leaf className="text-white" size={40} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Set Your Password
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    Complete your registration by creating a password
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                placeholder="Enter password"
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
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
                                placeholder="Confirm password"
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
                                <span>Completing...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                <span>Complete Registration</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </PageTransition>
    );
};

export default VerifyEmail;
