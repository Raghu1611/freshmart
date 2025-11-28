import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

import PageTransition from '../../components/PageTransition';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, formData);
            const { token, user } = response.data;

            // Security Check: Enforce Admin Role
            if (user.role !== 'admin') {
                toast.error('Access Denied: You do not have admin privileges.');
                return;
            }

            // Save token
            localStorage.setItem('token', token);

            // Update auth state
            login(user);

            toast.success('Welcome back, Admin! 🛡️');
            navigate('/admin/dashboard');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Admin login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition variant="scale" className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-900">
            <div className="w-full max-w-md">
                {/* Admin Badge */}
                <div className="flex justify-center mb-8">
                    <div className="bg-green-900/30 p-4 rounded-full border border-green-800 shadow-lg shadow-green-900/20">
                        <Shield size={48} className="text-green-500" />
                    </div>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
                            <p className="text-gray-400">Secure access for administrators only</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Admin Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Shield className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-700 transition-all"
                                        placeholder="admin@freshmart.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-700 transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-900/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <Shield size={20} />
                                        Access Dashboard
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-4 bg-gray-900/50 border-t border-gray-700 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <AlertCircle size={14} />
                        <span>Unauthorized access is strictly prohibited</span>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminLogin;
