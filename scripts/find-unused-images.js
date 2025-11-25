const fs = require('fs');
const path = require('path');

// Diretórios para verificar
const imagesDir = path.join(__dirname, '../public/images');
const articlesDir = path.join(__dirname, '../content/articles');

// Função para listar todos os arquivos de imagem
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|webp|avif|svg)$/i.test(file)) {
      // Caminho relativo a partir de public/images
      const relativePath = path.relative(imagesDir, filePath).replace(/\\/g, '/');
      fileList.push(relativePath);
    }
  });
  
  return fileList;
}

// Função para obter todas as referências de imagens nos artigos
function getImageReferences() {
  const references = new Set();
  
  // Ler todos os arquivos markdown
  const files = fs.readdirSync(articlesDir);
  
  files.forEach(file => {
    if (file.endsWith('.md') && !file.startsWith('_')) {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
      
      // Buscar padrões de imagem
      const patterns = [
        /src:\s*['"]\/images\/([^'"]+)['"]/g,
        /!\[.*?\]\(\/images\/([^)]+)\)/g,
        /<img[^>]+src=["']\/images\/([^"']+)["']/g
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          references.add(match[1]);
        }
      });
    }
  });
  
  return references;
}

// Executar análise
console.log('🔍 Analisando imagens...\n');

const allImages = getAllImages(imagesDir);
const usedImages = getImageReferences();

console.log(`📊 Total de imagens: ${allImages.length}`);
console.log(`✅ Imagens referenciadas: ${usedImages.size}\n`);

// Identificar imagens não utilizadas
const unusedImages = allImages.filter(img => {
  // Verificar se a imagem base está sendo usada
  const baseName = img.replace(/-(?:sm|md|lg|xl)\.(avif|webp)$/, '');
  const baseNameWithExt = baseName.match(/\.(jpg|jpeg|png)$/) ? baseName : `${baseName}.jpg`;
  
  // Verificar se alguma variante está sendo usada
  const isUsed = Array.from(usedImages).some(ref => {
    return ref.includes(baseName) || ref.includes(baseNameWithExt);
  });
  
  return !isUsed;
});

console.log(`🗑️  Imagens não utilizadas: ${unusedImages.length}\n`);

if (unusedImages.length > 0) {
  console.log('Lista de imagens não utilizadas:');
  unusedImages.forEach(img => {
    console.log(`  - ${img}`);
  });
  
  // Salvar lista em arquivo
  const outputPath = path.join(__dirname, '../unused-images.txt');
  fs.writeFileSync(outputPath, unusedImages.join('\n'));
  console.log(`\n📝 Lista salva em: unused-images.txt`);
}
