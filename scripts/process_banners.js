const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const bannersDir = path.join(__dirname, '../public/banners');
const files = fs.readdirSync(bannersDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));

async function processBanners() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(bannersDir, file);
    const outputPath = path.join(bannersDir, `hero-${i + 1}.webp`);
    
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    console.log(`Converted ${file} to hero-${i + 1}.webp`);
    
    // Optionally delete original to keep it clean
    fs.unlinkSync(inputPath);
  }
}

processBanners().catch(console.error);
