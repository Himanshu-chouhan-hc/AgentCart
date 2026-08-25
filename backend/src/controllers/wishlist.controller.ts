import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "../services/wishlist.service.js";

// GET /api/wishlist
export const getUserWishlist = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const wishlist = await getWishlist(req.user!.id);

    res.json({
      success: true,
      data: wishlist,
    });
  }
);

// POST /api/wishlist/:productId
export const addWishlistItem = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const productId = String(req.params.productId);

    if (!productId || productId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const item = await addToWishlist(
      req.user!.id,
      productId
    );

    res.status(201).json({
      success: true,
      data: item,
    });
  }
);

// DELETE /api/wishlist/:productId
export const removeWishlistItem = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const productId = String(req.params.productId);

    if (!productId || productId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    await removeFromWishlist(
      req.user!.id,
      productId
    );

    res.json({
      success: true,
      message: "Product removed from wishlist.",
    });
  }
);

// GET /api/wishlist/check/:productId
export const checkWishlist = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const productId = String(req.params.productId);

    if (!productId || productId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const result = await isProductInWishlist(
      req.user!.id,
      productId
    );

    res.json({
      success: true,
      data: result,
    });
  }
);