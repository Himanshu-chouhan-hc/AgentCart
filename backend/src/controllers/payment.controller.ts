import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createPaymentIntent } from "../services/payment.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const createPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const payment = await createPaymentIntent(req.user.id);

    res.status(201).json({
      success: true,
      data: payment,
    });
  }
);