import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, TrendingUp, Users, User, ShoppingBag, Leaf, Clock, Image as ImageIcon } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentProducts(viewed);
    }, []);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} added to cart`);
    };

    const { getCartCount } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const cartCount = getCartCount();

    const stats = [
        {
            title: 'Total Orders',
            value: loading ? '...' : totalOrders,
            change: 'Lifetime orders',
            icon: <ShoppingCart size={28} />,
            color: 'from-green-400 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Items in Cart',
            value: cartCount,
            change: 'Ready to checkout',
            icon: <ShoppingBag size={28} />,
            color: 'from-blue-400 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Total Spent',
            value: loading ? '...' : `₹${totalSpent.toLocaleString()}`,
            change: 'Lifetime spend',
            icon: <TrendingUp size={28} />,
            color: 'from-purple-400 to-violet-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: 'Saved Items',
            value: '0',
            change: 'Coming soon',
            icon: <Package size={28} />,
            color: 'from-orange-400 to-amber-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        },
    ];

    const quickActions = [
        { title: 'Browse Products', icon: <Leaf size={24} />, link: '/shop', color: 'from-green-500 to-emerald-600' },
        { title: 'My Orders', icon: <Clock size={24} />, link: '/orders', color: 'from-blue-500 to-cyan-600' },
        { title: 'Saved List', icon: <Package size={24} />, link: '/cart', color: 'from-purple-500 to-violet-600' },
        { title: 'My Profile', icon: <User size={24} />, link: '/profile', color: 'from-orange-500 to-amber-600' },
    ];

    return (
        <PageTransition variant="fadeUp" className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">{user?.email?.split('@')[0]}</span>! 👋
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Here's what's happening with your FreshMart account</p>
                        </div>
                        <Link
                            to="/profile"
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                        >
                            <User size={20} />
                            My Profile
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`${stat.bgColor} rounded-2xl p-6 border-2 border-transparent hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 cursor-pointer group hover:shadow-xl`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-10 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-green-50 hover:to-emerald-50 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 group"
                            >
                                <div className={`p-4 bg-gradient-to-br ${action.color} rounded-xl text-white mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                    {action.icon}
                                </div>
                                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-center">{action.title}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recently Viewed Products</h2>
                    {recentProducts.length > 0 ? (
                        <div className="space-y-4">
                            {recentProducts.map((product, index) => (
                                <Link
                                    to={`/product/${product._id}`}
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-xl flex items-center justify-center overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL.replace('/api', '')}${product.imageUrl}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{product.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{product.price}</p>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="mt-1 px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors shadow-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            <p>You haven't viewed any products yet.</p>
                            <Link to="/shop" className="text-green-600 hover:underline mt-2 inline-block">Start Shopping</Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
