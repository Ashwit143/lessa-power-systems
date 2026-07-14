import type { Banner } from "@/types";

const now = new Date().toISOString();

export const PLACEHOLDER_BANNERS: Banner[] = [
  {
    id: "banner-001",
    slug: "authorized-distributor",
    headline: "Hyderabad's Trusted Luminous Distributor",
    subheadline: "Genuine products, local service, 25,000+ satisfied customers since 2009",
    ctaText: "Explore Products",
    ctaHref: "/products",
    image: "/images/banners/banner-1.webp",
    imageMobile: "/images/banners/banner-1-mobile.webp",
    overlayOpacity: 45,
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    // Promotional slot — client to supply offer content
    id: "banner-002",
    slug: "promotion-slot",
    headline: "Special Offer", // [PLACEHOLDER — client to supply promotion details]
    subheadline: "Contact us on WhatsApp for current offers on Luminous inverters and batteries",
    ctaText: "Get Best Price on WhatsApp",
    ctaHref: "/products",
    image: "/images/banners/banner-2.webp",
    imageMobile: "/images/banners/banner-2-mobile.webp",
    overlayOpacity: 45,
    isActive: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
];
