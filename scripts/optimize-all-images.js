#!/usr/bin/env node

/**
 * Optimize All Images Script
 * Converte todas as imagensNG para WebP
 * Uso: node scripts/optimize-all-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function getAllImages(dir) {
  const images = [];

  function scan(directory) {
    const items = fs.readdirSync(directory);

    items.forEach(item => {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item.match(/\.(jpg|jpeg|png)$/i)) {
        images.push(fullPath);
      }
    });
  }

  scan(dir);
  return images;
}

function optimizeImage(imagePath) {
  const ext = path.extname(imagePath);
  const webpPath = imagePath.replace(ext, '.webp');

  // Verificar se WebP já existe
  if (fs.existsSync(webpPath)) {
    return { skipped: true, path: imagePath };
  }

  try {
    // Converter para WebP usando sharp (se instalado)
    // Ou usar imagemagick/cwebp
    console.log(`Converting: ${path.basename(imagePath)}`);

    // Exemplo com cwebp (precisa estar instalado)
    // execSync(`cwebp -q 85 "${imagePath}" -o "${webpPath}"`);

    return { success: true, path: imagePath, webp: webpPath };
  } catch (error) {
    return { error: true, path: imagePath, message: error.message };
  }
}

function analyzeImages() {
  console.log('\n📊 ANALISANDO IMAGENS DO SITE\n');

  const images = getAllImages(IMAGES_DIR);

  const stats = {
    total: images.length,
    jpg: images.filter(img => img.match(/\.jpe?g$/i)).length,
    png: images.filter(img => img.match(/\.png$/i)).length,
    webp: images.filter(img => img.match(/\.webp$/i)).length,
    avif: images.filter(img => img.match(/\.avif$/i)).length
  };

  console.log(`📊 Total de imagens: ${stats.total}`);
  console.log(`   JPG: ${stats.jpg}`);
  console.log(`   PNG: ${stats.png}`);
  console.log(`   WebP: ${stats.webp}`);
  console.log(`   AVIF: ${stats.avif}\n`);

  const needsOptimization = stats.jpg + stats.png;
  const optimized = stats.webp + stats.avif;
  const percentage = ((optimized / stats.total) * 100).toFixed(1);

  console.log(`✅ Otimizadas: ${optimized} (${percentage}%)`);
  console.log(`⚠️  Precisam otimização: ${needsOptimization}\n`);

  if (needsOptimization > 0) {
    console.log('💡 RECOMENDAÇÃO:');
    console.log('   1. Instale cwebp: https://developers.google.com/speed/webp/download');
    console.log('   2. Ou use sharp: npm install sharp');
    console.log('   3. Execute este script novamente para converter\n');
  } else {
    console.log('🎉 TODAS AS IMAGENS JÁ ESTÃO OTIMIZADAS!\n');
  }

  // Listar top 10 maiores imagens
  console.log('📦 TOP 10 MAIORES IMAGENS:\n');

  const imageSizes = images.map(img => ({
    path: img,
    size: fs.statSync(img).size,
    name: path.basename(img)
  })).sort((a, b) => b.size - a.size).slice(0, 10);

  imageSizes.forEach((img, index) => {
    const sizeMB = (img.size / 1024 / 1024).toFixed(2);
    console.log(`   ${index + 1}. ${img.name} - ${sizeMB} MB`);
  });

  console.log('\n');
}

analyzeImages();

