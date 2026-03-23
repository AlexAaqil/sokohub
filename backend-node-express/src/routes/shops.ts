import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  createShop,
  getMyShops,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop
} from '../controllers/shopController';

const router = Router();

// Validation rules
const createShopValidation = [
  body('name').notEmpty().withMessage('Shop name is required'),
  body('category').optional().isString(),
  body('description').optional().isString()
];

// Public routes
router.get('/', getAllShops);
router.get('/:id', getShopById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createShopValidation, createShop);
router.get('/my/shops', authMiddleware, getMyShops);
router.put('/:id', authMiddleware, updateShop);
router.delete('/:id', authMiddleware, deleteShop);

export default router;