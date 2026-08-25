import prisma from '../src/config/database.js';

const categories = [
  { name: 'Shoes' },
  { name: 'Fashion' },
  { name: 'Electronics' },
  { name: 'Home' },
  { name: 'Accessories' },
];

const products = [
  { name: 'Cloudswift Runner', description: 'Lightweight daily running shoes with responsive cushioning.', price: 2499, stock: 18, rating: 4.5, reviewCount: 128, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', category: 'Shoes' },
  { name: 'Everyday Carry Tote', description: 'A clean, roomy tote designed for everyday movement.', price: 1999, stock: 24, rating: 4.3, reviewCount: 86, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85', category: 'Fashion' },
  { name: 'QuietComfort Headphones', description: 'Comfortable wireless audio for focus, travel, and slow evenings.', price: 3499, stock: 12, rating: 4.7, reviewCount: 214, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', category: 'Electronics' },
  { name: 'Ceramic Pour Over', description: 'A considered coffee ritual for better mornings.', price: 999, stock: 30, rating: 4.2, reviewCount: 64, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=85', category: 'Home' },
];

const main = async () => {
  const categoryRecords = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({ where: { name: category.name }, update: {}, create: category });
    categoryRecords.set(record.name, record.id);
  }

  for (const product of products) {
    const categoryId = categoryRecords.get(product.category);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replaceAll(' ', '-') },
      update: { ...product, category: undefined, categoryId },
      create: { ...product, category: undefined, categoryId, id: product.name.toLowerCase().replaceAll(' ', '-') },
    });
  }
};

main().finally(() => prisma.$disconnect());
