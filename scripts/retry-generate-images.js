
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/black-forest-labs/flux-1-schnell';

const IMAGES_DIR = path.join(__dirname, '../public/images');

const TASKS = [
    {
        filename: 'web3-gaming-cover-v2.webp',
        prompt: 'Cyberpunk futuristic game interface with nft cards and crypto coins, neon lights, 3d render, high quality, 8k, blue and purple theme'
    },
    {
        filename: 'crypto-regulation-brazil-v2.webp',
        prompt: 'Futuristic map of Brazil made of digital circuit lines, growing green graphs overlay, legal gavel made of glass and light, government buildings in background, 8k resolution, cinematic lighting'
    },
    {
        filename: 'ai-blockchain-convergence-v2.webp',
        prompt: 'Abstract representation of Artificial Intelligence brain merging with golden blockchain blocks, data flow, neural networks, cyan and gold colors, 3d render, hyper realistic'
    }
];

async function generateImage(task) {
    console.log(`🎨 Gerando: ${task.filename}...`);
    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: task.prompt, num_steps: 4 })
            }
        );

        if (!response.ok) throw new Error(await response.text());

        const json = await response.json();
        const buffer = Buffer.from(json.result.image, 'base64');
        const outputPath = path.join(IMAGES_DIR, task.filename);

        await sharp(buffer).webp({ quality: 90 }).toFile(outputPath);
        console.log(`✅ Sucesso: ${outputPath}`);
        return true;
    } catch (e) {
        console.error(`❌ Erro: ${e.message}`);
        return false;
    }
}

async function main() {
    let successCount = 0;
    for (const task of TASKS) {
        if (await generateImage(task)) successCount++;
    }

    // Check uploaded file just in case needed as fallback
    // But primary goal is to use AI as requested
}

main();
