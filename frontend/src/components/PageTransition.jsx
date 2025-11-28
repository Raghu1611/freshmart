import { motion } from 'framer-motion';

const variants = {
    fadeUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4, ease: "easeOut" }
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.3, ease: "easeOut" }
    },
    slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const PageTransition = ({ children, variant = 'fadeUp', className = "" }) => {
    const selectedVariant = variants[variant] || variants.fadeUp;

    return (
        <motion.div
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={selectedVariant.transition}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
