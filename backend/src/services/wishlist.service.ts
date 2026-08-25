import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

// GET USER WISHLIST
export const getWishlist = async (userId: string) => {
  return prisma.wishlistItem.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ADD PRODUCT TO WISHLIST
export const addToWishlist = async (
  userId: string,
  productId: string
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingItem) {
    throw new ApiError(
      400,
      "Product is already in your wishlist"
    );
  }

  return prisma.wishlistItem.create({
    data: {
      userId,
      productId,
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

// REMOVE PRODUCT FROM WISHLIST
export const removeFromWishlist = async (
  userId: string,
  productId: string
) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!item) {
    throw new ApiError(
      404,
      "Product is not in your wishlist"
    );
  }

  await prisma.wishlistItem.delete({
    where: {
      id: item.id,
    },
  });

  return {
    success: true,
  };
};

// CHECK WISHLIST STATUS
export const isProductInWishlist = async (
  userId: string,
  productId: string
) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return {
    isWishlisted: !!item,
  };
};