import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'seller', 'admin']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Middleware to handle validation errors
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, getCurrentUser);

export default router;