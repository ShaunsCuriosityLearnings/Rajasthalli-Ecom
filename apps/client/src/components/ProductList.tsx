import { ProductsType, ProductType } from "@repo/types";
import Categories from "./Categories";
import Link from "next/link";
import ProductCard from "./ProductCard";
import Filter from "./Filter";
import { Suspense } from "react";

// Temporary Data
// const products: ProductsType = [
//   {
//     id: 1,
//     name: "Royal Bandhani Saree",
//     shortDescription:
//       "Traditional handcrafted Bandhani saree featuring intricate tie-dye patterns.",
//     description:
//       "A premium Bandhani saree crafted by skilled artisans of Rajasthan. Perfect for weddings, festivals, and special occasions.",
//     price: 4999,
//     sizes: ["Free Size"],
//     images: {
//       frontView: "/products/bandhani-red.jpeg",
//       sideView: "/products/bandhani-yellow.jpg",
//       backView: "/products/bandhani-red.jpeg",
//     },
//   },

//   {
//     id: 2,
//     name: "Leheriya Silk Dupatta",
//     shortDescription:
//       "Elegant Leheriya dupatta with vibrant Rajasthani wave patterns.",
//     description:
//       "Made from premium silk and dyed using traditional Leheriya techniques for a festive look.",
//     price: 1499,
//     sizes: ["Free Size"],
//     images: {
//       frontView: "/products/leheriya-pink.jpeg",
//       sideView: "/products/leheriya-blue.jpg",
//       backView: "/products/leheriya-orange.jpg",
//     },
//   },

//   {
//     id: 3,
//     name: "Mirror Work Ghagra Choli",
//     shortDescription:
//       "Traditional ghagra choli adorned with handcrafted mirror work.",
//     description:
//       "A stunning ethnic outfit designed for weddings, Garba nights, and cultural celebrations.",
//     price: 6999,
//     sizes: ["S", "M", "L", "XL"],
//     images: {
//       frontView: "/products/ghagra-green.jpeg",
//       sideView: "/products/ghagra-red.jpg",
//       backView: "/products/ghagra-navy.jpg",
//     },
//   },

//   {
//     id: 4,
//     name: "Jaipuri Printed Kurti",
//     shortDescription:
//       "Comfortable cotton kurti with authentic Jaipuri block prints.",
//     description:
//       "A versatile everyday wear kurti made from breathable cotton fabric.",
//     price: 1199,
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     images: {
//       frontView: "/products/kurti-white.jpeg",
//       sideView: "/products/kurti-blue.jpg",
//       backView: "/products/kurti-mustard.jpg",
//     },
//   },

//   {
//     id: 5,
//     name: "Rajasthani Angrakha Dress",
//     shortDescription:
//       "Classic Angrakha-style dress inspired by royal Rajasthan.",
//     description:
//       "Combines traditional design with modern comfort, suitable for festive occasions.",
//     price: 2499,
//     sizes: ["S", "M", "L", "XL"],
//     images: {
//       frontView: "/products/angrakha-purple.jpeg",
//       sideView: "/products/angrakha-green.jpg",
//       backView: "/products/angrakha-black.jpg",
//     },
//   },

//   {
//     id: 6,
//     name: "Hand Block Printed Saree",
//     shortDescription: "Beautiful hand block printed cotton saree from Jaipur.",
//     description:
//       "Crafted using centuries-old block printing techniques by local artisans.",
//     price: 2999,
//     sizes: ["Free Size"],
//     images: {
//       frontView: "/products/block-beige.jpeg",
//       sideView: "/products/block-blue.jpg",
//       backView: "/products/block-pink.jpg",
//     },
//   },

//   {
//     id: 7,
//     name: "Mojari Embroidered Footwear",
//     shortDescription:
//       "Traditional Rajasthani mojari with intricate embroidery.",
//     description:
//       "Handcrafted footwear designed for comfort and traditional elegance.",
//     price: 899,
//     sizes: ["6", "7", "8", "9", "10"],
//     images: {
//       frontView: "/products/mojari-brown.jpeg",
//       sideView: "/products/mojari-gold.jpg",
//       backView: "/products/mojari-black.jpg",
//     },
//   },

//   {
//     id: 8,
//     name: "Royal Rajputi Poshak",
//     shortDescription:
//       "Luxurious Rajputi Poshak inspired by Rajasthan's royal heritage.",
//     description:
//       "Designed with rich fabrics and traditional detailing for grand celebrations.",
//     price: 8999,
//     sizes: ["S", "M", "L", "XL"],
//     images: {
//       frontView: "/products/poshak-maroon.jpeg",
//       sideView: "/products/poshak-green.jpg",
//       backView: "/products/poshak-red.jpg",
//     },
//   },

//   {
//     id: 9,
//     name: "Cotton Leheriya Kurta Set",
//     shortDescription:
//       "Lightweight kurta set featuring authentic Leheriya patterns.",
//     description:
//       "Perfect for summer wear, festivals, and casual traditional outings.",
//     price: 1999,
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     images: {
//       frontView: "/products/kurta-yellow.jpeg",
//       sideView: "/products/kurta-blue.jpg",
//       backView: "/products/kurta-pink.jpg",
//     },
//   },

//   {
//     id: 10,
//     name: "Traditional Bandhej Suit Set",
//     shortDescription:
//       "Premium Bandhej suit set showcasing Rajasthan's rich textile heritage.",
//     description:
//       "Includes kurta, dupatta, and bottom wear, ideal for festive occasions.",
//     price: 3499,
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     images: {
//       frontView: "/products/suit-red.jpg",
//       sideView: "/products/suit-green.jpg",
//       backView: "/products/suit-orange.jpg",
//     },
//   },
// ];

async function fetchData({ category, mainCategory, sort, search, size, params }: {
  category?: string;
  mainCategory?: string;
  sort?: string;
  search?: string;
  size?: string;
  params: "homepage" | "products";
}) {
  const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
  const urlParams = new URLSearchParams();
  if (category) urlParams.append("category", category);
  if (mainCategory) urlParams.append("mainCategory", mainCategory);
  if (search) urlParams.append("search", search);
  if (sort) urlParams.append("sort", sort);
  if (size) urlParams.append("size", size);
  if (params === "homepage") {
    urlParams.append("homepageNewArrivals", "true");
  }
  urlParams.append("limit", params === "homepage" ? "10" : "20");

  const url = `${baseUrl}/products?${urlParams.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  const data: ProductType[] = await res.json();
  return data;
}
const ProductList = async ({
  category,
  mainCategory,
  params,
  search,
  sort,
  size,
}: {
  category?: string;
  mainCategory?: string;
  params: "homepage" | "products";
  search?: string;
  sort?: string;
  size?: string;
}) => {

  const products = await fetchData({ category, mainCategory, sort, search, size, params });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {params === "homepage" && (
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3.5xl font-bold text-[#16301d] font-[family-name:var(--font-heading)]">
            New <span className="text-[#7d1f1f] italic">Arrivals</span>
          </h2>
          <div className="h-0.5 w-16 bg-[#c89b3c]/60 mx-auto mt-2" />
        </div>
      )}

      <Suspense fallback={<div className="h-12 w-full bg-gray-50 animate-pulse rounded-xl mb-6" />}>
        {params !== "homepage" && <Categories />}
      </Suspense>

      <Suspense fallback={<div className="h-10 w-full bg-gray-50 animate-pulse rounded-xl mb-6" />}>
        {params === "products" && <Filter mainCategory={mainCategory} />}
      </Suspense>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          href={params === "homepage" ? "/products?sort=newest" : (category ? `/products?category=${category}` : "/products")}
          className="px-8 py-3 rounded-full border border-primary-green text-primary-green hover:bg-primary-green hover:text-white transition-all duration-300 font-medium text-sm tracking-wider uppercase shadow-xs hover:shadow-md cursor-pointer"
        >
          {params === "homepage" ? "View All New Arrivals" : "View All Products"}
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
