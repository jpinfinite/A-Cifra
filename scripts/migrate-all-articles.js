#!/usr/bin/env node

/**
 * Script para migrar TODOS os artigos do backup para arquivos Markdown
 * 
 * Uso:
 *   node scripts/migrate-all-articles.js
 */

const fs = require('fs');
const path = require('path');

const BACKUP_FILE = path.join(__dirname, '../src/data/articles.ts.backup-migration');
const ARTICLES_DIR = path.join(__dirname, '../content/articles');

console.log('🔄 Iniciando migração de TODOS os artigos...\n');

// Verificar se o backup existe
if (!fs.existsSync(BACKUP_FILE)) {
  console.error('❌ Arquivo de backup não encontrado!');
  console.log('   Procurando em:', BACKUP_FILE);
  process.exit(1);
}

// Criar pasta se não existir
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

// Ler o arquivo de backup
console.log('📖 Lendo arquivo de backup...');
const content = fs.readFileSync(BACKUP_FILE, 'utf8');

// Função para extrair valor de uma propriedade
function extractValue(text, property) {
  const patterns = {
    id: /id:\s*'([^']+)'/,
    title: /title:\s*'([^']+)'/,
    slug: /slug:\s*'([^']+)'/,
    excerpt: /excerpt:\s*'([^']+)'/,
    publishedAt: /publishedAt:\s*new Date\('([^']+)'\)/,
    categorySlug: /getCategoryOrThrow\('([^']+)'\)/,
  };
  
  const match = text.match(patterns[property]);
  return match ? match[1] : null;
}

// Função para extrair array
function extractArray(text, property) {
  const pattern = new RegExp(`${property}:\\s*\\[([^\\]]+)\\]`);
  const match = text.match(pattern);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(item => item.trim().replace(/'/g, ''))
    .filter(item => item.length > 0);
}

// Função para extrair SEO
function extractSEO(text) {
  const metaTitleMatch = text.match(/metaTitle:\s*'([^']+)'/);
  const metaDescMatch = text.match(/metaDescription:\s*'([^']+)'/);
  const keywordsMatch = text.match(/keywords:\s*\[([^\]]+)\]/);
  
  return {
    metaTitle: metaTitleMatch ? metaTitleMatch[1] : '',
    metaDescription: metaDescMatch ? metaDescMatch[1] : '',
    keywords: keywordsMatch 
      ? keywordsMatch[1].split(',').map(k => k.trim().replace(/'/g, ''))
      : []
  };
}

// Função para extrair cover image
function extractCoverImage(text) {
  const srcMatch = text.match(/coverImage:\s*\{[^}]*src:\s*'([^']+)'/);
  const altMatch = text.match(/coverImage:\s*\{[^}]*alt:\s*'([^']+)'/);
  const widthMatch = text.match(/coverImage:\s*\{[^}]*width:\s*(\d+)/);
  const heightMatch = text.match(/coverImage:\s*\{[^}]*height:\s*(\d+)/);
  
  return {
    src: srcMatch ? srcMatch[1] : '/images/default.jpg',
    alt: altMatch ? altMatch[1] : 'Imagem do artigo',
    width: widthMatch ? widthMatch[1] : '1200',
    height: heightMatch ? heightMatch[1] : '630'
  };
}

// Função para extrair conteúdo
function extractContent(text) {
  const contentMatch = text.match(/content:\s*`([\s\S]*?)`,\s*coverImage:/);
  return contentMatch ? contentMatch[1].trim() : '';
}

// Mapeamento de categorias
const categoryMap = {
  'analises': { name: 'Análises', slug: 'analises', description: 'Análises de mercado cripto' },
  'educacao': { name: 'Educação', slug: 'educacao', description: 'Aprenda sobre criptomoedas' },
  'altcoins': { name: 'Altcoins', slug: 'altcoins', description: 'Análises de altcoins' },
  'bitcoin': { name: 'Bitcoin', slug: 'bitcoin', description: 'Tudo sobre Bitcoin' },
  'ethereum': { name: 'Ethereum', slug: 'ethereum', description: 'Tudo sobre Ethereum' },
  'defi': { name: 'DeFi', slug: 'defi', description: 'Finanças Descentralizadas' },
  'nfts': { name: 'NFTs', slug: 'nfts', description: 'Tokens Não-Fungíveis' },
  'seguranca': { name: 'Segurança', slug: 'seguranca', description: 'Segurança em cripto' },
};

// Dividir o conteúdo em artigos individuais
console.log('🔍 Procurando artigos no backup...\n');

// Regex para encontrar cada artigo
const articlePattern = /\{\s*id:\s*'(\d+)'[\s\S]*?(?=\n\s*\},\s*\{|\n\s*\}\s*\])/g;
const matches = [...content.matchAll(articlePattern)];

console.log(`📊 Encontrados ${matches.length} artigos no backup\n`);

let successCount = 0;
let skipCount = 0;
let errorCount = 0;

matches.forEach((match, index) => {
  const articleText = match[0];
  
  try {
    // Extrair informações
    const id = extractValue(articleText, 'id');
    const title = extractValue(articleText, 'title');
    const slug = extractValue(articleText, 'slug');
    const excerpt = extractValue(articleText, 'excerpt');
    const publishedAt = extractValue(articleText, 'publishedAt') || '2025-10-30';
    const categorySlug = extractValue(articleText, 'categorySlug') || 'educacao';
    const tags = extractArray(articleText, 'tags');
    const seo = extractSEO(articleText);
    const coverImage = extractCoverImage(articleText);
    const articleContent = extractContent(articleText);
    
    if (!id || !title || !slug) {
      console.log(`⚠️  Artigo ${index + 1}: Dados incompletos, pulando...`);
      skipCount++;
      return;
    }
    
    // Verificar se já existe
    const filename = `${slug}.md`;
    const filepath = path.join(ARTICLES_DIR, filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  ID ${id}: ${filename} (já existe)`);
      skipCount++;
      return;
    }
    
    // Obter categoria
    const category = categoryMap[categorySlug] || categoryMap['educacao'];
    
    // Formatar tags
    const tagsFormatted = tags.length > 0 
      ? tags.map(t => `  - '${t}'`).join('\n')
      : "  - 'cripto'";
    
    // Formatar keywords
    const keywordsFormatted = seo.keywords.length > 0
      ? seo.keywords.map(k => `    - '${k}'`).join('\n')
      : "    - 'criptomoedas'";
    
    // Criar conteúdo Markdown
    const markdownContent = `---
id: '${id}'
title: '${title}'
slug: '${slug}'
excerpt: '${excerpt}'
coverImage:
  src: '${coverImage.src}'
  alt: '${coverImage.alt}'
  width: ${coverImage.width}
  height: ${coverImage.height}
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '${publishedAt}'
updatedAt: '${publishedAt}'
category:
  name: '${category.name}'
  slug: '${category.slug}'
  description: '${category.description}'
tags:
${tagsFormatted}
seo:
  metaTitle: '${seo.metaTitle || title + ' | A Cifra'}'
  metaDescription: '${seo.metaDescription || excerpt}'
  keywords:
${keywordsFormatted}
---

${articleContent}
`;
    
    // Salvar arquivo
    fs.writeFileSync(filepath, markdownContent, 'utf8');
    console.log(`✅ ID ${id}: ${filename}`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ Erro no artigo ${index + 1}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Resumo da Migração:`);
console.log(`   ✅ Migrados com sucesso: ${successCount}`);
console.log(`   ⏭️  Pulados (já existiam): ${skipCount}`);
console.log(`   ❌ Erros: ${errorCount}`);
console.log(`   📁 Total processados: ${matches.length}\n`);

if (successCount > 0) {
  console.log('✅ Migração concluída com sucesso!');
  console.log(`\n📁 Artigos salvos em: ${ARTICLES_DIR}`);
  console.log('\n🎯 Próximos passos:');
  console.log('   1. Verifique os arquivos em content/articles/');
  console.log('   2. Teste o site: npm run dev');
  console.log('   3. Commit: git add . && git commit -m "feat: Migrar todos os artigos para Markdown"');
} else {
  console.log('⚠️  Nenhum artigo novo foi migrado.');
}
