import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createOrder } from '../services/order.service.js';
import { createOrderSchema } from '../validators/order.validator.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createUserOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createOrderSchema.parse(req.body);
  const order = await createOrder(req.user!.id, parsed.items);
  res.status(201).json({ success: true, data: order });
});
