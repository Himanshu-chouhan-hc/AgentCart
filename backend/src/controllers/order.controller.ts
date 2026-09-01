import type { Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {
  createOrder,
  getOrderById as getOrderByIdService,
  getOrdersByUser,
} from "../services/order.service.js";

import { createOrderSchema } from "../validators/order.validator.js";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// CREATE ORDER
export const createUserOrder = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsed = createOrderSchema.parse(req.body);

    const order = await createOrder(
      req.user.id,
      parsed.items
    );

    res.status(201).json({
      success: true,
      data: order,
    });
  }
);

// GET ALL ORDERS
export const getUserOrders = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const orders = await getOrdersByUser(req.user.id);

    res.status(200).json({
      success: true,
      data: orders,
    });
  }
);

// GET ORDER BY ID
export const getOrderById = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const orderId = req.params.id;

    // TypeScript fix
    if (!orderId || Array.isArray(orderId)) {
      throw new ApiError(
        400,
        "Invalid order ID"
      );
    }

    const order = await getOrderByIdService(
      req.user.id,
      orderId
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  }
);