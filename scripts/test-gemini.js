const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log('Key length:', key ? key.length : 0);
  console.log('Key start:', key ? key.substring(0, 5) : 'NONE');

  if (!key) return;

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Tentar gemini-pro que é standard

  try {
    const result = await model.generateContent('Say hello');
    console.log('Response:', result.response.text());
  } catch (e) {
    console.error('Error:', e.message);
    if (e.response) {
        console.error('API Error details:', JSON.stringify(e.response, null, 2));
    }
  }
}

test();
