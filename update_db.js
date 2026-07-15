const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const productsFile = path.join(process.cwd(), 'src/data/products.ts');
  let productsContent = fs.readFileSync(productsFile, 'utf8');
  const match = productsContent.match(/(export const PLACEHOLDER_PRODUCTS: Product\[\] = )(\[[\s\S]*?\n\])(\s*;)/);
  const products = JSON.parse(match[2]);
  
  const inverterMap = new Map();
  for (const p of products) {
    if (p.category === 'inverter') {
      inverterMap.set(p.slug, {
        featured_image: p.featuredImage,
        gallery: p.gallery
      });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Updating Supabase database...');
  let dbUpdates = 0;
  
  for (const [slug, data] of inverterMap.entries()) {
    const { error } = await supabase
      .from('products')
      .update({
        featured_image: data.featured_image,
        gallery: data.gallery
      })
      .eq('slug', slug);
      
    if (error) {
      console.error('Error updating ' + slug + ':', error.message);
    } else {
      dbUpdates++;
    }
  }
  console.log('Successfully updated ' + dbUpdates + ' rows in Supabase.');

  const seedFile = path.join(process.cwd(), 'supabase/catalog_seed.sql');
  let sql = fs.readFileSync(seedFile, 'utf8');
  const lines = sql.split('\n');
  let seedUpdates = 0;
  
  const newLines = lines.map(line => {
    if (line.startsWith('INSERT INTO products ')) {
      const slugMatch = line.match(/VALUES \('[^']+', '([^']+)'/);
      if (slugMatch) {
        const slug = slugMatch[1];
        if (inverterMap.has(slug)) {
          const data = inverterMap.get(slug);
          let newLine = line.replace(/('(?:\/images\/products\/|\/images\/categories\/)[^']+?')/, "'" + data.featured_image + "'");
          newLine = newLine.replace(/('\["(?:\/images\/products\/|\/images\/categories\/)[^"]+?"\]')/, "'[\"" + data.featured_image + "\"]'");
          if (newLine !== line) {
            seedUpdates++;
          }
          return newLine;
        }
      }
    }
    return line;
  });
  
  fs.writeFileSync(seedFile, newLines.join('\n'));
  console.log('Updated ' + seedUpdates + ' products in catalog_seed.sql');
}

run();
