import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Session timeout: 15 minutes (900000 ms)
const SESSION_TIMEOUT = 900000; // 15 minutes
const WARNING_TIME = 60000; // Show warning 1 minute before timeout

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const timeoutRef = useRef(null);
    const warningTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    // Handle session expiration
    const handleSessionExpired = useCallback(() => {
        console.log('Session expired - logging out');

        // Clear all timers
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        setUser(null);
        setShowWarning(false);
        setTimeLeft(0);
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        toast.error('Session expired. Please login again.', {
            duration: 4000,
            icon: '🔒'
        });

        // Redirect to login
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    }, []);

    // Reset session timer
    const resetTimer = useCallback(() => {
        console.log('Timer reset');

        setShowWarning(false);
        setTimeLeft(0);

        // Clear existing timers
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        // Set warning timer (45 seconds - 15 seconds before logout)
        warningTimeoutRef.current = setTimeout(() => {
            console.log('Warning triggered');
            setShowWarning(true);
            setTimeLeft(15);

            // Start countdown
            countdownIntervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            toast.error('⚠️ Your session will expire soon!', {
                duration: 5000,
                icon: '⏰'
            });
        }, SESSION_TIMEOUT - WARNING_TIME);

        // Set logout timer (60 seconds)
        timeoutRef.current = setTimeout(() => {
            console.log('Logout timer triggered');
            handleSessionExpired();
        }, SESSION_TIMEOUT);
    }, [handleSessionExpired]);

    // Track user activity
    useEffect(() => {
        if (!user) {
            console.log('No user - skipping activity tracking');
            return;
        }

        console.log('Setting up activity listeners for user:', user.email);

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            console.log('Activity detected - resetting timer');
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            console.log('Cleaning up activity listeners');
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [user, resetTimer]);

    // Initial user verification & Axios Interceptor
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser && token) {
                    const userData = JSON.parse(storedUser);
                    console.log('User found in localStorage:', userData.email);
                    setUser(userData);
                }
            } catch (error) {
                console.error(" Auth check failed", error);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();

        // Axios Interceptor for 401s
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    console.log('401 Unauthorized - Logging out');
                    logout();
                    toast.error('Session expired. Please login again.');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = (userData) => {
        console.log('User logged in:', userData.email);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        console.log('Manual logout');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        setUser(null);
        setShowWarning(false);
        setTimeLeft(0);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const extendSession = () => {
        console.log('Session extended');
        resetTimer();
        toast.success('Session extended!', {
            duration: 2000,
            icon: '✅'
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            showWarning,
            timeLeft,
            extendSession,
            resetTimer
        }}>
            {children}
        </AuthContext.Provider>
    );
};
