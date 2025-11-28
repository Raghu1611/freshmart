import { ShoppingCart, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation

        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`);
    };

    // Calculate discount percentage if originalPrice exists and is greater than price
    const discountPercentage = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group relative flex flex-col h-full">
            <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        {discountPercentage}% OFF
                    </div>
                )}

                {/* Image */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center">
                    <img
                        src={product.imageUrl?.startsWith('http') ? product.imageUrl : `${API_URL.replace('/api', '')}${product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2" title={product.name}>
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                        {product.unit || '1 each'}
                    </p>

                    <div className="mt-auto flex items-end justify-between">
                        <div>
                            {product.originalPrice > product.price && (
                                <div className="text-xs text-gray-400 line-through mb-0.5">
                                    ₹{product.originalPrice}
                                </div>
                            )}
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                ₹{product.price}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 text-green-600 dark:text-green-400 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-green-200 dark:hover:shadow-none"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
