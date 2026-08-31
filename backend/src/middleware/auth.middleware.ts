import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const protect = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader);

  if (!authHeader) {
    return next(
      new ApiError(401, "Unauthorized: missing token")
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "Unauthorized: invalid authorization header")
    );
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return next(
      new ApiError(401, "Unauthorized: missing token")
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      env.jwtSecret
    ) as {
      id?: string;
      userId?: string;
      email?: string;
    };

    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return next(
        new ApiError(
          401,
          "Unauthorized: invalid token payload"
        )
      );
    }

    req.user = {
      id: userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error);

    return next(
      new ApiError(
        401,
        "Unauthorized: invalid or expired token"
      )
    );
  }
};