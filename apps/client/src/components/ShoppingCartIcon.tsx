"use client";
import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/dist/client/link";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();
  if (!hasHydrated) return null;
  return (
    <Link href="/cart" className="relative group p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
      <ShoppingCart className="w-5 h-5 text-bg-cream group-hover:text-accent-gold transition-colors duration-300" />
      <span className="absolute -top-1 -right-1 bg-heritage-maroon text-[#faf7f2] text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-semibold shadow-sm animate-pulse border border-accent-gold/20">
        {cart.reduce((acc, item) => acc + item.quantity, 0)}
      </span>
    </Link>
  );
};

export default ShoppingCartIcon;
