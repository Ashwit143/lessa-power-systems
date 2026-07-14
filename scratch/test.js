const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    const res = await axios.get('https://www.luminousindia.com/search?q=Zelio%2B+1100', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    const imgs = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src) imgs.push(src);
    });
    console.log("Found images:");
    console.log(imgs.filter(src => src.match(/\.(jpg|jpeg|png|webp)/i)).slice(0, 15).join('\n'));
  } catch (err) {
    console.error(err);
  }
})();
