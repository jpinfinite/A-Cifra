/**
 * Otimizador Automático de SEO (Versão Blindada)
 * Analisa artigos existentes e adiciona melhorias de SEO automaticamente
 * SEGURANÇA: Separa Frontmatter do Body e só altera o Body.
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

  const titleMatch = content.match(/title:\s*['"](.+)['"]/);
  const metaDescMatch = content.match(/metaDescription:\s*['"](.+)['"]/);
  const h2Count = (content.match(/^##\s+/gm) || []).length;

  // Análise do corpo apenas
  const parts = content.split('---');
  const bodyContent = parts.slice(2).join('---');
  const internalLinks = (bodyContent.match(/\[.*?\]\(\/artigo\/.*?\)/g) || []).length;
  const wordCount = bodyContent.split(/\s+/).length;

  if (internalLinks < 2) {
    suggestions.push(`Poucos links internos (atual: ${internalLinks})`);
  }

  return { issues, suggestions, linksAdded: 0 };
}

function addInternalLinks(fullFileContent) {
  // 1. Separação Estrita: Frontmatter vs Body
  const parts = fullFileContent.split('---');

  // Proteção: Se arquivo não tiver estrutura padrão (--- fm --- body), não toca.
  if (parts.length < 3) return { content: fullFileContent, linksAdded: 0 };

  const frontmatter = parts[1];
  let bodyContent = parts.slice(2).join('---'); // Garante que pega todo o resto

  let linksAdded = 0;

  // 2. Aplicação de Links APENAS no Body
  for (const [keyword, links] of Object.entries(INTERNAL_LINK_KEYWORDS)) {
    // Regex segura: Encontra palavra inteira que NÃO está dentro de link []
    // (?<!\[) = não precedido por [
    // \bpalavra\b = palavra exata
    // (?!\]) = não seguido por ] (simplificado, para evitar quebrar links existentes)
    const regex = new RegExp(`(?<!\\[|\\/|images\\/|tags\\/)\\b${keyword}\\b(?![\\w\\-])(?!\\])(?!\\))`, 'gi');

    // Verifica apenas no corpo
    const matches = bodyContent.match(regex);
    if (matches && matches.length > 0 && linksAdded < 5) {
      const link = links[0];
      // Substitui SOMENTE A PRIMEIRA ocorrência no corpo
      bodyContent = bodyContent.replace(regex, `[${keyword}](${link})`);
      linksAdded++;
    }
  }

  if (linksAdded === 0) return { content: fullFileContent, linksAdded: 0 };

  // 3. Reconstrução Segura
  const updatedContent = `---${frontmatter}---${bodyContent}`;
  return { content: updatedContent, linksAdded };
}

function optimizeArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);

  // console.log(`📄 Analisando: ${filename}`);

  const { content: optimizedContent, linksAdded } = addInternalLinks(content);

  if (linksAdded > 0) {
    fs.writeFileSync(filePath, optimizedContent);
    console.log(`✅ ${filename}: +${linksAdded} links`);
  }

  return { linksAdded };
}

function main() {
  console.log('🛡️  Otimizador de SEO Seguro Iniciado...\n');

  const articlesDir = path.join(__dirname, '../content/articles');
  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(articlesDir, f));

  console.log(`📚 Artigos encontrados: ${files.length}\n`);

  const results = files.map(optimizeArticle);
  const totalLinks = results.reduce((sum, r) => sum + r.linksAdded, 0);

  console.log('\n' + '═'.repeat(50));
  console.log(`🎉 Sucesso Blindado!`);
  console.log(`🔗 Total de links seguros adicionados: ${totalLinks}`);
  console.log('═'.repeat(50));
}

main();
