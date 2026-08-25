import { Router } from "express";
import {
  addProductToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getUserCart);
router.post("/add", addProductToCart);
router.patch("/:itemId", updateCartItem);
router.delete("/:itemId", removeCartItem);

export default router;