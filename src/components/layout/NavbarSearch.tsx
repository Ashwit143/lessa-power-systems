"use client";

import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/index";
import type { Product } from "@/types";

export function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch logic
  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResults();
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const product = results[selectedIndex];
        router.push(`/products/${product.category}/${product.slug}`);
        setIsOpen(false);
        setQuery("");
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-full lg:max-w-[320px] transition-all duration-300 ease-in-out focus-within:lg:max-w-[380px]" ref={containerRef}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full bg-neutral-100/80 border border-neutral-200 hover:border-neutral-300 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm py-2 pl-10 pr-10 rounded-full outline-none transition-all duration-200 placeholder:text-neutral-500"
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
          autoComplete="off"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div 
          id="search-dropdown"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50 flex flex-col max-h-[70vh] lg:max-h-[500px]"
          role="listbox"
        >
          {query.trim().length === 0 ? (
             <div className="p-4 flex flex-col gap-3">
               <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2">Popular</div>
               <Link href="/best-sellers" className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors group" onClick={() => setIsOpen(false)}>
                 <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">Best Sellers</span>
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors" />
               </Link>
               <Link href="/solar" className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors group" onClick={() => setIsOpen(false)}>
                 <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">Solar Solutions</span>
                 <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors" />
               </Link>
             </div>
          ) : query.trim().length < 2 ? (
             <div className="p-4 text-sm text-neutral-500 text-center">Type at least 2 characters to search.</div>
          ) : isLoading && results.length === 0 ? (
             <div className="p-6 flex justify-center">
               <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
             </div>
          ) : results.length > 0 ? (
             <div className="flex flex-col overflow-y-auto">
               <ul className="py-2">
                 {results.map((product, index) => (
                   <li key={product.id} role="option" aria-selected={selectedIndex === index}>
                     <Link
                       href={`/products/${product.category}/${product.slug}`}
                       className={cn(
                         "group flex items-center gap-3 p-3 transition-colors",
                         selectedIndex === index ? "bg-primary-50" : "hover:bg-neutral-50"
                       )}
                       onClick={() => setIsOpen(false)}
                     >
                       <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-md border border-neutral-100 p-1">
                         <Image src={product.featuredImage} alt={product.name} fill className="object-contain" sizes="48px" />
                       </div>
                       <div className="flex-1 min-w-0 flex flex-col">
                         <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-sm font-semibold text-neutral-900 truncate">{product.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-neutral-200 text-neutral-500">{product.category}</Badge>
                           {product.sku && <span className="text-[11px] text-neutral-400 truncate">{product.sku}</span>}
                         </div>
                       </div>
                       <div className="flex items-center text-[11px] font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                         View <ArrowRight className="w-3 h-3 ml-1" />
                       </div>
                     </Link>
                   </li>
                 ))}
               </ul>
               <div className="p-2 border-t border-neutral-100 bg-neutral-50">
                 <Link
                   href={`/search?q=${encodeURIComponent(query.trim())}`}
                   className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
                   onClick={() => setIsOpen(false)}
                 >
                   View all results <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
             </div>
          ) : !isLoading ? (
             <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
               <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-1">
                 <Search className="w-5 h-5 text-neutral-400" />
               </div>
               <p className="text-sm font-semibold text-neutral-800">No products found</p>
               <p className="text-xs text-neutral-500">Try searching with another keyword.</p>
             </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
