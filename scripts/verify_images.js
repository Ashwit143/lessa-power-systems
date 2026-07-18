const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, category, featured_image');

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    const report = [];
    let existingLocal = 0;
    let newlyMapped = 0;
    let newlyDownloaded = 0; // we haven't downloaded any yet
    let placeholderCount = 0;

    for (const p of products) {
        let status = 'Unknown';
        const img = p.featured_image;

        if (!img || img.includes('placeholder') || img.trim() === '') {
            status = 'Placeholder / Empty';
            placeholderCount++;
        } else {
            // Check if it exists locally
            const localPath = path.join(process.cwd(), 'public', img);
            if (fs.existsSync(localPath)) {
                // Determine if it was from the original mapping or new download
                // All our mapped images were in /images/products/
                if (img.startsWith('/images/products/')) {
                    status = 'Existing local image (Mapped)';
                    existingLocal++;
                } else {
                    status = 'Other local image';
                    existingLocal++;
                }
            } else {
                status = 'Missing Local File (Broken Link)';
                placeholderCount++; // broken link essentially
            }
        }

        report.push(`| ${p.name} | ${p.category} | ${img || 'NULL'} | ${status} |`);
    }

    console.log(`Total Products: ${products.length}`);
    console.log(`Existing Local / Mapped: ${existingLocal}`);
    console.log(`Placeholder / Empty / Broken: ${placeholderCount}`);

    let mdReport = `# Full Image Verification Report\n\n`;
    mdReport += `Generated on: ${new Date().toISOString()}\n\n`;
    mdReport += `| Product | Category | Featured Image | Status |\n`;
    mdReport += `|---|---|---|---|\n`;
    mdReport += report.join('\n');

    fs.writeFileSync(path.join(process.cwd(), 'reports', 'full_image_report.md'), mdReport);
    console.log("Report generated at reports/full_image_report.md");
}

run();
