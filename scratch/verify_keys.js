require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Project URL:', url);

try {
    const payloadBase64 = key.split('.')[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    console.log('JWT Payload:', JSON.stringify(payload, null, 2));
    
    const urlRef = url.split('//')[1].split('.')[0];
    const keyRef = payload.ref;
    
    if (urlRef === keyRef) {
        console.log('✅ URL and Key project refs MATCH:', urlRef);
    } else {
        console.log('❌ URL and Key project refs MISMATCH!');
        console.log('URL ref:', urlRef);
        console.log('Key ref:', keyRef);
    }
} catch (e) {
    console.error('Failed to decode key:', e.message);
}
