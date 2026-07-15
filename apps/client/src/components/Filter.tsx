"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="Free Size">Free Size</option>
        </select>
      </div>

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
