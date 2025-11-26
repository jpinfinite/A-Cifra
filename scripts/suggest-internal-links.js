#!/usr/bin/env node

/**
 * Suggest Internal Links
 * Sugere links internos relevantes paraos
 * Uso: node scripts/suggest-internal-links.js <caminho-do-artigo>
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles');

function extractKeywords(content) {
  const keywords = [];

  // Extrair do frontmatter
  const tagsMatch = content.match(/tags:\s*\[(.*?)\]/);
  if (tagsMatch) {
    const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
    keywords.push(...tags);
  }

  // Extrair do título
  const titleMatch = content.match(/^# (.+)$/m);
  if (titleMatch) {
    const titleWords = titleMatch[1].toLowerCase().split(/\s+/);
    keywords.push(...titleWords.filter(w => w.length > 4));
  }

  return [...new Set(keywords)];
}

function getAllArticles() {
  const articles = [];

  function scan(dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'en') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const slugMatch = content.match(/slug:\s*['"](.+?)['"]/);
        const titleMatch = content.match(/^# (.+)$/m);
        const categoryMatch = content.match(/categorySlug:\s*['"]?(\w+)['"]?/);

        if (slugMatch && titleMatch) {
          articles.push({
            slug: slugMatch[1],
            title: titleMatch[1],
            category: categoryMatch ? categoryMatch[1] : 'unknown',
            path: fullPath,
            content: content
          });
        }
      }
    });
  }

  scan(ARTICLES_DIR);
  return articles;
}

function suggestLinks(articlePath) {
  console.log('\n🔗 SUGGEST INTERNAL LINKS\n');

  if (!fs.existsSync(articlePath)) {
    console.log(`❌ Arquivo não encontrado: ${articlePath}`);
    process.exit(1);
  }

  const targetContent = fs.readFileSync(articlePath, 'utf-8');
  const targetKeywords = extractKeywords(targetContent);
  const targetCategoryMatch = targetContent.match(/categorySlug:\s*['"]?(\w+)['"]?/);
  const targetCategory = targetCategoryMatch ? targetCategoryMatch[1] : null;

  console.log(`📄 Artigo: ${path.basename(articlePath)}`);
  console.log(`🏷️  Keywords: ${targetKeywords.join(', ')}`);
  console.log(`📁 Categoria: ${targetCategory}\n`);

  const allArticles = getAllArticles();
  const suggestions = [];

  allArticles.forEach(article => {
    if (article.path === articlePath) return;

    let score = 0;
    let reasons = [];

    // Mesma categoria = +3 pontos
    if (article.category === targetCategory) {
      score += 3;
      reasons.push('mesma categoria');
    }

    // Keywords em comum = +2 pontos cada
    const articleKeywords = extractKeywords(article.content);
    const commonKeywords = targetKeywords.filter(k =>
      articleKeywords.some(ak => ak.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(ak.toLowerCase()))
    );

    if (commonKeywords.length > 0) {
      score += commonKeywords.length * 2;
      reasons.push(`${commonKeywords.length} keyword(s) em comum`);
    }

    // Menção no conteúdo = +5 pontos
    const titleWords = article.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const contentLower = targetContent.toLowerCase();
    const mentionedWords = titleWords.filter(w => contentLower.includes(w));

    if (mentionedWords.length > 0) {
      score += 5;
      reasons.push('mencionado no conteúdo');
    }

    if (score > 0) {
      suggestions.push({
        title: article.title,
        slug: article.slug,
        category: article.category,
        score: score,
        reasons: reasons
      });
    }
  });

  // Ordenar por score
  suggestions.sort((a, b) => b.score - a.score);

  // Mostrar top 10
  console.log('🎯 TOP 10 SUGESTÕES DE LINKS INTERNOS:\n');

  suggestions.slice(0, 10).forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion.title}`);
    console.log(`   URL: /artigo/${suggestion.slug}`);
    console.log(`   Categoria: ${suggestion.category}`);
    console.log(`   Score: ${suggestion.score} (${suggestion.reasons.join(', ')})`);
    console.log(`   Markdown: [${suggestion.title}](/artigo/${suggestion.slug})\n`);
  });

  console.log('💡 Dica: Adicione 3-5 desses links no seu artigo para melhorar SEO!\n');
}

// Executar
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\n❌ Uso: node scripts/suggest-internal-links.js <caminho-do-artigo>');
    console.log('\n📖 Exemplo:');
    console.log('  node scripts/suggest-internal-links.js content/articles/meu-artigo.md\n');
    process.exit(1);
  }

  suggestLinks(args[0]);
}

