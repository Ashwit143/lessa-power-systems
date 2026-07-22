import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: combos, error } = await supabase.from('products').select('id, specs').eq('category', 'combo');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const combo of combos) {
    if (typeof combo.specs === 'string') {
      try {
        const parsed = JSON.parse(combo.specs);
        await supabase.from('products').update({ specs: parsed }).eq('id', combo.id);
        console.log(`Updated ${combo.id}`);
      } catch (e) {
        console.error(`Failed to parse specs for ${combo.id}`);
      }
    } else {
        console.log(`Specs for ${combo.id} is not a string, skipping.`);
    }
  }
}

fix();
