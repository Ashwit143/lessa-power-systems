const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Poor man's dotenv
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

const featuredSlugs = [
  'luminous-zelio-1100', // Note: falling back to base zelio just in case
  'luminous-zelio-smart-1100',
  'luminous-zelio-s-1150',
  'luminous-eco-volt-neo-1050',
  'luminous-eco-volt-neo-750',
  'luminous-red-charge-rc-15000-pro',
  'luminous-inverlast-iltt-18060-pro',
  'luminous-nxg-850e',
  'luminous-topcon-bifacial-575w',
  'luminous-liftverter-5',
  'luminous-optimus-1250-plus'
];

async function run() {
  console.log("Resetting all featured to false...");
  const { error: err1 } = await supabase.from('products').update({ featured: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  if (err1) {
    console.error("Error resetting:", err1);
    return;
  }
  
  console.log("Setting featured to true for selected products...");
  const { data, error: err2 } = await supabase.from('products')
    .update({ featured: true })
    .in('slug', featuredSlugs)
    .select('slug, featured, name, category');
    
  if (err2) {
    console.error("Error updating:", err2);
    return;
  }
  
  console.log(`Successfully updated ${data.length} products:`);
  data.forEach(p => console.log(`- ${p.name} (${p.category})`));
  
  // Now we need to limit to exactly 8, taking 2 from each category if possible
  // We can just set featured=false for the extras if data.length > 8
}

run();
