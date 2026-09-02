import type { Product } from "./productApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type AIRecommendation = {
  product: Product;
  score: number;
  reason: string;
  pros: string[];
  cons: string[];
};

const postAIQuery = async <T>(path: string, query: string, history?: AIChatMessage[], contextProductIds?: string[]): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/ai/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, message: query, history, contextProductIds }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || "AI request failed");
  return payload?.data as T;
};

export const searchProductsWithAI = (query: string) =>
  postAIQuery<{ products: Product[] }>("search", query);

export const getAIRecommendations = (query: string) =>
  postAIQuery<{
    query: string;
    recommendations: AIRecommendation[];
    message?: string;
  }>("recommend", query);

export type AIChatAction = {
  type: "ADD_TO_CART" | "ADD_TO_WISHLIST" | "REMOVE_FROM_CART" | "VIEW_PRODUCT" | "COMPARE_PRODUCTS" | "OPEN_CART" | "OPEN_CHECKOUT" | "NONE";
  productId?: string | null;
  productIds?: string[];
  quantity?: number;
};

export type AIChatMessage = { role: "user" | "assistant"; content: string };

export type AIChatResult = {
  reply: string;
  action: AIChatAction;
  products: Product[];
};

export const sendAIChat = (message: string, history: AIChatMessage[], contextProductIds: string[]) =>
  postAIQuery<AIChatResult>("chat", message, history, contextProductIds);