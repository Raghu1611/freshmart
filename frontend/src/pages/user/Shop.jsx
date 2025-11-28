import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../config';
import ProductCard from '../../components/ProductCard';

import PageTransition from '../../components/PageTransition';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const categories = [
        'All',
        'Vegetables',
        'Fruits',
        'Smartphones',
        'Electronic Gadgets',
        'Food',
        'Dairy',
        'Fresh Meat',
        'Seafood',
        'Bakery',
        'Beverages',
        'Other'
    ];

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, selectedCategory, searchQuery]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data.products);
            setFilteredProducts(response.data.products);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let temp = [...products];

        if (selectedCategory !== 'All') {
            temp = temp.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            temp = temp.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(temp);
    };

    return (
        <PageTransition variant="fadeUp" className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header & Search */}
                <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-900 pb-4 pt-2 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                FreshMart <span className="text-primary-600">.</span>
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mt-1">
                                Everything delivered in 10 minutes
                            </p>
                        </div>

                        <div className="flex w-full md:w-auto gap-3">
                            <div className="relative flex-1 md:w-96 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search 'chips'"
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white shadow-sm text-sm transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="md:hidden p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 shadow-sm active:scale-95 transition-transform"
                            >
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Categories Scroll (Mobile/Desktop) */}
                    <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar mask-fade-right">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${selectedCategory === cat
                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-900/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-2">
                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-primary-600" size={40} />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeInUp">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-full mb-4 shadow-sm">
                                    <Search size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No items found</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Try searching for something else</p>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.05
                                        }
                                    }
                                }}
                            >
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        layout
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Shop;
