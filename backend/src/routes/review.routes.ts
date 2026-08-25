import { Router } from "express";
import {
  getReviews,
  addReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Get reviews for a product
router.get("/product/:productId", getReviews);

// Add review
router.post("/product/:productId", protect, addReview);

export default router;