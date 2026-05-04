require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
  try {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '0001_global_grads_crm.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration via Supabase API...');

    const { data, error } = await supabase.rpc('exec', { sql_string: sql });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

applyMigration();
