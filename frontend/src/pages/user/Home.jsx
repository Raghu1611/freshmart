import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import HeroSection from '../../components/HeroSection';
import ProductCard from '../../components/ProductCard';
import PageTransition from '../../components/PageTransition';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products`);
                setProducts(response.data.products);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <PageTransition variant="fadeUp" className="bg-brand-light dark:bg-gray-900 min-h-screen pb-12 transition-colors duration-300">
            {/* Hero Section - Full Width Background */}
            <HeroSection />

            <div className="container mx-auto px-4 lg:px-6 py-12">
                {/* Features / Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                    {[
                        { title: 'Fast Delivery', desc: 'Start from $10', icon: '🚚' },
                        { title: 'Money Guarantee', desc: '7 Days Back', icon: '💰' },
                        { title: '365 Days', desc: 'For free return', icon: '📅' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-brand-orange/5 dark:hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-1">
                            <span className="text-3xl">{item.icon}</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Best Sellers */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-brand-dark dark:text-white">Best Sellers</h2>
                        <Link to="/shop" className="flex items-center gap-2 text-brand-orange font-bold hover:text-red-600 transition-colors group">
                            View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-80 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {products.slice(0, 5).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Promo Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Banner 1: Breakfast */}
                    <div className="bg-[#f3f3f3] dark:bg-gray-800 rounded-3xl p-8 md:p-10 flex items-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                        <div className="z-10 relative max-w-[60%]">
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3 block">Breakfast Food</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                Fresh Healthy <br /> Breakfast food
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm font-medium leading-relaxed">
                                Get ready for spring as soon as today with $0 delivery fees.
                            </p>
                            <Link to="/shop" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-green-200 dark:shadow-none">
                                Explore More
                            </Link>
                        </div>
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[55%] h-[110%] rounded-l-full overflow-hidden">
                            <img
                                src="https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Healthy Breakfast"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                    </div>

                    {/* Banner 2: Chinese/Spicy */}
                    <div className="bg-[#f3f3f3] dark:bg-gray-800 rounded-3xl p-8 md:p-10 flex items-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                        <div className="z-10 relative max-w-[60%]">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                Love Spicy Food? <br />
                                <span className="text-brand-green">Try Chinese item</span>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm font-medium leading-relaxed">
                                Get your fresh food for diet plan and get healthy anytime.
                            </p>
                            <Link to="/shop" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-green-200 dark:shadow-none">
                                Explore Food
                            </Link>
                        </div>
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[55%] h-[110%] rounded-l-full overflow-hidden">
                            <img
                                src="https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Spicy Chinese Food"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                    </div>
                </div>

                {/* Popular Products */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-brand-dark dark:text-white">Popular Products</h2>
                        <Link to="/shop" className="flex items-center gap-2 text-brand-orange font-bold hover:text-red-600 transition-colors group">
                            View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Home;
