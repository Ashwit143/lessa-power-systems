const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT_DIR, 'scratch', 'extracted_pdf_images', 'index.json');
const IMAGES_DIR = path.join(ROOT_DIR, 'scratch', 'extracted_pdf_images');
const PUBLIC_PRODUCTS_DIR = path.join(ROOT_DIR, 'public', 'images', 'products');
const SQL_PATH = path.join(ROOT_DIR, 'supabase', 'catalog_seed.sql');

// Create public directory if not exists
if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
  fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
}

const indexData = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
let sqlContent = fs.readFileSync(SQL_PATH, 'utf-8');

// Parse products from SQL
const products = [];
const insertRegex = /INSERT INTO products \([^)]+\) VALUES \('([^']+)', '([^']+)', '([^']+)'(.*?)\);/g;

let match;
while ((match = insertRegex.exec(sqlContent)) !== null) {
  const [fullMatch, id, slug, name, rest] = match;
  
  // Try to extract capacity/specs from rest
  let specsText = "";
  const specsMatch = rest.match(/, '(\[.*?\])'::jsonb, '\[\]'::jsonb/);
  if (specsMatch) {
     specsText = specsMatch[1];
  }

  products.push({
    id,
    slug,
    name,
    originalText: fullMatch,
    nameNorm: name.toLowerCase().replace(/[^a-z0-9]/g, ' '),
    specs: specsText.toLowerCase()
  });
}

console.log(`Parsed ${products.length} products from SQL.`);

const mapped = [];
const unmapped = [];
const imageUsed = new Set();

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function calculateScore(product, image) {
  let score = 0;
  const pName = product.nameNorm;
  const pSlugParts = product.slug.split('-');
  const iText = normalize(image.detected_text);
  
  // Exact match of full name (without "Luminous" maybe)
  const nameWithoutBrand = pName.replace('luminous', '').trim();
  if (nameWithoutBrand && iText.includes(nameWithoutBrand)) {
    score += 100;
  }
  
  // Check parts of slug
  let partsMatched = 0;
  for (const part of pSlugParts) {
    if (part === 'luminous') continue;
    if (iText.includes(part)) {
      partsMatched++;
      score += 20;
    }
  }
  
  // If all meaningful parts matched
  const meaningfulParts = pSlugParts.filter(p => p !== 'luminous').length;
  if (meaningfulParts > 0 && partsMatched === meaningfulParts) {
    score += 50;
  }
  
  // Specs / Capacity match
  const specsMatches = [...product.specs.matchAll(/[0-9]+[k]?[vw]a?/g)];
  for (const m of specsMatches) {
    if (iText.includes(m[0])) {
      score += 30;
    }
  }

  // Exact number match (like '1100' or '5.5')
  const numbersInName = pName.match(/[0-9.]+/g);
  if (numbersInName) {
    for (const num of numbersInName) {
      // Must match as an isolated word/number in text
      const regex = new RegExp(`\\b${num}\\b`);
      if (regex.test(iText)) {
        score += 40;
      }
    }
  }

  return score;
}

// For each product, find the best matching image
for (const product of products) {
  let bestImage = null;
  let bestScore = 0;
  
  for (const image of indexData) {
    const score = calculateScore(product, image);
    if (score > bestScore) {
      bestScore = score;
      bestImage = image;
    }
  }
  
  if (bestImage && bestScore >= 70) {
    mapped.push({
      product,
      image: bestImage,
      score: bestScore
    });
    imageUsed.add(bestImage.filename);
  } else {
    unmapped.push({
      product,
      topScore: bestScore,
      topImage: bestImage ? bestImage.filename : null
    });
  }
}

console.log(`\n--- MAPPING REPORT ---`);
console.log(`✅ Successfully matched: ${mapped.length}`);
console.log(`❌ Unmatched / Low confidence: ${unmapped.length}`);

// Apply mappings
let updatedSql = sqlContent;
let appliedCount = 0;

for (const match of mapped) {
  const { product, image } = match;
  
  // Copy image
  const srcPath = path.join(IMAGES_DIR, image.filename);
  const destPath = path.join(PUBLIC_PRODUCTS_DIR, `${product.slug}.webp`);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    
    // Update SQL
    // We need to replace the featured_image and gallery fields in the specific INSERT statement
    // The original text looks like: ... '["tag"]'::jsonb, '/images/products/placeholder.png', '["/images/products/placeholder.png"]'::jsonb, ...
    // Because the user previously used placeholder images, we should find the exact row.
    
    // We can do a string replace on the specific product's full match
    const newImagePath = `/images/products/${product.slug}.webp`;
    let newText = product.originalText;
    
    // Replace featured_image
    newText = newText.replace(/, '\/images\/products\/[^']+', '\["\/images\/products\/[^"]+"\]'::jsonb,/, `, '${newImagePath}', '["${newImagePath}"]'::jsonb,`);
    
    // If the regex above didn't match (maybe it was .png or something), we can be more robust:
    // It's usually `tags'::jsonb, 'featured_image', 'gallery'::jsonb`
    newText = newText.replace(/(::jsonb, ')[^']+(', '\[")[^"]+("\]'::jsonb,)/, `$1${newImagePath}$2${newImagePath}$3`);
    
    updatedSql = updatedSql.replace(product.originalText, newText);
    appliedCount++;
  } else {
    console.error(`Source image not found: ${srcPath}`);
  }
}

fs.writeFileSync(SQL_PATH, updatedSql, 'utf-8');

console.log(`\nApplied ${appliedCount} updates to catalog_seed.sql and copied images.`);
console.log(`\nUnmapped Products (Need manual review):`);
unmapped.forEach(u => console.log(`- ${u.product.name} (Top score: ${u.topScore})`));
