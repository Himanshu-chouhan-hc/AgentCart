import { Router } from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // 'protect' import karein

const router = Router();

// Saare routes par protect middleware applied hai
router.use(protect);

router.route("/")
  .get(getAddresses)
  .post(createAddress);

router.route("/:id")
  .put(updateAddress)
  .delete(deleteAddress);

router.route("/:id/default")
  .patch(setDefaultAddress);

export default router;