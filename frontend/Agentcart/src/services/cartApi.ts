const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type Cart = {
  items: Array<{ id: string; quantity: number; product: { id: string; name: string; price: string | number; image?: string | null } }>;
};

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("agentcart_token")}` });

export const getCart = async (): Promise<Cart> => {
  const response = await fetch(`${API_BASE_URL}/cart`, { headers: authHeaders() });
  const payload = await response.json().catch(() => null) as { data?: Cart; message?: string } | null;
  if (!response.ok) throw new Error(payload?.message || "Could not load your cart.");
  return payload?.data || { items: [] };
};

export const addToCart = async (productId: string, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ productId, quantity }),
  });
  const payload = await response.json().catch(() => null) as { message?: string; data?: unknown } | null;
  if (!response.ok) throw new Error(payload?.message || "Could not add this product.");
  return payload?.data;
};

export const createOrder = async (items: Array<{ productId: string; quantity: number }>) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ items }),
  });
  const payload = await response.json().catch(() => null) as { data?: unknown; message?: string } | null;
  if (!response.ok) throw new Error(payload?.message || "Could not place your order.");
  return payload?.data;
};
