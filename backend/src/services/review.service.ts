import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

export const getProductReviews = async (productId: string) => {
  return prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createReview = async (
  userId: string,
  productId: string,
  rating: number,
  comment: string
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingReview) {
    throw new ApiError(
      400,
      "You have already reviewed this product"
    );
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const stats = await prisma.review.aggregate({
    where: {
      productId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      rating: stats._avg.rating ?? 0,
      reviewCount: stats._count.rating,
    },
  });

  return review;
};