const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:4400/auth/signin', {
      email: 'admin@company.com',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    // Test admin jobs endpoint
    const jobsResponse = await axios.get('http://localhost:4400/job/companies/16/jobs', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });
    
    console.log('Jobs endpoint successful!');
    console.log('Jobs data:', jobsResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAdminLogin();
