
const fs = require('fs');
const path = require('path');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
// Modelo Flux Schnell é rápido e bom
const MODEL = '@cf/black-forest-labs/flux-1-schnell';

const IMAGES_DIR = path.join(__dirname, '../public/images/articles');

async function generateImage(prompt, filename) {
    console.log(`🎨 Gerando imagem: ${filename}...`);
    console.log(`   Prompt: ${prompt}`);

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    num_steps: 4 // Flux Schnell funciona bem com 4-8 passos
                })
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erro API Cloudflare: ${response.status} - ${errText}`);
        }

        const json = await response.json();

        // A resposta do Flux geralmente é um base64 dentro do JSON result
        const base64Image = json.result.image;

        const buffer = Buffer.from(base64Image, 'base64');
        const filePath = path.join(IMAGES_DIR, filename);

        // Ensure directory exists
        if (!fs.existsSync(IMAGES_DIR)){
            fs.mkdirSync(IMAGES_DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Imagem salva com sucesso em: ${filePath}`);
        return true;

    } catch (e) {
        console.error("❌ Erro ao gerar imagem:", e.message);
        return false;
    }
}

async function main() {
    // Imagem para o artigo RWA
    const prompt = "Futuristic digital finance background representing Real World Assets (RWA) tokenization. Visuals of gold bars, real estate buildings, and bonds being digitized into glowing tokens. High tech blue and gold color scheme. Editorial style, clean, professional, suitable for a financial news website. 16:9 aspect ratio.";
    const filename = "rwa-top-3-criptomoedas-2025.jpg";

    await generateImage(prompt, filename);
}

main();
