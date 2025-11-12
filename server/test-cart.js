// Simple test script to debug cart functionality
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCartFunctionality() {
  try {
    console.log('🧪 Testing Cart Functionality...\n');

    // Step 1: Register a test user
    console.log('1. Registering test user...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ User registered successfully');
    console.log('Token:', registerResponse.data.token);
    console.log('User:', registerResponse.data.user);

    const token = registerResponse.data.token;

    // Step 2: Get products
    console.log('\n2. Fetching products...');
    const productsResponse = await axios.get(`${API_BASE}/products`);
    console.log('✅ Products fetched successfully');
    console.log('Number of products:', productsResponse.data.length);
    
    if (productsResponse.data.length > 0) {
      const firstProduct = productsResponse.data[0];
      console.log('First product:', firstProduct.name, '- ID:', firstProduct._id);

      // Step 3: Add product to cart
      console.log('\n3. Adding product to cart...');
      const cartData = {
        productId: firstProduct._id,
        quantity: 2,
        customization: 'Test customization'
      };

      const cartResponse = await axios.post(`${API_BASE}/cart/add`, cartData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Product added to cart successfully');
      console.log('Cart item:', cartResponse.data);

      // Step 4: Get cart
      console.log('\n4. Fetching cart...');
      const getCartResponse = await axios.get(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Cart fetched successfully');
      console.log('Cart items:', getCartResponse.data);

    } else {
      console.log('❌ No products found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('🔐 Authentication error - check token');
    }
  }
}

// Run the test
testCartFunctionality();
