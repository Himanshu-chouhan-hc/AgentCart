const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("agentcart_token")}`,
});

export type WishlistItem = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description?: string | null;
    price: string | number;
    image?: string | null;
    brand?: string | null;
    stock: number;
    rating: number;
    reviewCount: number;
    category?: {
      id: string;
      name: string;
    } | null;
  };
};

// GET wishlist
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    headers: getAuthHeaders(),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not load wishlist."
    );
  }

  return payload?.data || [];
};

// ADD
export const addToWishlist = async (
  productId: string
): Promise<WishlistItem> => {
  const response = await fetch(
    `${API_BASE_URL}/wishlist/${productId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not add to wishlist."
    );
  }

  return payload.data;
};

// REMOVE
export const removeFromWishlist = async (
  productId: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not remove from wishlist."
    );
  }

  return payload;
};

// CHECK
export const checkWishlist = async (
  productId: string
): Promise<boolean> => {
  const response = await fetch(
    `${API_BASE_URL}/wishlist/check/${productId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not check wishlist."
    );
  }

  return payload?.data?.isWishlisted ?? false;
};