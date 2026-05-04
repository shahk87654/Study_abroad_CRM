
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ADMIN_ID = "00000000-0000-0000-0000-000000000001";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "global-grads-local-admin-session-secret-change-before-production";

function base64UrlEncode(bytes) {
  return Buffer.from(bytes).toString('base64').replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function hmac(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest();
}

async function createToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `${ADMIN_ID}.${expiresAt}`;
  const signature = await hmac(payload);
  return `${expiresAt}.${base64UrlEncode(signature)}`;
}

async function testUpload() {
  const token = await createToken();
  const studentId = 'c2cfb6f7-4e73-4ef8-8599-d269b3c8f193';
  
  console.log('Using token:', token);
  
  const response = await fetch('http://localhost:3000/api/documents/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `gg_admin_session=${token}`
    },
    body: JSON.stringify({
      studentId,
      category: 'passport',
      fileName: 'test-doc.pdf',
      contentType: 'application/pdf'
    })
  });

  const data = await response.json();
  console.log('Response Status:', response.status);
  console.log('Response Data:', data);
}

testUpload();
