"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = ({ mainCategory }: { mainCategory?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isHomeDecor = mainCategory?.toLowerCase().includes("home") || mainCategory?.toLowerCase().includes("decor");
  const [filterType, setFilterType] = useState<string>(isHomeDecor ? "bedsheet" : "apparel");

  useEffect(() => {
    if (!mainCategory) {
      setFilterType("apparel");
      return;
    }
    const fetchFilterType = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/maincategory`);
        if (res.ok) {
          const data = await res.json();
          const currentMc = data.find((mc: any) => mc.slug === mainCategory);
          if (currentMc && currentMc.filterType) {
            setFilterType(currentMc.filterType);
          } else if (currentMc) {
            // Fallback for existing database records before filterType config is set
            if (currentMc.slug.includes("home") || currentMc.slug.includes("decor") || currentMc.name.toLowerCase().includes("home") || currentMc.name.toLowerCase().includes("decor")) {
              setFilterType("bedsheet");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching main category in Filter:", error);
      }
    };
    fetchFilterType();
  }, [mainCategory]);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="items-center justify-between w-full flex flex-wrap gap-4 mb-6 text-sm bg-neutral-100 p-4 rounded-xl border border-[#c89b3c]/10">
      {filterType !== "none" && (
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-700">Filter by Size:</span>
          <select
            name="size"
            id="size"
            onChange={(e) => handleFilter("size", e.target.value)}
            value={searchParams.get("size") || ""}
            className="bg-white border border-neutral-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#c89b3c] cursor-pointer"
          >
            <option value="">All Sizes</option>
            {filterType === "apparel" && (
              <>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="Free Size">Free Size</option>
              </>
            )}
            {filterType === "bedsheet" && (
              <>
                <option value="Single Bed (60&quot; x 90&quot;)">Single Bed (60" x 90")</option>
                <option value="Double Bed (90&quot; x 100&quot;)">Double Bed (90" x 100")</option>
                <option value="Queen Size (90&quot; x 108&quot;)">Queen Size (90" x 108")</option>
                <option value="King Size (108&quot; x 108&quot;)">King Size (108" x 108")</option>
                <option value="Free Size">Free Size</option>
              </>
            )}
            {filterType === "footwear" && (
              <>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </>
            )}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="font-medium text-neutral-700">Sort by:</span>
        <select
          name="sort"
          id="sort"
          onChange={(e) => handleFilter("sort", e.target.value)}
          value={searchParams.get("sort") || "newest"}
          className="bg-white border border-neutral-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#c89b3c] cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
