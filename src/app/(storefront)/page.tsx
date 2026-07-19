import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ShieldCheck, MapPin, MessageCircle, ArrowRight, Star, Headphones, Zap } from "lucide-react";
import { TrustBar } from "@/components/common/TrustBar";
import { HeroBannerCarousel } from "@/features/products/HeroBannerCarousel";
import { ProductCard, ProductCardSkeleton } from "@/features/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { getActiveBanners } from "@/services/banner.service";
import { getFeaturedProducts } from "@/services/product.service";
import { SITE_CONFIG } from "@/lib/config";
import { CATEGORIES } from "@/data/categories";
import { getSiteSettings } from "@/services/settings.service";
import { normalizeWhatsAppNumber } from "@/utils/whatsapp";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: `${SITE_CONFIG.businessName} — Authorized Luminous Distributor Hyderabad`,
  description:
    "Leesa Power Systems: Hyderabad's trusted Luminous distributor since 2009. Shop inverters, batteries, and solar systems. 25,000+ customers. WhatsApp ordering.",
  alternates: { canonical: SITE_CONFIG.siteUrl },
  openGraph: {
    title: `${SITE_CONFIG.businessName} — Authorized Luminous Distributor Hyderabad`,
    description:
      "Shop genuine Luminous inverters, batteries, and solar solutions in Hyderabad. WhatsApp ordering. Authorized distributor since 2009.",
    url: SITE_CONFIG.siteUrl,
  },
};

// ---------------------------------------------------------------------------
// JSON-LD: LocalBusiness structured data
// ---------------------------------------------------------------------------
function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_CONFIG.businessName,
    description: "Authorized Luminous distributor in Hyderabad selling inverters, batteries, and solar systems.",
    url: SITE_CONFIG.siteUrl,
    telephone: `+91${SITE_CONFIG.phones[0]}`,
    email: SITE_CONFIG.email,
    foundingDate: String(SITE_CONFIG.established),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE_CONFIG.address.line1}, ${SITE_CONFIG.address.line2}`,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.5135,
      longitude: 78.3824,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: [
      SITE_CONFIG.socialLinks.instagram,
      SITE_CONFIG.socialLinks.facebook,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Why Choose Us section data
// ---------------------------------------------------------------------------
const WHY_CHOOSE_US = [
  {
    icon: ShieldCheck,
    title: "Authorized Distributor",
    description:
      "We are an official Luminous channel partner since 2009. Every product comes directly through Luminous's authorized supply chain — genuine, warranty-backed, and fully supported.",
  },
  {
    icon: Star,
    title: "Genuine Luminous Products",
    description:
      "We stock only authentic Luminous inverters, batteries, and solar equipment. No grey-market products, no counterfeits. What you buy is exactly what Luminous manufactures.",
  },
  {
    icon: Zap,
    title: "Expert Guidance & Fast Installation",
    description:
      "Our technical team helps you choose the right capacity for your actual load — no overselling. Once ordered, our certified installers get your system up and running quickly.",
  },
  {
    icon: Headphones,
    title: "Reliable After-Sales Support",
    description:
      "Our relationship with customers doesn't end at the sale. We provide AMC, warranty service, and ongoing technical support so your power backup keeps working when you need it most.",
  },
];

// ---------------------------------------------------------------------------
// Homepage (Server Component — fetches data at request time)
// ---------------------------------------------------------------------------
export default async function HomePage() {
  const [banners, featuredProducts, settings] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(8),
    getSiteSettings(),
  ]);

  const whatsappNumber = normalizeWhatsAppNumber(settings.whatsappNumber || SITE_CONFIG.whatsappNumber);

  return (
    <>
      <LocalBusinessSchema />

      {/* ================================================================== */}
      {/* Hero Banner Carousel */}
      {/* ================================================================== */}
      <HeroBannerCarousel banners={banners} />

      {/* ================================================================== */}
      {/* Trust Bar */}
      {/* ================================================================== */}
      <TrustBar />

      {/* ================================================================== */}
      {/* Category Grid */}
      {/* ================================================================== */}
      <section className="section-padding bg-neutral-50" aria-labelledby="categories-heading">
        <div className="container-site">
          <div className="section-header">
            <span className="section-eyebrow">Browse by type</span>
            <h2 id="categories-heading" className="text-page text-neutral-900">
              Luminous Products for Every Need
            </h2>
            <p className="text-neutral-500 mt-3">
              From home UPS to large-scale solar systems — find the right power solution for your home, shop, or office.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.filter((c) => c.isActive).map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="group card-base card-hover p-6 flex flex-col items-center text-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                aria-label={`Browse ${category.name}: ${category.valueProp}`}
              >
                {/* Category image — object-contain in fixed square, no cropping */}
                <div className="relative w-20 h-20 bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0 group-hover:bg-primary-50 transition-colors border border-neutral-100">
                  <Image
                    src={category.featuredImage}
                    alt={category.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 group-hover:text-primary-700 transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {category.valueProp}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary-700 group-hover:underline flex items-center gap-1 mt-auto">
                  View Products
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Featured Products */}
      {/* ================================================================== */}
      <section className="section-padding bg-white" aria-labelledby="featured-heading">
        <div className="container-site">
          <div className="section-header">
            <span className="section-eyebrow">Top picks</span>
            <h2 id="featured-heading" className="text-page text-neutral-900">
              Popular Luminous Products
            </h2>
            <p className="text-neutral-500 mt-3">
              Our most-ordered inverters, batteries, and solar equipment — genuine Luminous, backed by warranty.
            </p>
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
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                No featured products at this time.
              </div>
            )}
          </Suspense>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products" className="inline-flex items-center gap-2 whitespace-nowrap">
                Browse All Products
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* ================================================================== */}
      {/* Why Choose Us */}
      {/* ================================================================== */}
      <section className="section-padding bg-neutral-50" aria-labelledby="why-heading">
        <div className="container-site">
          <div className="section-header">
            <span className="section-eyebrow">Why choose us</span>
            <h2 id="why-heading" className="text-page text-neutral-900">
              Why Choose Leesa Power Systems
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col items-start gap-4 p-6 bg-white rounded-lg border border-neutral-100">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Enquiry CTA */}
      {/* ================================================================== */}
      <section
        className="bg-primary-700 py-14"
        aria-labelledby="cta-heading"
      >
        <div className="container-site text-center">
          <h2 id="cta-heading" className="text-page text-white mb-3">
            Need Help Choosing the Right System?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
            Our team is available on WhatsApp to help you select the right inverter, battery, or solar system for your home or business.
          </p>
          <Button variant="accent" size="xl" asChild>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessages.general)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp for product enquiry"
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Chat on WhatsApp Now
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
