import { Router } from 'express';
import { 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../controllers/address.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);


export default router;
