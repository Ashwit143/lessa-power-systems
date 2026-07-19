// =============================================================================
// Product Service
// Abstracts all product data access. UI components never import Supabase
// or the static data file directly — they always go through this service.
//
// Data source priority:
//   1. Supabase (when NEXT_PUBLIC_SUPABASE_URL is configured)
//   2. Static seed data (for local dev / demo)
// =============================================================================

import type { Product, ProductCategory, PaginationInfo, ApiResponse } from "@/types";
import { unstable_cache, revalidateTag } from "next/cache";

export interface ProductFilters {
  category?: ProductCategory;
  subcategory?: string;
  featured?: boolean;
  status?: "draft" | "published";
  search?: string;
}

export interface ProductListResult {
  products: Product[];
  pagination: PaginationInfo;
}

// ---------------------------------------------------------------------------
// List products with optional filters and pagination
// ---------------------------------------------------------------------------
export const listProducts = unstable_cache(
  async (
    filters: ProductFilters = {},
    page = 1,
    pageSize = 12
  ): Promise<ProductListResult> => {
    return listProductsFromSupabase(filters, page, pageSize);
  },
  ["list-products-v2"],
  { revalidate: 86400, tags: ["products"] }
);

// ---------------------------------------------------------------------------
// Get a single product by slug
// ---------------------------------------------------------------------------
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    return getProductBySlugFromSupabase(slug);
  },
  ["get-product-by-slug-v2"],
  { revalidate: 86400, tags: ["products"] }
);

// ---------------------------------------------------------------------------
// Get featured products for homepage
// ---------------------------------------------------------------------------
export const getFeaturedProducts = unstable_cache(
  async (limit = 8): Promise<Product[]> => {
    return getFeaturedFromSupabase(limit);
  },
  ["get-featured-products-v4"],
  { revalidate: 86400, tags: ["products"] }
);

// ---------------------------------------------------------------------------
// Get products by category
// ---------------------------------------------------------------------------
export const getProductsByCategory = unstable_cache(
  async (category: ProductCategory): Promise<Product[]> => {
    return getByCategeoryFromSupabase(category);
  },
  ["get-products-by-category-v2"],
  { revalidate: 86400, tags: ["products"] }
);

// ---------------------------------------------------------------------------
// Get related products
// ---------------------------------------------------------------------------
export const getRelatedProducts = unstable_cache(
  async (
    productId: string,
    category: ProductCategory,
    limit = 4
  ): Promise<Product[]> => {
    return getRelatedFromSupabase(productId, category, limit);
  },
  ["get-related-products-v2"],
  { revalidate: 86400, tags: ["products"] }
);

// ---------------------------------------------------------------------------
// Search products
// ---------------------------------------------------------------------------
export const searchProducts = unstable_cache(
  async (query: string): Promise<Product[]> => {
    return searchFromSupabase(query);
  },
  ["search-products-v2"],
  { revalidate: 86400, tags: ["products"] }
);

// ---------------------------------------------------------------------------
// Get all product slugs (for static generation)
// ---------------------------------------------------------------------------
export const getAllProductSlugs = unstable_cache(
  async (): Promise<{ slug: string; category: string }[]> => {
    return getAllSlugsFromSupabase();
  },
  ["get-all-product-slugs"],
  { revalidate: 86400, tags: ["products"] }
);

// ===========================================================================
// Static data implementations
// ===========================================================================


// Supabase implementations
// ===========================================================================

import { staticSupabase } from "@/lib/supabase/static";
import { mapProduct, mapProductToDb } from "@/utils/mapper";

async function listProductsFromSupabase(
  filters: ProductFilters,
  page: number,
  pageSize: number
): Promise<ProductListResult> {
  let query = staticSupabase
    .from("products")
    .select("id, name, slug, category, short_description, featured_image, specs, featured, status, is_active", { count: "exact" });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.subcategory) query = query.eq("subcategory", filters.subcategory);
  if (filters.featured !== undefined) query = query.eq("featured", filters.featured);
  if (filters.status) {
    query = query.eq("status", filters.status);
  } else {
    query = query.eq("status", "published");
  }
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,category.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
    );
  }

  query = query.eq("is_active", true);

  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1).order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("[ProductService] Supabase error:", error.message);
    return {
      products: [],
      pagination: { page, pageSize, total: 0, totalPages: 0 },
    };
  }

  const total = count ?? 0;
  return {
    products: (data?.map(mapProduct) as Product[]) ?? [],
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getProductBySlugFromSupabase(slug: string): Promise<Product | null> {
  const { data, error } = await staticSupabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return mapProduct(data) as Product;
}

async function getFeaturedFromSupabase(limit: number): Promise<Product[]> {
  const { data, error } = await staticSupabase
    .from("products")
    .select("id, name, slug, category, short_description, featured_image, specs, featured, status, is_active")
    .eq("featured", true)
    .eq("is_active", true)
    .eq("status", "published")
    .limit(limit)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data?.map(mapProduct) as Product[]) ?? [];
}

async function getByCategeoryFromSupabase(category: ProductCategory): Promise<Product[]> {
  const { data, error } = await staticSupabase
    .from("products")
    .select("id, name, slug, category, short_description, featured_image, specs, featured, status, is_active")
    .eq("category", category)
    .eq("is_active", true)
    .eq("status", "published")
    .order("featured", { ascending: false });

  if (error) return [];
  return (data?.map(mapProduct) as Product[]) ?? [];
}

async function getRelatedFromSupabase(
  productId: string,
  category: ProductCategory,
  limit: number
): Promise<Product[]> {
  const { data, error } = await staticSupabase
    .from("products")
    .select("id, name, slug, category, short_description, featured_image, specs, featured, status, is_active")
    .eq("category", category)
    .neq("id", productId)
    .eq("is_active", true)
    .eq("status", "published")
    .limit(limit);

  if (error) return [];
  return (data?.map(mapProduct) as Product[]) ?? [];
}

async function searchFromSupabase(query: string): Promise<Product[]> {
  const { data, error } = await staticSupabase
    .from("products")
    .select("id, name, slug, category, short_description, featured_image, specs, featured, status, is_active, sku")
    .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,category.ilike.%${query}%,sku.ilike.%${query}%`)
    .eq("is_active", true)
    .eq("status", "published")
    .limit(6);

  if (error) return [];
  return (data?.map(mapProduct) as Product[]) ?? [];
}

async function getAllSlugsFromSupabase(): Promise<{ slug: string; category: string }[]> {
  const { data, error } = await staticSupabase
    .from("products")
    .select("slug, category")
    .eq("is_active", true)
    .eq("status", "published");

  if (error) return [];
  return (data as { slug: string; category: string }[]) ?? [];
}

// ---------------------------------------------------------------------------
// Admin-only: CRUD operations (requires service role key, server-side only)
// ---------------------------------------------------------------------------
export async function adminListProductsPaged(
  filters: ProductFilters = {},
  cursor?: { createdAt: string; id: string },
  direction: "next" | "prev" = "next",
  limit: number = 10
): Promise<ApiResponse<{ products: Product[]; totalCount: number; hasNext: boolean; hasPrev: boolean }>> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  // First, get total count with filters applied
  let countQuery = supabase.from("products").select("id", { count: "exact", head: true });
  
  if (filters.category) countQuery = countQuery.eq("category", filters.category);
  if (filters.status) countQuery = countQuery.eq("status", filters.status);
  if (filters.search) {
    countQuery = countQuery.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%,category.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }

  const { count } = await countQuery;
  const totalCount = count ?? 0;

  // Now, get the paginated data
  // We fetch limit + 1 to know if there's a next page
  let query = supabase.from("products").select("*").limit(limit + 1);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%,category.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }

  const isAscending = direction === "prev";

  if (cursor) {
    if (direction === "next") {
      // (created_at, id) < (cursor.createdAt, cursor.id)
      query = query.or(`created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`);
    } else {
      // (created_at, id) > (cursor.createdAt, cursor.id)
      query = query.or(`created_at.gt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.gt.${cursor.id})`);
    }
  }

  query = query.order("created_at", { ascending: isAscending }).order("id", { ascending: isAscending });

  const { data, error } = await query;

  if (error) return { data: null, error: error.message, success: false };

  let products = (data?.map(mapProduct) as Product[]) ?? [];
  const hasMore = products.length > limit;

  if (hasMore) {
    products.pop(); // Remove the extra item
  }

  if (direction === "prev") {
    products = products.reverse(); // Reverse back to DESC order
  }

  // If there's no cursor, we are on page 1, so hasPrev is false. 
  // hasNext is true if hasMore is true.
  // If direction === 'next', hasPrev is true (since we moved forward), hasNext is hasMore.
  // If direction === 'prev', hasNext is true (since we moved backward from something), hasPrev is hasMore.
  
  const hasNext = direction === "next" ? hasMore : true;
  const hasPrev = cursor ? (direction === "prev" ? hasMore : true) : false;

  return {
    data: {
      products,
      totalCount,
      hasNext,
      hasPrev,
    },
    error: null,
    success: true,
  };
}

export async function adminListAllProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
  // Legacy function just in case
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  let query = supabase.from("products").select("*");
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%,category.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }
  query = query.order("created_at", { ascending: false }).order("id", { ascending: false });
  const { data, error } = await query;
  if (error) return { data: null, error: error.message, success: false };
  return { data: (data?.map(mapProduct) as Product[]) ?? [], error: null, success: true };
}


export async function adminGetProductById(id: string): Promise<ApiResponse<Product>> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message, success: false };
  return { data: mapProduct(data) as Product, error: null, success: true };
}

export async function adminCreateProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Product>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const dbPayload = mapProductToDb({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

  const { data, error } = await supabase
    .from("products")
    .insert(dbPayload)
    .select()
    .single();

  if (error) return { data: null, error: error.message, success: false };
  revalidateTag("products");
  return { data: data as Product, error: null, success: true };
}

export async function adminUpdateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const dbPayload = mapProductToDb({ ...updates, updatedAt: new Date().toISOString() });

  const { data, error } = await supabase
    .from("products")
    .update(dbPayload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message, success: false };
  revalidateTag("products");
  return { data: data as Product, error: null, success: true };
}

export async function adminDeleteProduct(id: string): Promise<ApiResponse<null>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { data: null, error: error.message, success: false };
  revalidateTag("products");
  return { data: null, error: null, success: true };
}
