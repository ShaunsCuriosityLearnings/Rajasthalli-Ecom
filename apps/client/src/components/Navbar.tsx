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
    <nav className="sticky top-0 z-50 bg-primary-green/95 backdrop-blur-md border-b border-accent-gold/30 shadow-md flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-heritage-maroon text-[#faf7f2] py-2 px-4 text-center text-[10px] md:text-xs tracking-[0.2em] font-semibold uppercase flex items-center justify-center gap-2 border-b border-accent-gold/15">
        <span>✨ Authentic Indian Wear for Women | Handcrafted Traditional Wear in Mumbai ✨</span>
      </div>

      <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
        {/* Left Logo - Wrapped in an elegant cream plaque for contrast */}
        <Link href="/" className="bg-[#faf7f2] px-4 py-2 rounded-2xl border border-accent-gold/25 flex items-center hover:opacity-95 transition-all duration-300 shadow-sm">
          <Image
            src="/logo.jpeg"
            alt="Rajasthalii"
            width={160}
            height={64}
            className="h-10 md:h-12 w-auto object-contain mix-blend-multiply"
            priority
          />
        </Link>

        {/* Center Brand */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block text-center">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-white font-[family-name:var(--font-heading)] leading-none">
            RAJASTHALII
          </h1>
          <p className="text-[9px] lg:text-[10px] tracking-[0.4em] text-bg-cream/80 uppercase font-bold mt-2 font-[family-name:var(--font-body)]">
            Heritage • Elegance • Tradition
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:block">
            <Suspense fallback={<div className="w-32 h-8 bg-white/20 animate-pulse rounded-full" />}>
              <SearchBar />
            </Suspense>
          </div>

          <Link
            href="/"
            className="p-2 rounded-full hover:bg-white/10 text-bg-cream transition-colors duration-300 group"
            title="Home"
          >
            <Home className="w-5 h-5 text-bg-cream group-hover:text-accent-gold transition-colors duration-300" />
          </Link>

          <Link
            href="/notifications"
            className="p-2 rounded-full hover:bg-white/10 text-bg-cream transition-colors duration-300 group"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-bg-cream group-hover:text-accent-gold transition-colors duration-300" />
          </Link>

          <ShoppingCartIcon />

          {/* User Sign-In/Profile */}
          <div className="flex items-center pl-2 border-l border-white/20 ml-1">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary-green rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md">
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

      {/* Main Categories Row - pearl white color background */}
      <div className="hidden lg:flex items-center justify-center gap-6 py-2.5 border-t border-b border-accent-gold/20 bg-[#faf9f6]">
        <span className="h-px w-14 bg-accent-gold/30" />
        <Suspense fallback={<div className="h-6 w-96 bg-primary-green/5 animate-pulse rounded-full" />}>
          <MainCategories />
        </Suspense>
        <span className="h-px w-14 bg-accent-gold/30" />
      </div>
    </nav>
  );
};

export default Navbar;
