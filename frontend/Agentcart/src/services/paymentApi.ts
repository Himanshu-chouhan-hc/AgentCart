const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type PaymentResponse = {
  id: string;
  amount: number;
  currency: string;
  key: string;
  loadScript: () => Promise<void>;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

const getAuthHeaders = (): Record<string, string> => {
  const token =
    localStorage.getItem("agentcart_token") || localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in again to continue.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};

const request = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Payment request failed.");
  }

  return payload?.data as T;
};

export const createPayment = async (orderId: string): Promise<PaymentResponse> => {
  const payment = await request<Omit<PaymentResponse, "loadScript">>(
    "/payments/create",
    { orderId }
  );

  return {
    ...payment,
    loadScript: () =>
      new Promise<void>((resolve, reject) => {
        if (window.Razorpay) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Unable to load Razorpay."));
        document.body.appendChild(script);
      }),
  };
};

export const verifyPayment = async (details: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) =>
  request("/payments/verify", {
    orderId: details.orderId,
    razorpay_order_id: details.razorpayOrderId,
    razorpay_payment_id: details.razorpayPaymentId,
    razorpay_signature: details.razorpaySignature,
  });
