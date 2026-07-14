"use client";

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Bell, Home } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import MainCategories from "./MainCategories";
import MobileNav from "./MobileNav";
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

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-2 gap-4">
        {/* Left: Logo & Brand Name */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <MobileNav />
          <Link href="/" className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
            {/* The scale class slightly zooms the image, effectively cropping the edges */}
            <Image
              src="/logo.png"
              alt="Rajasthalii Logo"
              width={160}
              height={160}
              className="object-cover w-full h-full scale-[1.15]"
              priority
            />
          </Link>

          <Link href="/" className="hidden sm:flex flex-col group">
            <h1 className="text-xl lg:text-2xl font-bold tracking-[0.2em] text-[#16301d] font-[family-name:var(--font-heading)] leading-none transition-colors duration-300 group-hover:text-[#7d1f1f]">
              Rajasthalii
            </h1>
            <p className="text-[8px] tracking-[0.4em] text-neutral-500 uppercase font-semibold font-[family-name:var(--font-body)] mt-1.5">
              Heritage • Elegance • Tradition
            </p>
          </Link>
        </div>

        {/* Center: Main Categories */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <Suspense fallback={<div className="h-6 w-96 bg-neutral-200/30 animate-pulse rounded-full" />}>
            <MainCategories />
          </Suspense>
        </div>

        {/* Right Actions: Search & Icons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Suspense fallback={<div className="w-32 h-8 bg-neutral-200/30 animate-pulse rounded-full" />}>
            <SearchBar />
          </Suspense>

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
      </div>
    </nav>
  );
};

export default Navbar;
