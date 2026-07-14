const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const products = require('../scratch/product_list.json');
const OUT_DIR = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log(`Starting image fetch for ${products.length} products...`);

  const report = {
    matched: [],
    substitute: [],
    missing: []
  };

  // Limit to 5 for now to test the logic, I'll remove the limit if it works
  const targetProducts = products.slice(0, 10); // just testing 10

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] Searching for: ${product.name}`);
    
    try {
      // Search DuckDuckGo
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent('site:luminousindia.com ' + product.name)}`;
      const searchRes = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      
      const $search = cheerio.load(searchRes.data);
      const firstLink = $search('.result__url').first().attr('href');
      
      let imageUrl = null;

      if (firstLink) {
        // Resolve DDG redirect URL
        const actualUrl = decodeURIComponent(firstLink.split('uddg=')[1]?.split('&')[0] || firstLink);
        console.log(`   -> Found URL: ${actualUrl}`);
        
        // Fetch product page
        const prodRes = await axios.get(actualUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
          }
        });
        
        const $prod = cheerio.load(prodRes.data);
        
        // Look for og:image first
        imageUrl = $prod('meta[property="og:image"]').attr('content');
        
        if (!imageUrl) {
          $prod('img').each((i, el) => {
            const src = $prod(el).attr('src') || $prod(el).attr('data-src');
            if (src && src.includes('lumprodsta.blob.core.windows.net') && !src.includes('icon') && !src.includes('logo')) {
              imageUrl = src;
              return false; // break
            }
          });
        }
      }
      
      if (!imageUrl) {
        // Fallback: search images directly using a free API or just mark as missing
        console.log(`   -> No matching image found.`);
        report.missing.push(product.name);
      } else {
        console.log(`   -> Found image: ${imageUrl}`);
        // Download and optimize
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        
        const outPath = path.join(OUT_DIR, `${product.slug}.webp`);
        await sharp(buffer)
          .webp({ quality: 80 })
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .toFile(outPath);
          
        console.log(`   -> Saved to ${product.slug}.webp`);
        report.matched.push(product.name);
      }
      
    } catch (err) {
      console.error(`   -> Error processing ${product.name}: ${err.message}`);
      report.missing.push(product.name);
    }
    
    await delay(3000); // 3s delay to avoid blocking DDG
  }

  // Save report
  fs.writeFileSync(path.join(__dirname, '../scratch/image_report.json'), JSON.stringify(report, null, 2));
  console.log('Finished processing images. Report saved to scratch/image_report.json');
}

run().catch(console.error);
