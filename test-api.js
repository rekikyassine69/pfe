// Test API endpoints are accessible
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';

const collections = [
  'clients',
  'administrateurs',
  'potsConnectes',
  'historiqueMesures',
  'historiqueArrosage',
  'alertes',
  'cours',
  'progressionCours',
  'jeux',
  'scores',
  'produits',
  'commandes',
  'notifications'
];

async function testAPIEndpoints() {
  console.log('🌐 Testing API Endpoints...\n');
  console.log(`Base URL: ${API_URL}\n`);
  
  const results = [];
  
  for (const collection of collections) {
    try {
      const response = await fetch(`${API_URL}/api/collections/${collection}`);
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          collection,
          status: '✅',
          count: data.length,
          statusCode: response.status
        });
        console.log(`✅ ${collection.padEnd(25)} - ${data.length} documents (${response.status})`);
      } else {
        results.push({
          collection,
          status: '⚠️',
          count: 0,
          statusCode: response.status
        });
        console.log(`⚠️  ${collection.padEnd(25)} - HTTP ${response.status}`);
      }
    } catch (error) {
      results.push({
        collection,
        status: '❌',
        error: error.message
      });
      console.log(`❌ ${collection.padEnd(25)} - ${error.message}`);
    }
  }
  
  // Test auth endpoints
  console.log('\n🔐 Testing Auth Endpoints:\n');
  
  try {
    // Test login with a sample admin
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@plantcare.com',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(`✅ Login endpoint working - Token received`);
      
      // Test protected endpoint with token
      const meResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (meResponse.ok) {
        const userData = await meResponse.json();
        console.log(`✅ Protected endpoint working - User: ${userData.nom}`);
      } else {
        console.log(`⚠️  Protected endpoint - HTTP ${meResponse.status}`);
      }
    } else {
      console.log(`⚠️  Login endpoint - HTTP ${loginResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Auth endpoints - ${error.message}`);
  }
  
  // Summary
  console.log('\n📈 Summary:\n');
  console.log(`Total Endpoints Tested: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.status === '✅').length}`);
  console.log(`Warnings: ${results.filter(r => r.status === '⚠️').length}`);
  console.log(`Failed: ${results.filter(r => r.status === '❌').length}`);
  
  console.log('\n✅ API test completed!');
  console.log(`\n🚀 Frontend can access: http://localhost:5173`);
  console.log(`📡 Backend API running: ${API_URL}`);
}

testAPIEndpoints().catch(console.error);
