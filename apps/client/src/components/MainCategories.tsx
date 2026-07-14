"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MainCategoryType } from "@repo/types";

const MainCategories = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mainCategories, setMainCategories] = useState<MainCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/maincategory`);
        if (res.ok) {
          const data = await res.json();
          setMainCategories(data);
        }
      } catch (error) {
        console.error("Error fetching main categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMainCategories();
  }, []);

  const selectedMainCategory = searchParams.get("mainCategory") || (mainCategories[0]?.slug || "");

  const handleChange = (slug: string) => {
    const params = new URLSearchParams();
    params.set("mainCategory", slug);

    router.push(`/products?${params.toString()}`);
  };

  const handleSubClick = (mainSlug: string, subSlug: string) => {
    const params = new URLSearchParams();
    params.set("mainCategory", mainSlug);
    params.set("category", subSlug);

    router.push(`/products?${params.toString()}`);
    setHoveredCategory(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-8 lg:gap-14">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-20 bg-gray-200/50 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="flex items-center justify-center">
        <div className="flex items-center gap-8 lg:gap-14">
          {/* Custom New Arrivals Link */}
          <Link
            href="/products?sort=newest"
            className="group relative flex items-center gap-1.5 cursor-pointer outline-hidden py-4"
          >
            <span className="uppercase tracking-[0.25em] text-[10px] lg:text-[11px] transition-all duration-300 font-[family-name:var(--font-body)] text-neutral-600 font-light group-hover:text-[#7d1f1f]">
              New Arrivals
            </span>
            <span className="absolute -bottom-1 left-0 h-[1.5px] bg-[#16301d] transition-all duration-300 w-0 group-hover:w-full" />
          </Link>
          {mainCategories.map((category) => {
            const isActive = selectedMainCategory === category.slug;
            const isHovered = hoveredCategory === category.slug;
            const subcats = category.categories || [];
            const isLarge = subcats.length > 6;

            return (
              <div
                key={category.slug}
                className="relative py-4"
                onMouseEnter={() => setHoveredCategory(category.slug)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => handleChange(category.slug)}
                  className="group relative flex items-center gap-1.5 cursor-pointer outline-hidden"
                >
                  {/* Category Name */}
                  <span
                    className={`uppercase tracking-[0.25em] text-[10px] lg:text-[11px] transition-all duration-300 font-[family-name:var(--font-body)] ${
                      isActive
                        ? "text-[#16301d] font-semibold"
                        : "text-neutral-600 font-light group-hover:text-[#7d1f1f]"
                    }`}
                  >
                    {category.name}
                  </span>

                  {/* Dropdown Icon */}
                  <ChevronDown
                    size={10}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-[#16301d]"
                        : "text-neutral-450 group-hover:text-[#7d1f1f]"
                    } ${isHovered ? "rotate-180" : ""}`}
                  />

                  {/* Underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#16301d] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>

                {/* Subcategories Dropdown (Mega Menu) */}
                {isHovered && subcats.length > 0 && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 ${
                      isLarge ? "w-[440px]" : "w-60"
                    } bg-[#faf7f2]/98 backdrop-blur-md border border-neutral-200 shadow-xl rounded-xl p-5 z-50 animate-slide-down`}
                  >
                    <div
                      className={`grid ${
                        isLarge ? "grid-cols-2 gap-x-6 gap-y-1.5" : "grid-cols-1 gap-y-1.5"
                      }`}
                    >
                      {subcats.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubClick(category.slug, sub.slug)}
                          className="text-left text-xs font-normal tracking-wide text-neutral-700 hover:text-[#7d1f1f] py-2 px-3 rounded-lg hover:bg-neutral-800/5 transition-all duration-200 flex items-center gap-3 group/item outline-hidden w-full cursor-pointer"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#c89b3c] group-hover/item:scale-125 transition-transform duration-200" />
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MainCategories;
