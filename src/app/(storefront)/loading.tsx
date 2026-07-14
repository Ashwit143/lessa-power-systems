import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCardSkeleton } from "@/features/products/ProductCard";

export default function HomeLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      <Skeleton className="w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] rounded-none bg-neutral-100" />
      
      <div className="section-padding container-site">
        <div className="flex justify-between items-end mb-8">
          <div>
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full hidden sm:block" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
