#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_TO_OPTIMIZE = [
  '10-a-10.png',
  'o-preco.png',
  'risco.png',
  'hype.png',
  'Verifique.png',
  'Fortuna.png',
  'facil.png',
  'Dinheiro.png',
  'compra.png',
  'Temperatura.png',
  'concentracao.png'
];

async function optimizeImage(imagePath, outputPath, quality = 80) {
  try {
    const stats = fs.statSync(imagePath);
    const originalSize = stats.size;
    
    console.log(`🔄 Otimizando: ${path.basename(imagePath)}`);
    
    // Converter para WebP
    await sharp(imagePath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(imagePath)}: ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (-${reduction}%)`);
    
    return { originalSize, newSize, reduction };
  } catch (error) {
    console.error(`❌ Erro ao otimizar ${imagePath}:`, error.message);
    return null;
  }
}

async function optimizeAllImages() {
  console.log('🚀 Iniciando otimização de imagens...\n');
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let optimizedCount = 0;
  
  for (const imageName of IMAGES_TO_OPTIMIZE) {
    const imagePath = path.join(PUBLIC_DIR, imageName);
    const webpPath = path.join(PUBLIC_DIR, imageName.replace('.png', '.webp'));
    
    if (fs.existsSync(imagePath)) {
      const result = await optimizeImage(imagePath, webpPath, 80);
      if (result) {
        totalOriginal += result.originalSize;
        totalOptimized += result.newSize;
        optimizedCount++;
      }
    } else {
      console.log(`⚠️  Imagem não encontrada: ${imageName}`);
    }
  }
  
  if (optimizedCount > 0) {
    const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
    console.log(`\n📊 RESUMO:`);
    console.log(`   Imagens otimizadas: ${optimizedCount}`);
    console.log(`   Tamanho original: ${(totalOriginal/1024).toFixed(1)}KB`);
    console.log(`   Tamanho otimizado: ${(totalOptimized/1024).toFixed(1)}KB`);
    console.log(`   Redução total: ${totalReduction}%`);
    console.log(`\n✨ Otimização concluída!`);
  }
}

// Verificar se sharp está instalado
try {
  require('sharp');
  optimizeAllImages();
} catch (error) {
  console.log('📦 Sharp não encontrado. Instalando...');
  console.log('Execute: npm install sharp --save-dev');
  console.log('Depois execute novamente: node scripts/optimize-images.js');
}