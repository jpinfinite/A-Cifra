/**
 * Script para gerar imagem usando Cloudflare AI
 * Uso: node scripts/gerar-com-cloudflare.js
 */

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';

const prompt = `Professional Bitcoin price analysis cover image.
Dark blue gradient background from #041924 to #00283B with subtle grid pattern.
Large golden Bitcoin symbol in center with glowing effect.
Upward trending candlestick chart with green candles showing bullish momentum.
Modern financial data visualization, clean minimalist design, professional aesthetic.
1200x630 pixels, high quality, no text, no watermark.`;

async function generateImage() {
  console.log('🎨 Gerando imagem com Cloudflare AI (FLUX-1-Schnell)...\n');
  console.log('📝 Prompt:', prompt.substring(0, 100) + '...\n');

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
          prompt: prompt,
          steps: 8
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('📦 Resposta recebida!');

    if (!result.result || !result.result.image) {
      throw new Error('Resposta não contém imagem');
    }

    // A imagem vem em base64
    const base64Image = result.result.image;
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Salvar imagem
    const fs = require('fs');
    const outputPath = 'public/images/articles/bitcoin-95k-analise-completa.png';
    fs.writeFileSync(outputPath, imageBuffer);

    console.log('\n✅ Imagem gerada com sucesso!');
    console.log(`📁 Salva em: ${outputPath}`);
    console.log(`📊 Tamanho: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    console.log('\n🎨 Abra o arquivo para visualizar a imagem!');
    console.log('🔄 Para converter para WebP: node scripts/convert-to-webp.js');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.log('\n💡 Dicas:');
    console.log('1. Verifique se o token tem permissões para Workers AI');
    console.log('2. Confirme que o Account ID está correto');
    console.log('3. Tente gerar pela interface web do Cloudflare');
  }
}

generateImage();
