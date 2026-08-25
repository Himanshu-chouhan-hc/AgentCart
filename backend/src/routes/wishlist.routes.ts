import { Router } from "express";

import {
  getUserWishlist,
  addWishlistItem,
  removeWishlistItem,
  checkWishlist,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getUserWishlist);

router.get(
  "/check/:productId",
  checkWishlist
);

router.post(
  "/:productId",
  addWishlistItem
);

router.delete(
  "/:productId",
  removeWishlistItem
);

export default router;