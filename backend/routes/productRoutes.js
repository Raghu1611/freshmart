import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProductReview,
    subscribeToPriceAlert
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.array('images', 4), createProduct);

router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/alert', subscribeToPriceAlert);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.array('images', 4), updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
