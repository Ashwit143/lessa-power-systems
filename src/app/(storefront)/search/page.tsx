import type { Metadata } from "next";
import { Suspense } from "react";
import { listProducts } from "@/services/product.service";
import { ProductCard, ProductCardSkeleton } from "@/features/products/ProductCard";
import { EmptyState } from "@/components/ui/index";
import { Search as SearchIcon } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { ProductSearch } from "@/features/products/ProductSearch";

export const metadata: Metadata = {
  title: `Search Products — ${SITE_CONFIG.businessName}`,
  description: `Search for inverters, batteries, and solar solutions from ${SITE_CONFIG.businessName}.`,
  robots: { index: false, follow: true }, // Don't index search result pages
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  
  // Use existing getProducts but we'd ideally have a dedicated search function
  // For static demo purposes, we fetch all and filter in memory if the service doesn't support text search
  const { products: allProducts } = await listProducts({}, 1, 1000);
  
  const searchResults = query 
    ? allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  return (
    <div className="min-h-screen bg-neutral-50 section-padding">
      <div className="container-site">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-page text-neutral-900 mb-6">Search Products</h1>
          <ProductSearch initialQuery={query} />
        </div>

        <div className="mt-12">
          {!query ? (
            <div className="text-center py-12 text-neutral-500">
              Enter a search term above to find products.
            </div>
          ) : searchResults.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No products found"
              description={`We couldn't find anything matching "${query}". Try different keywords or browse our categories.`}
            />
          ) : (
            <div>
              <p className="text-neutral-600 mb-6">
                Found {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for "<span className="font-semibold text-neutral-900">{query}</span>"
              </p>
              
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {searchResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
