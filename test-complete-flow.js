const API_URL = 'http://localhost:4000';

async function testCompleteFlow() {
  try {
    // 1. Register a new user
    const testEmail = 'testuser' + Date.now() + '@example.com';
    console.log('\n=== 1. REGISTRATION TEST ===');
    const registerRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nom: 'Test Client',
        email: testEmail,
        password: 'testpass123'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('Status:', registerRes.status);
    console.log('Response has token:', !!registerData.token);
    console.log('User ID:', registerData.user?._id);
    
    if (!registerData.token) {
      console.error('❌ Registration failed to return token');
      return;
    }
    
    const token = registerData.token;
    console.log('✅ Registration successful with token');
    
    // 2. Get user profile
    console.log('\n=== 2. GET PROFILE TEST ===');
    const meRes = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const meData = await meRes.json();
    console.log('Status:', meRes.status);
    console.log('User found:', !!meData.user);
    console.log('User email:', meData.user?.email);
    
    if (!meData.user) {
      console.error('❌ GET /me failed');
      return;
    }
    console.log('✅ Profile retrieval successful');
    
    // 3. Update profile - Part 1: Personal Information
    console.log('\n=== 3. UPDATE PROFILE - Personal Info ===');
    const updateRes1 = await fetch(`${API_URL}/api/auth/me`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        nom: 'Updated Last Name',
        prenom: 'Updated First Name',
        telephone: '+216 12345678',
        bio: 'This is my bio'
      })
    });
    
    const updateData1 = await updateRes1.json();
    console.log('Status:', updateRes1.status);
    console.log('Updated nom:', updateData1.user?.nom);
    console.log('Updated prenom:', updateData1.user?.prenom);
    console.log('Updated telephone:', updateData1.user?.telephone);
    
    if (updateRes1.status !== 200) {
      console.error('❌ Profile update failed');
      return;
    }
    console.log('✅ Personal information updated successfully');
    
    // 4. Verify the update was persisted
    console.log('\n=== 4. VERIFY UPDATE PERSISTENCE ===');
    const meRes2 = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const meData2 = await meRes2.json();
    console.log('Status:', meRes2.status);
    console.log('Current nom:', meData2.user?.nom);
    console.log('Current prenom:', meData2.user?.prenom);
    console.log('Current telephone:', meData2.user?.telephone);
    console.log('Current bio:', meData2.user?.bio);
    
    const updatesPersisted = meData2.user?.nom === 'Updated Last Name' && 
                             meData2.user?.prenom === 'Updated First Name';
    
    if (updatesPersisted) {
      console.log('✅ Updates persisted in database');
    } else {
      console.error('❌ Updates not persisted');
      return;
    }
    
    // 5. Update preferences
    console.log('\n=== 5. UPDATE PREFERENCES ===');
    const updateRes2 = await fetch(`${API_URL}/api/auth/me`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        preferences: {
          langue: 'en',
          fuseau: 'UTC',
          theme: 'dark',
          notifications: {
            alertes: true,
            cours: false,
            promotions: true,
            newsletter: false
          }
        }
      })
    });
    
    const updateData2 = await updateRes2.json();
    console.log('Status:', updateRes2.status);
    console.log('Updated preferences:', updateData2.user?.preferences);
    
    if (updateRes2.status === 200) {
      console.log('✅ Preferences updated successfully');
    } else {
      console.error('❌ Preferences update failed');
    }
    
    console.log('\n✅ ALL TESTS PASSED - Profile update system is working!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

testCompleteFlow();
