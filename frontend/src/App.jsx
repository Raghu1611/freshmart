import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import VerifyEmail from './pages/user/VerifyEmail';
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import Shop from './pages/user/Shop';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';
import Dashboard from './pages/user/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import SessionWarning from './components/SessionWarning';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import Menu from './pages/user/Menu';

import ScrollToTop from './components/ScrollToTop';

const App = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <CartProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-brand-light dark:bg-gray-900 transition-colors duration-300">
                {!isAdminRoute && <Navbar />}
                <SessionWarning />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/menu" element={<Menu />} />

                        {/* Protected User Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-success" element={<OrderSuccess />} />
                            <Route path="/orders" element={<OrderHistory />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route element={<AdminRoute />}>
                            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                            <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
                            <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
                            <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
                            <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
                            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
                        </Route>
                    </Routes>
                </main>
                {!isAdminRoute && <Footer />}
            </div>
        </CartProvider>
    );
};

export default App;
