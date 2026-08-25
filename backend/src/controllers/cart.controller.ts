import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addToCart, getCart } from '../services/cart.service.js';
import { addToCartSchema } from '../validators/cart.validator.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getUserCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const cart = await getCart(req.user!.id);
  res.json({ success: true, data: cart });
});

export const addProductToCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = addToCartSchema.parse(req.body);
  const item = await addToCart(req.user!.id, parsed.productId, parsed.quantity);
  res.status(201).json({ success: true, data: item });
});
