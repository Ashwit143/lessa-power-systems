
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, featured_image, gallery');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  let updatedCount = 0;
  for (const p of data) {
    if (!p.featured_image || p.featured_image.trim() === '') {
      const fallbackImage = '/images/categories/' + p.category + '.jpg';
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          featured_image: fallbackImage,
          gallery: [fallbackImage]
        })
        .eq('id', p.id);
        
      if (!updateError) {
        console.log('Updated ' + p.name + ' with ' + fallbackImage);
        updatedCount++;
      }
    }
  }
  console.log('Successfully updated ' + updatedCount + ' products with fallback images.');
}

main();

