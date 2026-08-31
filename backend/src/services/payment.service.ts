import Razorpay from "razorpay";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../config/database.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createPaymentIntent = async (userId: string) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new ApiError(500, "Razorpay Key ID is missing");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay Key Secret is missing");
  }

  // Get user's cart from database
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Calculate amount from DATABASE prices
  let subtotal = 0;

  for (const item of cart.items) {
    if (item.quantity <= 0) {
      throw new ApiError(400, "Invalid cart quantity");
    }

    if (item.product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Not enough stock for ${item.product.name}`
      );
    }

    subtotal += Number(item.product.price) * item.quantity;
  }

  // Same delivery logic as checkout
  const FREE_SHIPPING_THRESHOLD = 999;
  const STANDARD_DELIVERY_FEE = 49;

  const deliveryFee =
    subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0
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
    receipt: `agentcart_${Date.now()}`,
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