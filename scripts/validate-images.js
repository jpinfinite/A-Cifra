#!/usr/bin/env node

/**
 * Validate Images Script
 * Verifica se todas as imagens referenciadas nos artigos existem
 * Uso: node scripts/validate-images.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function getAllArticles(dir) {
  const files = [];

  function scan(directory) {
    const items = fs.readdirSync(directory);

    items.forEach(item => {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'en') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith('.md')) {
        files.push(fullPath);
      }
    });
  }

  scan(dir);
  return files;
}

function extractImageFromArticle(content) {
  // Extrair imagem do frontmatter
  const coverImageMatch = content.match(/coverImage:\s*\n\s*src:\s*['"](.+?)['"]/);
  return coverImageMatch ? coverImageMatch[1] : null;
}

function validateImages() {
  console.log('\n🔍 VALIDANDO IMAGENS DOS ARTIGOS\n');

  const articles = getAllArticles(ARTICLES_DIR);
  const missingImages = [];
  const validImages = [];

  articles.forEach(articlePath => {
    const content = fs.readFileSync(articlePath, 'utf-8');
    const imagePath = extractImageFromArticle(content);

    if (imagePath) {
      const fullImagePath = path.join(__dirname, '..', 'public', imagePath);
      const fileName = path.basename(articlePath);

      if (fs.existsSync(fullImagePath)) {
        validImages.push({ article: fileName, image: imagePath });
      } else {
        missingImages.push({ article: fileName, image: imagePath });
      }
    }
  });

  // Relatório
  console.log(`📊 Total de artigos: ${articles.length}`);
  console.log(`✅ Imagens válidas: ${validImages.length}`);
  console.log(`❌ Imagens faltando: ${missingImages.length}\n`);

  if (missingImages.length > 0) {
    console.log('🚨 IMAGENS FALTANDO:\n');
    missingImages.forEach(({ article, image }) => {
      console.log(`   ❌ ${article}`);
      console.log(`      Imagem: ${image}\n`);
    });

    console.log('\n💡 AÇÃO NECESSÁRIA:');
    console.log('   1. Adicione as imagens faltantes em public/images/');
    console.log('   2. Ou atualize o frontmatter dos artigos');
    console.log('   3. Execute: git add public/images/');
    console.log('   4. Commit e push\n');

    process.exit(1);
  } else {
    console.log('✅ TODAS AS IMAGENS ESTÃO PRESENTES!\n');
    process.exit(0);
  }
}

validateImages();

