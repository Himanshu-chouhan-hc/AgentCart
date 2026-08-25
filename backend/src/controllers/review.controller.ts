import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createReview,
  getProductReviews,
} from "../services/review.service.js";
import { createReviewSchema } from "../validators/review.validator.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// GET /api/reviews/product/:productId
export const getReviews = asyncHandler(
  async (req, res: Response) => {
    const productId = String(req.params.productId);

    if (!productId || productId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await getProductReviews(productId);

    res.json({
      success: true,
      data: reviews,
    });
  }
);

// POST /api/reviews/product/:productId
export const addReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const productId = String(req.params.productId);

    if (!productId || productId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const parsed = createReviewSchema.parse(req.body);

    const review = await createReview(
      req.user!.id,
      productId,
      parsed.rating,
      parsed.comment
    );

    res.status(201).json({
      success: true,
      data: review,
    });
  }
);