const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    console.log('--- Checking with explicit public schema ---');
    const { data: d1, error: e1 } = await supabase.schema('public').from('students').select('*').limit(1);
    if (e1) console.log('Public schema error:', e1.message);
    else console.log('Public schema success! Data:', d1);

    console.log('\n--- Checking without explicit schema ---');
    const { data: d2, error: e2 } = await supabase.from('students').select('*').limit(1);
    if (e2) console.log('Default schema error:', e2.message);
    else console.log('Default schema success! Data:', d2);
    
    console.log('\n--- Checking RPC for table list ---');
    // This might fail if rpc doesn't exist, but worth a shot
    const { data: d3, error: e3 } = await supabase.rpc('get_tables');
    if (e3) console.log('RPC error:', e3.message);
    else console.log('Tables:', d3);
}

checkSchema();
