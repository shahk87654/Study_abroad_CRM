require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testTable() {
  try {
    console.log('🔍 Testing students table...');

    const result = await supabase
      .from('students')
      .select('count', { count: 'exact', head: true });
    
    console.log('Full result:', JSON.stringify(result, null, 2));
    const { data, error } = result;

    if (error) {
      if (error.code === 'PGRST205') {
        console.log('❌ Students table does NOT exist');
        console.log('\n📋 You need to run the migration manually:');
        console.log('1. Go to https://app.supabase.com/project/caltowezhhosslopwqks');
        console.log('2. SQL Editor → New query');
        console.log('3. Paste the entire contents of supabase/migrations/0001_global_grads_crm.sql');
        console.log('4. Click Run');
        return;
      }
      console.log('❌ Error:', error.message);
      return;
    }

    console.log('✅ Students table exists!');
    console.log(`📊 Current record count: ${data || 0}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testTable();