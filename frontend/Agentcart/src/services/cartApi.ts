const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// =========================
// TYPES
// =========================

export type CartProduct = {
  id: string;
  name: string;
  price: string | number;
  image?: string | null;
  category?: {
    name: string;
  } | null;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};

export type Cart = {
  id?: string;
  items: CartItem[];
};

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderPayload = {
  items: OrderItemInput[];
};

// =========================
// AUTH HEADERS
// =========================

const authHeaders = (): Record<string, string> => {
  const token =
    localStorage.getItem("agentcart_token") ||
    localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// =========================
// GET CART
// =========================

export const getCart = async (): Promise<Cart> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "GET",
    headers: authHeaders(),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not load your cart."
    );
  }

  // Backend normally returns:
  // { success: true, data: { items: [...] } }

  return payload?.data || { items: [] };
};

// =========================
// ADD TO CART
// =========================

export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<Cart> => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not add product to cart."
    );
  }

  return payload?.data?.cart || payload?.data || { items: [] };
};

// =========================
// UPDATE CART ITEM
// =========================

export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<Cart> => {
  if (quantity < 1) {
    return removeCartItem(itemId);
  }

  const response = await fetch(
    `${API_BASE_URL}/cart/${itemId}`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to update cart item."
    );
  }

  return payload?.data?.cart || payload?.data || { items: [] };
};

// =========================
// REMOVE CART ITEM
// =========================

export const removeCartItem = async (
  itemId: string
): Promise<Cart> => {
  const response = await fetch(
    `${API_BASE_URL}/cart/${itemId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to remove cart item."
    );
  }

  return payload?.data?.cart || payload?.data || { items: [] };
};

// =========================
// CREATE ORDER
// =========================

export const createOrder = async (
  payload: CreateOrderPayload
) => {
  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Could not place your order."
    );
  }

  return data?.data;
};