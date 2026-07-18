const fs = require('fs');
const path = require('path');
const baseDir = path.join(process.cwd(), 'public', 'images', 'products');
const categories = ['inveters', 'batteries', 'solar'];
const images = [];

for (const cat of categories) {
  const catPath = path.join(baseDir, cat);
  if (fs.existsSync(catPath)) {
    const files = fs.readdirSync(catPath);
    console.log(`Cat ${cat} has ${files.length} files.`);
    for (const file of files) {
      if (file.endsWith('.webp')) images.push(file);
    }
  } else {
    console.log(`Cat ${cat} DOES NOT EXIST at ${catPath}`);
  }
}

console.log("Images found:", images.filter(i => i.includes('2800')));
