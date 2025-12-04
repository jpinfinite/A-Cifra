/**
 * Script para gerar 10 imagens dos artigos usando Cloudflare AI
 * Uso:pts/gerar-10-imagens.js
 */

const fs = require('fs');

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';

// Definição das 10 imagens
const images = [
  {
    filename: 'ethereum-4k-analise-2025.jpg',
    prompt: `Professional Ethereum cryptocurrency analysis cover image.
Dark gradient background from deep purple #2D1B69 to dark blue #0A1929.
Large glowing Ethereum logo in center with ethereal light effects.
Upward trending price chart with blue-purple gradient showing $4000 target.
Modern financial dashboard aesthetic, clean minimalist design.
Floating holographic data points and geometric patterns.
1200x630 pixels, high quality, professional, no text, no watermark.`
  },
  {
    filename: 'melhores-altcoins-dezembro-2025.jpg',
    prompt: `Professional altcoins cryptocurrency portfolio cover image.
Dark gradient background from navy blue #0C1E3C to deep teal #0A2F3F.
Multiple cryptocurrency logos floating: Solana, Cardano, Polkadot, Avalanche.
Glowing connections between coins showing network effect.
Upward trending charts in background with green and blue colors.
Modern tech aesthetic, clean professional design, futuristic vibe.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'defi-guia-completo-2025.jpg',
    prompt: `Professional DeFi (Decentralized Finance) cover image.
Dark gradient background from deep blue #041F3E to purple #1A0B2E.
Abstract interconnected nodes representing DeFi protocols.
Glowing blockchain network visualization with flowing data streams.
Financial symbols: coins, charts, lock icons showing security.
Modern tech aesthetic, clean minimalist design, professional look.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'declarar-cripto-ir-2025.jpg',
    prompt: `Professional tax and cryptocurrency compliance cover image.
Dark gradient background from navy blue #0A1929 to dark gray #1C1C1E.
Calculator and financial documents with cryptocurrency symbols.
Brazilian flag colors subtly integrated (green, yellow, blue).
Tax forms, charts, and Bitcoin/Ethereum logos in professional layout.
Clean business aesthetic, trustworthy and official look.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'staking-cripto-guia-2025.jpg',
    prompt: `Professional cryptocurrency staking cover image.
Dark gradient background from deep purple #1E0A3C to dark blue #0A1F3E.
Stacked coins with glowing effect showing passive income concept.
Upward trending percentage symbols and growth charts.
Lock icon with blockchain network showing security and rewards.
Modern financial tech aesthetic, clean professional design.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'nfts-2025-tendencias.jpg',
    prompt: `Professional NFT (Non-Fungible Token) cover image.
Dark gradient background from deep purple #2D1B69 to cyan #0A3F5F.
Abstract digital art frames floating in 3D space with glowing edges.
Blockchain hexagonal pattern in background showing authenticity.
Gaming controller, music note, and art palette icons showing utility.
Modern digital art aesthetic, vibrant but professional, futuristic vibe.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'trading-cripto-iniciantes-2025.jpg',
    prompt: `Professional cryptocurrency trading cover image.
Dark gradient background from deep blue #041924 to black #0A0A0A.
Multiple candlestick charts with green and red candles showing market action.
Technical indicators: RSI, MACD, moving averages overlaid on charts.
Trading terminal aesthetic with glowing data visualization.
Professional financial market look, clean modern design.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'seguranca-cripto-guia-2025.jpg',
    prompt: `Professional cryptocurrency security cover image.
Dark gradient background from deep blue #0A1F3E to dark gray #1A1A1C.
Hardware wallet device (Ledger-style) with glowing security shield.
Lock icons, fingerprint, and 2FA symbols showing multi-layer security.
Blockchain network with encrypted nodes and secure connections.
Trustworthy professional aesthetic, clean modern design, secure feeling.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'layer-2-ethereum-guia-2025.jpg',
    prompt: `Professional Ethereum Layer 2 scalability cover image.
Dark gradient background from deep purple #1E0A3C to dark blue #0A2F3F.
Ethereum logo at center with multiple layer 2 chains branching out.
Arbitrum, Optimism, Base logos connected by glowing network lines.
Fast transaction visualization with speed lines and data flow.
Modern tech infrastructure aesthetic, clean professional design.
1200x630 pixels, high quality, no text, no watermark.`
  },
  {
    filename: 'regulacao-cripto-brasil-2025.jpg',
    prompt: `Professional cryptocurrency regulation in Brazil cover image.
Dark gradient background from navy blue #0A1929 to deep green #0A2F1F.
Brazilian flag colors subtly integrated (green, yellow, blue).
Legal documents, gavel, and cryptocurrency symbols in professional layout.
Banco Central logo style elements, official government aesthetic.
Balance scale showing regulation and innovation in harmony.
Clean professional business look, trustworthy and official.
1200x630 pixels, high quality, no text, no watermark.`
  }
];

async function generateImage(imageConfig, index) {
  console.log(`\n🎨 [${index + 1}/10] Gerando: ${imageConfig.filename}`);
  console.log(`📝 Prompt: ${imageConfig.prompt.substring(0, 80)}...`);

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
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (!result.result || !result.result.image) {
      throw new Error('Resposta não contém imagem');
    }

    const base64Image = result.result.image;
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const outputPath = `public/images/${imageConfig.filename}`;
    fs.writeFileSync(outputPath, imageBuffer);

    console.log(`✅ Salva: ${outputPath} (${(imageBuffer.length / 1024).toFixed(2)} KB)`);

    return { success: true, filename: imageConfig.filename };
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return { success: false, filename: imageConfig.filename, error: error.message };
  }
}

async function generateAllImages() {
  console.log('🚀 Iniciando geração de 10 imagens com Cloudflare AI...\n');
  console.log('⏱️  Tempo estimado: 2-3 minutos\n');
  console.log('=' .repeat(60));

  const results = [];

  for (let i = 0; i < images.length; i++) {
    const result = await generateImage(images[i], i);
    results.push(result);

    // Aguardar 2 segundos entre requisições para não sobrecarregar API
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RESUMO DA GERAÇÃO:\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Sucesso: ${successful}/10`);
  console.log(`❌ Falhas: ${failed}/10`);

  if (failed > 0) {
    console.log('\n❌ Imagens com erro:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.filename}: ${r.error}`);
    });
  }

  console.log('\n🎉 Processo concluído!');
  console.log('📁 Imagens salvas em: public/images/');
  console.log('\n💡 Próximos passos:');
  console.log('1. Verifique as imagens geradas');
  console.log('2. Otimize se necessário (WebP, compressão)');
  console.log('3. Faça commit e push para GitHub');
}

generateAllImages();

