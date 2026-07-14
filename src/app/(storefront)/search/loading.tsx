import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCardSkeleton } from "@/features/products/ProductCard";

export default function SearchLoading() {
  return (
    <div className="section-padding min-h-screen">
      <div className="container-site">
        <Skeleton className="h-8 w-64 mx-auto mb-10" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
