import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAIRecommendations } from "../services/aiRecommendation.service.js";

export const aiRecommendation = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.body as { query?: string };
  const result = await getAIRecommendations({ query: typeof query === "string" ? query : "" });
  res.status(200).json({ success: true, data: result });
});