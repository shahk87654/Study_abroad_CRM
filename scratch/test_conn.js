const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing connection to:', supabaseUrl);
    const { data, error } = await supabase.from('students').select('*').limit(1);
    if (error) {
        console.error('Error fetching students:', error);
    } else {
        console.log('Successfully connected! Data:', data);
    }
}

test();
