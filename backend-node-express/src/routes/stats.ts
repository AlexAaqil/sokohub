import { Router } from 'express';
import { getStats } from '../controllers/statsController';

const router = Router();

// Public route - no authentication required
router.get('/', getStats);

export default router;