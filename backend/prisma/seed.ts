import prisma from '../src/config/database.js';

const DUMMYJSON_URL = 'https://dummyjson.com/products?limit=0';
const cleanMode = process.env.SEED_CLEAN === 'true';

type DummyProduct = {
  title?: unknown;
  description?: unknown;
  price?: unknown;
  stock?: unknown;
  images?: unknown;
  category?: unknown;
  brand?: unknown;
  rating?: unknown;
  reviews?: unknown;
};

type DummyJsonResponse = { products?: DummyProduct[] };

const textOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const numberOrDefault = (value: unknown, fallback: number): number => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalize = (value: string) => value.trim().toLowerCase();

const fetchProducts = async (): Promise<DummyProduct[]> => {
  const response = await fetch(DUMMYJSON_URL);
  if (!response.ok) throw new Error(`DummyJSON request failed with HTTP ${response.status}`);

  const payload = (await response.json()) as DummyJsonResponse;
  if (!Array.isArray(payload.products)) throw new Error('DummyJSON response did not contain a products array');
  return payload.products;
};

const cleanProductCatalog = async () => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      cartItems: { select: { id: true }, take: 1 },
      orderItems: { select: { id: true }, take: 1 },
      wishlistItems: { select: { id: true }, take: 1 },
      reviews: { select: { id: true }, take: 1 },
    },
  });

  let deletedProducts = 0;
  let skippedProducts = 0;
  for (const product of products) {
    if (product.cartItems.length > 0 || product.orderItems.length > 0) {
      skippedProducts += 1;
      const reasons = [
        product.cartItems.length > 0 ? 'cart items' : '',
        product.orderItems.length > 0 ? 'order items' : '',
      ].filter(Boolean).join(' and ');
      console.log(`Skipped product cleanup: ${product.name} (${reasons})`);
      continue;
    }

    await prisma.product.delete({ where: { id: product.id } });
    deletedProducts += 1;
  }

  const deletedCategories = await prisma.category.deleteMany({ where: { products: { none: {} } } });
  return { deletedProducts, skippedProducts, deletedCategories: deletedCategories.count };
};

const main = async () => {
  console.log('AgentCart Production-Safe Seed');
  console.log(`Mode: ${cleanMode ? 'CLEAN DEVELOPMENT CATALOG' : 'SAFE ADDITIVE'}`);
  console.log('\nFetching DummyJSON products...');
  const dummyProducts = await fetchProducts();
  console.log(`Fetched: ${dummyProducts.length}`);

  if (cleanMode) {
    console.log('\nCleaning disposable product catalog...');
    const cleanup = await cleanProductCatalog();
    console.log(`Deleted products: ${cleanup.deletedProducts}`);
    console.log(`Skipped products: ${cleanup.skippedProducts}`);
    console.log(`Deleted disposable categories: ${cleanup.deletedCategories}`);
  }

  const categoryNames = [
    ...new Set(
      dummyProducts
        .map((product) => textOrNull(product.category))
        .filter((category): category is string => category !== null),
    ),
  ];

  console.log('\nCategories:');
  let createdCategories = 0;
  let reusedCategories = 0;
  const categoryRecords = new Map<string, string>();
  for (const name of categoryNames) {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      categoryRecords.set(normalize(name), existing.id);
      reusedCategories += 1;
      continue;
    }

    const created = await prisma.category.create({ data: { name } });
    categoryRecords.set(normalize(name), created.id);
    createdCategories += 1;
  }
  console.log(`Created: ${createdCategories}`);
  console.log(`Reused: ${reusedCategories}`);

  console.log('\nProducts:');
  let insertedProducts = 0;
  let skippedProducts = 0;
  let failedProducts = 0;

  for (const product of dummyProducts) {
    const name = textOrNull(product.title);
    const categoryName = textOrNull(product.category);
    const categoryId = categoryName ? categoryRecords.get(normalize(categoryName)) : undefined;
    if (!name || !categoryId) {
      failedProducts += 1;
      continue;
    }

    const existing = await prisma.product.findFirst({
      where: { name, categoryId },
      select: { id: true },
    });
    if (existing) {
      skippedProducts += 1;
      continue;
    }

    const images = Array.isArray(product.images)
      ? product.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
      : [];
    const reviews = Array.isArray(product.reviews) ? product.reviews : [];

    try {
      await prisma.product.create({
        data: {
          name,
          description: textOrNull(product.description),
          price: numberOrDefault(product.price, 0),
          image: images[0] ?? null,
          images,
          brand: textOrNull(product.brand),
          stock: Math.max(0, Math.trunc(numberOrDefault(product.stock, 0))),
          rating: Math.max(0, numberOrDefault(product.rating, 0)),
          reviewCount: reviews.length,
          categoryId,
          isActive: true,
        },
      });
      insertedProducts += 1;
    } catch (error) {
      failedProducts += 1;
      console.error(`Failed product import for ${name}:`, error instanceof Error ? error.message : 'unknown error');
    }
  }

  console.log(`Inserted: ${insertedProducts}`);
  console.log(`Already existed/skipped: ${skippedProducts}`);
  console.log(`Failed: ${failedProducts}`);
  if (failedProducts > 0) throw new Error(`${failedProducts} product imports failed`);
  console.log('\nSeed completed successfully.');
};

main()
  .catch((error) => {
    console.error('Seed failed:', error instanceof Error ? error.message : 'unknown error');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
