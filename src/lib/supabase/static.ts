import { createClient } from "@supabase/supabase-js";

// This client is used ONLY for SSG (Static Site Generation) functions
// like generateStaticParams, where `cookies()` from next/headers cannot be used.
export const staticSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);
