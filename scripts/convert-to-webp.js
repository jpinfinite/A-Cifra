const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/articles');

async function convertToWebP() {
  try {
    const files = fs.readdirSync(imagesDir);

    console.log('🖼️  Convertendo imagens para WebP...\n');

    let converted = 0;
    let totalSaved = 0;

    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(imagesDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

        // Pegar tamanho original
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;

        // Converter para WebP
        await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);

        // Pegar tamanho novo
        const newStats = fs.statSync(outputPath);
        const newSize = newStats.size;

        const saved = originalSize - newSize;
        const savedPercent = ((saved / originalSize) * 100).toFixed(1);

        totalSaved += saved;
        converted++;

        console.log(`✅ ${file} → ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`);
        console.log(`   ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savedPercent}% menor)\n`);
      }
    }

    console.log(`\n🎉 Conversão completa!`);
    console.log(`📊 Total: ${converted} imagens convertidas`);
    console.log(`💾 Economia: ${(totalSaved / 1024 / 1024).toFixed(2)}MB\n`);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

convertToWebP();
