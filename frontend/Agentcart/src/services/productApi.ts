const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  image?: string | null;
  brand?: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
};

/**
 * Get all products
 */
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => null);

  console.log("PRODUCT API RESPONSE:", payload);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to fetch products"
    );
  }

  // Backend response:
  // { success: true, data: { products: [...] } }
  if (Array.isArray(payload?.data?.products)) {
    return payload.data.products;
  }

  // Fallback if backend returns:
  // { success: true, data: [...] }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  // Fallback if backend returns:
  // { success: true, products: [...] }
  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  // Fallback if API directly returns array
  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

/**
 * Get single product by ID
 */
export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to fetch product"
    );
  }

  if (payload?.data?.product) {
    return payload.data.product;
  }

  if (payload?.product) {
    return payload.product;
  }

  if (payload?.data) {
    return payload.data;
  }

  return payload;
};