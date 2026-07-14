import { ProductCardSkeleton } from "@/features/products/ProductCard";

export default function Loading() {
  return (
    <div className="section-padding bg-neutral-50 min-h-screen">
      <div className="container-site">
        {/* Header skeleton */}
        <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse mb-8" />
        <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse mb-3" />
        <div className="h-4 w-full max-w-xl bg-neutral-200 rounded animate-pulse mb-10" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
