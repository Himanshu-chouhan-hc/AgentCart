import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

// CREATE ORDER
export const createOrder = async (
  userId: string,
  items: OrderItemInput[]
) => {
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!items || items.length === 0) {
    throw new ApiError(
      400,
      "Order must include at least one item"
    );
  }

  const productIds = items.map(
    (item) => item.productId
  );

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const productMap = new Map(
    products.map((product) => [
      product.id,
      product,
    ])
  );

  let totalAmount = 0;

  for (const item of items) {
    const product = productMap.get(
      item.productId
    );

    if (!product) {
      throw new ApiError(
        404,
        `Product ${item.productId} not found`
      );
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Not enough stock for ${product.name}`
      );
    }

    totalAmount +=
      Number(product.price) * item.quantity;
  }

  const order = await prisma.$transaction(
    async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",

          items: {
            create: items.map((item) => {
              const product = productMap.get(
                item.productId
              );

              if (!product) {
                throw new ApiError(
                  404,
                  `Product ${item.productId} not found`
                );
              }

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Decrease stock
      for (const item of items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    }
  );

  return order;
};

// GET ORDER BY ID
export const getOrderById = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  return order;
};