
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// --- Helper Functions from relatedArticles.ts (Adapted for Node) ---

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function extractKeywords(title) {
  const stopWords = ['o', 'a', 'de', 'da', 'do', 'em', 'para', 'com', 'e', 'ou', 'como', 'que', 'um', 'uma',
                     'the', 'of', 'in', 'to', 'for', 'with', 'and', 'or', 'as', 'that', 'a', 'an', 'how', 'what', 'why'];

  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .split(/[\s\-:]+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 3); // Top 3 keywords
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getRelatedArticles(currentArticle, allArticles, limit = 5) {
  const otherArticles = allArticles.filter(a => a.slug !== currentArticle.slug);

  const scored = otherArticles.map(article => {
    let score = 0;

    // Same category (extracted from path or frontmatter)
    const currentCat = currentArticle.data.categorySlug || currentArticle.data.category;
    const otherCat = article.data.categorySlug || article.data.category;

    if (currentCat && otherCat && currentCat === otherCat) {
      score += 10;
    }

    // Common tags
    const currentTags = currentArticle.data.tags || [];
    const otherTags = article.data.tags || [];
    const commonTags = otherTags.filter(tag => currentTags.includes(tag));
    score += commonTags.length * 5;

    // Recency (simplified)
    if (article.data.publishedAt && currentArticle.data.publishedAt) {
         // simple date string compare for rough closeness
         if (article.data.publishedAt.substring(0,7) === currentArticle.data.publishedAt.substring(0,7)) score += 2;
    }

    return { article, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}

function addInlineLinks(content, relatedArticles, currentLanguage) {
  let modifiedContent = content;
  let linkCount = 0;
  const MAX_LINKS_PER_ARTICLE = 4; // Don't overdo it

  // Filter related articles by language
  const sameLangArticles = relatedArticles.filter(a => {
      // Basic language detection from path
      const isEn = a.filePath.includes('/en/');
      const isEs = a.filePath.includes('/es/');
      const isPt = !isEn && !isEs;

      if (currentLanguage === 'en') return isEn;
      if (currentLanguage === 'es') return isEs;
      return isPt;
  });

  for (const article of sameLangArticles) {
      if (linkCount >= MAX_LINKS_PER_ARTICLE) break;

      const keywords = extractKeywords(article.data.title);

      for (const keyword of keywords) {
          // Regex to find keyword NOT inside existing link or header
          // This is tricky. Simplified approach: split by lines, check if line is "safe"
          const regex = new RegExp(`\\b(${escapeRegex(keyword)})\\b`, 'i');
          const lines = modifiedContent.split('\n');
          let replacedInArticle = false;

          for (let i = 0; i < lines.length; i++) {
              const line = lines[i];

              // Skip headers, existing links, code blocks, or short lines
              if (line.trim().startsWith('#') ||
                  line.includes('](') ||
                  line.includes('<ExchangeAffiliateLinks') ||
                  line.trim().length < 50) {
                  continue;
              }

              if (regex.test(line)) {
                  // Determine prefix based on language
                  let prefix = '/artigo/';
                  if (currentLanguage === 'en') prefix = '/en/article/';
                  if (currentLanguage === 'es') prefix = '/es/article/';

                  lines[i] = line.replace(regex, `[$1](${prefix}${article.slug} "${article.data.title}")`);
                  modifiedContent = lines.join('\n');
                  replacedInArticle = true;
                  linkCount++;
                  break; // Only one link per target article
              }
          }
          if (replacedInArticle) break;
      }
  }

  return { content: modifiedContent, count: linkCount };
}

// --- Main ---

async function main() {
  console.log('🔗 SMART INTERNAL LINKER v1.0\n');

  const filePaths = getAllFiles(ARTICLES_DIR);
  console.log(`📚 Carregando ${filePaths.length} artigos...`);

  // Load all articles into memory
  const allArticles = filePaths.map(filePath => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      return {
          filePath,
          slug: path.basename(filePath, '.md'),
          data,
          content
      };
  });

  let totalLinksAdded = 0;

  for (const article of allArticles) {
      // Detect language
      let lang = 'pt-BR';
      if (article.filePath.includes('/en/')) lang = 'en';
      if (article.filePath.includes('/es/')) lang = 'es';

      console.log(`Processing: ${article.slug} (${lang})`);

      const related = getRelatedArticles(article, allArticles, 10); // Get top 10 relevant candidates
      const result = addInlineLinks(article.content, related, lang);

      if (result.count > 0) {
          const newContent = matter.stringify(result.content, article.data);
          fs.writeFileSync(article.filePath, newContent);
          console.log(`   ✅ Added ${result.count} links.`);
          totalLinksAdded += result.count;
      }
  }

  console.log(`\n🎉 Finalizado! Total de ${totalLinksAdded} links internos criados.`);
}

main();
