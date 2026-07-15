const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (data.includes('Top picks')) {
      console.log('Top Picks section found!');
    } else {
      console.log('Top Picks section MISSING!');
    }
    if (data.includes('Luminous Optimus 1250+')) {
      console.log('Product found!');
    } else {
      console.log('Product MISSING!');
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
