const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  image?: string | null;
  brand?: string | null;
  rating: number;
  reviewCount: number;
  stock: number;
  category?: { id: string; name: string } | null;
};

type ProductResponse = {
  success: boolean;
  data: Product[];
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  const payload = (await response.json().catch(() => null)) as ProductResponse | { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload && "message" in payload && payload.message ? payload.message : "Unable to load products.");
  }

  return (payload as ProductResponse).data;
};
