/**
 * Otimizador Automático de SEO
 * Analisa artigos existentes e adiciona melhorias de SEO automaticamente
 * Execute: node scripts/otimizar-seo-batch.js
 */

const fs = require('fs');
const path = require('path');

// Palavras-chave para link building interno
const INTERNAL_LINK_KEYWORDS = {
  'bitcoin': ['/artigo/bitcoin-200k-2026-previsao-institucional', '/artigo/bitcoin-queda-ciclos-mercado-oportunidades'],
  'ethereum': ['/artigo/staking-ethereum-guia-renda-passiva-2026', '/artigo/ethereum-2026-atualizacao-preco-analise'],
  'exchange': ['/artigo/melhores-exchanges-cripto-2026-comparacao-taxas'],
  'hardware wallet': ['/artigo/ledger-vs-trezor-review', '/artigo/hardware-wallet-2026-ledger-trezor-comparativo'],
  'defi': ['/artigo/defi-yield-farming-protocolos-seguros-2026'],
  'staking': ['/artigo/staking-ethereum-guia-renda-passiva-2026'],
  'segurança': ['/artigo/ciberseguranca-2026-proteger-criptomoedas-golpes']
};

function analyzeArticleSEO(content, filename) {
  const issues = [];
  const suggestions = [];

  // 1. Verificar comprimento do título
  const titleMatch = content.match(/title:\s*['"](.+)['"]/);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length > 70) {
      issues.push(`Título muito longo (${title.length} caracteres)`);
    } else if (title.length < 30) {
      issues.push(`Título muito curto (${title.length} caracteres)`);
    }
  }

  // 2. Verificar meta description
  const metaDescMatch = content.match(/metaDescription:\s*['"](.+)['"]/);
  if (metaDescMatch) {
    const metaDesc = metaDescMatch[1];
    if (metaDesc.length > 160) {
      issues.push(`Meta description muito longa (${metaDesc.length} caracteres)`);
    } else if (metaDesc.length < 120) {
      suggestions.push(`Meta description poderia ser mais descritiva`);
    }
  } else {
    issues.push('Meta description ausente');
  }

  // 3. Verificar H2/H3
  const h2Count = (content.match(/^##\s+/gm) || []).length;
  const h3Count = (content.match(/^###\s+/gm) || []).length;

  if (h2Count < 3) {
    suggestions.push('Adicionar mais subtítulos H2 para melhorar estrutura');
  }

  // 4. Verificar densidade de keywords
  const bodyContent = content.split('---').slice(2).join('');
  const wordCount = bodyCount.split(/\s+/).length;

  if (wordCount < 1500) {
    suggestions.push(`Artigo curto (${wordCount} palavras). Ideal: 2000+`);
  }

  // 5. Verificar links internos
  const internalLinks = (content.match(/\[.*?\]\(\/artigo\/.*?\)/g) || []).length;

  if (internalLinks < 3) {
    suggestions.push(`Adicionar mais links internos (atual: ${internalLinks})`);
  }

  return { issues, suggestions, stats: { h2Count, h3Count, wordCount, internalLinks } };
}

function addInternalLinks(content) {
  let updatedContent = content;
  let linksAdded = 0;

  // Procura oportunidades de link building
  for (const [keyword, links] of Object.entries(INTERNAL_LINK_KEYWORDS)) {
    // Regex para encontrar a palavra sem já estar em link
    const regex = new RegExp(`(?<!\\[)\\b${keyword}\\b(?!\\])`, 'gi');

    const matches = content.match(regex);
    if (matches && matches.length > 0 && linksAdded < 5) {
      // Adiciona link na primeira ocorrência
      const link = links[0];
      updatedContent = updatedContent.replace(regex, `[${keyword}](${link})`);
      linksAdded++;
    }
  }

  return { content: updatedContent, linksAdded };
}

function optimizeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);

  console.log(`\n📄 Analisando: ${filename}`);

  // 1. Análise SEO
  const analysis = analyzeArticleSEO(content, filename);

  // 2. Adicionar links internos
  const { content: optimizedContent, linksAdded } = addInternalLinks(content);

  // 3. Relatório
  if (analysis.issues.length > 0) {
    console.log('   ⚠️  Problemas encontrados:');
    analysis.issues.forEach(issue => console.log(`      - ${issue}`));
  }

  if (analysis.suggestions.length > 0) {
    console.log('   💡 Sugestões:');
    analysis.suggestions.forEach(sug => console.log(`      - ${sug}`));
  }

  if (linksAdded > 0) {
    console.log(`   ✅ ${linksAdded} links internos adicionados`);

    // Salvar versão otimizada
    fs.writeFileSync(filePath, optimizedContent);
    console.log('   💾 Arquivo atualizado');
  }

  return {
    filename,
    issues: analysis.issues.length,
    suggestions: analysis.suggestions.length,
    linksAdded,
    stats: analysis.stats
  };
}

function main() {
  console.log('🔍 Otimizador Automático de SEO - A Cifra\n');
  console.log('═'.repeat(50));

  const articlesDir = path.join(__dirname, '../content/articles');
  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(articlesDir, f));

  console.log(`\n📚 ${files.length} artigos encontrados`);
  console.log('🚀 Iniciando otimização...\n');

  const results = files.map(optimizeArticle);

  // Relatório final
  console.log('\n' + '═'.repeat(50));
  console.log('\n📊 RELATÓRIO FINAL DE OTIMIZAÇÃO\n');

  const totalIssues = results.reduce((sum, r) => sum + r.issues, 0);
  const totalSuggestions = results.reduce((sum, r) => sum + r.suggestions, 0);
  const totalLinksAdded = results.reduce((sum, r) => sum + r.linksAdded, 0);

  console.log(`✅ ${files.length} artigos analisados`);
  console.log(`🔗 ${totalLinksAdded} links internos adicionados`);
  console.log(`⚠️  ${totalIssues} problemas identificados`);
  console.log(`💡 ${totalSuggestions} sugestões de melhoria\n`);

  // Salvar relatório detalhado
  const report = {
    date: new Date().toISOString(),
    totalArticles: files.length,
    totalLinksAdded,
    totalIssues,
    totalSuggestions,
    articleResults: results
  };

  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'seo-optimization-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('📄 Relatório completo salvo em: data/seo-optimization-report.json\n');
}

main();
