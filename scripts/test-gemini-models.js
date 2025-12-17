const https = require('https');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const key = process.env.GEMINI_API_KEY || "AIzaSyBxAsO7zm_LCdm8bKD3OtrdgAAHDyP3yVU";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log('Modelos Disponíveis:');
                json.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).forEach(m => {
                    console.log(`- ${m.name}`);
                });
            } else {
                console.log('Erro na resposta:', json);
            }
        } catch (e) {
            console.log('Erro parse:', e, data);
        }
    });
});
