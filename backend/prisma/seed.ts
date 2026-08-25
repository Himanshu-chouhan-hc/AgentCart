import prisma from '../src/config/database.js';

const categories = [
  { name: 'Shoes' },
  { name: 'Fashion' },
  { name: 'Electronics' },
  { name: 'Home' },
  { name: 'Accessories' },
];

const products = [
  // ==================== SHOES ====================
  {
    name: 'Cloudswift Runner',
    description:
      'Lightweight running shoes with responsive cushioning, breathable mesh and a comfortable everyday fit.',
    price: 2499,
    brand: 'Stride',
    stock: 18,
    rating: 4.5,
    reviewCount: 128,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    category: 'Shoes',
  },
  {
    name: 'Urban Flex Sneakers',
    description:
      'Casual everyday sneakers with soft cushioning and a clean minimal design.',
    price: 1899,
    brand: 'UrbanStep',
    stock: 25,
    rating: 4.3,
    reviewCount: 94,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    category: 'Shoes',
  },
  {
    name: 'Trail Max Running Shoes',
    description:
      'Durable running shoes designed for outdoor training, jogging and long walks.',
    price: 2999,
    brand: 'RunPro',
    stock: 14,
    rating: 4.7,
    reviewCount: 176,
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85',
    category: 'Shoes',
  },
  {
    name: 'Street Comfort Trainers',
    description:
      'Comfortable trainers for daily commuting, walking and casual outfits.',
    price: 1599,
    brand: 'WalkEase',
    stock: 32,
    rating: 4.1,
    reviewCount: 72,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
    category: 'Shoes',
  },
  {
    name: 'Sprint Pro Sports Shoes',
    description:
      'Performance sports shoes with lightweight construction and supportive sole for workouts.',
    price: 2799,
    brand: 'SprintX',
    stock: 20,
    rating: 4.6,
    reviewCount: 143,
    image:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85',
    category: 'Shoes',
  },

  // ==================== FASHION ====================
  {
    name: 'Everyday Carry Tote',
    description:
      'Roomy everyday tote bag with a minimal design suitable for college, office and travel.',
    price: 1999,
    brand: 'CarryCo',
    stock: 24,
    rating: 4.3,
    reviewCount: 86,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
    category: 'Fashion',
  },
  {
    name: 'Classic Cotton Hoodie',
    description:
      'Soft cotton hoodie with a relaxed fit, ideal for casual everyday wear.',
    price: 1499,
    brand: 'NorthLane',
    stock: 35,
    rating: 4.4,
    reviewCount: 112,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    category: 'Fashion',
  },
  {
    name: 'Minimal Oversized T-Shirt',
    description:
      'Premium oversized cotton t-shirt with a relaxed fit and simple everyday style.',
    price: 799,
    brand: 'BasicForm',
    stock: 50,
    rating: 4.2,
    reviewCount: 201,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
    category: 'Fashion',
  },
  {
    name: 'Slim Fit Casual Shirt',
    description:
      'Smart casual shirt made from lightweight fabric for office and evening wear.',
    price: 1299,
    brand: 'UrbanWear',
    stock: 22,
    rating: 4.1,
    reviewCount: 67,
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85',
    category: 'Fashion',
  },
  {
    name: 'Classic Denim Jacket',
    description:
      'Versatile denim jacket that works with casual outfits and weekend looks.',
    price: 2299,
    brand: 'DenimLab',
    stock: 16,
    rating: 4.5,
    reviewCount: 91,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
    category: 'Fashion',
  },

  // ==================== ELECTRONICS ====================
  {
    name: 'QuietSound Wireless Headphones',
    description:
      'Comfortable wireless headphones with rich sound, long battery life and soft ear cushions.',
    price: 3499,
    brand: 'SoundPeak',
    stock: 12,
    rating: 4.7,
    reviewCount: 214,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    category: 'Electronics',
  },
  {
    name: 'BassBoost Bluetooth Speaker',
    description:
      'Portable Bluetooth speaker with powerful bass and compact design for indoor and outdoor use.',
    price: 1999,
    brand: 'AudioCore',
    stock: 28,
    rating: 4.5,
    reviewCount: 156,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',
    category: 'Electronics',
  },
  {
    name: 'Pro Wireless Mouse',
    description:
      'Ergonomic wireless mouse with precision tracking for work, study and productivity.',
    price: 899,
    brand: 'ClickPro',
    stock: 40,
    rating: 4.4,
    reviewCount: 189,
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85',
    category: 'Electronics',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description:
      'Responsive mechanical keyboard designed for gaming, coding and fast typing.',
    price: 2499,
    brand: 'GameForge',
    stock: 19,
    rating: 4.6,
    reviewCount: 134,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
    category: 'Electronics',
  },
  {
    name: 'Smart Fitness Watch',
    description:
      'Smart fitness watch with activity tracking, notifications and multiple workout modes.',
    price: 2999,
    brand: 'FitPulse',
    stock: 21,
    rating: 4.3,
    reviewCount: 108,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    category: 'Electronics',
  },

  // ==================== HOME ====================
  {
    name: 'Ceramic Pour Over',
    description:
      'Minimal ceramic coffee dripper designed for a smooth and enjoyable pour-over coffee experience.',
    price: 999,
    brand: 'BrewHouse',
    stock: 30,
    rating: 4.2,
    reviewCount: 64,
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=85',
    category: 'Home',
  },
  {
    name: 'Aroma Soy Candle',
    description:
      'Hand-poured scented soy candle for creating a calm and relaxing home environment.',
    price: 599,
    brand: 'GlowNest',
    stock: 45,
    rating: 4.5,
    reviewCount: 83,
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85',
    category: 'Home',
  },
  {
    name: 'Minimal Desk Lamp',
    description:
      'Modern adjustable desk lamp suitable for study tables, workspaces and bedrooms.',
    price: 1299,
    brand: 'LumaHome',
    stock: 27,
    rating: 4.4,
    reviewCount: 97,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    category: 'Home',
  },
  {
    name: 'Soft Cotton Cushion',
    description:
      'Soft decorative cushion with a comfortable filling for sofas, chairs and beds.',
    price: 499,
    brand: 'HomeEase',
    stock: 60,
    rating: 4.1,
    reviewCount: 51,
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85',
    category: 'Home',
  },
  {
    name: 'Insulated Travel Mug',
    description:
      'Double-wall insulated travel mug that keeps coffee and tea warm while commuting.',
    price: 799,
    brand: 'ThermoGo',
    stock: 38,
    rating: 4.6,
    reviewCount: 145,
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
    category: 'Home',
  },

  // ==================== ACCESSORIES ====================
  {
    name: 'Everyday Analog Watch',
    description:
      'Classic minimalist analog watch with a clean dial for everyday outfits.',
    price: 1799,
    brand: 'TimeCraft',
    stock: 18,
    rating: 4.4,
    reviewCount: 76,
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
    category: 'Accessories',
  },
  {
    name: 'Polarized Sunglasses',
    description:
      'Lightweight polarized sunglasses designed for everyday outdoor use and driving.',
    price: 999,
    brand: 'ShadeLab',
    stock: 42,
    rating: 4.3,
    reviewCount: 118,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    category: 'Accessories',
  },
  {
    name: 'Urban Leather Wallet',
    description:
      'Compact everyday wallet with multiple card slots and a clean leather finish.',
    price: 899,
    brand: 'CarryCraft',
    stock: 34,
    rating: 4.5,
    reviewCount: 92,
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    category: 'Accessories',
  },
  {
    name: 'Everyday Backpack',
    description:
      'Spacious lightweight backpack with laptop compartment for college, office and travel.',
    price: 1599,
    brand: 'PackMate',
    stock: 26,
    rating: 4.6,
    reviewCount: 167,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    category: 'Accessories',
  },
  {
    name: 'Classic Baseball Cap',
    description:
      'Adjustable casual baseball cap suitable for everyday outdoor wear.',
    price: 499,
    brand: 'StreetCap',
    stock: 55,
    rating: 4.2,
    reviewCount: 63,
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85',
    category: 'Accessories',
  },
];

const main = async () => {
  const categoryRecords = new Map<string, string>();

  // Create categories
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });

    categoryRecords.set(record.name, record.id);
  }

  // Create products
  for (const product of products) {
    const categoryId = categoryRecords.get(product.category);

    if (!categoryId) {
      console.warn(`Category not found: ${product.category}`);
      continue;
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: product.name,
      },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          isActive: true,
          categoryId,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          brand: product.brand,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          isActive: true,
          categoryId,
        },
      });
    }
  }

  console.log(
    `✅ Seed complete: ${categories.length} categories, ${products.length} products`
  );
};

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });