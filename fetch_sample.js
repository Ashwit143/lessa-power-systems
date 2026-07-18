const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('products').select('id, name, slug, category, sku, featured_image').limit(20);
  console.log(JSON.stringify(data, null, 2));
}
run();
