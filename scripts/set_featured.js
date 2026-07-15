const fs = require('fs');
const path = require('path');

const SQL_PATH = path.join(__dirname, '../supabase/catalog_seed.sql');
let sqlContent = fs.readFileSync(SQL_PATH, 'utf-8');

const featuredSlugs = [
  'luminous-zelio-1100', // or luminous-zelio-smart-1100
  'luminous-eco-volt-neo-1050',
  'luminous-red-charge-rc-18000-pro', // Popular battery
  'luminous-inverlast-iltt-20060', // Another popular battery
  'luminous-nxg-1150e', // Solar Inverter
  'luminous-topcon-bifacial-580w', // Solar panel
  'luminous-liftverter-5', // Liftverter
  'luminous-optimus-1250' // Or some other high capacity / premium
];

// If exact slugs aren't found, we can use regex to find the first match of these series
const seriesMatches = [
  /luminous-zelio-[a-z0-9-]+/,
  /luminous-eco-volt-neo-[a-z0-9-]+/,
  /luminous-red-charge-[a-z0-9-]+/,
  /luminous-inverlast-[a-z0-9-]+/,
  /luminous-nxg-[a-z0-9-]+/,
  /luminous-topcon-[a-z0-9-]+/,
  /luminous-liftverter-[a-z0-9-]+/,
  /luminous-optimus-[a-z0-9-]+/
];

const insertRegex = /INSERT INTO products \([^)]+\) VALUES \('([^']+)', '([^']+)',(.*?)\);/g;
const products = [];
let match;
while ((match = insertRegex.exec(sqlContent)) !== null) {
  products.push({
    slug: match[2],
    fullMatch: match[0],
    index: match.index
  });
}

const selectedProducts = new Set();

for (const regex of seriesMatches) {
  const matchedProduct = products.find(p => regex.test(p.slug) && !selectedProducts.has(p.slug));
  if (matchedProduct) {
    selectedProducts.add(matchedProduct.slug);
    console.log('Selected:', matchedProduct.slug);
    
    // In catalog_seed.sql, the end of the INSERT is typically:
    // 'published', false, true, '2026-07-14...', '2026-07-14...');
    // We need to replace the `false` (featured) with `true`
    // The exact format is: 'published', false, true,
    
    const originalText = matchedProduct.fullMatch;
    // Let's replace 'published', false, true, with 'published', true, true,
    let newText = originalText.replace(/'published', false, true,/, "'published', true, true,");
    
    // In case it's already true, or format is different:
    if (newText === originalText) {
      newText = originalText.replace(/, false, true, '20/, ", true, true, '20");
    }
    
    sqlContent = sqlContent.replace(originalText, newText);
  } else {
    console.log('Could not find match for', regex);
  }
}

fs.writeFileSync(SQL_PATH, sqlContent, 'utf-8');
console.log('Finished updating catalog_seed.sql');
