import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 pt-16 pb-8 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src="/logo.png" alt="FreshMart Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-bold text-brand-dark dark:text-white tracking-tight">
                                Fresh<span className="text-green-600">Mart</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            FreshMart is your one-stop shop for fresh, organic, and locally sourced groceries. We deliver quality to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Shop', path: '/shop' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Menu', path: '/menu' }
                            ].map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-green-600 transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Categories</h3>
                        <ul className="space-y-4">
                            {[
                                'Vegetables',
                                'Fruits',
                                'Dairy',
                                'Fresh Meat',
                                'Seafood',
                                'Bakery',
                                'Beverages'
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={`/shop?category=${item}`}
                                        className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-green-600 transition-colors"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Address</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">123 Grocery St, Market City, ST 12345</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">support@freshmart.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} FreshMart. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
