import { createClient } from '@supabase/supabase-js';

const url = 'https://lcjxrtusjizjhqmshxba.supabase.co';
const key = 'sb_publishable_nGEm03cwf0YbeYrgtMsOwg_YdTcAQiM';
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('settings').select('*').limit(1);
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
