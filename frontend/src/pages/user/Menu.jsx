import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
    { name: 'Vegetables', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800', count: '45 Items', color: 'bg-green-50 text-green-600' },
    { name: 'Fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800', count: '32 Items', color: 'bg-orange-50 text-orange-600' },
    { name: 'Dairy', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800', count: '18 Items', color: 'bg-blue-50 text-blue-600' },
    { name: 'Fresh Meat', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800', count: '15 Items', color: 'bg-red-50 text-red-600' },
    { name: 'Seafood', image: 'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=800', count: '20 Items', color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Bakery', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800', count: '24 Items', color: 'bg-amber-50 text-amber-600' },
    { name: 'Beverages', image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800', count: '56 Items', color: 'bg-purple-50 text-purple-600' },
    { name: 'Food', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', count: '60 Items', color: 'bg-red-50 text-red-600' },
    { name: 'Smartphones', image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800', count: '12 Items', color: 'bg-gray-50 text-gray-600' },
    { name: 'Electronic Gadgets', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', count: '28 Items', color: 'bg-indigo-50 text-indigo-600' },
];

import PageTransition from '../../components/PageTransition';

const Menu = () => {
    return (
        <PageTransition variant="fadeUp" className="bg-brand-light dark:bg-gray-900 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 py-12 border-b border-gray-100 dark:border-gray-700">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Browse through our wide range of fresh products and find exactly what you need.</p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            to={`/shop?category=${cat.name}`}
                            key={index}
                            className="group"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors">{cat.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{cat.count}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.color}`}>
                                            View All
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-green-600 group-hover:text-white transition-all">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Promo Section */}
            <div className="container mx-auto px-4 mt-8">
                <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Get 20% Off Your First Order</h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Join thousands of happy customers who get fresh groceries delivered to their doorstep every day.</p>
                        <Link to="/shop" className="inline-block px-10 py-4 bg-white text-green-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            Shop Now
                        </Link>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Menu;
