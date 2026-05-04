require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function refreshSchema() {
  try {
    console.log('🔄 Attempting to refresh PostgREST schema cache...');

    // Try the NOTIFY command
    const { data, error } = await supabase.rpc('exec', {
      sql_string: "NOTIFY pgrst, 'reload schema'"
    });

    if (error) {
      console.log('❌ NOTIFY failed:', error.message);
    } else {
      console.log('✅ NOTIFY sent successfully');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test if it worked
    const testResult = await supabase.from('students').select('*').limit(1);
    if (testResult.error && testResult.error.code === 'PGRST205') {
      console.log('❌ Schema cache still not refreshed');
      console.log('\n🔧 MANUAL STEPS REQUIRED:');
      console.log('1. Go to https://app.supabase.com/project/caltowezhhosslopwqks');
      console.log('2. SQL Editor → New query');
      console.log('3. Run: NOTIFY pgrst, \'reload schema\'');
      console.log('4. Wait 30 seconds');
      console.log('5. Try the API again');
    } else {
      console.log('✅ Schema cache refreshed successfully!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

refreshSchema();