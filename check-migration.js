require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkAndApplyMigration() {
  try {
    console.log('Checking if students table exists...');

    // Try to select from students table
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST205') {
      console.log('❌ Students table does not exist. Migration needed.');
      console.log('\n📋 MANUAL STEPS REQUIRED:');
      console.log('1. Go to: https://app.supabase.com/project/caltowezhhosslopwqks');
      console.log('2. Click "SQL Editor"');
      console.log('3. Click "New query"');
      console.log('4. Copy and paste the entire contents of supabase/migrations/0001_global_grads_crm.sql');
      console.log('5. Click "Run"');
      console.log('\nAfter running the migration, run this script again to verify.');
      return;
    }

    if (data !== null) {
      console.log('✅ Students table exists! Migration appears to be applied.');
      return;
    }

  } catch (error) {
    console.error('Error checking table:', error.message);
  }
}

checkAndApplyMigration();