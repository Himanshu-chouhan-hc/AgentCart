import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAIChatResponse } from "../services/aiChat.service.js";

export const aiChat = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAIChatResponse(req.body);
  res.status(200).json({ success: true, data: result });
});