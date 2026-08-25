import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';

export const getProducts = async () => {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const createProduct = async (data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}) => {
  return prisma.product.create({ data });
};
