
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

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  let missingCount = 0;
  for (const p of data) {
    if (!p.featured_image) {
      console.log('Missing featured_image for: ' + p.name + ' (' + p.id + ')');
      missingCount++;
    } else {
      console.log('Found: ' + p.name + ' -> ' + p.featured_image.substring(0, 50));
    }
  }
  console.log('Total products: ' + data.length + ', Missing featured_image: ' + missingCount);
}

main();

