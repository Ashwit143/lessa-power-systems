"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";

export function ProductFiltersClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (searchParams.get("q") || "")) {
        updateFilters({ q: searchQuery });
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const updateFilters = (newFilters: { q?: string; category?: string; status?: string }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newFilters.q !== undefined) {
      if (newFilters.q) current.set("q", newFilters.q);
      else current.delete("q");
    }
    
    if (newFilters.category !== undefined) {
      if (newFilters.category) current.set("category", newFilters.category);
      else current.delete("category");
    }
    
    if (newFilters.status !== undefined) {
      if (newFilters.status) current.set("status", newFilters.status);
      else current.delete("status");
    }

    // Always reset pagination when filters change
    current.delete("cursorCreatedAt");
    current.delete("cursorId");
    current.delete("dir");
    current.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`);
    });
  };

  return (
    <div className={`p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50/50 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      <div className="relative w-full sm:w-72">
        <input 
          type="search" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..." 
          className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
        />
        <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        <select 
          value={category}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="border border-neutral-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        >
          <option value="">All Categories</option>
          <option value="battery">Battery</option>
          <option value="inverter">Inverter</option>
          <option value="solar">Solar</option>
          <option value="combo">Combo</option>
        </select>
        <select 
          value={status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="border border-neutral-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}
