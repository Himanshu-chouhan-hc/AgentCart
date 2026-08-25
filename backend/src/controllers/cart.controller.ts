import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addToCart,
  getCart,
  updateCartItem as updateCartItemService,
  removeCartItem as removeCartItemService,
} from "../services/cart.service.js";
import { addToCartSchema } from "../validators/cart.validator.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// GET /api/cart
export const getUserCart = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const cart = await getCart(req.user!.id);

    res.json({
      success: true,
      data: cart,
    });
  }
);

// POST /api/cart/add
export const addProductToCart = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const parsed = addToCartSchema.parse(req.body);

    const item = await addToCart(
      req.user!.id,
      parsed.productId,
      parsed.quantity
    );

    res.status(201).json({
      success: true,
      data: item,
    });
  }
);

// PATCH /api/cart/:itemId
export const updateCartItem = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId || Array.isArray(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer.",
      });
    }

    const updatedItem = await updateCartItemService(
      req.user!.id,
      itemId,
      quantity
    );

    res.json({
      success: true,
      data: updatedItem,
    });
  }
);

// DELETE /api/cart/:itemId
export const removeCartItem = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;

    if (!itemId || Array.isArray(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    await removeCartItemService(req.user!.id, itemId);

    res.json({
      success: true,
      message: "Item removed from cart.",
    });
  }
);