const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string | number;
    image?: string | null;
    category?: {
      name: string;
    } | null;
  };
};

export type Cart = {
  id?: string;
  items: CartItem[];
};

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemInput[];
}

const authHeaders = (): Record<string, string> => {
  const token =
    localStorage.getItem("agentcart_token") ||
    localStorage.getItem("token") ||
    "";

  return {
    Authorization: token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : "",
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

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: Cart;
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Could not load your cart.");
  }

  return payload?.data || { items: [] };
};

// =========================
// ADD TO CART
// =========================
export const addToCart = async (
  productId: string,
  quantity = 1
): Promise<Cart | undefined> => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: {
      cart?: Cart;
    };
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Could not add this product.");
  }

  return payload?.data?.cart;
};

// =========================
// UPDATE QUANTITY
// =========================
export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<Cart> => {
  if (quantity < 1) {
    return removeCartItem(itemId);
  }

  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: {
      cart?: Cart;
    };
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to update cart item"
    );
  }

  return payload?.data?.cart || { items: [] };
};

// =========================
// REMOVE ITEM
// =========================
export const removeCartItem = async (
  itemId: string
): Promise<Cart> => {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: {
      cart?: Cart;
    };
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to remove cart item"
    );
  }

  return payload?.data?.cart || { items: [] };
};

// =========================
// CREATE ORDER
// =========================
export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const resData = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: unknown;
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(
      resData?.message || "Could not place your order."
    );
  }

  return resData?.data;
};