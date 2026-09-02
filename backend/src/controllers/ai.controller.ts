import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { searchProductsWithAI } from "../services/ai.service.js";

export const aiProductSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const { query } = req.body as {
      query?: string;
    };

    const trimmedQuery = typeof query === "string" ? query.trim() : "";

    if (!trimmedQuery) {
      throw new ApiError(400, "Query is required");
    }

    const result = await searchProductsWithAI({ query: trimmedQuery });

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);