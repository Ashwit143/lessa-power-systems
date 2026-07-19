import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data, error } = await supabase.rpc('get_tables'); // Or try selecting from pg_tables
  if (error) {
    const { data: qData, error: qError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
    console.log('Settings table select error:', qError?.message || 'Table exists');
  }
}

checkTables();
