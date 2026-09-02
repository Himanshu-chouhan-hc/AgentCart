import OpenAI from "openai";
import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type AIProductSearchInput = {
  query: string;
};

type ParsedAIIntent = {
  keywords?: string[];
  maxPrice?: number | null;
  minPrice?: number | null;
  category?: string | null;
  color?: string | null;
  brand?: string | null;
};

const getPriceFromText = (text: string) => {
  const match = text.match(/(?:under|below|max(?:imum)?|upto|up to|budget|within|less than|budget under)\s*(?:rs\.?|inr\.?|₹)?\s?(\d{2,6})/i);
  if (!match) {
    return null;
  }

  return Number(match[1]);
};

const buildFallbackIntent = (query: string): ParsedAIIntent => {
  const normalized = query.toLowerCase();
  const tokens = normalized
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["for", "with", "from", "need", "want", "buy", "looking", "search", "find", "best", "good", "cheap", "under", "the", "some", "product"].includes(token));

  const keywordHints = tokens.slice(0, 8);
  const maxPrice = getPriceFromText(normalized);

  return {
    keywords: keywordHints,
    maxPrice,
    minPrice: null,
    category: null,
    color: null,
    brand: null,
  };
};

const parseAIIntent = (rawText: string): ParsedAIIntent => {
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned) as ParsedAIIntent;

  return {
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
    minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
    category: typeof parsed.category === "string" ? parsed.category : null,
    color: typeof parsed.color === "string" ? parsed.color : null,
    brand: typeof parsed.brand === "string" ? parsed.brand : null,
  };
};

const rankProducts = (
  products: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number | string | { toString(): string };
    image: string | null;
    images: unknown;
    brand: string | null;
    stock: number;
    rating: number;
    reviewCount: number;
    isActive: boolean;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    category?: { name?: string | null } | null;
  }>,
  intent: ParsedAIIntent
) => {
  const keywords = (intent.keywords || [])
    .map((keyword) => keyword.toLowerCase().trim())
    .filter(Boolean);

  const category = intent.category?.toLowerCase().trim() || null;
  const color = intent.color?.toLowerCase().trim() || null;
  const brand = intent.brand?.toLowerCase().trim() || null;

  const minPrice = typeof intent.minPrice === "number" ? intent.minPrice : null;
  const maxPrice = typeof intent.maxPrice === "number" ? intent.maxPrice : null;

  return products
    .filter((product) => {
      const price = Number(product.price);

      if (minPrice !== null && price < minPrice) {
        return false;
      }

      if (maxPrice !== null && price > maxPrice) {
        return false;
      }

      return true;
    })
    .map((product) => {
      const productText = [
        product.name,
        product.description || "",
        product.brand || "",
        product.category?.name || "",
      ].join(" ").toLowerCase();

      let score = 0;

      for (const keyword of keywords) {
        if (productText.includes(keyword)) {
          score += 3;
        }
      }

      if (category && product.category?.name?.toLowerCase().includes(category)) {
        score += 5;
      }

      if (color && productText.includes(color)) {
        score += 2;
      }

      if (brand && productText.includes(brand)) {
        score += 3;
      }

      return {
        product,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

export const searchProductsWithAI = async (
  input: AIProductSearchInput
) => {
  const query = input.query?.trim();

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      rating: "desc",
    },
  });

  let intent: ParsedAIIntent = buildFallbackIntent(query);
  let source: "fallback" | "openai" = "fallback";

  if (openai) {
    try {
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "You are AgentCart's shopping assistant. Extract shopping intent from the user's request. Return only valid JSON with keys: keywords, maxPrice, minPrice, category, color, brand. Use null if not mentioned. Keep keywords as short relevant terms.",
          },
          {
            role: "user",
            content: query,
          },
        ],
      });

      const rawText = typeof response.output_text === "string" ? response.output_text : "";

      if (rawText) {
        intent = parseAIIntent(rawText);
        source = "openai";
      }
    } catch {
      // Graceful fallback: keep query working even when AI is unavailable.
      intent = buildFallbackIntent(query);
      source = "fallback";
    }
  }

  const rankedProducts = rankProducts(products, intent);

  return {
    query,
    source,
    understanding: {
      keywords: (intent.keywords || []).map((keyword) => keyword.toLowerCase().trim()).filter(Boolean),
      minPrice: typeof intent.minPrice === "number" ? intent.minPrice : null,
      maxPrice: typeof intent.maxPrice === "number" ? intent.maxPrice : null,
      category: intent.category?.toLowerCase().trim() || null,
      color: intent.color?.toLowerCase().trim() || null,
      brand: intent.brand?.toLowerCase().trim() || null,
    },
    products: rankedProducts.map((item) => ({
      ...item.product,
      aiScore: item.score,
    })),
  };
};