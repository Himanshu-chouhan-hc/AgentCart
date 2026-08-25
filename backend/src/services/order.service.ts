import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';

export const createOrder = async (userId: string, items: { productId: string; quantity: number }[]) => {
  if (!items.length) throw new ApiError(400, 'Order must include at least one item');

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const productMap = new Map<string, any>(
    products.map((product: any) => [product.id, product])
  );

  let totalAmount = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
    if (product.stock < item.quantity) throw new ApiError(400, `Not enough stock for ${product.name}`);
    totalAmount += Number(product.price) * item.quantity;
  }

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: 'PENDING',
      items: {
        create: items.map((item) => {
          const product = productMap.get(item.productId)!;
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          };
        }),
      },
    },
    include: { items: true },
  });

  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return order;
};
