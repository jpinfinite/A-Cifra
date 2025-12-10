#!/usr/bin/env node

/**
 * Auto SEO Checker
 * Verifica automaticamente SEO de todos os artigos
 * Uso: node scripts/auto-seo-checker.js
 */

const fs = require('fs');
const path = require('path');
const { validateFrontmatter, validateContent } = require('./kiroArticleProcessor');

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles');

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

function checkSEO() {
  console.log('\n🔍 AUTO SEO CHECKER - Verificando todos os artigos...\n');

  const articles = getAllArticles(ARTICLES_DIR);
  console.log(`📚 Total de artigos encontrados: ${articles.length}\n`);

  const results = {
    approved: [],
    warnings: [],
    errors: []
  };

  articles.forEach((articlePath, index) => {
    const content = fs.readFileSync(articlePath, 'utf-8');
    const frontmatterResult = validateFrontmatter(content);
    const contentResult = validateContent(content);

    const hasErrors = frontmatterResult.errors.length > 0 || contentResult.errors.length > 0;
    const hasWarnings = frontmatterResult.warnings.length > 0 || contentResult.warnings.length > 0;

    const fileName = path.basename(articlePath);

    if (hasErrors) {
      results.errors.push({
        file: fileName,
        path: articlePath,
        errors: [...frontmatterResult.errors, ...contentResult.errors]
      });
    } else if (hasWarnings) {
      results.warnings.push({
        file: fileName,
        path: articlePath,
        warnings: [...frontmatterResult.warnings, ...contentResult.warnings]
      });
    } else {
      results.approved.push(fileName);
    }

    // Progress
    if ((index + 1) % 10 === 0) {
      console.log(`   Processados: ${index + 1}/${articles.length}`);
    }
  });

  // Relatório Final
  console.log('\n' + '═'.repeat(70));
  console.log('📊 RELATÓRIO FINAL - AUTO SEO CHECKER');
  console.log('═'.repeat(70));

  console.log(`\n✅ Aprovados: ${results.approved.length}`);
  console.log(`⚠️  Com Avisos: ${results.warnings.length}`);
  console.log(`❌ Com Erros: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log('\n🚨 ARTIGOS COM ERROS CRÍTICOS:');
    results.errors.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.file}`);
      item.errors.forEach(error => console.log(`   • ${error}`));
    });
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  ARTIGOS COM AVISOS:');
    results.warnings.slice(0, 10).forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.file}`);
      item.warnings.slice(0, 3).forEach(warning => console.log(`   • ${warning}`));
    });

    if (results.warnings.length > 10) {
      console.log(`\n   ... e mais ${results.warnings.length - 10} artigos com avisos`);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log(`\n💡 Taxa de aprovação: ${((results.approved.length / articles.length) * 100).toFixed(1)}%`);
  console.log('═'.repeat(70) + '\n');
}

checkSEO();
