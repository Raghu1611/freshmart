import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Truck, Shield, Check, Loader2, Star, Minus, Plus, User, Bell } from 'lucide-react';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard';

import PageTransition from '../../components/PageTransition';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    // Review State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const [activeImage, setActiveImage] = useState('');

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProductAndRelated = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/${id}`);
                const data = response.data.product || response.data;
                setProduct(data);

                // Set initial active image
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                } else {
                    setActiveImage(data.imageUrl);
                }

                // Save to Recently Viewed
                const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const newViewed = [data, ...viewed.filter(p => p._id !== data._id)].slice(0, 5);
                localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));

                // Fetch related products
                const relatedResponse = await axios.get(`${API_URL}/products?category=${data.category}&limit=4`);
                const related = relatedResponse.data.products.filter(p => p._id !== data._id).slice(0, 4);
                setRelatedProducts(related);

            } catch (error) {
                console.error('Failed to fetch product', error);
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndRelated();
    }, [id, navigate]);

    const handleSubscribe = async () => {
        let emailToSubscribe = user?.email;

        if (!emailToSubscribe) {
            emailToSubscribe = prompt("Please enter your email to receive price drop alerts:");
            if (!emailToSubscribe) return;
        }

        try {
            await axios.post(`${API_URL}/products/${id}/alert`, { email: emailToSubscribe }, {
                headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}
            });
            toast.success('Successfully subscribed to price alerts!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to subscribe');
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        try {
            await axios.post(`${API_URL}/cart/add`, {
                productId: product._id,
                quantity
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success(`Added ${quantity} ${product.name} to cart`);
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            toast.error('Please login to buy items');
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        try {
            await axios.post(`${API_URL}/cart/add`, {
                productId: product._id,
                quantity
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate('/checkout');
        } catch (error) {
            console.error('Buy now error:', error);
            toast.error(error.response?.data?.message || 'Failed to process buy now');
        } finally {
            setAddingToCart(false);
        }
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to write a review');
            navigate('/login');
            return;
        }
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmittingReview(true);
        try {
            await axios.post(`${API_URL}/products/${id}/reviews`, { rating, comment }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Review submitted successfully');

            // Refresh product data
            const response = await axios.get(`${API_URL}/products/${id}`);
            setProduct(response.data.product || response.data);
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="animate-spin text-green-600" size={40} />
            </div>
        );
    }

    if (!product) {
        return (
            <PageTransition variant="fadeUp" className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Product not found</h2>
            </PageTransition>
        );
    }

    return (
        <PageTransition variant="slideRight" className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-8 lg:p-12 bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-square flex items-center justify-center mb-8 relative group"
                            >
                                <img
                                    src={activeImage?.startsWith('http') ? activeImage : `${API_URL.replace('/api', '')}${activeImage}`}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                                />
                            </motion.div>

                            <div className="grid grid-cols-4 gap-4">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(img)}
                                            className={`aspect-square rounded-xl border-2 overflow-hidden p-2 transition-all ${activeImage === img
                                                ? 'border-primary-600 ring-2 ring-primary-50 dark:ring-primary-900/50'
                                                : 'border-gray-100 dark:border-gray-700 hover:border-primary-300'
                                                }`}
                                        >
                                            <img
                                                src={img?.startsWith('http') ? img : `${API_URL.replace('/api', '')}${img}`}
                                                alt={`View ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </button>
                                    ))
                                ) : null}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 lg:p-12 flex flex-col">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                    {product.stock > 0 ? (
                                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> In Stock
                                        </span>
                                    ) : (
                                        <span className="text-red-500 text-sm font-medium">Out of Stock</span>
                                    )}
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"}
                                                className={i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                        {product.numReviews || 0} Reviews
                                    </span>
                                </div>

                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        ₹{product.price}
                                    </span>
                                    {product.originalPrice > product.price && (
                                        <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                                    )}
                                </div>
                            </div>

                            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                <p>{product.description}</p>
                            </div>

                            <div className="mt-auto space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary-600 transition-colors"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-primary-600 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0 || addingToCart}
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {addingToCart ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={product.stock <= 0 || addingToCart}
                                        className="flex-1 bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 h-12 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                <button
                                    onClick={handleSubscribe}
                                    className="w-full mt-4 flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                                >
                                    <Bell size={16} />
                                    Notify me if price drops
                                </button>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                                        <Truck className="text-blue-600 dark:text-blue-400" size={20} />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-xs">Fast Delivery</p>
                                            <p className="text-[10px] text-gray-500">Within 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                                        <Shield className="text-purple-600 dark:text-purple-400" size={20} />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-xs">Secure Payment</p>
                                            <p className="text-[10px] text-gray-500">100% Protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews & Related */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Reviews */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h3>

                            {/* Write Review */}
                            <form onSubmit={submitReviewHandler} className="mb-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    size={24}
                                                    fill={star <= rating ? "currentColor" : "none"}
                                                    className={star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <textarea
                                        rows="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-sm"
                                        placeholder="Write your review..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
                                                        {review.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</span>
                                                </div>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            fill={i < review.rating ? "currentColor" : "none"}
                                                            className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm pl-11">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Related Products</h3>
                            <Link
                                to={`/shop?category=${product.category}`}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related._id} product={related} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ProductDetails;
