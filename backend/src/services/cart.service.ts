import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

// =========================
// GET CART
// =========================
export const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  return cart ?? {
    id: null,
    userId,
    items: [],
  };
};

// =========================
// ADD TO CART
// =========================
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock available");
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new ApiError(400, "Not enough stock available");
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
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

// =========================
// UPDATE CART ITEM
// =========================
export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      product: true,
    },
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  if (quantity > cartItem.product.stock) {
    throw new ApiError(400, "Not enough stock available");
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
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

// =========================
// REMOVE CART ITEM
// =========================
export const removeCartItem = async (
  userId: string,
  itemId: string
) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  return {
    success: true,
  };
};