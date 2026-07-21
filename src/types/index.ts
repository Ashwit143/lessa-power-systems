// =============================================================================
// Leesa Power Systems — Shared TypeScript Interfaces
// All domain types are defined here and reused across the app, services, and
// admin dashboard. Zod schemas in src/schemas/ mirror these interfaces.
// =============================================================================

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductCategory = "battery" | "inverter" | "solar" | "combo";

export type ProductStatus = "draft" | "published";

export interface Product {
  // Identity
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  features?: string[];

  // Categorization
  category: ProductCategory;
  subcategory?: string;
  tags?: string[];

  // Images
  featuredImage: string;
  gallery?: string[];

  // Technical Specifications
  specs: ProductSpec[];
  useCases?: string[];
  pdfDatasheet?: string;

  // Status & Visibility
  status: ProductStatus;
  featured?: boolean;
  isActive: boolean;

  // Commerce (optional — reserved for future phases)
  sku?: string;
  priceRange?: string; // e.g. "₹8,000–₹12,000" — only set if client confirms
  stockStatus?: "in_stock" | "out_of_stock" | "on_request";

  // SEO
  seoTitle?: string;
  metaDescription?: string;
  altText?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;

  // Demo flag — set true on all placeholder catalog items
  isDemo?: boolean;

  // Best seller
  isBestSeller?: boolean;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  valueProp: string; // 1-line value proposition shown on category tile
  icon: string; // Lucide icon name
  featuredImage: string;
  productCount?: number;
  isActive: boolean;
  sortOrder: number;
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------
export interface Banner {
  id: string;
  slug: string;
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  imageMobile?: string; // Optional separate mobile crop
  overlayOpacity?: number; // 0–100
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Lead (Solar Enquiry)
// ---------------------------------------------------------------------------
export type MonthlyBillRange =
  | "below_1000"
  | "1000_3000"
  | "3000_6000"
  | "6000_10000"
  | "above_10000";

export type LeadStatus = "new" | "contacted" | "converted" | "closed";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  monthlyBillRange?: MonthlyBillRange;
  message?: string;
  source: "solar_page" | "contact_form" | "whatsapp_cta";
  status: LeadStatus;
  ipAddress?: string; // Collected server-side for spam filtering
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Business Information
// ---------------------------------------------------------------------------
export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessInfo {
  name: string;
  established: number;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  phones: readonly string[];
  whatsappNumber: string; // Primary WhatsApp contact
  email: string;
  website: string;
  socialLinks: {
    instagram?: string; // [PLACEHOLDER — awaiting client]
    facebook?: string; // [PLACEHOLDER — awaiting client]
    youtube?: string;
  };
  googleMapsEmbedUrl?: string; // [PLACEHOLDER — awaiting client]
  googleMapsUrl?: string;
  stats: {
    customers: string;
    dealers: string;
    yearsEstablished: string;
  };
  serviceAreas: readonly string[];
  businessHours: readonly BusinessHours[];
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "solar" | "battery" | "inverter" | "general" | "ordering";
  sortOrder: number;
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalBanners: number;
  activeBanners: number;
  totalLeads: number;
  newLeads: number;
  categories: number;
}

export interface RecentActivity {
  id: string;
  type: "product_added" | "product_updated" | "product_deleted" | "banner_updated" | "lead_received";
  description: string;
  timestamp: string;
  userId?: string;
}

// ---------------------------------------------------------------------------
// UI / Utility
// ---------------------------------------------------------------------------
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ---------------------------------------------------------------------------
// Cart (client-side only — not persisted to Supabase)
// ---------------------------------------------------------------------------
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: ProductCategory;
  featuredImage: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
}
