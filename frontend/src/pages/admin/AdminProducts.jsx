import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Upload, Loader2, Image as ImageIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';

import PageTransition from '../../components/PageTransition';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    // Array of 4 slots for images
    const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        unit: '',
        description: '',
        category: '',
        stock: '',
        // Array of 4 slots for files
        images: [null, null, null, null]
    });

    const categories = [
        'Vegetables',
        'Fruits',
        'Smartphones',
        'Electronic Gadgets',
        'Food',
        'Dairy',
        'Bakery',
        'Beverages',
        'Other'
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data.products);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...formData.images];
            newImages[index] = file;
            setFormData({ ...formData, images: newImages });

            const newPreviews = [...imagePreviews];
            newPreviews[index] = URL.createObjectURL(file);
            setImagePreviews(newPreviews);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);

        // Initialize images state
        const initialImages = [null, null, null, null];
        const initialPreviews = [null, null, null, null];

        // Populate previews from existing product images
        if (product.images && product.images.length > 0) {
            product.images.forEach((img, i) => {
                if (i < 4) {
                    initialPreviews[i] = img.startsWith('http') ? img : `${API_URL.replace('/api', '')}${img}`;
                }
            });
        } else if (product.imageUrl) {
            // Fallback for legacy single image
            initialPreviews[0] = product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL.replace('/api', '')}${product.imageUrl}`;
        }

        setFormData({
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || '',
            unit: product.unit || '',
            description: product.description,
            category: product.category,
            stock: product.stock,
            images: initialImages // We don't have files, only URLs. New uploads will populate this.
        });
        setImagePreviews(initialPreviews);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        resetForm();
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('originalPrice', formData.originalPrice);
            data.append('unit', formData.unit);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('stock', formData.stock);

            // Append all selected files
            formData.images.forEach((file) => {
                if (file) {
                    data.append('images', file);
                }
            });

            if (editingProduct) {
                await axios.put(`${API_URL}/products/${editingProduct._id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Product updated successfully');
            } else {
                await axios.post(`${API_URL}/products`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Product created successfully');
            }

            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            unit: '',
            description: '',
            category: '',
            stock: '',
            images: [null, null, null, null]
        });
        setImagePreviews([null, null, null, null]);
        setEditingProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition variant="fadeUp" className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your product inventory</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all shadow-lg shadow-green-600/20 font-medium transform active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-green-600" size={40} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL.replace('/api', '')}${product.imageUrl}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon size={20} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.unit}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">₹{product.price}</div>
                                            {product.originalPrice > product.price && (
                                                <div className="text-xs text-gray-400 line-through">₹{product.originalPrice}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {product.stock > 0 ? (
                                                    <CheckCircle size={16} className="text-green-500" />
                                                ) : (
                                                    <AlertCircle size={16} className="text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No products found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Product Image Section */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Product Image</label>
                                    <div className="flex gap-4">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div key={index} className="relative w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group bg-gray-50 dark:bg-gray-900 overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleImageChange(e, index)}
                                                />
                                                {imagePreviews[index] ? (
                                                    <img src={imagePreviews[index]} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <Upload size={24} className="text-gray-400 group-hover:text-green-500 mb-1 transition-colors" />
                                                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-green-500 transition-colors">Upload</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all placeholder:text-gray-400"
                                        placeholder="Type here"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Product Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all resize-none placeholder:text-gray-400"
                                        placeholder="Type here"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Category</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all text-gray-600 dark:text-gray-300"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price & Stock Grid (Kept for functionality) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all placeholder:text-gray-400"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Stock</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all placeholder:text-gray-400"
                                            placeholder="0"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Unit</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all placeholder:text-gray-400"
                                            placeholder="e.g. 1 kg"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Original Price (Optional) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Original Price <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:text-white transition-all placeholder:text-gray-400"
                                            placeholder="0.00"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="flex items-center gap-2 px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg shadow-green-900/20 font-medium disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                                    >
                                        {submitLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                {editingProduct ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                {editingProduct ? <Save size={18} /> : <Plus size={18} />}
                                                {editingProduct ? 'Update Product' : 'Create Product'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default AdminProducts;
