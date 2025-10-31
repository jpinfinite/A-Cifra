const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeHero() {
  const inputPath = path.join(process.cwd(), 'public', 'hero.png');
  const outputWebP = path.join(process.cwd(), 'public', 'hero.webp');
  
  try {
    // Verificar se o arquivo existe
    if (!fs.existsSync(inputPath)) {
      console.error('❌ Arquivo hero.png não encontrado em public/');
      return;
    }
    
    // Obter informações do arquivo original
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    console.log('🚀 Otimizando hero.png...');
    console.log(`📏 Tamanho original: ${(originalSize / 1024).toFixed(1)}KB`);
    
    // Converter para WebP com otimização
    await sharp(inputPath)
      .webp({ 
        quality: 85,
        effort: 6,
        lossless: false
      })
      .toFile(outputWebP);
    
    // Verificar tamanho do arquivo otimizado
    const optimizedStats = fs.statSync(outputWebP);
    const optimizedSize = optimizedStats.size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ hero.webp criado: ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`📉 Redução: ${reduction}%`);
    
    // Também criar uma versão PNG otimizada
    const outputPNG = path.join(process.cwd(), 'public', 'hero-optimized.png');
    
    await sharp(inputPath)
      .png({ 
        quality: 90,
        compressionLevel: 9,
        progressive: true
      })
      .toFile(outputPNG);
    
    const pngStats = fs.statSync(outputPNG);
    const pngSize = pngStats.size;
    const pngReduction = ((originalSize - pngSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ hero-optimized.png criado: ${(pngSize / 1024).toFixed(1)}KB`);
    console.log(`📉 Redução PNG: ${pngReduction}%`);
    
    console.log('\n🎉 Otimização do hero concluída!');
    console.log('📝 Arquivos criados:');
    console.log('   - hero.webp (formato moderno, menor tamanho)');
    console.log('   - hero-optimized.png (fallback otimizado)');
    
  } catch (error) {
    console.error('❌ Erro ao otimizar hero.png:', error.message);
  }
}

optimizeHero();