import { supabase } from './src/supabaseClient';

async function run() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error fetching buckets:", error);
  } else {
    console.log("Found buckets:", data?.map(b => b.name));
  }
}

run();
