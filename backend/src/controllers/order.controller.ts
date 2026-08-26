import type { Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";

import {
  createOrder,
  getOrderById as getOrderByIdService,
} from "../services/order.service.js";

import { createOrderSchema } from "../validators/order.validator.js";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// CREATE ORDER
export const createUserOrder = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const parsed = createOrderSchema.parse(
      req.body
    );

    const order = await createOrder(
      req.user!.id,
      parsed.items
    );

    res.status(201).json({
      success: true,
      data: order,
    });
  }
);

// GET ORDER BY ID
export const getOrderById = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const order = await getOrderByIdService(
      req.user!.id,
      id
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  }
);