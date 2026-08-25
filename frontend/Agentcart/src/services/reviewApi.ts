const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("agentcart_token")}`,
});

export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
};

export const getProductReviews = async (
  productId: string
): Promise<Review[]> => {
  const response = await fetch(
    `${API_BASE_URL}/reviews/product/${productId}`
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not load reviews."
    );
  }

  return payload?.data || [];
};

export const createReview = async (
  productId: string,
  rating: number,
  comment: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/reviews/product/${productId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Could not submit review."
    );
  }

  return payload?.data;
};