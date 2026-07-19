import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SITE_CONFIG } from "@/lib/config";

export interface AppSettings {
  id: number;
  companyName: string;
  companyLogo: string | null;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  googleMapsLink: string | null;
}

export type SettingsUpdatePayload = Partial<Omit<AppSettings, "id">>;

/**
 * Fetches settings from Supabase, falling back to SITE_CONFIG if table is empty or missing.
 * Cached with Next.js unstable_cache, tagged with 'settings' for on-demand revalidation.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<AppSettings> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (!error && data) {
        return {
          id: data.id,
          companyName: data.company_name || SITE_CONFIG.businessName,
          companyLogo: data.company_logo || null,
          primaryPhone: data.primary_phone || SITE_CONFIG.primaryPhone,
          whatsappNumber: data.whatsapp_number || SITE_CONFIG.whatsappNumber,
          email: data.email || SITE_CONFIG.email,
          address: data.address || SITE_CONFIG.address.line1,
          workingHours: data.working_hours || "Mon - Sat: 10:00 AM - 8:30 PM",
          googleMapsLink: data.google_maps_link || SITE_CONFIG.googleMapsUrl,
        };
      }
    } catch (e) {
      console.warn("Failed to fetch settings from DB, falling back to SITE_CONFIG", e);
    }

    // Fallback if error or table missing
    return {
      id: 1,
      companyName: SITE_CONFIG.businessName,
      companyLogo: null,
      primaryPhone: SITE_CONFIG.primaryPhone,
      whatsappNumber: SITE_CONFIG.whatsappNumber,
      email: SITE_CONFIG.email,
      address: `${SITE_CONFIG.address.line1}, ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state} ${SITE_CONFIG.address.pincode}`,
      workingHours: "Mon - Sat: 10:00 AM - 8:30 PM",
      googleMapsLink: SITE_CONFIG.googleMapsUrl,
    };
  },
  ["site-settings"],
  {
    tags: ["settings"],
    revalidate: 3600 // Also revalidate hourly just in case
  }
);
