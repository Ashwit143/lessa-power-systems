const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// ============================================================================
// Advanced Normalization & Matching Engine
// ============================================================================
function normalizeAndExtract(str) {
  if (!str) return { normalized: '', words: [], modelNumbers: [] };
  let s = str.toLowerCase();
  
  if (s.endsWith('.webp')) {
    s = s.slice(0, -5);
  }

  // Remove generic words
  const wordsToRemove = [
    'luminous', 'solar', 'battery', 'inverter', 'inveter', 'ups', 'series', 
    'home', 'commercial', 'grid tie', 'off grid', 'hybrid', 'copy', 'pro', 'eco'
  ];
  for (const w of wordsToRemove) {
    s = s.replace(new RegExp(`\\b${w}\\b`, 'g'), ' ');
  }

  // Extract potential model numbers/capacities (e.g., 2800, 5kw, 7.5kva, 1206nm, 1250+)
  const modelRegex = /\d+(?:\.\d+)?(?:kw|kva|w|v|ah|nm|e|h|l|p|\+)?/g;
  const rawModels = str.toLowerCase().match(modelRegex) || [];
  const modelNumbers = [...new Set(rawModels)];

  // Further normalize: remove all punctuation but keep alphanumeric and spaces
  let cleanString = s.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  let words = cleanString.split(' ').filter(w => w.length > 0);
  
  // Create a completely squashed string for exact matching
  let squashed = cleanString.replace(/\s+/g, '');

  return {
    normalized: squashed, // e.g. "optimus2800"
    words: words,         // e.g. ["optimus", "2800"]
    modelNumbers: modelNumbers // e.g. ["2800+"] (from raw string)
  };
}

// Jaccard Index for words
function getSimilarity(wordsA, wordsB) {
  if (wordsA.length === 0 && wordsB.length === 0) return 1;
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

// Main scoring function
function calculateConfidence(productInfo, imageInfo) {
  let score = 0;
  
  // 1. Exact squashed match (highest confidence)
  if (productInfo.normalized === imageInfo.normalized && productInfo.normalized.length > 0) {
    return 100;
  }
  
  // 2. Substring squashed match (e.g. filename is subset of slug)
  if (productInfo.normalized.length > 4 && imageInfo.normalized.length > 4) {
      if (productInfo.normalized.includes(imageInfo.normalized) || imageInfo.normalized.includes(productInfo.normalized)) {
          score += 40;
      }
  }

  // 3. Model number match
  let sharedModels = 0;
  for (const m of productInfo.modelNumbers) {
    if (imageInfo.modelNumbers.includes(m)) sharedModels++;
  }
  if (productInfo.modelNumbers.length > 0 && sharedModels === productInfo.modelNumbers.length) {
      score += 50; // All product model numbers exist in image
  } else if (sharedModels > 0) {
      score += 25; // At least one model number matches
  }
  
  // 4. Word similarity (Jaccard)
  const sim = getSimilarity(productInfo.words, imageInfo.words);
  score += (sim * 30);
  
  return score;
}

// ============================================================================
// Main Script
// ============================================================================
async function run() {
  console.log("Starting Advanced Image Mapping Process...\n");
  
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products');
  const categories = ['inverters', 'batteries', 'solar']; 
  const images = [];

  // Read images
  for (const cat of categories) {
    const catPath = path.join(baseDir, cat);
    if (fs.existsSync(catPath)) {
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.webp'));
      for (const file of files) {
        images.push({
          filename: file,
          path: `/images/products/${cat}/${file}`,
          category: cat,
          info: normalizeAndExtract(file)
        });
      }
    }
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: products, error } = await supabase.from('products').select('id, name, slug, category, subcategory, featured_image, sku');

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  let matchedCount = 0;
  let alreadyCorrectCount = 0;
  let unmatchedCount = 0;
  const updates = [];
  const reports = [];

  for (const p of products) {
    // Generate info from both name and slug
    const nameInfo = normalizeAndExtract(p.name);
    const slugInfo = normalizeAndExtract(p.slug);
    
    // Combine model numbers and words from both to maximize matching potential
    const combinedInfo = {
        normalized: nameInfo.normalized, // Favor name for exact match
        words: [...new Set([...nameInfo.words, ...slugInfo.words])],
        modelNumbers: [...new Set([...nameInfo.modelNumbers, ...slugInfo.modelNumbers])]
    };

    let bestCandidate = null;
    let highestScore = 0;

    // Filter images by the exact same category to avoid cross-category false positives
    // Note: product category might be 'inverter' while image folder is 'inverters'
    const categoryMapping = { 'inverter': 'inverters', 'battery': 'batteries', 'solar': 'solar' };
    const expectedImageCategory = categoryMapping[p.category] || p.category;
    
    const candidateImages = images.filter(img => img.category === expectedImageCategory);

    for (const img of candidateImages) {
        let score = calculateConfidence(combinedInfo, img.info);
        if (score > highestScore) {
            highestScore = score;
            bestCandidate = img;
        }
    }

    // Threshold for acceptance
    // A score >= 50 means we likely hit a model number match or very high word similarity
    if (bestCandidate && highestScore >= 45) {
      if (p.featured_image === bestCandidate.path) {
        alreadyCorrectCount++;
      } else {
        updates.push({ id: p.id, featured_image: bestCandidate.path, name: p.name });
        matchedCount++;
      }
    } else {
      unmatchedCount++;
      reports.push({
          name: p.name,
          slug: p.slug,
          closestCandidate: bestCandidate ? bestCandidate.filename : 'None found in category',
          score: highestScore
      });
    }
  }

  console.log(`================ SUMMARY ================`);
  console.log(`Total products: ${products.length}`);
  console.log(`Successfully mapped (needs update): ${matchedCount}`);
  console.log(`Already correct: ${alreadyCorrectCount}`);
  console.log(`Remaining unmatched: ${unmatchedCount}`);
  console.log(`=========================================\n`);

  if (reports.length > 0) {
    console.log(`--- Unmatched Products Review ---`);
    for (const r of reports) {
      console.log(`[Score: ${r.score.toFixed(1)}] ${r.name} -> Closest: ${r.closestCandidate}`);
    }
    console.log(`---------------------------------\n`);
  }

  if (updates.length > 0) {
    console.log(`Updating ${updates.length} records in Supabase...`);
    let successCount = 0;
    
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          featured_image: update.featured_image,
          gallery: [update.featured_image]
        })
        .eq('id', update.id);
        
      if (!updateError) successCount++;
    }
    console.log(`Successfully updated ${successCount}/${updates.length} records.\n`);
  }
}

run();
