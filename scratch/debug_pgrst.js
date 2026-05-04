const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
    console.log('Testing with select("count", { head: true })...');
    const res1 = await supabase.from('students').select('count', { count: 'exact', head: true });
    if (res1.error) {
        console.error('Test 1 failed:', res1.error.message);
    } else {
        console.log('Test 1 success! Count:', res1.data);
    }

    console.log('\nTesting with select("*").limit(1)...');
    const res2 = await supabase.from('students').select('*').limit(1);
    if (res2.error) {
        console.error('Test 2 failed:', res2.error.message);
    } else {
        console.log('Test 2 success! Data:', res2.data);
    }
}

runTests();
