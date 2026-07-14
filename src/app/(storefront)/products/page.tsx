import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Battery, Zap, Sun, Package } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/features/products/ProductCard";
import { Badge } from "@/components/ui/index";
import { getFeaturedProducts } from "@/services/product.service";
import { CATEGORIES } from "@/data/categories";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Products — Luminous Inverters, Batteries & Solar | Leesa Power Systems",
  description:
    "Browse genuine Luminous inverters, batteries, solar systems, and combos. Authorized distributor in Hyderabad. WhatsApp ordering. Best price guaranteed.",
  alternates: { canonical: `${SITE_CONFIG.siteUrl}/products` },
  openGraph: {
    title: "Luminous Products — Inverters, Batteries & Solar in Hyderabad",
    description:
      "Browse the full range of genuine Luminous products at Leesa Power Systems, Hyderabad's authorized distributor.",
    url: `${SITE_CONFIG.siteUrl}/products`,
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  battery: Battery,
  inverter: Zap,
  solar: Sun,
  combo: Package,
};

export default async function ProductsPage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-site py-10">
          <span className="section-eyebrow">Our catalog</span>
          <h1 className="text-page text-neutral-900 mt-2 mb-3">
            Luminous Products
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Authorized Luminous distributor in Hyderabad. Browse our full range of genuine inverters, batteries, solar systems, and bundles.
          </p>
        </div>
      </div>

      {/* Category shortcuts */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-site">
          <nav
            className="flex gap-2 overflow-x-auto no-scrollbar py-3"
            aria-label="Product categories"
          >
            {CATEGORIES.filter((c) => c.isActive).map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Zap;
              return (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm font-semibold text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Featured products */}
      <div className="section-padding">
        <div className="container-site">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="primary" className="mb-2">Popular choices</Badge>
              <h2 className="text-2xl font-bold text-neutral-800">Featured Products</h2>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          </Suspense>

          {/* Category browse cards */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.filter((c) => c.isActive).map((cat) => {
                const Icon = CATEGORY_ICONS[cat.slug] ?? Zap;
                return (
                  <Link
                    key={cat.id}
                    href={`/products/${cat.slug}`}
                    className="card-base card-hover p-6 flex flex-col gap-4 group"
                    aria-label={`Browse ${cat.name}`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                      <Icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 group-hover:text-primary-700 transition-colors mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {cat.valueProp}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
