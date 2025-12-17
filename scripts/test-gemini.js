const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
     // A lib oficial não expõe listModels diretamente na classe principal v0.1?
     // Vamos tentar uma chamada manual com fetch se falhar.
     // Mas a documentação diz que podemos instanciar e tentar gerar.

     console.log('Tentando gemini-1.5-flash-latest...');
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
     const res = await model.generateContent("Test");
     console.log('Sucesso com gemini-1.5-flash-latest!');
  } catch (e) {
    console.log('Erro ao testar modelo:', e.message);
  }
}

listModels();
