import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ShoppingCart, Menu, Package, UserCircle, ChevronDown, ClipboardList, Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsUserMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
            <div className="container mx-auto px-4 py-4 lg:py-5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/logo.png" alt="FreshMart Logo" className="h-10 w-auto object-contain" />
                        <span className="text-2xl font-bold tracking-tight">
                            Fresh<span className="text-green-600">Mart</span>
                        </span>
                    </Link>

                    {/* Centered Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-600 dark:text-gray-300">
                        <Link to="/" className="text-green-600 font-semibold hover:text-green-700 transition-colors">Home</Link>
                        <Link to="/about" className="hover:text-green-600 transition-colors">About</Link>
                        <Link to="/menu" className="hover:text-green-600 transition-colors">Menu</Link>
                        <Link to="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
                        <Link to="/contact" className="hover:text-green-600 transition-colors">Contact</Link>
                        {user && (
                            <Link to="/dashboard" className="hover:text-green-600 transition-colors font-semibold text-green-600">Dashboard</Link>
                        )}
                        {!user && (
                            <Link to="/admin/login" className="hover:text-green-600 transition-colors">Admin</Link>
                        )}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {/* Cart Icon */}
                        <Link
                            to="/cart"
                            className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            <ShoppingCart size={22} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                        </Link>

                        {user ? (
                            /* User Dropdown Menu */
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className={`flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full transition-all duration-200 border ${isUserMenuOpen
                                        ? 'bg-green-50 border-green-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 ring-2 ring-white dark:ring-gray-900 shadow-sm">
                                        <User size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-none mt-1">
                                            Account
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`text-gray-400 ml-1 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180 text-green-600' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                        {/* User Info Header */}
                                        <div className="px-6 py-5 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm border border-gray-100 dark:border-gray-600">
                                                    <span className="font-bold text-xl">{user.name?.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400 transition-all group"
                                            >
                                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                                                    <Activity size={18} className="text-green-600 dark:text-green-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">Dashboard</p>
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Overview & Stats</p>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400 transition-all group"
                                            >
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                                    <UserCircle size={18} className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">My Profile</p>
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Personal details</p>
                                                </div>
                                            </Link>

                                            <Link
                                                to="/orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400 transition-all group"
                                            >
                                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                                                    <ClipboardList size={18} className="text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">Order History</p>
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Past purchases</p>
                                                </div>
                                            </Link>

                                            <div className="my-2 border-t border-gray-100 dark:border-gray-700/50 mx-2"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all group"
                                            >
                                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                                                    <LogOut size={18} className="text-red-500 dark:text-red-400" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-sm">Logout</p>
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Sign out</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 hover:-translate-y-0.5 active:scale-95 ring-2 ring-green-400/20 hover:ring-green-400/40"
                            >
                                <User size={20} strokeWidth={2.5} />
                                <span className="text-sm tracking-wide">Sign In</span>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></div>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-gray-700 dark:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 absolute w-full left-0 shadow-xl">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-2.5 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 rounded-xl"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/menu"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Menu
                        </Link>
                        <Link
                            to="/shop"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Shop
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Contact
                        </Link>
                        {!user && (
                            <Link
                                to="/admin/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                Admin Login
                            </Link>
                        )}

                        {user ? (
                            <>
                                <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <Activity size={20} className="text-green-600" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <UserCircle size={20} className="text-blue-600" />
                                    My Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <ClipboardList size={20} className="text-purple-600" />
                                    Order History
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-center py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
