#!/usr/bin/env node

/**
 * Optimize All Images Script
 * Converte todas as imagensNG para WebP
 * Uso: node scripts/optimize-all-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MIN_SIZE_KB = 100; // Convert only images larger than 100KB

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
        images.push({
            path: fullPath,
            size: stat.size
        });
      }
    });
  }

  scan(dir);
  return images;
}

async function convertToWebP(imageInfo) {
    const { path: imagePath, size } = imageInfo;
    const ext = path.extname(imagePath);
    const webpPath = imagePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
    const sizeKB = size / 1024;

    if (sizeKB < MIN_SIZE_KB) {
        return { skipped: true, reason: 'small_file' };
    }

    if (fs.existsSync(webpPath)) {
        // Se o arquivo WebP já existe, verificamos se o original é mais recente ou maior
        // Neste caso, vamos forçar a re-geração para garantir qualidade
        // return { skipped: true, reason: 'webp_exists' };
    }

    try {
        await sharp(imagePath)
            .webp({ quality: 80 })
            .toFile(webpPath);

        console.log(`✅ Converted: ${path.basename(imagePath)} (${sizeKB.toFixed(2)} KB) -> ${path.basename(webpPath)}`);

        // Opcional: Remover original se desejar economizar espaço, mas perigoso se algo quebrar refs
        // fs.unlinkSync(imagePath);

        return { success: true, original: imagePath, webp: webpPath };
    } catch (error) {
        console.error(`❌ Error converting ${path.basename(imagePath)}:`, error.message);
        return { error: true, message: error.message };
    }
}

async function analyzeAndOptimize() {
  console.log('\n📊 STARTING IMAGE OPTIMIZATION (LARGE IMAGES > 100KB)\n');

  const images = getAllImages(IMAGES_DIR);

  // Filtrar apenas imagens grandes
  const largeImages = images.filter(img => img.size > MIN_SIZE_KB * 1024);

  console.log(`🔍 Found ${images.length} total images.`);
  console.log(`🎯 Found ${largeImages.length} large images to optimize.\n`);

  let convertedCount = 0;
  let errors = 0;

  for (const img of largeImages) {
      const result = await convertToWebP(img);
      if (result.success) convertedCount++;
      if (result.error) errors++;
  }

  console.log(`\n🎉 Optimization finished!`);
  console.log(`✅ Converted: ${convertedCount}`);
  console.log(`❌ Errors: ${errors}\n`);
}

analyzeAndOptimize();

