const fs = require('fs');
const path = require('path');

// Ler lista de imagens não utilizadas
const unusedListPath = path.join(__dirname, '../unused-images.txt');
const imagesDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(unusedListPath)) {
  console.error('❌ Arquivo unused-images.txt não encontrado!');
  console.log('Execute primeiro: node scripts/find-unused-images.js');
  process.exit(1);
}

const unusedImages = fs.readFileSync(unusedListPath, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

console.log(`🗑️  Preparando para deletar ${unusedImages.length} imagens não utilizadas...\n`);

let deletedCount = 0;
let errorCount = 0;
const errors = [];

unusedImages.forEach(imagePath => {
  const fullPath = path.join(imagesDir, imagePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      deletedCount++;
      console.log(`✅ Deletado: ${imagePath}`);
    } else {
      console.log(`⚠️  Não encontrado: ${imagePath}`);
    }
  } catch (error) {
    errorCount++;
    errors.push({ path: imagePath, error: error.message });
    console.error(`❌ Erro ao deletar ${imagePath}: ${error.message}`);
  }
});

console.log(`\n📊 Resumo:`);
console.log(`   ✅ Deletadas: ${deletedCount}`);
console.log(`   ❌ Erros: ${errorCount}`);

if (errors.length > 0) {
  console.log(`\n❌ Erros encontrados:`);
  errors.forEach(({ path, error }) => {
    console.log(`   - ${path}: ${error}`);
  });
}

console.log(`\n✨ Processo concluído!`);
