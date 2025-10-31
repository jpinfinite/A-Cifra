#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

const expectedImages = [
  'og-not-your-keys-not-your-coins.png',
  'og-not-your-keys-dark.png',
  'og-not-your-keys-blue.png',
  'og-not-your-keys-minimal.png'
];

async function testImage(imagePath) {
  try {
    const stats = fs.statSync(imagePath);
    const metadata = await sharp(imagePath).metadata();
    
    const fileName = path.basename(imagePath);
    const fileSize = (stats.size / 1024).toFixed(1);
    
    // Verificar dimensões padrão OG
    const isValidSize = metadata.width === 1200 && metadata.height === 630;
    const sizeStatus = isValidSize ? '✅' : '❌';
    
    // Verificar tamanho do arquivo (deve ser < 100KB)
    const isValidFileSize = stats.size < 100 * 1024;
    const fileSizeStatus = isValidFileSize ? '✅' : '❌';
    
    console.log(`${sizeStatus} ${fileName}`);
    console.log(`   Dimensões: ${metadata.width}x${metadata.height}px ${sizeStatus}`);
    console.log(`   Tamanho: ${fileSize}KB ${fileSizeStatus}`);
    console.log(`   Formato: ${metadata.format}`);
    console.log('');
    
    return {
      fileName,
      valid: isValidSize && isValidFileSize,
      width: metadata.width,
      height: metadata.height,
      size: stats.size,
      format: metadata.format
    };
    
  } catch (error) {
    console.log(`❌ ${path.basename(imagePath)}: Erro - ${error.message}`);
    return { fileName: path.basename(imagePath), valid: false, error: error.message };
  }
}

async function testAllImages() {
  console.log('🧪 Testando imagens OG...\n');
  
  const results = [];
  let validCount = 0;
  
  for (const imageName of expectedImages) {
    const imagePath = path.join(IMAGES_DIR, imageName);
    
    if (fs.existsSync(imagePath)) {
      const result = await testImage(imagePath);
      results.push(result);
      if (result.valid) validCount++;
    } else {
      console.log(`❌ ${imageName}: Arquivo não encontrado`);
      results.push({ fileName: imageName, valid: false, error: 'Arquivo não encontrado' });
    }
  }
  
  // Resumo
  console.log('📊 RESUMO DOS TESTES:');
  console.log(`   Imagens testadas: ${results.length}`);
  console.log(`   Imagens válidas: ${validCount}`);
  console.log(`   Taxa de sucesso: ${((validCount / results.length) * 100).toFixed(1)}%`);
  
  // URLs para teste
  console.log('\n🔗 URLs para teste nas redes sociais:');
  results.forEach(result => {
    if (result.valid) {
      console.log(`   https://blog-a-cifra.pages.dev/images/${result.fileName}`);
    }
  });
  
  // Ferramentas de validação
  console.log('\n🛠️  Ferramentas de validação recomendadas:');
  console.log('   Facebook: https://developers.facebook.com/tools/debug/');
  console.log('   Twitter: https://cards-dev.twitter.com/validator');
  console.log('   LinkedIn: https://www.linkedin.com/post-inspector/');
  
  if (validCount === results.length) {
    console.log('\n✨ Todas as imagens OG estão válidas e prontas para uso!');
  } else {
    console.log('\n⚠️  Algumas imagens precisam de atenção. Verifique os erros acima.');
  }
}

// Verificar se sharp está instalado
try {
  require('sharp');
  testAllImages();
} catch (error) {
  console.log('📦 Sharp não encontrado. Instalando...');
  console.log('Execute: npm install sharp --save-dev');
  console.log('Depois execute novamente: node scripts/test-og-images.js');
}