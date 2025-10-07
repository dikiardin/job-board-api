// Test script untuk subscription endpoint
const axios = require('axios');

async function testSubscription() {
  try {
    // Test endpoint tanpa token
    console.log('Testing subscription endpoint...');
    
    const response = await axios.get('http://localhost:4400/api/subscription/my-active-subscription', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Ganti dengan token yang valid
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testSubscription();
