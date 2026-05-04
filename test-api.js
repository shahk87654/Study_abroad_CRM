require('dotenv').config();

async function testAPI() {
  const baseUrl = 'http://localhost:3000';

  console.log('🔐 Logging in as admin...');

  // Login as admin
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'testadmin@globalgrads.local',
      password: 'GlobalGrads123!' // Correct admin password
    }),
  });

  if (!loginResponse.ok) {
    console.log('❌ Login failed:', loginResponse.status, loginResponse.statusText);
    const error = await loginResponse.text();
    console.log('Error details:', error);
    return;
  }

  const loginData = await loginResponse.json();
  console.log('✅ Login successful:', loginData);

  // Get the session cookie
  const cookie = loginResponse.headers.get('set-cookie');
  if (!cookie) {
    console.log('❌ No session cookie received');
    return;
  }

  console.log('🍪 Session cookie received');
  console.log('Cookie details:', cookie);

  // Extract cookie name and value
  const cookieMatch = cookie.match(/gg_admin_session=([^;]+)/);
  if (!cookieMatch) {
    console.log('❌ Could not extract session cookie');
    return;
  }

  const sessionCookie = cookieMatch[1];
  console.log('Session token starts with:', sessionCookie.substring(0, 20) + '...');

  console.log('👤 Creating test student...');

  // Create a student
  const studentResponse = await fetch(`${baseUrl}/api/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `gg_admin_session=${sessionCookie}`,
    },
    body: JSON.stringify({
      first_name: 'Test',
      last_name: 'Student',
      email: 'test@example.com',
      phone: '+1234567890',
      country_preferences: ['Canada', 'Australia'],
      program_interest: 'Computer Science',
      intake_term: 'Fall 2024'
    }),
  });

  console.log('Student request status:', studentResponse.status);
  console.log('Student request headers sent:', {
    'Content-Type': 'application/json',
    'Cookie': `gg_admin_session=${sessionCookie.substring(0, 20)}...`
  });

  if (!studentResponse.ok) {
    console.log('❌ Student creation failed:', studentResponse.status, studentResponse.statusText);
    const error = await studentResponse.text();
    console.log('Error details:', error);
    return;
  }

  const studentData = await studentResponse.json();
  console.log('✅ Student created successfully!');
  console.log('📋 Student data:', JSON.stringify(studentData, null, 2));
}

testAPI().catch(console.error);