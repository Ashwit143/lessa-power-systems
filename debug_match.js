const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// ============================================================================
// Normalization Engine
// ============================================================================
function normalize(str) {
  if (!str) return '';
  let s = str.toLowerCase();
  
  if (s.endsWith('.webp')) {
    s = s.slice(0, -5);
  }

  const wordsToRemove = ['luminous', 'solar', 'battery', 'inverter', 'inveter', 'grid tie', 'off grid', 'hybrid', 'series', 'copy', 'pro'];
  for (const w of wordsToRemove) {
    s = s.replace(new RegExp(`\\b${w}\\b`, 'g'), '');
  }
  
  s = s.replace(/[\s\-_+\[\]\(\)\.,]/g, '');
  
  return s.trim();
}

async function run() {
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products');
  const categories = ['inveters', 'batteries', 'solar'];
  const images = [];

  for (const cat of categories) {
    const catPath = path.join(baseDir, cat);
    if (fs.existsSync(catPath)) {
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.webp'));
      for (const file of files) {
        images.push({
          filename: file,
          normalized: normalize(file),
          path: `/images/products/${cat}/${file}`,
          category: cat
        });
      }
    }
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: products } = await supabase.from('products').select('id, name, slug, category, subcategory, featured_image');

  for (const p of products) {
    if (p.name.includes("Optimus 2800+")) {
       console.log("Found Optimus:", p.name, "Normalized:", normalize(p.name));
       const match = images.find(img => img.normalized === normalize(p.name));
       console.log("Match:", match);
       
       const img = images.find(img => img.filename === "optimus 2800+.webp");
       console.log("Optimus Image Normalized:", img ? img.normalized : "Not found!");
    }
  }
}
run();
