import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, MapPin, Smartphone, Laptop, Pizza, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        category: 'Grocery Delivery',
        title: 'Make healthy life with',
        highlight: 'fresh grocery',
        description: 'Get the best quality and most delicious grocery food in the world, delivered to your door.',
        image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Groceries/Veg
        color: 'text-green-600',
        bgColor: 'bg-green-600',
        icon: <ShoppingBag size={20} />,
        badgeColor: 'bg-green-100 text-green-600'
    },
    {
        id: 2,
        category: 'Smart Electronics',
        title: 'Upgrade your world with',
        highlight: 'smart phones',
        description: 'Experience the latest technology with our premium collection of smartphones and accessories.',
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Smartphones
        color: 'text-blue-600',
        bgColor: 'bg-blue-600',
        icon: <Smartphone size={20} />,
        badgeColor: 'bg-blue-100 text-blue-600'
    },
    {
        id: 3,
        category: 'Digital Workspace',
        title: 'Boost productivity with',
        highlight: 'pro laptops',
        description: 'High-performance laptops for work, gaming, and creativity at unbeatable prices.',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Laptops
        color: 'text-purple-600',
        bgColor: 'bg-purple-600',
        icon: <Laptop size={20} />,
        badgeColor: 'bg-purple-100 text-purple-600'
    },
    {
        id: 4,
        category: 'Fast Food',
        title: 'Satisfy cravings with',
        highlight: 'tasty meals',
        description: 'Delicious fast food delivered hot and fresh to your doorstep in minutes.',
        image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Fast Food
        color: 'text-orange-500',
        bgColor: 'bg-orange-500',
        icon: <Pizza size={20} />,
        badgeColor: 'bg-orange-100 text-orange-600'
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const slide = slides[currentSlide];

    return (
        <div className="relative bg-brand-light dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left z-20">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 transition-colors duration-500 ${slide.badgeColor} dark:bg-opacity-20`}>
                            <span>{slide.category}</span>
                            <span className={`w-2 h-2 rounded-full ${slide.bgColor}`}></span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-brand-dark dark:text-white leading-[1.1] mb-6 tracking-tight transition-all duration-500">
                            {slide.title} <br />
                            <span className={`${slide.color} relative inline-block transition-colors duration-500`}>
                                {slide.highlight}
                                <svg className={`absolute w-full h-3 -bottom-1 left-0 opacity-30 transition-colors duration-500 ${slide.color}`} viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed transition-opacity duration-500">
                            {slide.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                            <Link
                                to={`/shop?category=${slide.category === 'Grocery Delivery' ? 'Vegetables' : slide.category === 'Smart Electronics' ? 'Smartphones' : slide.category === 'Digital Workspace' ? 'Electronic Gadgets' : 'Food'}`}
                                className={`px-8 py-4 text-white rounded-full font-bold text-lg shadow-lg transition-all hover:-translate-y-1 duration-300 ${slide.bgColor} hover:brightness-110`}
                            >
                                Shop Now
                            </Link>
                        </div>

                        {/* App Download */}
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">For Better Service Download now</p>
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase">Get it on</div>
                                        <div className="text-sm font-bold leading-none">Google Play</div>
                                    </div>
                                </button>
                                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase">Download on</div>
                                        <div className="text-sm font-bold leading-none">App Store</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
                        <div className="relative z-10 aspect-square">
                            {/* Main Image with Transition */}
                            <div className="w-full h-full rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl relative">
                                {slides.map((s, index) => (
                                    <img
                                        key={s.id}
                                        src={s.image}
                                        alt={s.highlight}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                ))}
                            </div>

                            {/* Floating Card 1: Category Icon */}
                            <div className="absolute top-10 -left-4 md:left-0 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 animate-bounce-slow z-20">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${slide.badgeColor} bg-opacity-20`}>
                                    {slide.icon}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Top Quality</p>
                                    <p className="text-[10px] text-gray-500">Best in class</p>
                                </div>
                            </div>

                            {/* Floating Card 2: Fast Delivery */}
                            <div className="absolute bottom-10 -right-4 md:right-0 bg-white dark:bg-gray-800 p-3 pr-6 rounded-full shadow-xl flex items-center gap-3 animate-pulse-slow z-20">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-brand-orange">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Fast Delivery</p>
                                    <p className="text-[10px] text-gray-500">Free of cost</p>
                                </div>
                            </div>
                        </div>

                        {/* Background Blob */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-3xl -z-10 transition-colors duration-1000 ${slide.bgColor} opacity-20`}></div>
                    </div>
                </div>

                {/* Slide Controls */}
                <div className="flex items-center justify-center gap-4 mt-8 lg:mt-0 lg:absolute lg:bottom-10 lg:left-1/2 lg:-translate-x-1/2">
                    <button
                        onClick={prevSlide}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-brand-dark scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
