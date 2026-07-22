import * as xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function run() {
  const filePath = 'public/UPS & BATTERY COMBO.xlsx';
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<any>(worksheet, { defval: '' });

  let processed = 0;
  let updated = 0;
  let created = 0;
  let skipped = 0;
  let unmatched = 0;

  // First fetch all products to easily match them in memory
  const { data: allProducts, error } = await supabase.from('products').select('id, name, slug, sku, category');
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  for (const row of data) {
    processed++;
    const upsModel = row['UPS MODEL']?.toString().trim() || '';
    const batteryModel = row['BATTERY MODEL']?.toString().trim() || '';
    const va = row['VA']?.toString().trim() || '';
    const warranty = row['UPS&BATTERY WARRANTY']?.toString().trim() || '';
    const priceStr = row['PRICE']?.toString().replace(/[^0-9.]/g, '') || '0';
    const price = parseFloat(priceStr);

    if (!upsModel || !batteryModel) {
      skipped++;
      continue;
    }

    const productName = `${upsModel} + ${batteryModel}`;
    const generatedSlug = slugify(productName);

    // Matching logic
    let matchedProduct = null;
    
    // 1. Slug match
    matchedProduct = allProducts.find((p: any) => p.slug === generatedSlug);
    
    // 2. Product Name match
    if (!matchedProduct) {
      matchedProduct = allProducts.find((p: any) => p.name.toLowerCase() === productName.toLowerCase());
    }

    if (matchedProduct) {
      // Update product category only
      if (matchedProduct.category !== 'combo') {
        const { error: updateError } = await supabase
          .from('products')
          .update({ category: 'combo' })
          .eq('id', matchedProduct.id);
        
        if (updateError) {
          console.error(`Error updating product ${productName}:`, updateError);
        } else {
          updated++;
        }
      } else {
        // already in Combos
        updated++;
      }
    } else {
      // Create missing product
      unmatched++;
      // Specs JSON
      const specsArray = [];
      if (va) specsArray.push({ label: 'VA', value: va });
      if (warranty) specsArray.push({ label: 'Warranty', value: warranty });

      const newProduct = {
        name: productName,
        slug: generatedSlug,
        category: 'combo',
        is_active: true,
        status: 'published',
        price_range: price > 0 ? `₹${price.toLocaleString('en-IN')}` : null,
        specs: specsArray.length > 0 ? JSON.stringify(specsArray) : null,
        short_description: `Combo pack including ${upsModel} and ${batteryModel}`,
        featured_image: '',
        description: `This combo package includes the ${upsModel} and ${batteryModel}, providing a comprehensive power solution with a ${warranty}.`
      };

      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert([newProduct])
        .select('id, name, slug, sku, category');

      if (insertError) {
        console.error(`Error creating product ${productName}:`, insertError);
      } else {
        created++;
        if (inserted && inserted.length > 0) {
          allProducts.push(inserted[0]);
        }
      }
    }
  }

  console.log(`\n--- FINAL SUMMARY ---`);
  console.log(`Total rows processed: ${processed}`);
  console.log(`Existing products updated: ${updated}`);
  console.log(`New Combo products created: ${created}`);
  console.log(`Products skipped: ${skipped}`);
  console.log(`Unmatched products (created new): ${unmatched}`);
}

run();
