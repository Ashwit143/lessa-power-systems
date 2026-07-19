import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Buckets:", data.map(b => b.name));
    
    // Create products bucket if not exists
    if (!data.find(b => b.name === 'products')) {
      console.log("Creating 'products' bucket...");
      const { data: createData, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (createError) console.error("Error creating bucket:", createError);
      else console.log("Created bucket:", createData);
    }
  }
}

checkBuckets();
