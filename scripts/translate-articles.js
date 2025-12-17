#!/usr/bin/env node

/**
 * Script de Tradução Automática de Artigos
 *
 * Traduz artigos do diretório pt-BR para en e es
 * Mantém a formatação markdown e metadados
 *
 * Uso:
 *   node scripts/translate-articles.js <arquivo.md>
 *   node scripts/translate-articles.js --all
 */

const fs = require('fs');
const path = require('path');

// Configuração de diretórios
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');
const PT_DIR = path.join(CONTENT_DIR, 'pt-BR');
const EN_DIR = path.join(CONTENT_DIR, 'en');
const ES_DIR = path.join(CONTENT_DIR, 'es');

// Mapeamento de categorias
const CATEGORY_MAP = {
  'pt-BR': {
    'bitcoin': { en: 'bitcoin', es: 'bitcoin' },
    'ethereum': { en: 'ethereum', es: 'ethereum' },
    'defi': { en: 'defi', es: 'defi' },
    'nfts': { en: 'nfts', es: 'nfts' },
    'altcoins': { en: 'altcoins', es: 'altcoins' },
    'analises': { en: 'analysis', es: 'analisis' },
    'educacao': { en: 'education', es: 'educacion' },
    'regulacao': { en: 'regulation', es: 'regulacion' },
    'mineracao': { en: 'mining', es: 'mineria' },
    'trading': { en: 'trading', es: 'trading' }
  }
};

// Glossário de termos técnicos (não traduzir)
const TECHNICAL_TERMS = [
  'Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'blockchain', 'smart contract',
  'Layer 2', 'rollup', 'staking', 'yield farming', 'TVL', 'APY',
  'gas fee', 'wallet', 'DEX', 'CEX', 'DAO', 'Web3', 'MetaMask',
  'Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Arbitrum', 'Optimism',
  'zkSync', 'Polygon', 'Solana', 'Cardano', 'Polkadot'
];

/**
 * Extrai frontmatter e conteúdo do arquivo markdown
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: '', content: content };
  }

  return {
    frontmatter: match[1],
    content: match[2]
  };
}

/**
 * Traduz frontmatter
 */
function translateFrontmatter(frontmatter, targetLang) {
  const lines = frontmatter.split('\n');
  const translated = lines.map(line => {
    // Traduzir título
    if (line.startsWith('title:')) {
      const title = line.replace('title:', '').trim().replace(/^["']|["']$/g, '');
      return `title: "${translateText(title, targetLang)}"`;
    }

    // Traduzir excerpt
    if (line.startsWith('excerpt:')) {
      const excerpt = line.replace('excerpt:', '').trim().replace(/^["']|["']$/g, '');
      return `excerpt: "${translateText(excerpt, targetLang)}"`;
    }

    // Traduzir categoria
    if (line.startsWith('category:')) {
      const category = line.replace('category:', '').trim().replace(/^["']|["']$/g, '');
      const translatedCategory = CATEGORY_MAP['pt-BR'][category]?.[targetLang] || category;
      return `category: "${translatedCategory}"`;
    }

    // Manter outras linhas
    return line;
  });

  return translated.join('\n');
}

/**
 * Função de tradução (placeholder - em produção, usar API de tradução)
 * Para este exemplo, retorna indicação de que precisa tradução manual
 */
function translateText(text, targetLang) {
  // NOTA: Em produção, integrar com Google Translate API, DeepL, ou similar
  // Por enquanto, retorna marcador para tradução manual

  if (targetLang === 'en') {
    return `[EN] ${text}`;
  } else if (targetLang === 'es') {
    return `[ES] ${text}`;
  }

  return text;
}

/**
 * Traduz conteúdo markdown
 */
function translateContent(content, targetLang) {
  // NOTA: Implementação simplificada
  // Em produção, usar API de tradução preservando markdown

  const lines = content.split('\n');
  const translated = lines.map(line => {
    // Preservar código
    if (line.startsWith('```') || line.startsWith('    ')) {
      return line;
    }

    // Preservar links e imagens
    if (line.includes('![') || line.includes('](')) {
      return line;
    }

    // Traduzir texto
    if (line.trim() && !line.startsWith('#')) {
      return translateText(line, targetLang);
    }

    return line;
  });

  return translated.join('\n');
}

/**
 * Processa um arquivo
 */
function translateFile(filename, targetLang) {
  const sourcePath = path.join(PT_DIR, filename);
  const targetDir = targetLang === 'en' ? EN_DIR : ES_DIR;
  const targetPath = path.join(targetDir, filename);

  console.log(`Traduzindo ${filename} para ${targetLang.toUpperCase()}...`);

  // Ler arquivo fonte
  const content = fs.readFileSync(sourcePath, 'utf-8');
  const { frontmatter, content: markdownContent } = parseMarkdown(content);

  // Traduzir
  const translatedFrontmatter = translateFrontmatter(frontmatter, targetLang);
  const translatedContent = translateContent(markdownContent, targetLang);

  // Criar diretório se não existir
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Salvar arquivo traduzido
  const output = `---\n${translatedFrontmatter}\n---\n${translatedContent}`;
  fs.writeFileSync(targetPath, output, 'utf-8');

  console.log(`✓ Salvo em ${targetPath}`);
}

/**
 * Processa todos os arquivos
 */
function translateAll() {
  const files = fs.readdirSync(PT_DIR).filter(f => f.endsWith('.md'));

  console.log(`Encontrados ${files.length} arquivos para traduzir\n`);

  files.forEach(file => {
    translateFile(file, 'en');
    translateFile(file, 'es');
    console.log('');
  });

  console.log('✓ Tradução concluída!');
  console.log('\nNOTA: Este script cria estrutura de arquivos.');
  console.log('Para traduções de qualidade, use Google Translate API ou DeepL.');
}

// Executar
const args = process.argv.slice(2);

if (args.includes('--all')) {
  translateAll();
} else if (args.length > 0) {
  const filename = args[0];
  translateFile(filename, 'en');
  translateFile(filename, 'es');
} else {
  console.log('Uso:');
  console.log('  node scripts/translate-articles.js <arquivo.md>');
  console.log('  node scripts/translate-articles.js --all');
}
