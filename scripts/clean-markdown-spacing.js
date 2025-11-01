const fs = require('fs');
const path = require('path');

const articlesDir = path.join(process.cwd(), 'content/articles');

// Lista de artigos convertidos que precisam de limpeza
const articlesToClean = [
  'solana-ascensao-etf-spot-mudar-jogo-300-dolares.md',
  'perspectivas-otimistas-mercado-cripto-final-2025.md',
  'renascimento-bitcoin-novo-ciclo-crescimento-2025.md',
  'criptomoedas-2026-maturidade-adoacao-institucional-fim-euforia-especulativa.md',
  'tendencias-cripto-outubro-2025.md',
  'nfts-revolucionando-arte-colecionaveis-mercado-digital.md',
  'como-analisar-criptomoedas-guia-completo-investidores.md',
  'pools-liquidez-coracao-financa-descentralizada-defi.md',
  'defi-futuro-financa-descentralizada-investir-seguranca.md',
  'gamefi-revolucionando-industria-jogos-investir-seguranca.md',
  'centralizacao-vs-descentralizacao-dilema-distribuicao-poder.md',
  'blockchain-tecnologia-revolucionaria-mudando-mundo.md'
];

function cleanMarkdownSpacing(content) {
  // Separa front-matter do conteúdo
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontMatterMatch) {
    return content;
  }

  const [, frontMatter, articleContent] = frontMatterMatch;
  
  // Limpa o conteúdo do artigo
  let cleaned = articleContent;
  
  // Remove espaços no início de cada linha
  cleaned = cleaned.split('\n').map(line => line.trimStart()).join('\n');
  
  // Remove múltiplas quebras de linha (máximo 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Garante espaço antes de headings
  cleaned = cleaned.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
  
  // Garante espaço depois de headings
  cleaned = cleaned.replace(/(#{1,6}\s.*)\n([^#\n])/g, '$1\n\n$2');
  
  // Garante espaço antes de listas
  cleaned = cleaned.replace(/([^\n])\n(-\s|\d+\.\s)/g, '$1\n\n$2');
  
  // Garante espaço depois de listas
  cleaned = cleaned.replace(/(-\s.*|\d+\.\s.*)\n([^-\d\n])/g, '$1\n\n$2');
  
  // Garante espaço antes de blockquotes
  cleaned = cleaned.replace(/([^\n])\n(>\s)/g, '$1\n\n$2');
  
  // Garante espaço depois de blockquotes
  cleaned = cleaned.replace(/(>\s.*)\n([^>\n])/g, '$1\n\n$2');
  
  // Remove espaços no final
  cleaned = cleaned.trim();
  
  // Reconstrói o arquivo
  return `---\n${frontMatter}\n---\n\n${cleaned}`;
}

function processArticle(filename) {
  const filePath = path.join(articlesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filename}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const cleaned = cleanMarkdownSpacing(content);
  
  fs.writeFileSync(filePath, cleaned, 'utf8');
  
  console.log(`✅ Limpo: ${filename}`);
}

// Processa todos os artigos
console.log('🧹 Iniciando limpeza de espaçamento...\n');

articlesToClean.forEach(filename => {
  processArticle(filename);
});

console.log('\n✅ Limpeza concluída!');
