const API_URL = 'http://localhost:4000';

async function testServer() {
  try {
    console.log('Testing health endpoint...');
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET'
    });
    
    const text = await response.text();
    console.log('Health Status:', response.status);
    console.log('Health Response:', text);
    
    return response.status === 200;
  } catch (error) {
    console.error('Server Error:', error.message);
    return false;
  }
}

async function testMe() {
  try {
    console.log('\n\nTesting GET /api/auth/me with invalid token...');
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer invalid_token' }
    });
    
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function run() {
  const healthy = await testServer();
  if (healthy) {
    await testMe();
  }
  process.exit(0);
}

run();
