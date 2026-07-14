const fs = require('fs');
let lines = fs.readFileSync('supabase/catalog_seed.sql', 'utf8').split('\n');
const newLines = lines.map(line => {
  if (line.startsWith('INSERT INTO products ')) {
    const match = line.match(/VALUES \('[^']+', '([^']+)'/);
    if (match) {
      const slug = match[1];
      return line.replace(/'\/images\/categories\/[^']+'/, `'/images/products/${slug}.png'`)
                 .replace(/'\["\/images\/categories\/[^"]+"\]'::jsonb/, `'["/images/products/${slug}.png"]'::jsonb`);
    }
  }
  return line;
});
fs.writeFileSync('supabase/catalog_seed.sql', newLines.join('\n'));
console.log('Updated catalog_seed.sql');
