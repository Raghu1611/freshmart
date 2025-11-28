import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

import PageTransition from '../../components/PageTransition';
import { API_URL } from '../../config';

const getImageUrl = (path) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    return `${API_URL.replace('/api', '')}${path}`;
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { addToCart, clearCart } = useCart();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = (order) => {
        clearCart();
        order.items.forEach(item => {
            if (item.product) {
                addToCart(item.product, item.quantity);
            }
        });
        toast.success('Items added to cart! Proceeding to checkout.');
        navigate('/cart');
    };

    const handleCancelOrder = (orderId) => {
        toast((t) => (
            <div className="flex flex-col gap-3 min-w-[250px]">
                <p className="font-semibold text-gray-800">Cancel this order?</p>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
                <div className="flex gap-3 justify-end mt-1">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Keep Order
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const token = localStorage.getItem('token');
                                await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                toast.success('Order cancelled successfully');
                                fetchOrders();
                            } catch (error) {
                                console.error('Error cancelling order:', error);
                                toast.error(error.response?.data?.message || 'Failed to cancel order');
                            }
                        }}
                        className="px-3 py-1.5 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors shadow-sm"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '16px',
                borderRadius: '16px',
            },
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="text-yellow-500" size={20} />;
            case 'confirmed':
                return <CheckCircle className="text-blue-500" size={20} />;
            case 'processing':
                return <Package className="text-purple-500" size={20} />;
            case 'shipped':
                return <Truck className="text-orange-500" size={20} />;
            case 'delivered':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'cancelled':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'processing':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'shipped':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.orderStatus === filter;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading your orders...</p>
            </div>
        );
    }

    return (
        <PageTransition variant="slideRight" className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-3">
                        My Orders
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Track and manage your orders</p>
                </div>

                {/* Filters */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap gap-3">
                        {[
                            { value: 'all', label: 'All Orders', count: orders.length },
                            { value: 'pending', label: 'Pending' },
                            { value: 'confirmed', label: 'Confirmed' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'shipped', label: 'Shipped' },
                            { value: 'delivered', label: 'Delivered' },
                            { value: 'cancelled', label: 'Cancelled' }
                        ].map(({ value, label, count }) => (
                            <button
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === value
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {label}
                                {count !== undefined && ` (${count})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-16 text-center border border-gray-100 dark:border-gray-700">
                        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={64} className="text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">No Orders Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                            {filter === 'all'
                                ? "You haven't placed any orders yet."
                                : `You don't have any ${filter} orders.`}
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-green-200 dark:hover:border-green-900 transition-all"
                            >
                                {/* Order Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-gray-100 dark:border-gray-700">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Order #{order.orderNumber}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className={`px-6 py-3 rounded-2xl font-bold border-2 flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                                            {getStatusIcon(order.orderStatus)}
                                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                        </div>
                                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Items ({order.items.length})</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl"
                                            >
                                                <img
                                                    src={getImageUrl(item.product?.imageUrl || item.product?.images?.[0])}
                                                    alt={item.product?.name}
                                                    className="w-20 h-20 object-cover rounded-xl"
                                                />
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                                                        {item.product?.name || 'Product'}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm font-bold text-green-600">
                                                        ₹{(item.quantity * item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                                        Delivery Address
                                    </h4>
                                    <div className="text-gray-700 dark:text-gray-300 space-y-1">
                                        <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        {order.shippingAddress.landmark && (
                                            <p className="text-sm">Landmark: {order.shippingAddress.landmark}</p>
                                        )}
                                        <p>
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Phone: {order.shippingAddress.phone}
                                            {order.shippingAddress.alternatePhone && `, ${order.shippingAddress.alternatePhone}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Status</p>
                                        <p className={`font-bold ${order.paymentStatus === 'completed' ? 'text-green-600 dark:text-green-400' :
                                            order.paymentStatus === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Status</p>
                                        <p className="font-bold text-blue-600 dark:text-blue-400">
                                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => handleReorder(order)}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={20} />
                                        Reorder
                                    </button>
                                    {['pending', 'confirmed'].includes(order.orderStatus) && (
                                        <button
                                            onClick={() => handleCancelOrder(order._id)}
                                            className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default OrderHistory;
