import { Router } from 'express';
import { addProductToCart, getUserCart } from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/', getUserCart);
router.post('/add', addProductToCart);

export default router;
