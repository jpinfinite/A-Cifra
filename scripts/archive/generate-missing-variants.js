const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const articlesDir = path.join(__dirname, '../content/articles');
const publicDir = path.join(__dirname, '../public');

// Configurações de tamanhos
const sizes = {
  sm: 384,
  md: 662,
  lg: 1024
};

async function generateVariants(imagePath) {
  const fullPath = path.join(publicDir, imagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Imagem não existe: ${imagePath}`);
    return;
  }

  const basePath = imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const baseFullPath = path.join(publicDir, basePath);

  console.log(`\n🔄 Processando: ${imagePath}`);

  try {
    const image = sharp(fullPath);
    const metadata = await image.metadata();

    // Gerar variantes faltando
    for (const [sizeName, width] of Object.entries(sizes)) {
      // Pular se a imagem original for menor que o tamanho desejado
      if (metadata.width < width) continue;

      // AVIF
      const avifPath = `${baseFullPath}-${sizeName}.avif`;
      if (!fs.existsSync(avifPath)) {
        await image
          .clone()
          .resize(width, null, { withoutEnlargement: true })
          .avif({ quality: 80 })
          .toFile(avifPath);
        console.log(`  ✅ Criado: ${sizeName}.avif`);
      }

      // WebP
      const webpPath = `${baseFullPath}-${sizeName}.webp`;
      if (!fs.existsSync(webpPath)) {
        await image
          .clone()
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(webpPath);
        console.log(`  ✅ Criado: ${sizeName}.webp`);
      }
    }

    console.log(`  ✨ Concluído!`);
  } catch (error) {
    console.error(`  ❌ Erro: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Gerando variantes de imagens faltantes...\n');

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  const imagesToProcess = new Set();

  // Coletar todas as imagens que precisam de variantes
  files.forEach(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
    const coverImageMatch = content.match(/coverImage:\s*\n\s*src:\s*['"]([^'"]+)['"]/);
    
    if (coverImageMatch) {
      const imagePath = coverImageMatch[1].replace(/^\//, '');
      imagesToProcess.add(imagePath);
    }
  });

  console.log(`📊 Total de imagens para processar: ${imagesToProcess.size}\n`);

  // Processar cada imagem
  for (const imagePath of imagesToProcess) {
    await generateVariants(imagePath);
  }

  console.log('\n✅ Processo concluído!');
}

main().catch(console.error);
