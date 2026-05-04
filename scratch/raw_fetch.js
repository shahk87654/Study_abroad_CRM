require('dotenv').config();

async function rawTest() {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/students?select=*&limit=1`;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Fetching:', url);

    const res = await fetch(url, {
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
        }
    });

    console.log('Status:', res.status);
    console.log('Headers:', JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
    const body = await res.text();
    console.log('Body:', body);
}

rawTest();
