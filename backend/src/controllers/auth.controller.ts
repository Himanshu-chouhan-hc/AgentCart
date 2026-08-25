import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerUser, loginUser, logoutUser, getUserById } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { protect, type AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const parsed = registerSchema.parse(req.body);
  const result = await registerUser(parsed.name, parsed.email, parsed.password);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const parsed = loginSchema.parse(req.body);
  const result = await loginUser(parsed.email, parsed.password);
  res.json({ success: true, data: result });
});

export const logout = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  const user = await getUserById(req.user.id);
  res.json({ success: true, data: { user } });
});

