// =============================================================================
// Site Configuration — Single source of truth for all runtime constants.
// Update environment variables in .env.local to override defaults.
// NEVER hardcode these values directly in page or component files.
// =============================================================================

import type { BusinessInfo } from "@/types";

export const SITE_CONFIG = {
  // -------------------------------------------------------------------------
  // WhatsApp — configured via NEXT_PUBLIC_WHATSAPP_NUMBER env var
  // Default: 9347487107 (confirm primary WhatsApp number with client)
  // -------------------------------------------------------------------------
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919347487107",

  // -------------------------------------------------------------------------
  // Business Details (sourced from client's IndiaMART listing)
  // -------------------------------------------------------------------------
  businessName: "Leesa Power Systems",
  tagline: "Hyderabad's Trusted Luminous Distributor",
  established: 2009,
  email: "leesapowersystems@gmail.com",
  phones: ["7702778412", "9440698412"],
  // Primary display phone — update once client confirms
  primaryPhone: "9347487107",

  // -------------------------------------------------------------------------
  // Address (verbatim from client's IndiaMART listing)
  // -------------------------------------------------------------------------
  address: {
    line1: "H.No. 9-200/485, Plot No. 485",
    line2: "Road No. 1E, Near Akruthi's Venkatadri Towers, Nizampet",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500090",
    country: "India",
    full: "H.No. 9-200/485, Plot No. 485, Road No. 1E, Near Akruthi's Venkatadri Towers, Nizampet, Hyderabad, Telangana – 500090",
  },

  // -------------------------------------------------------------------------
  // Client-Provided Claims — display as brand claims, not independent fact
  // -------------------------------------------------------------------------
  stats: {
    customers: "25,000+",
    dealers: "500+",
    yearsEstablished: "Since 2009",
    yearsInBusiness: new Date().getFullYear() - 2009,
  },

  // -------------------------------------------------------------------------
  // Social Links — PLACEHOLDER: awaiting client confirmation
  // -------------------------------------------------------------------------
  socialLinks: {
    instagram: null as string | null, // [PLACEHOLDER — client to provide]
    facebook: null as string | null,  // [PLACEHOLDER — client to provide]
    youtube: null as string | null,
  },

  // -------------------------------------------------------------------------
  // Maps — PLACEHOLDER: awaiting client confirmation
  // -------------------------------------------------------------------------
  googleMapsEmbedUrl: null as string | null, // [PLACEHOLDER — client to provide]
  googleMapsUrl: "https://maps.google.com/?q=Nizampet,Hyderabad,Telangana",

  // -------------------------------------------------------------------------
  // Business Hours
  // -------------------------------------------------------------------------
  businessHours: [
    { day: "Monday – Saturday", open: "9:00 AM", close: "7:00 PM", closed: false },
    { day: "Sunday", open: "", close: "", closed: true },
  ],

  // -------------------------------------------------------------------------
  // Service Areas
  // -------------------------------------------------------------------------
  serviceAreas: [
    "Nizampet",
    "Kukatpally",
    "Bachupally",
    "Miyapur",
    "Kondapur",
    "Gachibowli",
    "Madhapur",
    "Hitech City",
    "Secunderabad",
    "Hyderabad & Twin Cities",
  ],

  // -------------------------------------------------------------------------
  // SEO Defaults
  // -------------------------------------------------------------------------
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://leesapowersystems.com",
  defaultOgImage: "/images/og-default.webp",

  // -------------------------------------------------------------------------
  // WhatsApp Message Defaults
  // -------------------------------------------------------------------------
  whatsappMessages: {
    general:
      "Hi, I'm interested in Luminous batteries/inverters/solar solutions. Please assist.",
    solarEnquiry:
      "Hi, I'd like to know more about solar installation in Hyderabad. Please contact me.",
    orderPrefix: "Hello Leesa Power Systems, I'd like to order:",
    orderSuffix: "\n\nPlease share pricing and availability. Sent via website.",
  },

  // -------------------------------------------------------------------------
  // Feature Flags (for future phases)
  // -------------------------------------------------------------------------
  features: {
    showPricing: false, // Set to true only after client confirms prices
    enableWishlist: false, // Reserved for future phase
    enableComparison: false, // Reserved for future phase
    enableCustomerAuth: false, // Reserved for future phase
    enableInventory: false, // Reserved for future phase
  },
} as const;

// ---------------------------------------------------------------------------
// Typed BusinessInfo export (used in JSON-LD structured data)
// ---------------------------------------------------------------------------
export const BUSINESS_INFO: BusinessInfo = {
  name: SITE_CONFIG.businessName,
  established: SITE_CONFIG.established,
  address: {
    line1: SITE_CONFIG.address.line1,
    line2: SITE_CONFIG.address.line2,
    city: SITE_CONFIG.address.city,
    state: SITE_CONFIG.address.state,
    pincode: SITE_CONFIG.address.pincode,
    country: SITE_CONFIG.address.country,
  },
  phones: SITE_CONFIG.phones,
  whatsappNumber: SITE_CONFIG.whatsappNumber,
  email: SITE_CONFIG.email,
  website: SITE_CONFIG.siteUrl,
  socialLinks: {
    instagram: SITE_CONFIG.socialLinks.instagram ?? undefined,
    facebook: SITE_CONFIG.socialLinks.facebook ?? undefined,
    youtube: SITE_CONFIG.socialLinks.youtube ?? undefined,
  },
  googleMapsEmbedUrl: SITE_CONFIG.googleMapsEmbedUrl ?? undefined,
  googleMapsUrl: SITE_CONFIG.googleMapsUrl,
  stats: SITE_CONFIG.stats,
  serviceAreas: SITE_CONFIG.serviceAreas,
  businessHours: SITE_CONFIG.businessHours,
};
