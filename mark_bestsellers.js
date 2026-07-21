const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

function normalizeForMatch(str) {
  if (!str) return '';
  let s = str.toLowerCase();
  
  // Custom normalization to align spreadsheet naming conventions with DB conventions
  
  // Inverters: "850EVO S SINEWAVE UPS" -> "EVO S 850"
  let evoMatch = s.match(/(\d+)evo\s*s/);
  if (evoMatch) {
    s = `evo s ${evoMatch[1]}`;
  }

  // Batteries: "150AH RC18000ST PRO SHORT TUBULAR BATTERY" -> "RC 18000ST PRO"
  // Remove AH prefixes
  s = s.replace(/^\d+ah\s+/, '');
  
  // Format specific battery series
  s = s.replace(/rc\s*18000st/i, 'rc 18000st');
  s = s.replace(/ilst\s*12042/i, 'ilst 12042');
  s = s.replace(/bc\s*16048/i, 'bc 16048');
  s = s.replace(/bc\s*18048/i, 'bc 18048');

  // Strip generic suffix words
  s = s.replace(/sinewave ups/i, '');
  s = s.replace(/short tubular battery/i, '');
  s = s.replace(/luminous/i, '');
  s = s.replace(/red charge/i, '');

  return s.replace(/[^a-z0-9]/g, '');
}

async function run() {
  const filePath = 'public/UPS & BATTERY COMBO.xlsx';
  console.log(`Reading Excel file: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const uniqueSpreadsheetProducts = new Set();
  
  data.forEach(row => {
    if (row['UPS MODEL'] && typeof row['UPS MODEL'] === 'string') {
      uniqueSpreadsheetProducts.add(row['UPS MODEL'].trim());
    }
    if (row['BATTERY MODEL'] && typeof row['BATTERY MODEL'] === 'string') {
      uniqueSpreadsheetProducts.add(row['BATTERY MODEL'].trim());
    }
  });

  const productsList = Array.from(uniqueSpreadsheetProducts).filter(Boolean);
  
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: dbProducts, error } = await supabase.from('products').select('id, name, slug, sku');
  
  if (error) {
    console.error("Error fetching products from DB:", error);
    return;
  }

  let matchedCount = 0;
  let updatedCount = 0;
  const unmatched = [];
  const matchedIds = new Set();

  for (const spreadsheetProduct of productsList) {
    const sNorm = normalizeForMatch(spreadsheetProduct);
    
    // Find matching products
    const match = dbProducts.find(p => {
      const pSlug = p.slug ? p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      const pSku = p.sku ? p.sku.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      const pName = normalizeForMatch(p.name);
      
      return pSlug === sNorm || pSku === sNorm || pName === sNorm;
    });

    if (match) {
      console.log(`Matched: "${spreadsheetProduct}" -> DB: "${match.name}"`);
      matchedCount++;
      if (!matchedIds.has(match.id)) {
        matchedIds.add(match.id);
        const { error: updateError } = await supabase
          .from('products')
          .update({ is_best_seller: true })
          .eq('id', match.id);
          
        if (!updateError) {
          updatedCount++;
        }
      }
    } else {
      unmatched.push(spreadsheetProduct);
    }
  }

  console.log("\n========== FINAL SUMMARY ==========");
  console.log(`Total products in spreadsheet (unique components): ${productsList.length}`);
  console.log(`Successfully matched: ${matchedCount}`);
  console.log(`Updated in database: ${updatedCount}`);
  console.log(`Unmatched: ${unmatched.length}`);
  
  if (unmatched.length > 0) {
    console.log("\n--- Unmatched Products ---");
    unmatched.forEach(p => console.log(`- ${p}`));
  }
}

run();
