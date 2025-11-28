import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, LogOut, RefreshCw } from 'lucide-react';

const SessionWarning = () => {
    const { showWarning, timeLeft, logout, extendSession } = useAuth();

    if (!showWarning) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-orange-100 dark:border-orange-900/30 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full -mr-16 -mt-16 z-0"></div>

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Clock className="text-orange-600 dark:text-orange-400" size={40} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session Expiring!</h2>

                        <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4 font-mono">
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Your session is about to expire due to inactivity. Would you like to stay logged in?
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={logout}
                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                            <button
                                onClick={extendSession}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Extend
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SessionWarning;
