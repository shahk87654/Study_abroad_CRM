async function testStudentAPI() {
  const baseUrl = 'http://localhost:3000';

  console.log('👤 Creating test student...');

  const response = await fetch(`${baseUrl}/api/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: 'Test',
      last_name: 'Student',
      email: 'test' + Math.random().toString(36).substring(7) + '@example.com',
      phone: '+1234567890',
      country_preferences: ['Canada', 'Australia'],
      program_interest: 'Computer Science',
      intake_term: 'Fall 2024'
    }),
  });

  if (!response.ok) {
    console.log('❌ Student creation failed:', response.status, response.statusText);
    const error = await response.text();
    console.log('Error details:', error);
    return;
  }

  const studentData = await response.json();
  console.log('✅ Student created successfully!');
  console.log('📋 Student data:', JSON.stringify(studentData, null, 2));
}

testStudentAPI().catch(console.error);