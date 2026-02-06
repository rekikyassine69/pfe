const API_URL = 'http://localhost:4000';

async function test() {
  try {
    // First, register a new test user
    const testEmail = 'testuser' + Date.now() + '@example.com';
    console.log('1. Testing registration...');
    const registerRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nom: 'Test User',
        email: testEmail,
        password: 'testpass123'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('Register status:', registerRes.status);
    console.log('Register response:', JSON.stringify(registerData, null, 2));
    
    if (!registerData.token) {
      console.log('Registration failed');
      return;
    }
    
    const token = registerData.token;
    console.log('\nToken:', token.substring(0, 20) + '...');
    
    // Get user info
    console.log('\n2. Getting user info...');
    const meRes = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const userData = await meRes.json();
    console.log('GET /me status:', meRes.status);
    console.log('User data:', JSON.stringify(userData, null, 2));
    
    // Try to update profile
    console.log('\n3. Updating profile...');
    const updateRes = await fetch(`${API_URL}/api/auth/me`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        nom: 'Updated Name',
        prenom: 'Updated First'
      })
    });
    
    const updateData = await updateRes.json();
    console.log('PATCH /me status:', updateRes.status);
    console.log('Update response:', JSON.stringify(updateData, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

test();

