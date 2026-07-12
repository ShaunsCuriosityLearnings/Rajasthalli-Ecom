"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

import { ProductType } from "@repo/types";
import useCartStore from "@/stores/cartStore";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");

  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize,
    });

    toast.success("Added to Cart");
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <Image
            src={product.images.frontView}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Wishlist */}
          <button className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-sm hover:bg-white transition">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-3 sm:p-4">
        <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-primary-green font-semibold mb-1 sm:mb-2">
          Rajasthalii
        </p>

        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-green transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 min-h-[15px] sm:min-h-[32px]">
          {product.shortDescription}
        </p>

        {/* FOOTER (Size select, Price, Add Button) */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100">
          <div>
            <p className="text-sm sm:text-base md:text-lg font-bold text-heritage-maroon">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end xs:self-auto">
            <select
              value={selectedSize}
              className="text-[10px] sm:text-xs border border-gray-200 rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 outline-none focus:border-accent-gold transition-colors bg-[#faf7f2]/50 cursor-pointer"
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddToCart}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-green text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-primary-green-hover transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
