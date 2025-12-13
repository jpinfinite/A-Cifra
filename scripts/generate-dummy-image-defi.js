
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
// Modelo Flux Schnell (Melhor custo-benefício e qualidade para imagens)
const MODEL = '@cf/black-forest-labs/flux-1-schnell';

const IMAGES_DIR = path.join(__dirname, '../public/images');

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
                    num_steps: 4
                })
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Erro API Cloudflare: ${response.status} - ${errText}`);
        }

        const json = await response.json();
        const base64Image = json.result.image;
        const buffer = Buffer.from(base64Image, 'base64');

        // Salva diretamente como WebP usando Sharp se possível, ou converte depois.
        // Como o script de otimização já existe, vamos salvar como PNG primeiro ou tentar converter direto no buffer.
        // Vamos usar o sharp aqui para já salvar otimizado.

        const outputPath = path.join(IMAGES_DIR, filename.replace('.png', '.webp').replace('.jpg', '.webp'));

        await sharp(buffer)
            .webp({ quality: 85 })
            .toFile(outputPath);

        console.log(`✅ Imagem gerada e otimizada salva em: ${outputPath}`);
        return true;

    } catch (e) {
        console.error("❌ Erro ao gerar imagem:", e.message);
        return false;
    }
}

async function main() {
    // Prompt específico para "AI Agents in DeFi"
    const prompt = "Futuristic 3D render of autonomous artificial intelligence agents managing decentralized finance graphs, glowing blue and gold data streams, digital neural network connecting coins, premium crypto aesthetic, 8k resolution, isometric view, dark background";
    const filename = "ai-agents-defi-cover.webp";

    await generateImage(prompt, filename);
}

main();
