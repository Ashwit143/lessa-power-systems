// =============================================================================
// Banner Service
// =============================================================================
import type { Banner, ApiResponse } from "@/types";
import { staticSupabase } from "@/lib/supabase/static";

import { mapBanner } from "@/utils/mapper";

export async function getActiveBanners(): Promise<Banner[]> {
  const { data, error } = await staticSupabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[BannerService] Error fetching active banners:", error.message);
    return [];
  }
  return (data?.map(mapBanner) as Banner[]) ?? [];
}

export async function adminListBanners(): Promise<ApiResponse<Banner[]>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return { data: null, error: error.message, success: false };
  return { data: (data?.map(mapBanner) as Banner[]) ?? [], error: null, success: true };
}

export async function adminUpdateBanner(
  id: string,
  updates: Partial<Banner>
): Promise<ApiResponse<Banner>> {


  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message, success: false };
  return { data: mapBanner(data) as Banner, error: null, success: true };
}

