import { ApiError } from '../utils/ApiError.js';

export type PaymentIntentInput = {
  amount: number;
  currency?: string;
  userApproved?: boolean;
  cartTotal?: number;
  orderId?: string;
  paymentRef?: string;
};

export const createPaymentIntent = async (input: PaymentIntentInput) => {
  if (!input.amount || input.amount <= 0) {
    throw new ApiError(400, 'Payment amount must be greater than zero');
  }

  return {
    success: true,
    gateway: 'test-gateway',
    paymentId: `pay_${Date.now()}`,
    amount: input.amount,
    currency: input.currency || 'INR',
    status: 'created',
    orderId: input.orderId,
  };
};

export const verifyPayment = async (paymentId: string, signature: string) => {
  if (!paymentId || !signature) {
    throw new ApiError(400, 'Payment verification failed: missing payment data');
  }

  return {
    success: true,
    paymentId,
    signature,
    verified: true,
    status: 'verified',
  };
};
