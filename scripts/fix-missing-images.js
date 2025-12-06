/**
 * Script INTELIGENTE de correção para gerar imagens faltantes
 * Escaneia todos os artigos, verifica se a imagem de capa existe
 * Se não existir, gera usando Cloudflare AI e salva no caminho correto
 */

const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const fs = require('fs');
const path = require('path');

// Caminhos base
const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public');

// Função para extrair metadados do arquivo MD
function getArticleMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/title:\s*['"](.+)['"]/);
    const imageMatch = content.match(/src:\s*['"](.+)['"]/);

    if (!titleMatch || !imageMatch) return null;

    return {
        title: titleMatch[1],
        imagePath: imageMatch[1] // ex: /images/bitcoin/2026/file.webp
    };
}

async function generateImage(localPath, prompt) {
  console.log(`   🎨 Gerando imagem...`);
  console.log(`      Prompt: ${prompt.substring(0, 60)}...`);

  try {
    // Garantir que diretório existe
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Tentar primeiro com FLUX (melhor qualidade)
    let response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}, 8k resolution, futuristic financial concept, professional lighting, cinematic composition`,
          steps: 8
        })
      }
    );

    // Fallback para Stable Diffusion se falhar
    if (!response.ok) {
        console.log('      ⚠️  Flux falhou, tentando SDXL...');
        response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: prompt })
            }
        );
    }

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const result = await response.json();
    if (!result.result || !result.result.image) throw new Error('No image in response');

    const buffer = Buffer.from(result.result.image, 'base64');
    fs.writeFileSync(localPath, buffer);
    console.log('      ✅ Imagem salva com sucesso!');

    return true;

  } catch (error) {
    console.error(`      ❌ Falha ao gerar: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Image Fixer Auto-Scan - A Cifra\n');

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  console.log(`📚 Analisando ${files.length} artigos...`);

  let missingCount = 0;

  for (const file of files) {
      const metadata = getArticleMetadata(path.join(ARTICLES_DIR, file));
      if (!metadata) continue;

      // Converter caminho relativo do MD (/images/...) para sistema de arquivos (public/images/...)
      const relativePath = metadata.imagePath.startsWith('/') ? metadata.imagePath.substring(1) : metadata.imagePath;
      const fullPath = path.join(PUBLIC_IMAGES_DIR, relativePath);

      if (!fs.existsSync(fullPath)) {
          console.log(`\n❌ Imagem faltante encontrada!`);
          console.log(`   📄 Artigo: ${metadata.title}`);
          console.log(`   🖼️  Caminho esperado: ${relativePath}`);

          await generateImage(fullPath, metadata.title);

          // Pausa para evitar rate limit
          await new Promise(r => setTimeout(r, 3000));
          missingCount++;
      }
  }

  if (missingCount === 0) {
      console.log('\n✅ Nenhuma imagem faltante encontrada. Tudo 100%!');
  } else {
      console.log(`\n✨ Processo finalizado! ${missingCount} imagens geradas.`);
  }
}

main();
