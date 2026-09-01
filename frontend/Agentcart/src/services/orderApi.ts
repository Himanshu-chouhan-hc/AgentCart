const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemInput[];
}

const getAuthHeaders = (): Record<string, string> => {
  const token =
    localStorage.getItem("agentcart_token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in again to place your order.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};

export const getOrdersAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const resData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resData?.message || "Failed to fetch orders");
  }

  return resData?.data || resData;
};

export const createOrderAPI = async (payload: CreateOrderPayload) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const resData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resData?.message || "Failed to place order");
  }

  return resData?.data || resData;
};