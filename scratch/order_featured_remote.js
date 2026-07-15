const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(url, key);

// The exact 8 products in the order we want them to appear (highest created_at first)
const orderedSlugs = [
  'luminous-zelio-1100', // or luminous-zelio-smart-1100 if base doesn't exist
  'luminous-eco-volt-neo-1050',
  'luminous-inverlast-iltt-18060-pro',
  'luminous-red-charge-rc-15000-pro',
  'luminous-nxg-850e',
  'luminous-topcon-bifacial-575w',
  'luminous-liftverter-5',
  'luminous-optimus-1250-plus'
];

async function run() {
  console.log("Resetting all featured to false...");
  await supabase.from('products').update({ featured: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  
  const now = new Date().getTime();
  
  console.log("Setting featured and ordering...");
  for (let i = 0; i < orderedSlugs.length; i++) {
    const slug = orderedSlugs[i];
    // We want the first item to have the highest created_at.
    // So we subtract i days from 'now'
    const createdAt = new Date(now - i * 1000 * 60 * 60 * 24).toISOString();
    
    let { data, error } = await supabase.from('products')
      .update({ featured: true, created_at: createdAt })
      .eq('slug', slug)
      .select('slug, name');
      
    // Fallback if base zelio isn't there
    if ((!data || data.length === 0) && slug === 'luminous-zelio-1100') {
      const fallback = 'luminous-zelio-smart-1100';
      console.log(`Fallback to ${fallback}`);
      let res = await supabase.from('products')
        .update({ featured: true, created_at: createdAt })
        .eq('slug', fallback)
        .select('slug, name');
      data = res.data;
    }
      
    if (data && data.length > 0) {
      console.log(`${i + 1}. Featured: ${data[0].name}`);
    } else {
      console.log(`Failed to feature: ${slug}`);
    }
  }
}

run();
