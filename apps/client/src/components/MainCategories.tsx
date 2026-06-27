"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("mainCategory", slug);
    params.delete("category");

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleSubClick = (mainSlug: string, subSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mainCategory", mainSlug);
    params.set("category", subSlug);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
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
                    className={`uppercase tracking-[0.25em] text-[11px] lg:text-[12px] font-bold transition-all duration-300 font-[family-name:var(--font-body)] ${
                      isActive
                        ? "text-primary-green font-bold"
                        : "text-primary-green/75 group-hover:text-heritage-maroon"
                    }`}
                  >
                    {category.name}
                  </span>

                  {/* Dropdown Icon */}
                  <ChevronDown
                    size={12}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-primary-green"
                        : "text-primary-green/55 group-hover:text-heritage-maroon"
                    } ${isHovered ? "rotate-180" : ""}`}
                  />

                  {/* Underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-primary-green transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>

                {/* Subcategories Dropdown (Mega Menu) */}
                {isHovered && subcats.length > 0 && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 ${
                      isLarge ? "w-[440px]" : "w-60"
                    } bg-[#faf7f2]/98 backdrop-blur-md border border-accent-gold/35 shadow-2xl rounded-2xl p-5 z-50 animate-slide-down`}
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
                          className="text-left text-xs font-semibold tracking-wider text-primary-green hover:text-heritage-maroon py-2 px-3 rounded-xl hover:bg-accent-gold/10 transition-all duration-200 flex items-center gap-3.5 group/item outline-hidden w-full cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-gold group-hover/item:scale-125 transition-transform duration-200" />
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
