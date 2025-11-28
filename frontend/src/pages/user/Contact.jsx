import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

import PageTransition from '../../components/PageTransition';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/contact/send`, formData);
            toast.success(response.data.message || 'Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <PageTransition variant="fadeUp" className="bg-brand-light dark:bg-gray-900 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-green-600 text-white py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg opacity-90 max-w-2xl mx-auto px-4">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Contact Info Sidebar */}
                    <div className="lg:w-1/3 bg-gray-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="text-green-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Call Us</p>
                                        <p className="font-semibold text-lg">+1 (555) 123-4567</p>
                                        <p className="text-sm text-gray-400">+1 (555) 987-6543</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="text-green-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Email Us</p>
                                        <p className="font-semibold text-lg">support@freshmart.com</p>
                                        <p className="text-sm text-gray-400">info@freshmart.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-green-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Visit Us</p>
                                        <p className="font-semibold text-lg">123 Grocery St.</p>
                                        <p className="text-sm text-gray-400">Market City, ST 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-600 rounded-full opacity-20 blur-3xl"></div>
                        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-2xl"></div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3 p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="container mx-auto px-4 mt-12">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm h-[400px] overflow-hidden relative">
                    <img
                        src="https://images.pexels.com/photos/2957865/pexels-photo-2957865.jpeg?auto=compress&cs=tinysrgb&w=1920"
                        alt="Map Location"
                        className="w-full h-full object-cover rounded-2xl brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl text-center">
                            <MapPin className="text-green-600 mx-auto mb-2" size={40} />
                            <h3 className="font-bold text-xl">Find Us Here</h3>
                            <p className="text-gray-500">123 Grocery St, Market City</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Contact;
