import { Router } from 'express';
import { createNewProduct, getAllProducts, getSingleProduct } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/', createNewProduct);

export default router;
