import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Leaf, Users, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageTransition from '../../components/PageTransition';

const About = () => {
    return (
        <PageTransition variant="fadeUp" className="bg-white dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1920"
                        alt="About Us Hero"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-4"
                    >
                        About FreshMart
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200"
                    >
                        Delivering freshness and quality to your doorstep since 2023.
                    </motion.p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <img
                                src="https://images.pexels.com/photos/219794/pexels-photo-219794.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Our Story"
                                className="rounded-3xl shadow-2xl z-10 relative"
                            />
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-green-100 dark:bg-green-900/30 rounded-full -z-0 hidden md:block"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-100 dark:bg-orange-900/30 rounded-full -z-0 hidden md:block"></div>
                        </motion.div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-green-600 font-bold tracking-wider uppercase"
                        >
                            Our Story
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-gray-900 dark:text-white leading-tight"
                        >
                            We're on a Mission to Change the Way You Eat
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
                        >
                            FreshMart started with a simple idea: everyone deserves access to fresh, high-quality food without the hassle. We partner directly with local farmers and sustainable suppliers to bring you the best produce, meats, and pantry staples.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
                        >
                            Our commitment goes beyond just delivery. We believe in building a community centered around healthy living, sustainability, and the joy of cooking.
                        </motion.p>
                        <div className="pt-4">
                            <Link to="/contact" className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-green-500/30">
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-gray-50 dark:bg-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose FreshMart?</h2>
                        <p className="text-gray-600 dark:text-gray-400">We don't just deliver groceries; we deliver a promise of quality, speed, and reliability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Leaf size={40} />, title: "100% Organic", desc: "Sourced directly from certified organic farms." },
                            { icon: <Truck size={40} />, title: "Fast Delivery", desc: "Same-day delivery to keep your food fresh." },
                            { icon: <ShieldCheck size={40} />, title: "Quality Guarantee", desc: "Not satisfied? We offer a 100% refund." },
                            { icon: <Users size={40} />, title: "Community First", desc: "Supporting local farmers and producers." },
                            { icon: <Award size={40} />, title: "Award Winning", desc: "Recognized for our service and quality." },
                            { icon: <Heart size={40} />, title: "Made with Love", desc: "Hand-picked and packed with care." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group"
                            >
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { number: "15k+", label: "Happy Customers" },
                        { number: "500+", label: "Products" },
                        { number: "50+", label: "Partner Farms" },
                        { number: "24/7", label: "Support" }
                    ].map((stat, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-bold text-green-600">{stat.number}</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
};

export default About;
