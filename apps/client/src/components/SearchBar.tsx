"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState("");

  // Sync state with URL search param when search changes (e.g. back navigation or clear)
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden sm:flex items-center gap-2.5 bg-white border border-[#c89b3c]/20 focus-within:border-[#c89b3c]/60 rounded-full px-4 py-2 transition-all duration-300 shadow-sm max-w-xs focus-within:shadow-md"
    >
      <button type="submit" className="focus:outline-hidden cursor-pointer flex items-center bg-transparent border-none p-0">
        <Search className="w-4 h-4 text-primary-green hover:text-heritage-maroon transition-colors" />
      </button>
      <input
        type="search"
        placeholder="Search for heritage..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-xs text-[#2b2b2b] placeholder-[#2b2b2b]/40 bg-transparent border-none outline-hidden w-full font-[family-name:var(--font-body)]"
      />
    </form>
  );
};

export default SearchBar;
