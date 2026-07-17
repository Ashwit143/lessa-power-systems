import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { listProducts } from "@/services/product.service";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { ProductCard, ProductCardSkeleton } from "@/features/products/ProductCard";
import { Breadcrumb } from "@/components/ui/forms";
import { Badge } from "@/components/ui/index";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import type { ProductCategory } from "@/types";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return {
    title: `${cat.name} — Luminous Products in Hyderabad`,
    description: cat.description,
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/products/${category}`,
    },
    openGraph: {
      title: `Luminous ${cat.name} in Hyderabad | ${SITE_CONFIG.businessName}`,
      description: cat.description,
    },
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page = "1", q } = await searchParams;

  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const pageNum = Math.max(1, parseInt(page, 10));
  const { products, pagination } = await listProducts(
    {
      category: category as ProductCategory,
      search: q,
    },
    pageNum
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: cat.name },
  ];

  return (
    <div className="section-padding bg-neutral-50 min-h-screen">
      <div className="container-site">
        <Breadcrumb items={breadcrumbs} />

        {/* Category header */}
        <div className="mb-10">
          <Badge variant="primary" className="mb-3">{cat.name}</Badge>
          <h1 className="text-page text-neutral-900 mb-3">{cat.name}</h1>
          <p className="text-neutral-600 max-w-2xl leading-relaxed">{cat.description}</p>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : category === "combo" ? (
          /* ─── Combo Coming Soon — elegant illustrated empty state ─── */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {/* Illustration */}
            <div className="mb-8 w-48 h-48 flex items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Background circle */}
                <circle cx="100" cy="100" r="90" fill="#EFF6FF" />
                {/* Battery shape */}
                <rect x="30" y="85" width="75" height="50" rx="6" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
                <rect x="28" y="95" width="4" height="30" rx="2" fill="#60A5FA"/>
                <rect x="105" y="95" width="6" height="10" rx="2" fill="#93C5FD"/>
                {/* Battery segments */}
                <rect x="36" y="93" width="14" height="34" rx="3" fill="#3B82F6" opacity="0.7"/>
                <rect x="54" y="93" width="14" height="34" rx="3" fill="#3B82F6" opacity="0.5"/>
                <rect x="72" y="93" width="14" height="34" rx="3" fill="#3B82F6" opacity="0.3"/>
                {/* Inverter shape */}
                <rect x="115" y="70" width="60" height="80" rx="8" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
                {/* Inverter display */}
                <rect x="122" y="80" width="46" height="28" rx="4" fill="#1D4ED8" opacity="0.15"/>
                <rect x="126" y="84" width="38" height="20" rx="2" fill="#1D4ED8" opacity="0.3"/>
                {/* Inverter LEDs */}
                <circle cx="128" cy="120" r="4" fill="#22C55E"/>
                <circle cx="141" cy="120" r="4" fill="#3B82F6"/>
                {/* Lightning bolt */}
                <path d="M95 55 L85 75 H97 L87 95 L107 70 H95 L105 55 Z" fill="#F59E0B" opacity="0.9"/>
                {/* Stars */}
                <circle cx="50" cy="45" r="3" fill="#FCD34D" opacity="0.7"/>
                <circle cx="160" cy="50" r="2" fill="#FCD34D" opacity="0.5"/>
                <circle cx="35" cy="155" r="2.5" fill="#93C5FD" opacity="0.6"/>
                <circle cx="170" cy="160" r="3" fill="#93C5FD" opacity="0.5"/>
              </svg>
            </div>

            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
              Coming Soon
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              Exciting Combos on the Way
            </h2>
            <p className="text-neutral-500 max-w-md leading-relaxed mb-8">
              We&apos;re putting together the best inverter + battery combo deals for you — expert-matched sets ready to install. Check back soon!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/products/inverter"
                className="px-5 py-2.5 bg-primary-700 text-white text-sm font-semibold rounded-lg hover:bg-primary-800 transition-colors"
              >
                Browse Inverters
              </Link>
              <Link
                href="/products/battery"
                className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                Browse Batteries
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm">Try adjusting your search or <Link href="/products" className="text-primary-700 underline">browse all products</Link>.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav className="mt-10 flex justify-center items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Pagination">
            {/* Previous Button */}
            {pagination.page > 1 ? (
              <Link
                href={
                  q
                    ? `/products/${category}?page=${pagination.page - 1}&q=${encodeURIComponent(q)}`
                    : `/products/${category}?page=${pagination.page - 1}`
                }
                aria-label="Go to previous page"
                className="h-[44px] px-3 sm:px-4 flex-shrink-0 flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="h-[44px] px-3 sm:px-4 flex-shrink-0 flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-400 cursor-not-allowed opacity-60"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const p = i + 1;
                const isActive = p === pagination.page;
                const href = q
                  ? `/products/${category}?page=${p}&q=${encodeURIComponent(q)}`
                  : `/products/${category}?page=${p}`;
                return (
                  <Link
                    key={p}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-w-[44px] h-[44px] flex-shrink-0 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary-700 text-white"
                        : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {/* Next Button */}
            {pagination.page < pagination.totalPages ? (
              <Link
                href={
                  q
                    ? `/products/${category}?page=${pagination.page + 1}&q=${encodeURIComponent(q)}`
                    : `/products/${category}?page=${pagination.page + 1}`
                }
                aria-label="Go to next page"
                className="h-[44px] px-3 sm:px-4 flex-shrink-0 flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="h-[44px] px-3 sm:px-4 flex-shrink-0 flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-400 cursor-not-allowed opacity-60"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            )}
          </nav>
        )}

        {/* Related categories */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Browse Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter((c) => c.slug !== category && c.isActive).map((c) => (
              <Link
                key={c.id}
                href={`/products/${c.slug}`}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
