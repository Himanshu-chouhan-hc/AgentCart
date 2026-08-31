import { Router } from "express";
import { createPayment } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", protect, createPayment);

export default router;