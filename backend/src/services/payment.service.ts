import Razorpay from "razorpay";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../config/database.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createPaymentIntent = async (
  userId: string,
  orderId: string
) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new ApiError(500, "Razorpay Key ID is missing");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay Key Secret is missing");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order || order.items.length === 0) {
    throw new ApiError(404, "Order not found");
  }

  // Calculate amount from DATABASE prices
  let subtotal = 0;

  for (const item of order.items) {
    subtotal += Number(item.price) * item.quantity;
  }

  // Same delivery logic as checkout
  const FREE_SHIPPING_THRESHOLD = 999;
  const STANDARD_DELIVERY_FEE = 49;

  const deliveryFee =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : STANDARD_DELIVERY_FEE;

  const totalAmount = subtotal + deliveryFee;

  if (totalAmount <= 0) {
    throw new ApiError(400, "Payment amount must be greater than zero");
  }

  // Razorpay uses paise
  const amountInPaise = Math.round(totalAmount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `ac_${Date.now()}_${order.id.slice(0, 16)}`,
  });

  return {
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
    subtotal,
    deliveryFee,
    totalAmount,
  };
};

export const verifyPaymentSignature = async (
  userId: string,
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "PAID") {
    return order;
  }

  const crypto = await import("node:crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (
    expectedSignature.length !== razorpaySignature.length ||
    !crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    )
  ) {
    throw new ApiError(400, "Invalid payment signature");
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });
};