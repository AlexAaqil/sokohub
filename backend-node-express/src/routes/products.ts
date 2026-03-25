import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  createProduct,
  getAllProducts,
  getProductsByShop,
  getProductById,
  updateProduct,
  deleteProduct,
  getDeals
} from '../controllers/productController';

const router = Router();

// Validation rules
const createProductValidation = [
  body('shop_id').isInt().withMessage('Shop ID is required'),
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discount_pct').optional().isInt({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('stock_qty').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
];

// Public routes
router.get('/', getAllProducts);
router.get('/shop/:shopId', getProductsByShop);
router.get('/deals', getDeals);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createProductValidation, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;