import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const mainCategories = [
  { name: "Dresses", slug: "dresses" }
];

const categories = [
  { name: "Bandhani Sarees", slug: "bandhani-sarees", mainCategorySlug: "dresses" },
  { name: "Rajputi Poshak", slug: "rajputi-poshak", mainCategorySlug: "dresses" },
  { name: "Ghagra Choli", slug: "ghagra-choli", mainCategorySlug: "dresses" },
  { name: "Kurtis", slug: "kurtis", mainCategorySlug: "dresses" },
  { name: "Suit Sets", slug: "suit-sets", mainCategorySlug: "dresses" },
  { name: "Angrakha Dresses", slug: "angrakha-dresses", mainCategorySlug: "dresses" },
  { name: "Dupattas", slug: "dupattas", mainCategorySlug: "dresses" },
  { name: "Wedding Collection", slug: "wedding-collection", mainCategorySlug: "dresses" }
];

const products = [
  {
    id: 1,
    name: "Royal Bandhani Saree",
    shortDescription: "Traditional handcrafted Bandhani saree featuring intricate tie-dye patterns.",
    description: "A premium Bandhani saree crafted by skilled artisans of Rajasthan. Perfect for weddings, festivals, and special occasions.",
    price: 4999,
    sizes: ["Free Size"],
    categorySlug: "bandhani-sarees",
    images: {
      frontView: "/products/bandhani-red.jpeg",
      sideView: "/products/bandhani-yellow.jpg",
      backView: "/products/bandhani-red.jpeg"
    }
  },
  {
    id: 2,
    name: "Leheriya Silk Dupatta",
    shortDescription: "Elegant Leheriya dupatta with vibrant Rajasthani wave patterns.",
    description: "Made from premium silk and dyed using traditional Leheriya techniques for a festive look.",
    price: 1499,
    sizes: ["Free Size"],
    categorySlug: "dupattas",
    images: {
      frontView: "/products/leheriya-pink.jpeg",
      sideView: "/products/leheriya-blue.jpg",
      backView: "/products/leheriya-orange.jpg"
    }
  },
  {
    id: 3,
    name: "Mirror Work Ghagra Choli",
    shortDescription: "Traditional ghagra choli adorned with handcrafted mirror work.",
    description: "A stunning ethnic outfit designed for weddings, Garba nights, and cultural celebrations.",
    price: 6999,
    sizes: ["S", "M", "L", "XL"],
    categorySlug: "ghagra-choli",
    images: {
      frontView: "/products/ghagra-green.jpeg",
      sideView: "/products/ghagra-red.jpg",
      backView: "/products/ghagra-navy.jpg"
    }
  },
  {
    id: 4,
    name: "Jaipuri Printed Kurti",
    shortDescription: "Comfortable cotton kurti with authentic Jaipuri block prints.",
    description: "A versatile everyday wear kurti made from breathable cotton fabric.",
    price: 1199,
    sizes: ["S", "M", "L", "XL", "XXL"],
    categorySlug: "kurtis",
    images: {
      frontView: "/products/kurti-white.jpeg",
      sideView: "/products/kurti-blue.jpg",
      backView: "/products/kurti-mustard.jpg"
    }
  },
  {
    id: 5,
    name: "Rajasthani Angrakha Dress",
    shortDescription: "Classic Angrakha-style dress inspired by royal Rajasthan.",
    description: "Combines traditional design with modern comfort, suitable for festive occasions.",
    price: 2499,
    sizes: ["S", "M", "L", "XL"],
    categorySlug: "angrakha-dresses",
    images: {
      frontView: "/products/angrakha-purple.jpeg",
      sideView: "/products/angrakha-green.jpg",
      backView: "/products/angrakha-black.jpg"
    }
  },
  {
    id: 6,
    name: "Hand Block Printed Saree",
    shortDescription: "Beautiful hand block printed cotton saree from Jaipur.",
    description: "Crafted using centuries-old block printing techniques by local artisans.",
    price: 2999,
    sizes: ["Free Size"],
    categorySlug: "bandhani-sarees",
    images: {
      frontView: "/products/block-beige.jpeg",
      sideView: "/products/block-blue.jpg",
      backView: "/products/block-pink.jpg"
    }
  },
  {
    id: 7,
    name: "Mojari Embroidered Footwear",
    shortDescription: "Traditional Rajasthani mojari with intricate embroidery.",
    description: "Handcrafted footwear designed for comfort and traditional elegance.",
    price: 899,
    sizes: ["6", "7", "8", "9", "10"],
    categorySlug: "rajputi-poshak",
    images: {
      frontView: "/products/mojari-brown.jpeg",
      sideView: "/products/mojari-gold.jpg",
      backView: "/products/mojari-black.jpg"
    }
  },
  {
    id: 8,
    name: "Royal Rajputi Poshak",
    shortDescription: "Luxurious Rajputi Poshak inspired by Rajasthan's royal heritage.",
    description: "Designed with rich fabrics and traditional detailing for grand celebrations.",
    price: 8999,
    sizes: ["S", "M", "L", "XL"],
    categorySlug: "rajputi-poshak",
    images: {
      frontView: "/products/poshak-maroon.jpeg",
      sideView: "/products/poshak-green.jpg",
      backView: "/products/poshak-red.jpg"
    }
  },
  {
    id: 9,
    name: "Cotton Leheriya Kurta Set",
    shortDescription: "Lightweight kurta set featuring authentic Leheriya patterns.",
    description: "Perfect for summer wear, festivals, and casual traditional outings.",
    price: 1999,
    sizes: ["S", "M", "L", "XL", "XXL"],
    categorySlug: "suit-sets",
    images: {
      frontView: "/products/kurta-yellow.jpeg",
      sideView: "/products/kurta-blue.jpg",
      backView: "/products/kurta-pink.jpg"
    }
  },
  {
    id: 10,
    name: "Traditional Bandhej Suit Set",
    shortDescription: "Premium Bandhej suit set showcasing Rajasthan's rich textile heritage.",
    description: "Includes kurta, dupatta, and bottom wear, ideal for festive occasions.",
    price: 3499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    categorySlug: "suit-sets",
    images: {
      frontView: "/products/suit-red.jpg",
      sideView: "/products/suit-green.jpg",
      backView: "/products/suit-orange.jpg"
    }
  }
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean up existing data to avoid conflicts
  console.log("🧹 Cleaning up existing data...");
  await prisma.productImages.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.mainCategory.deleteMany({});

  // 2. Seed Main Categories
  console.log("🛒 Seeding Main Categories...");
  for (const mc of mainCategories) {
    await prisma.mainCategory.upsert({
      where: { slug: mc.slug },
      update: {},
      create: mc
    });
  }

  // 3. Seed Categories
  console.log("📂 Seeding Categories...");
  for (const cat of categories) {
    // Find the mainCategory ID
    const mc = await prisma.mainCategory.findUnique({
      where: { slug: cat.mainCategorySlug }
    });

    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        mainCategoryId: mc.id
      }
    });
  }

  // 4. Seed Products and their images
  console.log("📦 Seeding Products...");
  for (const p of products) {
    const { images, ...productData } = p;

    await prisma.product.upsert({
      where: { id: productData.id },
      update: {},
      create: {
        ...productData,
        images: {
          create: images
        }
      }
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client and database connection pool
    await prisma.$disconnect();
    await pool.end();
  });
