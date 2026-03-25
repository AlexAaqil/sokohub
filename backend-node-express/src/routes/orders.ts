import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatusHandler
} from '../controllers/orderController';

const router = Router();

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product_id').isInt().withMessage('Each item must have a product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item must have a positive quantity'),
  body('payment_method').optional().isIn(['mpesa', 'card']).withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

const updatePaymentValidation = [
  body('payment_status').isIn(['unpaid', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
  body('payment_method').optional().isIn(['mpesa', 'card'])
    .withMessage('Invalid payment method')
];

// All order routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', createOrderValidation, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/shop-orders', getShopOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateStatusValidation, updateOrderStatus);
router.put('/:id/payment', updatePaymentValidation, updatePaymentStatusHandler);

export default router;