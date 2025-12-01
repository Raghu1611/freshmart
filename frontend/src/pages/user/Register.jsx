import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Loader2, Leaf, ArrowRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';
import GroceryAnimation from '../../components/GroceryAnimation';

const Register = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/auth/register`, { email });
            toast.success('Verification link sent to your email! 📧');
            // Optional: navigate to a "check email" page or stay here
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]); // Reverse for natural tilt
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
    const shineOpacity = useTransform(mouseY, [-0.5, 0.5], [0, 0.3]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh] py-10 px-4 transition-colors duration-300 relative overflow-hidden perspective-1000">
            <GroceryAnimation />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-md p-10 border border-white/50 dark:border-gray-700 z-10"
            >
                {/* Shine Effect */}
                <motion.div
                    style={{ opacity: shineOpacity }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-[2rem] pointer-events-none z-20"
                />

                {/* Content Container with slight Z-lift for depth */}
                <div style={{ transform: "translateZ(20px)" }} className="relative z-30">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30"
                        >
                            <Leaf className="text-white" size={40} />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                        Join FreshMart for fresh groceries delivered
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
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
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-3">
                            <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                We'll send a verification link to your email to set your password and complete registration.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Sending Link...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 font-bold">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
