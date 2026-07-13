"use client";

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Bell, Home } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import MainCategories from "./MainCategories";
import { Show, SignInButton } from "@clerk/nextjs";
import ProfileButton from "./ProfileButton";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const Navbar = () => {
  // const pathname = usePathname();

  // if (pathname === "/cart") {
  //   return null;
  // }

  return (
    <nav className="sticky top-0 z-50 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#c89b3c]/15 shadow-sm flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-[#7d1f1f] text-[#faf7f2] py-2 px-4 text-center text-[10px] md:text-xs tracking-[0.2em] font-semibold uppercase flex items-center justify-center gap-2 border-b border-[#c89b3c]/10">
        <span>✨ Authentic Indian Wear for Women | Handcrafted Traditional Wear in Mumbai ✨</span>
      </div>

      <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3.5">
        {/* Left Actions: Logo & Search Bar */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.jpeg"
              alt="Rajasthalii Logo"
              width={38}
              height={38}
              className="rounded-full object-cover border border-[#c89b3c]/20 shadow-2xs hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <Suspense fallback={<div className="w-32 h-8 bg-neutral-200/30 animate-pulse rounded-full" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Center Brand Identity */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <Link href="/" className="flex flex-col items-center group">
            <h1 className="text-xl lg:text-2xl font-bold tracking-[0.2em] text-[#16301d] font-[family-name:var(--font-heading)] leading-none transition-colors duration-300 group-hover:text-[#7d1f1f]">
              Rajasthalii
            </h1>
            <p className="text-[8px] tracking-[0.4em] text-neutral-500 uppercase font-semibold font-[family-name:var(--font-body)] mt-1.5">
              Heritage • Elegance • Tradition
            </p>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-neutral-800/5 text-[#16301d] transition-colors duration-300 group"
            title="Home"
          >
            <Home className="w-5 h-5 text-[#16301d] group-hover:text-[#7d1f1f] transition-colors duration-300" />
          </Link>

          <Link
            href="/notifications"
            className="p-2 rounded-full hover:bg-neutral-800/5 text-[#16301d] transition-colors duration-300 group"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#16301d] group-hover:text-[#7d1f1f] transition-colors duration-300" />
          </Link>

          <ShoppingCartIcon />

          {/* User Sign-In/Profile */}
          <div className="flex items-center pl-2 border-l border-neutral-200 ml-1">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 border border-[#16301d] text-[#16301d] hover:bg-[#16301d] hover:text-white rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <ProfileButton />
            </Show>
          </div>
        </div>
      </div>

      {/* Main Categories Row - clean line style */}
      <div className="hidden lg:flex items-center justify-center gap-6 py-1 border-t border-neutral-200/50 bg-[#faf7f2]/50">
        <Suspense fallback={<div className="h-6 w-96 bg-neutral-200/30 animate-pulse rounded-full" />}>
          <MainCategories />
        </Suspense>
      </div>
    </nav>
  );
};

export default Navbar;
