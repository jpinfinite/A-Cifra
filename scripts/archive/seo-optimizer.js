#!/usr/bin/env node

/**
 * SEO Optimizer - A Cifra
 * Automatiza otimizações de SEO em artigos
 * Uso: node scripts/seo-optimizer.js <caminho-do-artigo>
 */

const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
  titleMin: 50,
  titleMax: 60,
  descriptionMin: 150,
  descriptionMax: 160,
  keywordDensityMin: 1,
  keywordDensityMax: 2,
  minInternalLinks: 3,
  maxInternalLinks: 5
};

// Categorias válidas
const VALID_CATEGORIES = [
  'bitcoin', 'altcoins', 'defi', 'ethereum', 'nfts',
  'trading', 'seguranca', 'educacao', 'regulacao', 'analises'
];

// Mapeamento de artigos para sugestão de links internos
const ARTICLE_MAP = {
  'bitcoin': [
    '/artigo/bitcoin-guia-completo-iniciantes-2025',
    '/artigo/como-comprar-primeira-criptomoeda',
    '/artigo/bitcoin-2026-previsao-preco-analise-completa'
  ],
  'defi': [
    '/artigo/defi-futuro-financa-descentralizada-investir-seguranca',
    '/artigo/pools-liquidez-coracao-financa-descentralizada-defi',
    '/artigo/yield-farming-guia-completo'
  ],
  'ethereum': [
    '/artigo/ethereum-2-0-futuro-segunda-maior-criptomoeda',
    '/artigo/como-fazer-staking-ethereum',
    '/artigo/staking-ethereum-2025-guia-completo-renda-passiva'
  ],
  'altcoins': [
    '/artigo/altcoins-promissoras-2025-analise-fundamentalista',
    '/artigo/como-analisar-criptomoedas-guia-completo-investidores',
    '/artigo/analise-fundamentalista-avaliar-projetos-cripto'
  ],
  'trading': [
    '/artigo/analise-tecnica-indicadores-essenciais-cripto',
    '/artigo/rsi-macd-fibonacci-analise-tecnica',
    '/artigo/padroes-graficos-candlestick-cripto'
  ],
  'seguranca': [
    '/artigo/como-proteger-criptomoedas-guia-completo-seguranca',
    '/artigo/carteiras-digitais-tipos-e-seguranca',
    '/artigo/cold-wallet-vs-hot-wallet-seguranca'
  ],
  'educacao': [
    '/artigo/o-que-e-blockchain-guia-iniciantes',
    '/artigo/blockchain-tecnologia-revolucionaria-mudando-mundo',
    '/artigo/como-investir-criptomoedas-2025-guia-completo'
  ]
};

function extractKeywords(content) {
  // Remove frontmatter e código
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .toLowerCase();

  // Palavras comuns a ignorar
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'sob',
    'e', 'ou', 'mas', 'que', 'se', 'como', 'quando', 'onde', 'mais',
    'muito', 'pode', 'ser', 'ter', 'fazer', 'este', 'esse', 'aquele'
  ]);

  // Extrair palavras
  const words = cleanContent.match(/\b[aêíïóôõöúçñ]{4,}\b/g) || [];

  // Contar frequência
  const frequency = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // Ordenar por frequência
  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return sorted;
}

function analyzeKeywordDensity(content, keyword) {
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, '')
    .toLowerCase();

  const totalWords = cleanContent.split(/\s+/).length;
  const keywordCount = (cleanContent.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;

  const density = (keywordCount / totalWords) * 100;

  return {
    keyword,
    count: keywordCount,
    totalWords,
    density: density.toFixed(2)
  };
}

function suggestInternalLinks(content, category) {
  const suggestions = [];

  // Obter artigos relacionados da categoria
  const relatedArticles = ARTICLE_MAP[category] || [];

  // Verificar links já existentes
  const existingLinks = (content.match(/\[.*?\]\(\/artigo\/.*?\)/g) || [])
    .map(link => link.match(/\(([^)]+)\)/)[1]);

  // Sugerir novos links
  relatedArticles.forEach(article => {
    if (!existingLinks.includes(article)) {
      suggestions.push(article);
    }
  });

  return suggestions.slice(0, 5);
}

function optimizeTitle(title) {
  const suggestions = [];

  if (title.length < CONFIG.titleMin) {
    suggestions.push({
      type: 'warning',
      message: `Título muito curto (${title.length} chars). Adicione mais contexto.`,
      suggestion: `Considere expandir para ${CONFIG.titleMin}-${CONFIG.titleMax} caracteres`
    });
  }

  if (title.length > CONFIG.titleMax) {
    suggestions.push({
      type: 'warning',
      message: `Título muito longo (${title.length} chars). Pode ser truncado no Google.`,
      suggestion: `Reduza para ${CONFIG.titleMin}-${CONFIG.titleMax} caracteres`
    });
  }

  // Verificar se contém ano
  if (!/202[4-9]|203[0-9]/.test(title)) {
    suggestions.push({
      type: 'tip',
      message: 'Considere adicionar o ano atual para melhorar relevância',
      suggestion: `Exemplo: "${title} 2025"`
    });
  }

  // Verificar se contém números
  if (!/\d/.test(title)) {
    suggestions.push({
      type: 'tip',
      message: 'Títulos com números tendem a ter melhor CTR',
      suggestion: 'Considere adicionar números quando relevante'
    });
  }

  return suggestions;
}

function optimizeMetaDescription(description) {
  const suggestions = [];

  if (!description) {
    suggestions.push({
      type: 'error',
      message: 'Meta description ausente',
      suggestion: 'Crie uma descrição de 150-160 caracteres'
    });
    return suggestions;
  }

  if (description.length < CONFIG.descriptionMin) {
    suggestions.push({
      type: 'warning',
      message: `Meta description muito curta (${description.length} chars)`,
      suggestion: `Expanda para ${CONFIG.descriptionMin}-${CONFIG.descriptionMax} caracteres`
    });
  }

  if (description.length > CONFIG.descriptionMax) {
    suggestions.push({
      type: 'warning',
      message: `Meta description muito longa (${description.length} chars)`,
      suggestion: `Reduza para ${CONFIG.descriptionMin}-${CONFIG.descriptionMax} caracteres`
    });
  }

  // Verificar call-to-action
  const ctas = ['saiba', 'descubra', 'aprenda', 'entenda', 'veja', 'confira'];
  const hasCTA = ctas.some(cta => description.toLowerCase().includes(cta));

  if (!hasCTA) {
    suggestions.push({
      type: 'tip',
      message: 'Considere adicionar um call-to-action',
      suggestion: 'Use verbos como: Saiba, Descubra, Aprenda, Entenda'
    });
  }

  return suggestions;
}

function generateSEOReport(filePath) {
  console.log('\n🔍 SEO Optimizer - A Cifra');
  console.log('═'.repeat(60));

  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Extrair frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log('\n❌ Frontmatter não encontrado');
    process.exit(1);
  }

  const frontmatter = frontmatterMatch[1];

  // Extrair dados
  const titleMatch = frontmatter.match(/title:\s*['"](.+?)['"]/);
  const categoryMatch = frontmatter.match(/categorySlug:\s*['"]?(\w+)['"]?/);
  const metaTitleMatch = frontmatter.match(/metaTitle:\s*['"](.+?)['"]/);
  const metaDescMatch = frontmatter.match(/metaDescription:\s*['"](.+?)['"]/);

  const title = titleMatch ? titleMatch[1] : '';
  const category = categoryMatch ? categoryMatch[1] : '';
  const metaTitle = metaTitleMatch ? metaTitleMatch[1] : title;
  const metaDesc = metaDescMatch ? metaDescMatch[1] : '';

  console.log(`\n📄 Arquivo: ${path.basename(filePath)}`);
  console.log(`📂 Categoria: ${category}`);

  // Análise de título
  console.log('\n📌 ANÁLISE DE TÍTULO');
  console.log('─'.repeat(60));
  console.log(`Título: ${title}`);
  console.log(`Comprimento: ${title.length} caracteres`);

  const titleSuggestions = optimizeTitle(metaTitle);
  if (titleSuggestions.length > 0) {
    titleSuggestions.forEach(s => {
      const icon = s.type === 'error' ? '❌' : s.type === 'warning' ? '⚠️' : '💡';
      console.log(`${icon} ${s.message}`);
      console.log(`   → ${s.suggestion}`);
    });
  } else {
    console.log('✅ Título otimizado!');
  }

  // Análise de meta description
  console.log('\n📝 ANÁLISE DE META DESCRIPTION');
  console.log('─'.repeat(60));
  console.log(`Description: ${metaDesc}`);
  console.log(`Comprimento: ${metaDesc.length} caracteres`);

  const descSuggestions = optimizeMetaDescription(metaDesc);
  if (descSuggestions.length > 0) {
    descSuggestions.forEach(s => {
      const icon = s.type === 'error' ? '❌' : s.type === 'warning' ? '⚠️' : '💡';
      console.log(`${icon} ${s.message}`);
      console.log(`   → ${s.suggestion}`);
    });
  } else {
    console.log('✅ Meta description otimizada!');
  }

  // Análise de keywords
  console.log('\n🔑 ANÁLISE DE KEYWORDS');
  console.log('─'.repeat(60));

  const keywords = extractKeywords(content);
  console.log('Top 10 palavras mais frequentes:');
  keywords.forEach(([word, count], index) => {
    const density = analyzeKeywordDensity(content, word);
    console.log(`${index + 1}. ${word}: ${count}x (densidade: ${density.density}%)`);
  });

  // Sugestão de links internos
  console.log('\n🔗 SUGESTÃO DE LINKS INTERNOS');
  console.log('─'.repeat(60));

  const linkSuggestions = suggestInternalLinks(content, category);
  if (linkSuggestions.length > 0) {
    console.log('Artigos relacionados para linkar:');
    linkSuggestions.forEach((link, index) => {
      console.log(`${index + 1}. ${link}`);
    });
  } else {
    console.log('✅ Já possui links internos suficientes');
  }

  console.log('\n═'.repeat(60));
  console.log('✅ Análise SEO concluída!');
  console.log('═'.repeat(60));
}

// Executar
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\n❌ Uso: node scripts/seo-optimizer.js <caminho-do-artigo>');
    console.log('\nExemplo:');
    console.log('  node scripts/seo-optimizer.js content/articles/meu-artigo.md');
    process.exit(1);
  }

  generateSEOReport(args[0]);
}

module.exports = {
  extractKeywords,
  analyzeKeywordDensity,
  suggestInternalLinks,
  optimizeTitle,
  optimizeMetaDescription
};

