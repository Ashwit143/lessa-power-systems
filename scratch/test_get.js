require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, category, short_description, featured_image, specs, featured, status, is_active")
    .eq("featured", true)
    .eq("is_active", true)
    .eq("status", "published")
    .limit(8)
    .order("created_at", { ascending: false });
  console.log("Error:", error);
  console.log("Data length:", data?.length);
  if (data) console.log("Names:", data.map(d => d.name));
}
test();
