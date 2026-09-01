import { Router } from "express";
import {
	createPayment,
	verifyPayment,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", protect, createPayment);
router.post("/verify", protect, verifyPayment);

export default router;