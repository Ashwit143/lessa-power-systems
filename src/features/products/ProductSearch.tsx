"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface ProductSearchProps {
  initialQuery?: string;
}

export function ProductSearch({ initialQuery = "" }: ProductSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative flex items-center w-full max-w-lg mx-auto"
      role="search"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search inverters, batteries, solar..."
        className="w-full pl-11 pr-4 py-3 rounded-full border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-neutral-800 shadow-sm"
        aria-label="Search products"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <Search className="h-5 w-5" aria-hidden="true" />
      </div>
      <button
        type="submit"
        className="sr-only"
      >
        Search
      </button>
    </form>
  );
}
