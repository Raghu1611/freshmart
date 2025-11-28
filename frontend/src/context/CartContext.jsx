import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage and check expiration
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const cartTimestamp = localStorage.getItem('cartTimestamp');

        if (savedCart && cartTimestamp) {
            const daysSinceLastUpdate = (Date.now() - parseInt(cartTimestamp)) / (1000 * 60 * 60 * 24);

            // Clear cart if older than 7 days
            if (daysSinceLastUpdate > 7) {
                console.log('Cart expired (older than 7 days). Clearing cart.');
                localStorage.removeItem('cart');
                localStorage.removeItem('cartTimestamp');
                setCart([]);
            } else {
                setCart(JSON.parse(savedCart));
                console.log(`Cart loaded. ${Math.floor(7 - daysSinceLastUpdate)} days remaining.`);
            }
        }
    }, []);

    // Save cart to localStorage with timestamp
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartTimestamp', Date.now().toString());
        } else {
            localStorage.removeItem('cart');
            localStorage.removeItem('cartTimestamp');
        }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTimestamp');
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const getCartExpiration = () => {
        const cartTimestamp = localStorage.getItem('cartTimestamp');
        if (!cartTimestamp) return null;

        const expirationDate = new Date(parseInt(cartTimestamp) + (7 * 24 * 60 * 60 * 1000));
        return expirationDate;
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                getCartExpiration,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
