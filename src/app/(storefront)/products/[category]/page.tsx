import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { listProducts } from "@/services/product.service";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { ProductCard, ProductCardSkeleton } from "@/features/products/ProductCard";
import { Breadcrumb } from "@/components/ui/forms";
import { Badge } from "@/components/ui/index";
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
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm">Try adjusting your search or <Link href="/products" className="text-primary-700 underline">browse all products</Link>.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
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
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary-700 text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
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
