/**
 * Script de correção para gerar imagens faltantes
 * Usa Cloudflare AI para gerar imagens de alta qualidade
 */

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const fs = require('fs');
const path = require('path');

const MISSING_IMAGES = [
  {
    path: 'public/images/bitcoin/2025-12/bitcoin-previsao-2026-analise.webp',
    prompt: 'Futuristic digital gold bitcoin 2026 prediction chart, upward trend, professional financial analysis background, dark blue and gold theme, high quality 8k, cinematic lighting'
  },
  {
    path: 'public/images/educacao/2025-12/como-comprar-criptomoedas-tutorial-passo-a-passo-para-iniciantes.webp',
    prompt: 'Step by step guide to buying cryptocurrency on smartphone, modern clean interface application, digital wallet concept, secure transaction, blue and white colors, 3d render style, high quality'
  },
  {
    path: 'public/images/regulacao/2025-12/regulao-cripto-brasil-2026-o-que-muda-e-como-se-preparar.webp',
    prompt: 'Brazil regulation cryptocurrency concept, brazilian flag colors subtly integrated with digital blockchain network, legal document hammer scales of justice, professional corporate style, 8k resolution'
  },
  {
    path: 'public/images/defi/2025-12/staking-ethereum-rendimento-maximize-seus-ganhos-com-segurana.webp',
    prompt: 'Ethereum staking rewards growth concept, glowing eth symbol, passive inome visualisation, secure vault digital lock, green and purple neon lights, cyberpunk defied aesthetic, high detail'
  }
];

async function generateImage(item) {
  console.log(`\n🎨 Gerando imagem para: ${path.basename(item.path)}`);
  console.log(`📝 Prompt: ${item.prompt.substring(0, 50)}...`);

  try {
    // Garantir que diretório existe
    const dir = path.dirname(item.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: item.prompt,
          steps: 8
        })
      }
    );

    if (!response.ok) {
        // Tente outro modelo se o Flux falhar (às vezes está sobrecarregado)
        console.log('⚠️  Flux falhou, tentando SDXL...');
        const responseSD = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: item.prompt
              })
            }
        );

        if (!responseSD.ok) {
             throw new Error(`Erro na geração: ${responseSD.statusText}`);
        }

        const resultSD = await responseSD.json();
        // SDXL retorna stream ou blob, mas workers AI via REST retorna JSON com result.image (base64)
         if (!resultSD.result || !resultSD.result.image) {
             throw new Error('Resposta SD não contém imagem');
         }
         const buffer = Buffer.from(resultSD.result.image, 'base64');
         fs.writeFileSync(item.path, buffer); // Salva como .webp (conteúdo é png/jpeg mas renomeamos, browser aguenta)
         console.log('✅ Imagem salva (SDXL)!');
         return;
    }

    const result = await response.json();

    if (!result.result || !result.result.image) {
      throw new Error('Resposta não contém imagem');
    }

    const imageBuffer = Buffer.from(result.result.image, 'base64');
    fs.writeFileSync(item.path, imageBuffer);
    console.log('✅ Imagem salva com sucesso!');

  } catch (error) {
    console.error(`❌ Falha ao gerar ${path.basename(item.path)}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando correção de imagens faltantes...\n');

  for (const item of MISSING_IMAGES) {
    if (fs.existsSync(item.path)) {
        console.log(`⏭️  Imagem já existe: ${path.basename(item.path)}`);
        continue;
    }
    await generateImage(item);
    // Pequena pausa para não estourar rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✨ Processo finalizado!');
}

main();
