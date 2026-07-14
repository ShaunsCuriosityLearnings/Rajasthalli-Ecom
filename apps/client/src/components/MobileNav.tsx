"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainCategoryType } from "@repo/types";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mainCategories, setMainCategories] = useState<MainCategoryType[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/maincategory`);
        if (res.ok) {
          const data = await res.json();
          // Sort to match homepage sorting
          data.sort((a: any, b: any) => {
            const aIsWomens = a.name.toLowerCase() === "womens" || a.slug.toLowerCase() === "womens";
            const bIsWomens = b.name.toLowerCase() === "womens" || b.slug.toLowerCase() === "womens";
            if (aIsWomens && !bIsWomens) return -1;
            if (!aIsWomens && bIsWomens) return 1;
            return 0;
          });
          setMainCategories(data);
        }
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  const handleMainClick = (slug: string) => {
    const params = new URLSearchParams();
    params.set("mainCategory", slug);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleSubClick = (mainSlug: string, subSlug: string) => {
    const params = new URLSearchParams();
    params.set("mainCategory", mainSlug);
    params.set("category", subSlug);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-[#16301d] lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[#faf7f2] z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-[#c89b3c]/20">
          <span className="font-[family-name:var(--font-heading)] font-bold text-xl tracking-widest text-[#16301d]">MENU</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-neutral-500 hover:text-[#7d1f1f]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col py-4">
          <Link 
            href="/products?sort=newest"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 text-sm font-semibold tracking-[0.2em] uppercase text-[#16301d] border-b border-neutral-200/60"
          >
            New Arrivals
          </Link>
          
          {mainCategories.map((category) => {
            const subcats = category.categories || [];
            const isExpanded = expandedCategory === category.slug;

            return (
              <div key={category.slug} className="border-b border-neutral-200/60">
                <div className="flex items-center justify-between px-6 py-4">
                  <button 
                    onClick={() => handleMainClick(category.slug)}
                    className="text-sm font-semibold tracking-[0.2em] uppercase text-[#16301d] text-left"
                  >
                    {category.name}
                  </button>
                  {subcats.length > 0 && (
                    <button 
                      onClick={() => setExpandedCategory(isExpanded ? null : category.slug)}
                      className="p-2 text-neutral-500"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                
                {isExpanded && subcats.length > 0 && (
                  <div className="bg-neutral-100/50 flex flex-col py-2 px-6">
                    {subcats.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => handleSubClick(category.slug, sub.slug)}
                        className="text-left text-sm text-neutral-600 py-2.5 hover:text-[#7d1f1f] flex items-center gap-2"
                      >
                        <ChevronRight className="w-3 h-3 text-[#c89b3c]" />
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
