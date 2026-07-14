import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="section-padding bg-neutral-50 min-h-screen">
      <div className="container-site">
        <Skeleton className="h-4 w-64 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <Skeleton className="aspect-square w-full rounded-2xl bg-white" />
          
          <div className="space-y-6 pt-4 lg:pt-8">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
            
            <Skeleton className="h-12 w-48" />
            
            <div className="flex gap-4 pt-4 border-t border-neutral-100">
              <Skeleton className="h-12 w-1/2 rounded-full" />
              <Skeleton className="h-12 w-1/2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
