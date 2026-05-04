require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
  try {
    // Try to query information_schema directly
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (error) {
      console.log('❌ Cannot query information_schema:', error.message);
    } else {
      console.log('📋 Tables in database:', data?.map(t => t.table_name) || 'None');
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
}

checkTables();