import { Router } from 'express';
import { createUserOrder } from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.post('/', createUserOrder);

export default router;
