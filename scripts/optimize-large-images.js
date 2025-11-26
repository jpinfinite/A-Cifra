const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Script para otimizar imagens grandes do site
 * Reduz tamanho mantendo qualidade visual
 */

const imagesToOptimize = [
  {
    input: 'public/images/aethir-gpu-depin-infrastructure.jpg',
    output: 'public/images/aethir-gpu-depin-infrastructure.jpg',
    maxWidth: 1266, // 2x do tamanho de exibição (633px)
    quality: 85
  },
  {
    input: 'public/images/logos/cifra-positivo.png',
    output: 'public/images/logos/cifra-positivo.png',
    maxWidth: 300, // 2x do tamanho de exibição (150px)
    quality: 90
  }
];

async function optimizeImage(config) {
  try {
    const { input, output, maxWidth, quality } = config;
    
    if (!fs.existsSync(input)) {
      console.log(`⚠️  Imagem não encontrada: ${input}`);
      return;
    }

    const originalStats = fs.statSync(input);
    const originalSize = (originalStats.size / 1024).toFixed(2);

    console.log(`\n🔄 Otimizando: ${path.basename(input)}`);
    console.log(`   Tamanho original: ${originalSize} KB`);

    await sharp(input)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality, mozjpeg: true })
      .toFile(output + '.tmp');

    // Substituir arquivo original
    fs.renameSync(output + '.tmp', output);

    const newStats = fs.statSync(output);
    const newSize = (newStats.size / 1024).toFixed(2);
    const savings = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`   ✅ Novo tamanho: ${newSize} KB`);
    console.log(`   💾 Economia: ${savings}%`);

  } catch (error) {
    console.error(`❌ Erro ao otimizar ${config.input}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando otimização de imagens...\n');
  
  for (const config of imagesToOptimize) {
    await optimizeImage(config);
  }
  
  console.log('\n✨ Otimização concluída!\n');
}

main();
