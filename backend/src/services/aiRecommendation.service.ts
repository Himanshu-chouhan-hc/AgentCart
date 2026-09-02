import OpenAI from "openai";
import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type AIRecommendationInput = { query: string };

type RecommendationIntent = {
  keywords: string[];
  preferences: string[];
  maxPrice: number | null;
  minPrice: number | null;
  category: string | null;
  color: string | null;
  brand: string | null;
};

const ignoredWords = new Set([
  "best", "good", "suggest", "suggestion", "recommend", "recommendation",
  "products", "product", "for", "with", "under", "below", "less", "than",
  "need", "want", "have", "rupees", "rs", "inr", "the", "some", "me",
  "my", "buy", "find", "looking", "choose", "long", "use",
]);

const priceFromText = (text: string) => {
  const match = text.match(/(?:under|below|max(?:imum)?|upto|up to|within|less than|budget|have)\s*(?:rs\.?|inr\.?|₹)?\s*(\d{2,6})/i)
    || text.match(/₹\s?(\d{2,6})\s*(?:budget|rupees)?/i);
  return match ? Number(match[1]) : null;
};

const categoryHints = ["laptop", "headphone", "phone", "mobile", "shoe", "watch", "camera", "backpack", "tablet"];
const colorHints = ["black", "white", "blue", "red", "green", "yellow", "grey", "gray"];
const preferenceHints = ["coding", "performance", "music", "comfort", "camera", "photography", "gaming", "battery", "wireless", "long use"];

const buildFallbackIntent = (query: string): RecommendationIntent => {
  const normalized = query.toLowerCase();
  const words = normalized.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const category = categoryHints.find((hint) => normalized.includes(hint)) || null;
  const color = colorHints.find((hint) => normalized.includes(hint)) || null;
  const preferences = preferenceHints.filter((hint) => normalized.includes(hint));
  const keywords = words.filter((word) => word.length > 2 && !ignoredWords.has(word) && !categoryHints.includes(word) && !colorHints.includes(word) && !preferences.includes(word)).slice(0, 8);

  return { keywords, preferences, maxPrice: priceFromText(normalized), minPrice: null, category, color, brand: null };
};

const parseIntent = (text: string, fallback: RecommendationIntent): RecommendationIntent => {
  try {
    const parsed = JSON.parse(text.replace(/```json/gi, "").replace(/```/g, "").trim()) as Partial<RecommendationIntent>;
    return {
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.filter((value): value is string => typeof value === "string") : fallback.keywords,
      preferences: Array.isArray(parsed.preferences) ? parsed.preferences.filter((value): value is string => typeof value === "string") : fallback.preferences,
      maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : fallback.maxPrice,
      minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
      category: typeof parsed.category === "string" ? parsed.category : fallback.category,
      color: typeof parsed.color === "string" ? parsed.color : fallback.color,
      brand: typeof parsed.brand === "string" ? parsed.brand : fallback.brand,
    };
  } catch {
    return fallback;
  }
};

const getIntent = async (query: string) => {
  const fallback = buildFallbackIntent(query);
  if (!openai) return fallback;

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: "Extract shopping intent. Return only JSON with keywords (string[]), preferences (only explicitly stated shopping priorities), maxPrice, minPrice, category, color, and brand. Use null or [] when absent. Never infer product specifications." },
        { role: "user", content: query },
      ],
    });
    return response.output_text ? parseIntent(response.output_text, fallback) : fallback;
  } catch {
    return fallback;
  }
};

const textFor = (product: { name: string; description: string | null; brand: string | null; category?: { name?: string | null } | null }) =>
  [product.name, product.description || "", product.brand || "", product.category?.name || ""].join(" ").toLowerCase();

const createExplanation = (product: { name: string; description: string | null; brand: string | null; price: unknown; category?: { name?: string | null } | null }, intent: RecommendationIntent, score: number) => {
  const text = textFor(product);
  const matchedPreferences = intent.preferences.filter((preference) => text.includes(preference.toLowerCase()));
  const pros = [
    intent.maxPrice !== null && Number(product.price) <= intent.maxPrice ? "Within your budget" : null,
    intent.category && text.includes(intent.category.toLowerCase()) ? "Matches your requested category" : null,
    matchedPreferences.length ? `Relevant to ${matchedPreferences.join(" and ")}` : null,
  ].filter((value): value is string => Boolean(value)).slice(0, 2);

  return {
    score,
    reason: pros.length ? `${pros[0]}${pros[1] ? ` and ${pros[1].toLowerCase()}` : ""}.` : "A relevant match based on the available product information.",
    pros: pros.length ? pros : ["Relevant to your request"],
    cons: ["Not enough product information to evaluate further."],
  };
};

const generateExplanation = async (product: Parameters<typeof createExplanation>[0], intent: RecommendationIntent, score: number) => {
  const fallback = createExplanation(product, intent, score);
  if (!openai) return fallback;

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: "Explain why this real product matches the request. Use only the supplied product fields and requirements. Never infer specifications, ratings, stock, discounts, warranty, or features. Return JSON with reason (1-2 short sentences), pros (string[]), and cons (string[]). If unknown, say: Not enough product information to evaluate." },
        { role: "user", content: JSON.stringify({ product: { name: product.name, price: Number(product.price), description: product.description, brand: product.brand, category: product.category?.name || null }, requirements: intent }) },
      ],
    });
    const parsed = JSON.parse(response.output_text.replace(/```json/gi, "").replace(/```/g, "").trim()) as Partial<typeof fallback>;
    return {
      score,
      reason: typeof parsed.reason === "string" ? parsed.reason : fallback.reason,
      pros: Array.isArray(parsed.pros) ? parsed.pros.filter((value): value is string => typeof value === "string") : fallback.pros,
      cons: Array.isArray(parsed.cons) ? parsed.cons.filter((value): value is string => typeof value === "string") : fallback.cons,
    };
  } catch {
    return fallback;
  }
};

export const getAIRecommendations = async (input: AIRecommendationInput) => {
  const query = input.query?.trim();
  if (!query) throw new ApiError(400, "Query is required");

  let intent = await getIntent(query);
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(intent.maxPrice !== null ? { price: { lte: intent.maxPrice } } : {}),
      ...(intent.minPrice !== null ? { price: { gte: intent.minPrice } } : {}),
    },
    include: { category: true },
    orderBy: { rating: "desc" },
    take: 40,
  });

  if (!intent.brand) {
    const requestedBrand = products.find((product) => product.brand && query.toLowerCase().includes(product.brand.toLowerCase()))?.brand;
    if (requestedBrand) intent = { ...intent, brand: requestedBrand };
  }

  const ranked = products.map((product) => {
    const text = textFor(product);
    const categoryMatch = Boolean(intent.category && text.includes(intent.category.toLowerCase()));
    const keywordMatches = intent.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
    const preferenceMatches = intent.preferences.filter((preference) => text.includes(preference.toLowerCase())).length;
    const brandMatch = Boolean(intent.brand && text.includes(intent.brand.toLowerCase()));
    const colorMatch = Boolean(intent.color && text.includes(intent.color.toLowerCase()));
    const budgetMatch = intent.maxPrice === null ? 15 : Number(product.price) <= intent.maxPrice ? 30 : 0;
    const score = Math.min(100, budgetMatch + (categoryMatch ? 25 : 0) + Math.min(25, preferenceMatches * 12.5) + Math.min(15, keywordMatches * 5) + (brandMatch || colorMatch ? 5 : 0));
    return { product, score: Math.round(score), hasExplicitMatch: categoryMatch || keywordMatches > 0 || preferenceMatches > 0 || brandMatch || colorMatch };
  }).filter((item) => item.hasExplicitMatch || (!intent.category && !intent.brand && !intent.color && !intent.keywords.length)).sort((a, b) => b.score - a.score).slice(0, 3);

  const recommendations = await Promise.all(ranked.map(async ({ product, score }) => ({ product, ...(await generateExplanation(product, intent, score)) })));
  return {
    query,
    recommendations,
    ...(recommendations.length ? {} : { message: "I couldn't find products that closely match your requirements." }),
  };
};