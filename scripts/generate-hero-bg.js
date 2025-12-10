
const fs = require('fs');
const path = require('path');

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';

const OUTPUT_DIR = 'public/images';

const imageConfig = {
    filename: 'hero-bg-3d.jpg',
    prompt: `Abstract dark 3D glassmorphism background, deep blue and gold particles, glowing crypto network connection lines, bokeh effect, minimalist, ultra high quality, 8k, dark aesthetic, seamless texture style`
};

async function generateHero() {
  console.log(`\n🎨 Gerando Hero Background: ${imageConfig.filename}`);
  console.log(`📝 Prompt: ${imageConfig.prompt}`);

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
          prompt: imageConfig.prompt,
          steps: 8
        })
      }
    );

    if (!response.ok) {
        throw new Error(`Erro: ${await response.text()}`);
    }

    const result = await response.json();
    const base64Image = result.result.image;
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const outputPath = path.join(OUTPUT_DIR, imageConfig.filename);

    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`✅ Salvo: ${outputPath}`);

  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
  }
}

generateHero();
