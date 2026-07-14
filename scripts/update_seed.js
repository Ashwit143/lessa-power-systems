const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '../supabase/catalog_seed.sql');
const REPORT_FILE = path.join(__dirname, '../scratch/image_report.json');

if (!fs.existsSync(REPORT_FILE)) {
  console.error("No image_report.json found. Run fetch_images.js first.");
  process.exit(1);
}

const report = require(REPORT_FILE);
let sql = fs.readFileSync(SEED_FILE, 'utf8');
let updatedCount = 0;

const lines = sql.split('\n');
const newLines = lines.map(line => {
  if (line.startsWith('INSERT INTO products ')) {
    const match = line.match(/VALUES \('[^']+', '([^']+)', '([^']+)'/);
    if (match) {
      const slug = match[1];
      const name = match[2];
      
      if (report.matched.includes(name) || report.substitute.includes(name)) {
        // We know we downloaded the .webp image
        const imgPath = `/images/products/${slug}.webp`;
        // Replace the featured_image (it is preceded by the tags jsonb, so it's tricky with regex)
        // Let's do a simpler replace on the whole line assuming it currently has /images/products/slug.png
        
        let newLine = line.replace(/'\/images\/products\/[^']+\.png'/, `'/images/products/${slug}.webp'`);
        newLine = newLine.replace(/'\["\/images\/products\/[^"]+\.png"\]'::jsonb/, `'["/images/products/${slug}.webp"]'::jsonb`);
        
        // Also just in case it still has /images/categories/...
        newLine = newLine.replace(/'\/images\/categories\/[^']+'/, `'/images/products/${slug}.webp'`);
        newLine = newLine.replace(/'\["\/images\/categories\/[^"]+"\]'::jsonb/, `'["/images/products/${slug}.webp"]'::jsonb`);

        if (newLine !== line) {
          updatedCount++;
        }
        return newLine;
      }
    }
  }
  return line;
});

fs.writeFileSync(SEED_FILE, newLines.join('\n'));
console.log(`Updated ${updatedCount} products in catalog_seed.sql`);
