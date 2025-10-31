#!/usr/bin/env node

/**
 * Script para extrair artigos do articles.ts e criar arquivos Markdown
 */

const fs = require('fs');
const path = require('path');

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

// Lista de artigos a extrair (manualmente identificados)
const articles = [
  {
    id: '17',
    slug: 'tendencias-cripto-outubro-2025',
    category: 'analises'
  },
  {
    id: '16',
    slug: 'exchanges-criptomoedas-guia-completo',
    category: 'educacao'
  },
  {
    id: '15',
    slug: 'perspectivas-otimistas-mercado-cripto-final-2025',
    category: 'analises'
  },
  {
    id: '14',
    slug: 'criptomoedas-2026-maturidade-adoacao-institucional-fim-euforia-especulativa',
    category: 'analises'
  },
  {
    id: '13',
    slug: 'solana-ascensao-etf-spot-mudar-jogo-300-dolares',
    category: 'altcoins'
  },
  {
    id: '12',
    slug: 'centralizacao-vs-descentralizacao-dilema-distribuicao-poder',
    category: 'educacao'
  },
  {
    id: '11',
    slug: 'pools-liquidez-coracao-financa-descentralizada-defi',
    category: 'defi'
  },
  {
    id: '10',
    slug: 'blockchain-tecnologia-revolucionaria-mudando-mundo',
    category: 'educacao'
  },
  {
    id: '9',
    slug: 'gamefi-revolucionando-industria-jogos-investir-seguranca',
    category: 'defi'
  },
  {
    id: '8',
    slug: 'nfts-revolucionando-arte-colecionaveis-mercado-digital',
    category: 'nfts'
  },
  {
    id: '7',
    slug: 'defi-futuro-financa-descentralizada-investir-seguranca',
    category: 'defi'
  },
  {
    id: '6',
    slug: 'renascimento-bitcoin-novo-ciclo-crescimento-2025',
    category: 'bitcoin'
  },
  {
    id: '5',
    slug: 'como-analisar-criptomoedas-guia-completo-investidores',
    category: 'educacao'
  },
  {
    id: '3',
    slug: 'como-proteger-criptomoedas-guia-completo-seguranca',
    category: 'seguranca'
  }
];

const articlesDir = path.join(__dirname, '../content/articles');

// Criar pasta se não existir
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

console.log('🔄 Extraindo artigos do articles.ts...\n');

// Ler o arquivo articles.ts
const articlesFile = path.join(__dirname, '../src/data/articles.ts');
const content = fs.readFileSync(articlesFile, 'utf8');

let extractedCount = 0;
let skippedCount = 0;

articles.forEach(article => {
  const filename = `${article.slug}.md`;
  const filepath = path.join(articlesDir, filename);
  
  // Verificar se já existe
  if (fs.existsSync(filepath)) {
    console.log(`⏭️  Pulando ${article.id} - ${filename} (já existe)`);
    skippedCount++;
    return;
  }
  
  // Procurar o artigo no conteúdo
  const idPattern = new RegExp(`id: '${article.id}'[\\s\\S]*?(?=\\n  \\},\\n  \\{|\\n  \\}\\n\\])`);
  const match = content.match(idPattern);
  
  if (!match) {
    console.log(`❌ Não encontrado: ${article.id}`);
    return;
  }
  
  const articleContent = match[0];
  
  // Extrair informações básicas
  const titleMatch = articleContent.match(/title: '([^']+)'/);
  const excerptMatch = articleContent.match(/excerpt: '([^']+)'/);
  const coverImageMatch = articleContent.match(/coverImage: \{[^}]+src: '([^']+)'[^}]+alt: '([^']+)'[^}]+width: (\d+)[^}]+height: (\d+)/);
  const publishedAtMatch = articleContent.match(/publishedAt: new Date\('([^']+)'\)/);
  const tagsMatch = articleContent.match(/tags: \[([^\]]+)\]/);
  const seoMatch = articleContent.match(/seo: \{[^}]+metaTitle: '([^']+)'[^}]+metaDescription: '([^']+)'[^}]+keywords: \[([^\]]+)\]/);
  const contentMatch = articleContent.match(/content: `([\s\S]*?)`,\s*coverImage/);
  
  if (!titleMatch || !excerptMatch || !contentMatch) {
    console.log(`❌ Dados incompletos: ${article.id}`);
    return;
  }
  
  const title = titleMatch[1];
  const excerpt = excerptMatch[1];
  const coverSrc = coverImageMatch ? coverImageMatch[1] : '/images/default.jpg';
  const coverAlt = coverImageMatch ? coverImageMatch[2] : title;
  const coverWidth = coverImageMatch ? coverImageMatch[3] : '1200';
  const coverHeight = coverImageMatch ? coverImageMatch[4] : '630';
  const publishedAt = publishedAtMatch ? publishedAtMatch[1] : '2025-10-30';
  const tags = tagsMatch ? tagsMatch[1].replace(/'/g, '').split(', ').map(t => `  - '${t.trim()}'`).join('\n') : "  - 'cripto'";
  const metaTitle = seoMatch ? seoMatch[1] : `${title} | A Cifra`;
  const metaDescription = seoMatch ? seoMatch[2] : excerpt;
  const keywords = seoMatch ? seoMatch[3].replace(/'/g, '').split(', ').map(k => `    - '${k.trim()}'`).join('\n') : "    - 'criptomoedas'";
  const articleBody = contentMatch[1].trim();
  
  const cat = categoryMap[article.category] || categoryMap['educacao'];
  
  // Criar conteúdo do arquivo Markdown
  const markdownContent = `---
id: '${article.id}'
title: '${title}'
slug: '${article.slug}'
excerpt: '${excerpt}'
coverImage:
  src: '${coverSrc}'
  alt: '${coverAlt}'
  width: ${coverWidth}
  height: ${coverHeight}
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '${publishedAt}'
updatedAt: '${publishedAt}'
category:
  name: '${cat.name}'
  slug: '${cat.slug}'
  description: '${cat.description}'
tags:
${tags}
seo:
  metaTitle: '${metaTitle}'
  metaDescription: '${metaDescription}'
  keywords:
${keywords}
---

${articleBody}
`;
  
  // Salvar arquivo
  fs.writeFileSync(filepath, markdownContent, 'utf8');
  console.log(`✅ Criado: ${article.id} - ${filename}`);
  extractedCount++;
});

console.log(`\n📊 Resumo:`);
console.log(`   ✅ Extraídos: ${extractedCount}`);
console.log(`   ⏭️  Pulados: ${skippedCount}`);
console.log(`   📁 Total: ${extractedCount + skippedCount}\n`);

console.log('✅ Extração concluída!\n');
