
const fs = require('fs');
const path = require('path');

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';

const OUTPUT_DIR = 'public/images/icons';

// Garantir que diretório existe
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const icons = [
  {
    filename: 'bitcoin-3d.png',
    prompt: `3D glassmorphism icon of Bitcoin logo, rounded square glass tile, orange and gold gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view, white background`
  },
  {
    filename: 'ethereum-3d.png',
    prompt: `3D glassmorphism icon of Ethereum logo, rounded square glass tile, blue and purple gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view, white background`
  },
  {
    filename: 'defi-3d.png',
    prompt: `3D glassmorphism icon representing Decentralized Finance (DeFi) with interconnected nodes, rounded square glass tile, indigo and violet gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view`
  },
  {
    filename: 'nfts-3d.png',
    prompt: `3D glassmorphism icon representing NFTs (digital art frame), rounded square glass tile, vibrant pink and cyan gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view`
  },
  {
    filename: 'security-3d.png',
    prompt: `3D glassmorphism icon of a Shield and Lock (Security), rounded square glass tile, emerald green gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view`
  },
  {
    filename: 'analysis-3d.png',
    prompt: `3D glassmorphism icon of a Rising Chart (Analysis), rounded square glass tile, red and orange gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view`
  },
  {
    filename: 'education-3d.png',
    prompt: `3D glassmorphism icon of a Graduation Cap or Book (Education), rounded square glass tile, ocean blue gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view`
  },
  {
    filename: 'altcoins-3d.png',
    prompt: `3D glassmorphism icon representing Altcoins (multiple coins), rounded square glass tile, yellow and multicolor gradient, glossy finish, cinematic lighting, high detail, 8k resolution, isometric view`
  }
];

async function generateIcon(iconConfig, index) {
  console.log(`\n🎨 [${index + 1}/${icons.length}] Gerando Ícone: ${iconConfig.filename}`);
  console.log(`📝 Prompt: ${iconConfig.prompt}`);

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: iconConfig.prompt,
          steps: 8
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (!result.result || !result.result.image) {
      throw new Error('Resposta não contém imagem');
    }

    const base64Image = result.result.image;
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const outputPath = path.join(OUTPUT_DIR, iconConfig.filename);
    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`✅ Salvo: ${outputPath} (${(imageBuffer.length / 1024).toFixed(2)} KB)`);
    return { success: true, filename: iconConfig.filename };

  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return { success: false, filename: iconConfig.filename, error: error.message };
  }
}

async function main() {
  console.log('🚀 ATIVANDO MODO DESIGN GRÁFICO IA: Gerando Ícones Premium 3D...\n');

  for (let i = 0; i < icons.length; i++) {
    await generateIcon(icons[i], i);
    // Pequena pausa
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n✨ Geração de Ícones Concluída!');
}

main();
