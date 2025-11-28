import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, Calendar, LogOut, Leaf, Eye, EyeOff, Send, Key } from 'lucide-react';
import { API_URL } from '../../config';

import PageTransition from '../../components/PageTransition';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('email');
    const [loading, setLoading] = useState(false);

    // Email update state
    const [emailData, setEmailData] = useState({
        newEmail: '',
        password: ''
    });

    // Password update (current password method)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // OTP method state
    const [otpMethod, setOtpMethod] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpPasswordData, setOtpPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showOtpPasswords, setShowOtpPasswords] = useState({
        new: false,
        confirm: false
    });

    const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    // OTP Input Handlers
    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpInputRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e) => {
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
            otpInputRefs[lastFilledIndex].current?.focus();
        } else {
            otpInputRefs[5].current?.focus();
        }
    };

    // Email Update Handler
    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/profile/update-email`,
                emailData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Email updated successfully! Check your new email for confirmation.');
            setEmailData({ newEmail: '', password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update email');
        } finally {
            setLoading(false);
        }
    };

    // Password Update (Current Password Method)
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords don't match");
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/profile/update-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    // Request OTP
    const handleRequestOTP = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/profile/request-password-otp`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('OTP sent to your email! Check your inbox.');
            setOtpSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Update Password with OTP
    const handleOtpPasswordUpdate = async (e) => {
        e.preventDefault();

        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            return toast.error('Please enter all 6 digits');
        }

        if (otpPasswordData.newPassword !== otpPasswordData.confirmPassword) {
            return toast.error("Passwords don't match");
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/profile/update-password-otp`,
                {
                    otp: otpValue,
                    newPassword: otpPasswordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Password updated successfully!');
            setOtp(['', '', '', '', '', '']);
            setOtpPasswordData({ newPassword: '', confirmPassword: '' });
            setOtpSent(false);
            setOtpMethod(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <PageTransition variant="slideRight" className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-green-100 dark:border-gray-700 mb-6 transition-colors duration-300"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                <User className="text-white" size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h1>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <Mail size={16} />
                                    {user.email}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                    <Calendar size={14} />
                                    Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-100 dark:border-gray-700 transition-colors duration-300"
                >
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'email'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Mail size={20} />
                                Update Email
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('password'); setOtpMethod(false); }}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'password'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Lock size={20} />
                                Update Password
                            </span>
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Email Update Tab */}
                        {activeTab === 'email' && (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleEmailUpdate}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        New Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="text-gray-400" size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                            placeholder="newemail@example.com"
                                            value={emailData.newEmail}
                                            onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password (for verification)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="text-gray-400" size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                            placeholder="••••••••"
                                            value={emailData.password}
                                            onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update Email'}
                                </button>
                            </motion.form>
                        )}

                        {/* Password Update Tab */}
                        {activeTab === 'password' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {/* Method Selection */}
                                {!otpMethod ? (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Choose Update Method</h3>

                                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setOtpMethod(false)}
                                                className="p-6 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-xl text-left hover:shadow-lg transition-all"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                                        <Key className="text-white" size={24} />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">Current Password</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Use your current password to set a new one</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setOtpMethod(true)}
                                                className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 rounded-xl text-left hover:shadow-lg transition-all"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                                        <Send className="text-white" size={24} />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">Email OTP</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Receive a code via email for extra security</p>
                                            </button>
                                        </div>

                                        {/* Current Password Method Form */}
                                        <form onSubmit={handlePasswordUpdate} className="space-y-5 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="text-gray-400" size={20} />
                                                    </div>
                                                    <input
                                                        type={showPasswords.current ? 'text' : 'password'}
                                                        required
                                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                                        placeholder="Enter current password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="text-gray-400" size={20} />
                                                    </div>
                                                    <input
                                                        type={showPasswords.new ? 'text' : 'password'}
                                                        required
                                                        minLength={6}
                                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                                        placeholder="Enter new password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Lock className="text-gray-400" size={20} />
                                                    </div>
                                                    <input
                                                        type={showPasswords.confirm ? 'text' : 'password'}
                                                        required
                                                        minLength={6}
                                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                                        placeholder="Confirm new password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    // OTP Method
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email OTP Method</h3>
                                            <button
                                                type="button"
                                                onClick={() => { setOtpMethod(false); setOtpSent(false); }}
                                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 font-semibold"
                                            >
                                                ← Change Method
                                            </button>
                                        </div>

                                        {!otpSent ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Send className="text-blue-600 dark:text-blue-400" size={32} />
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 mb-6">We'll send a 6-digit OTP to your email</p>
                                                <button
                                                    type="button"
                                                    onClick={handleRequestOTP}
                                                    disabled={loading}
                                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg transition-all duration-300 disabled:opacity-50"
                                                >
                                                    {loading ? 'Sending...' : 'Send OTP to Email'}
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleOtpPasswordUpdate} className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                                                        Enter 6-Digit OTP
                                                    </label>
                                                    <div className="flex justify-center gap-2 mb-2" onPaste={handleOtpPaste}>
                                                        {otp.map((digit, index) => (
                                                            <input
                                                                key={index}
                                                                ref={otpInputRefs[index]}
                                                                type="text"
                                                                maxLength={1}
                                                                value={digit}
                                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                                className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">OTP expires in 15 minutes</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Lock className="text-gray-400" size={20} />
                                                        </div>
                                                        <input
                                                            type={showOtpPasswords.new ? 'text' : 'password'}
                                                            required
                                                            minLength={6}
                                                            className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                                            placeholder="Enter new password"
                                                            value={otpPasswordData.newPassword}
                                                            onChange={(e) => setOtpPasswordData({ ...otpPasswordData, newPassword: e.target.value })}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowOtpPasswords({ ...showOtpPasswords, new: !showOtpPasswords.new })}
                                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showOtpPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Lock className="text-gray-400" size={20} />
                                                        </div>
                                                        <input
                                                            type={showOtpPasswords.confirm ? 'text' : 'password'}
                                                            required
                                                            minLength={6}
                                                            className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white"
                                                            placeholder="Confirm new password"
                                                            value={otpPasswordData.confirmPassword}
                                                            onChange={(e) => setOtpPasswordData({ ...otpPasswordData, confirmPassword: e.target.value })}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowOtpPasswords({ ...showOtpPasswords, confirm: !showOtpPasswords.confirm })}
                                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showOtpPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Profile;
