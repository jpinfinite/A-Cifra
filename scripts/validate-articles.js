#!/usr/bin/env node

/**
 * Validate Articles - A Cifra
 * Valida estrutura e conteúdo de todos os artigos
 * Uso: node scripts/validate-articles.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = 'content/articles';
const VALID_CATEGORIES = [
  'bitcoin', 'altcoins', 'defi', 'ethereum', 'nfts',
  'trading', 'seguranca', 'educacao', 'regulacao', 'analises'
];

function getAllArticles() {
  const articles = [];

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log(`❌ Diretório não encontrado: ${ARTICLES_DIR}`);
    return articles;
  }

  const files = fs.readdirSync(ARTICLES_DIR);

  files.forEach(file => {
    if (file.endsWith('.md') && !file.startsWith('.')) {
      articles.push(path.join(ARTICLES_DIR, file));
    }
  });

  // Verificar subdiretório 'en'
  const enDir = path.join(ARTICLES_DIR, 'en');
  if (fs.existsSync(enDir)) {
    const enFiles = fs.readdirSync(enDir);
    enFiles.forEach(file => {
      if (file.endsWith('.md') && !file.startsWith('.')) {
        articles.push(path.join(enDir, file));
      }
    });
  }

  return articles;
}

function validateArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];
  const warnings = [];
  const stats = {};

  // Extrair frontmatter
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    errors.push('Frontmatter não encontrado');
    return { errors, warnings, stats };
  }

  const frontmatter = frontmatterMatch[1];
  const contentBody = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

  // Validar campos obrigatórios do frontmatter
  const requiredFields = [
    'id', 'title', 'slug', 'excerpt', 'coverImage',
    'author', 'publishedAt', 'categorySlug', 'tags', 'seo'
  ];

  requiredFields.forEach(field => {
    if (!frontmatter.includes(`${field}:`)) {
      errors.push(`Campo obrigatório ausente: ${field}`);
    }
  });

  // Validar categorySlug
  const categoryMatch = frontmatter.match(/categorySlug:\s*['"]?(\w+)['"]?/);
  if (categoryMatch) {
    const category = categoryMatch[1];
    stats.category = category;
    if (!VALID_CATEGORIES.includes(category)) {
      errors.push(`Categoria inválida: ${category}`);
    }
  }

  // Validar SEO
  const metaTitleMatch = frontmatter.match(/metaTitle:\s*['"](.+?)['"]/);
  if (metaTitleMatch) {
    const titleLength = metaTitleMatch[1].length;
    stats.metaTitleLength = titleLength;
    if (titleLength < 50 || titleLength > 60) {
      warnings.push(`Meta title fora do ideal: ${titleLength} chars (recomendado: 50-60)`);
    }
  } else {
    errors.push('metaTitle ausente');
  }

  const metaDescMatch = frontmatter.match(/metaDescription:\s*['"](.+?)['"]/);
  if (metaDescMatch) {
    const descLength = metaDescMatch[1].length;
    stats.metaDescLength = descLength;
    if (descLength < 150 || descLength > 160) {
      warnings.push(`Meta description fora do ideal: ${descLength} chars (recomendado: 150-160)`);
    }
  } else {
    errors.push('metaDescription ausente');
  }

  // Validar conteúdo
  const wordCount = contentBody.split(/\s+/).filter(w => w.length > 0).length;
  stats.wordCount = wordCount;

  if (wordCount < 1500) {
    warnings.push(`Conteúdo curto: ${wordCount} palavras (mínimo recomendado: 1500)`);
  }

  // Validar H1
  const h1Count = (contentBody.match(/^# /gm) || []).length;
  stats.h1Count = h1Count;

  if (h1Count === 0) {
    errors.push('Nenhum H1 encontrado');
  } else if (h1Count > 1) {
    errors.push(`Múltiplos H1: ${h1Count} (deve haver apenas 1)`);
  }

  // Validar H2
  const h2Count = (contentBody.match(/^## /gm) || []).length;
  stats.h2Count = h2Count;

  if (h2Count < 3) {
    warnings.push(`Poucos H2: ${h2Count} (recomendado: 3-10)`);
  }

  // Validar links internos
  const internalLinks = (contentBody.match(/\[.*?\]\(\/artigo\//g) || []).length;
  stats.internalLinks = internalLinks;

  if (internalLinks < 3) {
    warnings.push(`Poucos links internos: ${internalLinks} (recomendado: 3-5)`);
  }

  // Validar ExchangeAffiliateLinks
  const affiliateLinks = (contentBody.match(/<ExchangeAffiliateLinks/g) || []).length;
  stats.affiliateLinks = affiliateLinks;

  if (affiliateLinks === 0) {
    errors.push('ExchangeAffiliateLinks não encontrado');
  }

  // Validar FAQ
  const hasFAQ = contentBody.includes('FAQ') || contentBody.includes('Perguntas Frequentes');
  stats.hasFAQ = hasFAQ;

  if (!hasFAQ) {
    warnings.push('Seção FAQ não encontrada');
  }

  // Validar imagens
  const imagesWithoutAlt = (contentBody.match(/!\[\]\(/g) || []).length;
  if (imagesWithoutAlt > 0) {
    warnings.push(`${imagesWithoutAlt} imagem(ns) sem alt text`);
  }

  // Validar coverImage
  const coverImageMatch = frontmatter.match(/src:\s*['"](.+?)['"]/);
  if (coverImageMatch) {
    const imagePath = coverImageMatch[1];
    const fullImagePath = path.join('public', imagePath);
    if (!fs.existsSync(fullImagePath)) {
      errors.push(`Imagem de capa não encontrada: ${imagePath}`);
    }
  }

  return { errors, warnings, stats };
}

function generateReport() {
  console.log('\n📊 Validate Articles - A Cifra');
  console.log('═'.repeat(70));

  const articles = getAllArticles();
  console.log(`\n📄 Total de artigos: ${articles.length}`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const articlesByCategory = {};
  const problemArticles = [];

  articles.forEach(article => {
    const result = validateArticle(article);
    const fileName = path.basename(article);

    if (result.errors.length > 0 || result.warnings.length > 0) {
      problemArticles.push({
        file: fileName,
        path: article,
        errors: result.errors,
        warnings: result.warnings,
        stats: result.stats
      });
    }

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    // Contar por categoria
    if (result.stats.category) {
      articlesByCategory[result.stats.category] =
        (articlesByCategory[result.stats.category] || 0) + 1;
    }
  });

  // Exibir artigos com problemas
  if (problemArticles.length > 0) {
    console.log('\n⚠️  ARTIGOS COM PROBLEMAS');
    console.log('─'.repeat(70));

    problemArticles.forEach(article => {
      console.log(`\n📄 ${article.file}`);

      if (article.stats.wordCount) {
        console.log(`   📝 ${article.stats.wordCount} palavras`);
      }
      if (article.stats.category) {
        console.log(`   📂 Categoria: ${article.stats.category}`);
      }

      if (article.errors.length > 0) {
        console.log(`   ❌ Erros (${article.errors.length}):`);
        article.errors.forEach(error => {
          console.log(`      • ${error}`);
        });
      }

      if (article.warnings.length > 0) {
        console.log(`   ⚠️  Avisos (${article.warnings.length}):`);
        article.warnings.forEach(warning => {
          console.log(`      • ${warning}`);
        });
      }
    });
  }

  // Estatísticas por categoria
  console.log('\n📊 ARTIGOS POR CATEGORIA');
  console.log('─'.repeat(70));

  Object.entries(articlesByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count} artigos`);
    });

  // Resumo final
  console.log('\n═'.repeat(70));
  console.log('📈 RESUMO GERAL');
  console.log('═'.repeat(70));
  console.log(`Total de artigos: ${articles.length}`);
  console.log(`Artigos com problemas: ${problemArticles.length}`);
  console.log(`Total de erros: ${totalErrors}`);
  console.log(`Total de avisos: ${totalWarnings}`);

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✅ Todos os artigos estão em conformidade!');
  } else if (totalErrors === 0) {
    console.log('\n✅ Nenhum erro crítico encontrado');
    console.log('💡 Revise os avisos para melhorar a qualidade');
  } else {
    console.log('\n⚠️  Corrija os erros antes de publicar');
  }

  console.log('═'.repeat(70));

  // Retornar código de saída
  process.exit(totalErrors > 0 ? 1 : 0);
}

// Executar
if (require.main === module) {
  generateReport();
}

module.exports = { validateArticle, getAllArticles };

