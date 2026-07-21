import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/config";
import { listProducts } from "@/services/product.service";
import { ProductCard, ProductCardSkeleton } from "@/features/products/ProductCard";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Best Sellers — ${SITE_CONFIG.businessName}`,
  description: `Discover the most popular Luminous inverters, batteries, and solar systems at ${SITE_CONFIG.businessName}.`,
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/best-sellers` },
};

export default async function BestSellersPage() {
  const result = await listProducts({ isBestSeller: true, status: "published" }, 1, 100);
  const bestSellers = result.products;

  return (
    <div className="min-h-[60vh] bg-neutral-50 flex flex-col">
      <div className="bg-white border-b border-neutral-200">
        <div className="container-site py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Best Sellers
          </h1>
          <p className="text-neutral-500">
            Our most popular and highly rated Luminous products.
          </p>
        </div>
      </div>

      <div className="flex-grow container-site py-16 flex items-center justify-center">
        {bestSellers.length > 0 ? (
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-primary-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Coming Soon
            </h2>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Our most popular products will appear here soon. We're currently curating the list of our best-selling items for you.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/products" className="inline-flex items-center gap-2">
                Explore Products
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
