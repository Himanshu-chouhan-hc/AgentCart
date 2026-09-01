import { Router } from "express";

import {
  createUserOrder,
  getOrderById,
  getUserOrders,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getUserOrders);
router.post("/", createUserOrder);
router.get("/:id", getOrderById);

export default router;