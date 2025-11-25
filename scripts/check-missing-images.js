const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '../content/articles');
const imagesDir = path.join(__dirname, '../public/images');

// Ler todos os artigos
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));

const missingImages = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
  
  // Extrair coverImage do frontmatter
  const coverImageMatch = content.match(/coverImage:\s*\n\s*src:\s*['"]([^'"]+)['"]/);
  
  if (coverImageMatch) {
    const imagePath = coverImageMatch[1].replace(/^\//, '');
    const fullPath = path.join(__dirname, '../public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      missingImages.push({
        article: file,
        image: imagePath
      });
    } else {
      // Verificar variantes
      const basePath = imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      const variants = ['-sm.avif', '-sm.webp', '-md.avif', '-md.webp'];
      
      const missingVariants = variants.filter(variant => {
        const variantPath = path.join(__dirname, '../public', basePath + variant);
        return !fs.existsSync(variantPath);
      });
      
      if (missingVariants.length > 0) {
        missingImages.push({
          article: file,
          image: imagePath,
          missingVariants: missingVariants
        });
      }
    }
  }
});

console.log(`\n📊 Verificação de Imagens\n`);
console.log(`Total de artigos: ${files.length}`);
console.log(`Artigos com problemas: ${missingImages.length}\n`);

if (missingImages.length > 0) {
  console.log('🔴 Imagens com problemas:\n');
  missingImages.forEach(({ article, image, missingVariants }) => {
    console.log(`📄 ${article}`);
    console.log(`   Imagem: ${image}`);
    if (missingVariants) {
      console.log(`   Variantes faltando: ${missingVariants.join(', ')}`);
    } else {
      console.log(`   ❌ IMAGEM PRINCIPAL NÃO EXISTE!`);
    }
    console.log('');
  });
} else {
  console.log('✅ Todas as imagens estão OK!');
}
