import { z } from "zod";

// ---------------------------------------------------------------------------
// Product Spec
// ---------------------------------------------------------------------------
export const ProductSpecSchema = z.object({
  label: z.string().min(1, "Spec label is required"),
  value: z.string().min(1, "Spec value is required"),
});

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export const ProductCategorySchema = z.enum([
  "battery",
  "inverter",
  "solar",
  "combo",
]);

export const ProductStatusSchema = z.enum(["draft", "published"]);

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Product name is required").max(200),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(300),
  description: z.string().min(1, "Description is required"),

  category: ProductCategorySchema,
  subcategory: z.string().optional(),
  tags: z.array(z.string()).optional(),

  featuredImage: z.string().min(1, "Featured image is required"),
  gallery: z.array(z.string()).optional(),

  specs: z.array(ProductSpecSchema).min(1, "At least one spec is required"),
  useCases: z.array(z.string()).optional(),
  pdfDatasheet: z.string().url().optional().or(z.literal("")),

  status: ProductStatusSchema.default("draft"),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().default(true),

  // Commerce (reserved, optional)
  sku: z.string().optional(),
  priceRange: z.string().optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "on_request"]).optional(),

  // SEO
  seoTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  altText: z.string().max(200).optional(),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean().optional().default(false),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type ProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export const CategorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1, "Category name is required"),
  shortName: z.string().min(1),
  description: z.string().min(1),
  valueProp: z.string().min(1).max(150),
  icon: z.string().min(1),
  featuredImage: z.string().min(1),
  productCount: z.number().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------
export const BannerSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  headline: z.string().min(1, "Headline is required").max(100),
  subheadline: z.string().max(200).optional(),
  ctaText: z.string().min(1, "CTA text is required").max(50),
  ctaHref: z.string().min(1, "CTA link is required"),
  image: z.string().min(1, "Banner image is required"),
  imageMobile: z.string().optional(),
  overlayOpacity: z.number().min(0).max(100).optional().default(40),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateBannerSchema = BannerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateBannerSchema = CreateBannerSchema.partial();

export type BannerInput = z.infer<typeof CreateBannerSchema>;

// ---------------------------------------------------------------------------
// Lead
// ---------------------------------------------------------------------------
export const MonthlyBillRangeSchema = z.enum([
  "below_1000",
  "1000_3000",
  "3000_6000",
  "6000_10000",
  "above_10000",
]);

export const LeadStatusSchema = z.enum([
  "new",
  "contacted",
  "converted",
  "closed",
]);

export const LeadSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .regex(/^[a-zA-Z\s.'-]+$/, "Please enter a valid name"),
  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit mobile number"
    ),
  monthlyBillRange: MonthlyBillRangeSchema.optional(),
  message: z.string().max(500).optional(),
  source: z.enum(["solar_page", "contact_form", "whatsapp_cta"]),
  status: LeadStatusSchema.default("new"),
  ipAddress: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateLeadSchema = LeadSchema.omit({
  id: true,
  status: true,
  ipAddress: true,
  createdAt: true,
  updatedAt: true,
});

export type LeadInput = z.infer<typeof CreateLeadSchema>;

// ---------------------------------------------------------------------------
// Contact Form (distinct from Lead — general callback request)
// ---------------------------------------------------------------------------
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .regex(/^[a-zA-Z\s.'-]+$/, "Please enter a valid name"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  subject: z.string().min(1, "Please select a subject").max(100),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

// ---------------------------------------------------------------------------
// Admin Login
// ---------------------------------------------------------------------------
export const AdminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

// ---------------------------------------------------------------------------
// Solar Lead Form (used on /solar page)
// ---------------------------------------------------------------------------
export const SolarLeadFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .regex(/^[a-zA-Z\s.'-]+$/, "Please enter a valid name"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  monthlyBillRange: MonthlyBillRangeSchema.optional(),
});

export type SolarLeadFormInput = z.infer<typeof SolarLeadFormSchema>;

// ---------------------------------------------------------------------------
// File Upload Validation
// ---------------------------------------------------------------------------
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB pre-optimization
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ImageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_IMAGE_SIZE_BYTES, "Image must be under 5MB")
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Only JPEG, PNG, and WebP images are accepted"
    ),
});
