const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
  console.log("Starting Web Image Sourcing...\n");

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // Fetch products that do NOT have an official featured image yet
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, category, featured_image')
    .or('featured_image.is.null,featured_image.eq.,featured_image.like.%placeholder%');

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Found ${products.length} products needing images.`);

  const reports = [];
  const categoryMapping = { 'inverter': 'inverters', 'battery': 'batteries', 'solar': 'solar' };

  // Launch Puppeteer
  const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  // Speed up by aborting unnecessary requests
  await page.setRequestInterception(true);
  page.on('request', (req) => {
      if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
          req.abort();
      } else {
          req.continue();
      }
  });

  for (const p of products) {
    console.log(`Searching for: ${p.name}`);
    let sourceUrl = null;
    let imageUrl = null;
    let status = 'Not Found';
    let sourceName = 'Official Luminous';

    try {
        const query = encodeURIComponent(p.name.replace(/luminous/i, '').trim());
        const searchUrl = `https://www.luminousindia.com/catalogsearch/result/?q=${query}`;
        
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        // Wait briefly for SPA to render products
        await new Promise(resolve => setTimeout(resolve, 2000));

        imageUrl = await page.evaluate(() => {
            // Usually the first product image in the grid
            const img = document.querySelector('.product-image-photo');
            return img ? img.src : null;
        });

        if (imageUrl && !imageUrl.includes('placeholder') && !imageUrl.includes('saved-product-img.svg')) {
            sourceUrl = searchUrl;
        } else {
            imageUrl = null; // Reject placeholders
        }

    } catch (e) {
        console.log(`  - Error searching: ${e.message}`);
    }

    if (imageUrl) {
        try {
            console.log(`  - Found image: ${imageUrl}`);
            const expectedImageCategory = categoryMapping[p.category] || p.category;
            const dir = path.join(process.cwd(), 'public', 'images', 'products', expectedImageCategory);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const filename = `${p.slug}.webp`;
            const localPath = path.join(dir, filename);
            const dbPath = `/images/products/${expectedImageCategory}/${filename}`;

            // Download image buffer
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            
            // Convert to webp using sharp
            await sharp(response.data)
                .webp({ quality: 85 })
                .toFile(localPath);

            // Update Database
            await supabase
                .from('products')
                .update({ featured_image: dbPath })
                .eq('id', p.id);

            status = 'Downloaded';
            console.log(`  - Saved and updated DB: ${dbPath}`);
        } catch (e) {
            console.log(`  - Error downloading/processing: ${e.message}`);
            status = 'Failed Download';
        }
    } else {
        console.log(`  - No valid image found.`);
        status = 'Placeholder';
    }

    reports.push({
        product: p.name,
        source: imageUrl ? sourceName : 'Not Found',
        status: status
    });
  }

  await browser.close();

  // Generate Report
  console.log("\n================ REPORT ================\n");
  console.log("Product | Source | Status");
  console.log("--- | --- | ---");
  for (const r of reports) {
      console.log(`${r.product} | ${r.source} | ${r.status}`);
  }
  console.log("\n========================================\n");
}

run();
