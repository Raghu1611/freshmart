import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, AlertCircle } from 'lucide-react';

import PageTransition from '../../components/PageTransition';

const AdminDashboard = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Total Revenue',
            value: '$12,450',
            change: '+15% this month',
            icon: <DollarSign size={28} />,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-white dark:bg-gray-800'
        },
        {
            title: 'Active Users',
            value: '1,234',
            change: '+5% this week',
            icon: <Users size={28} />,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-white dark:bg-gray-800'
        },
        {
            title: 'Total Orders',
            value: '456',
            change: '+8% today',
            icon: <ShoppingBag size={28} />,
            color: 'from-purple-500 to-violet-600',
            bgColor: 'bg-white dark:bg-gray-800'
        },
        {
            title: 'Pending Orders',
            value: '23',
            change: 'Action needed',
            icon: <AlertCircle size={28} />,
            color: 'from-orange-500 to-amber-600',
            bgColor: 'bg-white dark:bg-gray-800'
        },
    ];

    return (
        <PageTransition variant="fadeUp" className="min-h-screen bg-brand-light dark:bg-gray-900 py-8 transition-colors duration-300">
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
                            <h1 className="text-4xl font-bold text-brand-dark dark:text-white mb-2">
                                Dashboard Overview
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Welcome back, Admin</p>
                        </div>
                        <div className="mt-4 md:mt-0 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-brand-green dark:text-green-400 rounded-full font-semibold border border-green-200 dark:border-green-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                            System Online
                        </div>
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
                            className={`${stat.bgColor} rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Orders Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Recent Activity</h2>
                        <button className="text-brand-green font-semibold hover:text-green-700 transition-colors">View All</button>
                    </div>

                    <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <Package size={48} className="mx-auto mb-4 opacity-30 text-brand-dark dark:text-white" />
                        <p className="text-lg font-medium">No recent orders to display</p>
                        <p className="text-sm opacity-70">New orders will appear here automatically</p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
