const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    // A known Luminous product URL
    const url = 'https://www.luminousindia.com/zelio-1100.html';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    const ogImage = $('meta[property="og:image"]').attr('content');
    console.log("og:image =", ogImage);
    
    // Also try finding all images
    const imgs = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.includes('lumprodsta.blob.core.windows.net')) {
        imgs.push(src);
      }
    });
    console.log("Found imgs length =", imgs.length);
    console.log(imgs.slice(0, 5));
  } catch (err) {
    console.error(err.message);
  }
})();
