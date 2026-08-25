import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createPaymentIntent } from '../services/payment.service.js';

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { amount, currency, userApproved, cartTotal, orderId, paymentRef } = req.body as {
    amount: number;
    currency?: string;
    userApproved?: boolean;
    cartTotal?: number;
    orderId?: string;
    paymentRef?: string;
  };

  const payment = await createPaymentIntent({
    amount,
    currency,
    userApproved,
    cartTotal,
    orderId,
    paymentRef,
  });

  res.status(201).json({ success: true, data: payment });
});
