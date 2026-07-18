const { image_search } = require('duckduckgo-images-api');

async function testDDG() {
    try {
        console.log("Searching DDG images...");
        const results = await image_search({ query: "site:luminousindia.com Luminous EVO S 850", moderate: true });
        console.log("Found:", results.slice(0, 5));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testDDG();
