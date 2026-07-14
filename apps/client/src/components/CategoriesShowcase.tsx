"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

interface CategoriesShowcaseProps {
  subcategories: SubCategory[];
  mainCategorySlug: string;
  mainCategoryName?: string;
}

const CategoriesShowcase = ({ subcategories, mainCategorySlug, mainCategoryName }: CategoriesShowcaseProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    // Add small delay to ensure rendering completes before checking dimensions
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [subcategories]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (subcategories.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3.5xl font-bold text-[#16301d] font-[family-name:var(--font-heading)]">
            Shop by <span className="text-[#7d1f1f] italic">{mainCategoryName || "Category"}</span>
          </h2>
          <div className="h-0.5 w-16 bg-[#c89b3c]/60 mt-2" />
        </div>

        {/* Carousel controls */}
        {subcategories.length > 5 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!showLeftArrow}
              className={`p-2 rounded-full border border-neutral-200 transition-all duration-300 ${
                showLeftArrow
                  ? "bg-white hover:bg-neutral-50 text-[#16301d] cursor-pointer shadow-xs"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50"
              }`}
              aria-label="Previous categories"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!showRightArrow}
              className={`p-2 rounded-full border border-neutral-200 transition-all duration-300 ${
                showRightArrow
                  ? "bg-white hover:bg-neutral-50 text-[#16301d] cursor-pointer shadow-xs"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50"
              }`}
              aria-label="Next categories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Categories Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {subcategories.map((sub) => {
          const fallbackImage = "/featured.jpg";
          const imageToShow = sub.imageUrl || fallbackImage;

          return (
            <Link
              key={sub.id}
              href={`/products?mainCategory=${mainCategorySlug}&category=${sub.slug}`}
              className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.33%-12px)] md:w-[calc(25%-15px)] lg:w-[calc(20%-16px)] group relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100"
            >
              {/* Card Image */}
              <Image
                src={imageToShow}
                alt={sub.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Elegant dark overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Text Label */}
              <div className="absolute bottom-5 inset-x-4 text-center">
                <span className="text-white text-xs sm:text-sm font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-body)] transition-transform duration-300 inline-block group-hover:translate-y-[-2px]">
                  {sub.name}
                </span>
                <span className="block h-[1.5px] w-0 bg-[#c89b3c] mx-auto mt-1 transition-all duration-300 group-hover:w-12" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesShowcase;
