import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createProduct, getProductById, getProducts } from '../services/product.service.js';
import { createProductSchema } from '../validators/product.validator.js';

export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await getProducts();
  res.json({ success: true, data: products });
});

export const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
  const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = await getProductById(productId);
  res.json({ success: true, data: product });
});

export const createNewProduct = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createProductSchema.parse(req.body);
  const product = await createProduct(parsed);
  res.status(201).json({ success: true, data: product });
});
