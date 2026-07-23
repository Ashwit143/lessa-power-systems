
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, featured_image, gallery');

  if (error) return;

  for (const p of data) {
    if (p.featured_image && p.featured_image.length > 5) {
      console.log(p.featured_image);
    }
  }
}

main();

