const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '../.env.antigravity') });
if (!process.env.GEMINI_API_KEY && result.parsed) process.env.GEMINI_API_KEY = result.parsed.GEMINI_API_KEY;

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Infelizmente a lib node não expõe listModels diretamente na classe principal facilmente
  // Mas podemos tentar inferir ou usar fetch direto que é mais garantido para debug

  // USANDO FETCH PURO PARA DIAGNÓSTICO
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Modelos Disponíveis:', JSON.stringify(data, null, 2));
  } catch(e) {
      console.error('Erro ao listar modelos:', e);
  }
}
list();
