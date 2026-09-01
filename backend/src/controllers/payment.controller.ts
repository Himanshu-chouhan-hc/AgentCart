import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createPaymentIntent,
  verifyPaymentSignature,
} from "../services/payment.service.js";
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

    const { orderId } = req.body as { orderId?: unknown };
    if (typeof orderId !== "string" || !orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const payment = await createPaymentIntent(req.user.id, orderId);

    res.status(201).json({
      success: true,
      data: payment,
    });
  }
);

export const verifyPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const {
      orderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body as Record<string, unknown>;

    if (
      typeof orderId !== "string" ||
      typeof razorpayOrderId !== "string" ||
      typeof razorpayPaymentId !== "string" ||
      typeof razorpaySignature !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid payment verification details",
      });
      return;
    }

    const order = await verifyPaymentSignature(
      req.user.id,
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    res.json({ success: true, data: order });
  }
);