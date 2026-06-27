"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  selectedSize,
  selectedView,
}: {
  product: ProductType;
  selectedSize: string;
  selectedView: "frontView" | "sideView" | "backView";
}) => {
  const { addToCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(type, value);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
    });

    toast.success("Added To Cart");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* SIZE */}
      <div>
        <h3 className="font-medium mb-3">Select Size</h3>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleTypeChange("size", size)}
              className={`px-4 py-2 rounded-xl border text-sm transition cursor-pointer ${
                selectedSize === size
                  ? "border-primary-green bg-primary-green/5 text-primary-green font-semibold"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT VIEW */}
      <div>
        <h3 className="font-medium mb-3">Product View</h3>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeChange("view", "frontView")}
            className={`px-4 py-2 rounded-xl border text-sm transition cursor-pointer ${
              selectedView === "frontView"
                ? "border-primary-green bg-primary-green/5 text-primary-green font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            Front View
          </button>

          <button
            onClick={() => handleTypeChange("view", "sideView")}
            className={`px-4 py-2 rounded-xl border text-sm transition cursor-pointer ${
              selectedView === "sideView"
                ? "border-primary-green bg-primary-green/5 text-primary-green font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            Side View
          </button>

          <button
            onClick={() => handleTypeChange("view", "backView")}
            className={`px-4 py-2 rounded-xl border text-sm transition cursor-pointer ${
              selectedView === "backView"
                ? "border-primary-green bg-primary-green/5 text-primary-green font-semibold"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            Back View
          </button>
        </div>
      </div>

      {/* QUANTITY */}
      <div>
        <h3 className="font-medium mb-3">Quantity</h3>

        <div className="flex items-center w-max border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="p-3 hover:bg-gray-50 cursor-pointer"
          >
            <Minus size={16} />
          </button>

          <span className="px-5 font-semibold text-gray-800">{quantity}</span>

          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="p-3 hover:bg-gray-50 cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-primary-green hover:bg-primary-green-hover text-white py-3.5 rounded-2xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md uppercase tracking-wider text-xs"
        >
          <ShoppingBag size={18} className="text-accent-gold" />
          Add To Cart
        </button>

        <button className="flex-1 border border-accent-brown hover:bg-accent-brown hover:text-white text-accent-brown py-3.5 rounded-2xl font-semibold transition cursor-pointer uppercase tracking-wider text-xs">
          Buy Now
        </button>
      </div>

      {/* INFO */}
      <div className="text-sm text-gray-500 flex flex-col gap-2">
        <p>
          Selected Size:
          <span className="font-medium text-gray-700 ml-2">{selectedSize}</span>
        </p>

        <p>
          Selected View:
          <span className="font-medium text-gray-700 ml-2">
            {selectedView === "frontView"
              ? "Front View"
              : selectedView === "sideView"
                ? "Side View"
                : "Back View"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductInteraction;
