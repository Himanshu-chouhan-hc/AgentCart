import { Router } from 'express';

import {
  createUserOrder,
  getOrderById,
} from '../controllers/order.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/', createUserOrder);

router.get('/:id', getOrderById);

export default router;