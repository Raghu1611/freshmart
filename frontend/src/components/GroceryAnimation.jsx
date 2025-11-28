import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    Apple, Carrot, Milk, CupSoda, Sandwich, Croissant,
    ShoppingBasket, Truck, Home, CheckCircle, Beef, Fish, Pizza,
    Sparkles, MapPin, Clock, Star, Package
} from 'lucide-react';

const GroceryAnimation = () => {
    const [animationStage, setAnimationStage] = useState('floating'); // floating, gathering, delivering

    // Mouse Interaction
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        x.set((clientX / window.innerWidth) - 0.5);
        y.set((clientY / window.innerHeight) - 0.5);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Items start from left
    const groceryItems = [
        { Icon: Apple, color: 'text-red-500', bg: 'bg-red-50/90', border: 'border-red-200', id: 1, size: 36, delay: 0 },
        { Icon: Carrot, color: 'text-orange-500', bg: 'bg-orange-50/90', border: 'border-orange-200', id: 2, size: 40, delay: 0.1 },
        { Icon: Milk, color: 'text-blue-400', bg: 'bg-blue-50/90', border: 'border-blue-200', id: 3, size: 36, delay: 0.2 },
        { Icon: CupSoda, color: 'text-purple-500', bg: 'bg-purple-50/90', border: 'border-purple-200', id: 4, size: 32, delay: 0.3 },
        { Icon: Beef, color: 'text-rose-700', bg: 'bg-rose-50/90', border: 'border-rose-200', id: 5, size: 38, delay: 0.4 },
        { Icon: Fish, color: 'text-indigo-400', bg: 'bg-indigo-50/90', border: 'border-indigo-200', id: 6, size: 34, delay: 0.5 },
        { Icon: Pizza, color: 'text-yellow-500', bg: 'bg-yellow-50/90', border: 'border-yellow-200', id: 7, size: 40, delay: 0.6 },
        { Icon: Sandwich, color: 'text-amber-600', bg: 'bg-amber-50/90', border: 'border-amber-200', id: 8, size: 36, delay: 0.7 },
    ];

    useEffect(() => {
        const cycle = async () => {
            setAnimationStage('floating');
            await new Promise(r => setTimeout(r, 6000));
            setAnimationStage('gathering');
            await new Promise(r => setTimeout(r, 2500));
            setAnimationStage('delivering');
            await new Promise(r => setTimeout(r, 5000));
            cycle();
        };
        cycle();
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center perspective-1000">
            <motion.div
                className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center transform-style-3d"
                style={{ perspective: 1000, rotateX, rotateY }}
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/50 -z-50" />

                {/* Status Bar - Top Center */}
                <motion.div className="absolute top-24 z-50">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={animationStage}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2 font-bold text-lg"
                            >
                                {animationStage === 'floating' && <span className="text-green-600">Selecting Items...</span>}
                                {animationStage === 'gathering' && <span className="text-blue-600">Packing Order...</span>}
                                {animationStage === 'delivering' && <span className="text-orange-600">Out for Delivery!</span>}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Left-to-Right Animation Flow */}
                <div className="relative w-full h-full flex items-center">

                    {/* Stage 1: Floating Items (Left Side) */}
                    <AnimatePresence>
                        {animationStage !== 'delivering' && groceryItems.map((item, i) => {
                            const isGathering = animationStage === 'gathering';
                            // Random start positions on the LEFT half of the screen
                            const startX = -35 + (Math.random() * 20);
                            const startY = -20 + (Math.random() * 40);

                            return (
                                <motion.div
                                    key={item.id}
                                    className={`absolute left-1/2 top-1/2 p-3 rounded-xl shadow-lg border backdrop-blur-sm ${item.bg} ${item.border} ${item.color}`}
                                    initial={{ x: '-50vw', y: startY + 'vh', opacity: 0, scale: 0 }}
                                    animate={isGathering ? {
                                        x: '20vw', // Move to basket on RIGHT
                                        y: 0,
                                        scale: 0,
                                        opacity: 0,
                                        rotate: 360,
                                        transition: { duration: 0.8, ease: "backIn", delay: item.delay }
                                    } : {
                                        x: [startX + 'vw', (startX + 10) + 'vw'], // Drift right
                                        y: [startY + 'vh', (startY + (Math.random() * 10 - 5)) + 'vh'],
                                        opacity: 1,
                                        scale: 1,
                                        rotate: [0, 10, -10, 0],
                                        transition: { duration: 6, ease: "linear", repeat: Infinity, repeatType: "mirror" }
                                    }}
                                >
                                    <item.Icon size={item.size} />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Stage 2: Basket (Right Side) */}
                    <AnimatePresence>
                        {(animationStage === 'gathering' || animationStage === 'delivering') && (
                            <motion.div
                                className="absolute left-1/2 top-1/2 z-20"
                                initial={{ x: '20vw', scale: 0, opacity: 0 }} // Appears on RIGHT
                                animate={animationStage === 'delivering' ? {
                                    x: '20vw',
                                    scale: 0,
                                    opacity: 0,
                                    transition: { duration: 0.5 } // Disappears into truck
                                } : {
                                    x: '20vw',
                                    scale: 1.2,
                                    opacity: 1,
                                    transition: { type: "spring", stiffness: 200 }
                                }}
                            >
                                <div className="bg-green-500 text-white p-6 rounded-3xl shadow-2xl relative">
                                    <ShoppingBasket size={64} />
                                    <motion.div
                                        className="absolute -top-3 -right-3 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        8
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stage 3: Delivery Truck (Left to Right) */}
                    <AnimatePresence>
                        {animationStage === 'delivering' && (
                            <>
                                {/* Truck */}
                                <motion.div
                                    className="absolute left-1/2 top-1/2 z-30"
                                    initial={{ x: '-50vw', opacity: 0 }} // Start far LEFT
                                    animate={{
                                        x: ['-50vw', '0vw', '50vw'], // Drive across screen
                                        opacity: [1, 1, 0]
                                    }}
                                    transition={{ duration: 4, ease: "easeInOut" }}
                                >
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl border border-gray-200 relative">
                                        <Truck size={72} className="text-green-600" />
                                        {/* Wind lines */}
                                        <motion.div
                                            className="absolute top-2 -left-6 space-y-2"
                                            animate={{ opacity: [0, 1, 0], x: [-10, -20] }}
                                            transition={{ repeat: Infinity, duration: 0.5 }}
                                        >
                                            <div className="w-8 h-1 bg-gray-300 rounded-full" />
                                            <div className="w-5 h-1 bg-gray-300 rounded-full" />
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Destination (Right Side) */}
                                <motion.div
                                    className="absolute left-1/2 top-1/2 z-20"
                                    initial={{ x: '35vw', opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 2 }}
                                >
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border-2 border-green-100">
                                        <Home size={48} className="text-gray-700" />
                                    </div>
                                </motion.div>

                                {/* Success Check (Right Side) */}
                                <motion.div
                                    className="absolute left-1/2 top-1/2 z-40"
                                    initial={{ x: '35vw', y: -40, scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 3, type: "spring" }}
                                >
                                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                                        <CheckCircle size={32} />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default GroceryAnimation;
