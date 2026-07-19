import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/forms";
import { ProductCard } from "@/features/products/ProductCard";
import { ProductDetailClient } from "./ProductDetailClient";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/services/product.service";
import { SITE_CONFIG } from "@/lib/config";
import { getSiteSettings } from "@/services/settings.service";
import { normalizeWhatsAppNumber } from "@/utils/whatsapp";
import type { ProductCategory } from "@/types";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.seoTitle ?? `${product.name} — ${SITE_CONFIG.businessName}`;
  const description =
    product.metaDescription ??
    `${product.shortDescription} Available in Hyderabad. Contact Leesa Power Systems for best price on WhatsApp.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/products/${product.category}/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: product.featuredImage, alt: product.altText ?? product.name }],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((s) => ({ category: s.category, slug: s.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product || product.category !== category) notFound();

  const [relatedProducts, settings] = await Promise.all([
    getRelatedProducts(product.id, product.category as ProductCategory, 4),
    getSiteSettings()
  ]);
  const whatsappNumber = normalizeWhatsAppNumber(settings.whatsappNumber || SITE_CONFIG.whatsappNumber);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/products/${product.category}` },
    { label: product.name },
  ];

  // JSON-LD: Product schema (no price — omitted per spec Section 2)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_CONFIG.siteUrl}${product.featuredImage}`,
    category: product.category,
    brand: { "@type": "Brand", name: "Luminous" },
    seller: {
      "@type": "Organization",
      name: SITE_CONFIG.businessName,
      url: SITE_CONFIG.siteUrl,
    },
  };

  return (
    <div className="section-padding bg-neutral-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="container-site">
        <Breadcrumb items={breadcrumbs} />

        {/* Main product section */}
        <ProductDetailClient product={product} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-neutral-200" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-bold text-neutral-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 p-3 pb-safe md:hidden"
        aria-label="Quick order actions"
      >
        <div className="flex gap-2 max-w-sm mx-auto">
          <Link
            href="/cart"
            className="flex-1 py-3 text-sm font-semibold text-center text-primary-700 border-2 border-primary-700 rounded-md hover:bg-primary-50 transition-colors"
          >
            View Cart
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share pricing and availability.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 text-sm font-semibold text-center text-white bg-whatsapp rounded-md hover:opacity-90 transition-opacity"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
