import OpenAI from "openai";
import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { getAIRecommendations } from "./aiRecommendation.service.js";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type AIActionType =
  | "ADD_TO_CART"
  | "ADD_TO_WISHLIST"
  | "REMOVE_FROM_CART"
  | "VIEW_PRODUCT"
  | "COMPARE_PRODUCTS"
  | "OPEN_CART"
  | "OPEN_CHECKOUT"
  | "NONE";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatInput = {
  message: string;
  history?: ChatMessage[];
  contextProductIds?: string[];
};

const productText = (product: { name: string; description: string | null; brand: string | null; category?: { name?: string | null } | null }) =>
  [product.name, product.description || "", product.brand || "", product.category?.name || ""].join(" ").toLowerCase();

const actionFor = (message: string): AIActionType => {
  const text = message.toLowerCase();
  if (/checkout|place (an? )?order|order now|proceed to checkout|take me to checkout/.test(text)) return "OPEN_CHECKOUT";
  if (/open (my )?cart|show (my )?cart/.test(text)) return "OPEN_CART";
  if (/compare/.test(text)) return "COMPARE_PRODUCTS";
  if (/wishlist|wish list/.test(text) && /add|save|keep/.test(text)) return "ADD_TO_WISHLIST";
  if (/remove|delete/.test(text) && /cart/.test(text)) return "REMOVE_FROM_CART";
  if (/add|buy|purchase|order/.test(text) && /cart|buy|purchase|order|this|it|one/.test(text)) return "ADD_TO_CART";
  if (/show|open|view|see/.test(text) && /product|this|it|one/.test(text)) return "VIEW_PRODUCT";
  return "NONE";
};

const ordinalIndex = (message: string) => {
  const match = message.toLowerCase().match(/\b(first|1st|second|2nd|third|3rd)\b/);
  if (!match) return null;
  const indexes: Record<string, number> = { first: 0, "1st": 0, second: 1, "2nd": 1, third: 2, "3rd": 2 };
  return indexes[match[1]] ?? null;
};

const providerAction = async (message: string, candidates: unknown[], history: ChatMessage[]) => {
  if (!openai) return null;
  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: "You are AgentCart's shopping action classifier. Return only JSON: {action, productId, productIds, quantity, reply}. action must be one of ADD_TO_CART, ADD_TO_WISHLIST, REMOVE_FROM_CART, VIEW_PRODUCT, COMPARE_PRODUCTS, OPEN_CART, OPEN_CHECKOUT, NONE. Select IDs only from candidates. Use null/[] when unavailable. Never invent IDs. For buy/order, use ADD_TO_CART and ask for confirmation in reply; never process payment." },
        { role: "user", content: JSON.stringify({ message, history: history.slice(-8), candidates }) },
      ],
    });
    return JSON.parse(response.output_text.replace(/```json/gi, "").replace(/```/g, "").trim()) as { action?: AIActionType; productId?: string | null; productIds?: string[]; quantity?: number; reply?: string };
  } catch {
    return null;
  }
};

export const getAIChatResponse = async (input: ChatInput) => {
  const message = input.message?.trim();
  if (!message) throw new ApiError(400, "Message is required");

  const contextIds = Array.isArray(input.contextProductIds) ? input.contextProductIds.filter((id) => typeof id === "string").slice(0, 8) : [];
  const contextProducts = contextIds.length
    ? await prisma.product.findMany({ where: { id: { in: contextIds }, isActive: true }, include: { category: true } })
    : [];
  const orderedContextProducts = contextIds.map((id) => contextProducts.find((product) => product.id === id)).filter((product): product is (typeof contextProducts)[number] => Boolean(product));
  const action = actionFor(message);

  if (action === "NONE" && /show|find|recommend|suggest|best|under|budget|need|looking for/.test(message.toLowerCase())) {
    const result = await getAIRecommendations({ query: message });
    return {
      reply: result.recommendations.length ? `I found ${result.recommendations.length} product${result.recommendations.length === 1 ? "" : "s"} for you.` : (result.message || "I couldn't find a close match."),
      action: { type: "NONE" as const, productId: null, quantity: 1 },
      products: result.recommendations.map((recommendation) => recommendation.product),
    };
  }

  const ordinal = ordinalIndex(message);
  let selectedProducts = ordinal !== null ? (ordinal < orderedContextProducts.length ? [orderedContextProducts[ordinal]] : []) : [];
  if (
    !selectedProducts.length &&
    orderedContextProducts.length &&
    (/\b(this|it|that|one)\b/i.test(message) ||
      ["ADD_TO_CART", "ADD_TO_WISHLIST", "REMOVE_FROM_CART", "VIEW_PRODUCT"].includes(action))
  ) selectedProducts = [orderedContextProducts[orderedContextProducts.length - 1]];

  if (!selectedProducts.length && action !== "OPEN_CART" && action !== "OPEN_CHECKOUT") {
    const allProducts = await prisma.product.findMany({ where: { isActive: true }, include: { category: true }, take: 100 });
    const words = message.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
    selectedProducts = allProducts.filter((product) => words.filter((word) => productText(product).includes(word)).length >= Math.min(2, words.length));
    if (!selectedProducts.length) selectedProducts = allProducts.filter((product) => product.brand && message.toLowerCase().includes(product.brand.toLowerCase()));
  }

  const provider = await providerAction(message, selectedProducts.map((product) => ({ id: product.id, name: product.name, brand: product.brand, price: Number(product.price), category: product.category?.name || null })), input.history || []);
  const requestedType = action === "OPEN_CHECKOUT" ? action : provider?.action && ["ADD_TO_CART", "ADD_TO_WISHLIST", "REMOVE_FROM_CART", "VIEW_PRODUCT", "COMPARE_PRODUCTS", "OPEN_CART", "OPEN_CHECKOUT", "NONE"].includes(provider.action) ? provider.action : action;
  const ids = selectedProducts.map((product) => product.id);

  if (requestedType === "COMPARE_PRODUCTS") {
    const compareProducts = selectedProducts.length >= 2 ? selectedProducts.slice(0, 2) : orderedContextProducts.slice(0, 2);
    if (compareProducts.length < 2) return { reply: "Please show me two products first, then I can compare them.", action: { type: "NONE" as const, productId: null, quantity: 1 }, products: selectedProducts };
    return { reply: "Here are the two products using only the information available in the catalog.", action: { type: "COMPARE_PRODUCTS" as const, productIds: compareProducts.map((product) => product.id) }, products: compareProducts };
  }

  if (["OPEN_CART", "OPEN_CHECKOUT"].includes(requestedType)) return { reply: requestedType === "OPEN_CART" ? "Opening your cart." : "Opening checkout. You can review and authorize payment there.", action: { type: requestedType, productId: null, quantity: 1 }, products: [] };
  if (["ADD_TO_CART", "ADD_TO_WISHLIST", "REMOVE_FROM_CART", "VIEW_PRODUCT"].includes(requestedType) && selectedProducts.length !== 1) {
    return { reply: selectedProducts.length > 1 ? "I found multiple matching products. Please tell me which one you mean." : "Sorry, I couldn't identify the product. Please select one from the results.", action: { type: "NONE" as const, productId: null, quantity: 1 }, products: selectedProducts };
  }

  const selected = selectedProducts[0];
  const quantity = typeof provider?.quantity === "number" && Number.isInteger(provider.quantity) && provider.quantity > 0 && provider.quantity <= 10 ? provider.quantity : 1;
  return {
    reply: provider?.reply || (selected ? `${requestedType === "ADD_TO_WISHLIST" ? "I can add" : requestedType === "VIEW_PRODUCT" ? "Opening" : "I can add"} ${selected.name}.` : "Tell me which product you would like to use."),
    action: { type: requestedType, productId: selected?.id || null, quantity },
    products: selectedProducts,
  };
};