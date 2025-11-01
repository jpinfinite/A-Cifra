const fs = require('fs');
const path = require('path');

const articlesDir = path.join(process.cwd(), 'content/articles');

// Lista de artigos que precisam ser convertidos (os 22 antigos)
const articlesToConvert = [
  'solana-ascensao-etf-spot-mudar-jogo-300-dolares.md',
  'perspectivas-otimistas-mercado-cripto-final-2025.md',
  'renascimento-bitcoin-novo-ciclo-crescimento-2025.md',
  'criptomoedas-2026-maturidade-adoacao-institucional-fim-euforia-especulativa.md',
  'tendencias-cripto-outubro-2025.md',
  'bitcoin-guia-completo-iniciantes-2025.md',
  'ethereum-2-0-futuro-segunda-maior-criptomoeda.md',
  'altcoins-promissoras-2025-analise-fundamentalista.md',
  'defi-revolucionando-financas-tradicionais.md',
  'nfts-revolucionando-arte-colecionaveis-mercado-digital.md',
  'proteger-criptomoedas-guia-seguranca-completo.md',
  'como-analisar-criptomoedas-guia-completo-investidores.md',
  'staking-criptomoedas-passo-passo-recompensas.md',
  'exchanges-criptomoedas-guia-completo.md',
  'metamask-guia-completo.md',
  'memecoins-fenomeno-cultural.md',
  'layer-2-essencial-ethereum-escalabilidade.md',
  'pools-liquidez-coracao-financa-descentralizada-defi.md',
  'defi-futuro-financa-descentralizada-investir-seguranca.md',
  'gamefi-revolucionando-industria-jogos-investir-seguranca.md',
  'centralizacao-vs-descentralizacao-dilema-distribuicao-poder.md',
  'blockchain-tecnologia-revolucionaria-mudando-mundo.md'
];

function convertHtmlToMarkdown(content) {
  let markdown = content;

  // Remove espaços extras e quebras de linha desnecessárias
  markdown = markdown.replace(/\n\s+\n/g, '\n\n');
  markdown = markdown.replace(/\s+\n/g, '\n');

  // Converte parágrafos
  markdown = markdown.replace(/<p>(.*?)<\/p>/gs, '$1\n\n');

  // Converte headings
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n');

  // Converte strong/bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');

  // Converte em/italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');

  // Converte listas não ordenadas
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
    const items = content.match(/<li>(.*?)<\/li>/gs) || [];
    return items.map(item => {
      const text = item.replace(/<\/?li>/g, '').trim();
      return `- ${text}`;
    }).join('\n') + '\n\n';
  });

  // Converte listas ordenadas
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
    const items = content.match(/<li>(.*?)<\/li>/gs) || [];
    return items.map((item, index) => {
      const text = item.replace(/<\/?li>/g, '').trim();
      return `${index + 1}. ${text}`;
    }).join('\n') + '\n\n';
  });

  // Converte divs especiais (tip-box, warning-box, etc.)
  markdown = markdown.replace(/<div class="tip-box">(.*?)<\/div>/gs, (match, content) => {
    const text = content.replace(/<\/?p>/g, '').trim();
    return `> 💡 **Dica:** ${text}\n\n`;
  });

  markdown = markdown.replace(/<div class="warning-box">(.*?)<\/div>/gs, (match, content) => {
    const text = content.replace(/<\/?p>/g, '').trim();
    return `> ⚠️ **Aviso:** ${text}\n\n`;
  });

  markdown = markdown.replace(/<div class="alert-box">(.*?)<\/div>/gs, (match, content) => {
    const text = content.replace(/<\/?p>/g, '').trim();
    return `> ⚠️ ${text}\n\n`;
  });

  markdown = markdown.replace(/<div class="conclusion-box">(.*?)<\/div>/gs, (match, content) => {
    const text = content.replace(/<\/?p>/g, '').trim();
    return `> ✅ **Conclusão:** ${text}\n\n`;
  });

  markdown = markdown.replace(/<div class="info-box">(.*?)<\/div>/gs, (match, content) => {
    const text = content.replace(/<\/?p>/g, '').trim();
    return `> ℹ️ ${text}\n\n`;
  });

  // Remove outras divs genéricas
  markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/gs, '$1\n\n');

  // Converte links
  markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

  // Converte code inline
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');

  // Converte blockquotes
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gs, (match, content) => {
    const lines = content.trim().split('\n');
    return lines.map(line => `> ${line}`).join('\n') + '\n\n';
  });

  // Remove quebras de linha HTML
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');

  // Limpa espaços extras no início das linhas
  markdown = markdown.split('\n').map(line => line.trimStart()).join('\n');
  
  // Limpa múltiplas quebras de linha
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  // Remove espaços antes de headings
  markdown = markdown.replace(/\n\s+(#{1,6}\s)/g, '\n\n$1');
  
  markdown = markdown.trim();

  return markdown;
}

function processArticle(filename) {
  const filePath = path.join(articlesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filename}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Separa front-matter do conteúdo
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontMatterMatch) {
    console.log(`❌ Front-matter inválido: ${filename}`);
    return;
  }

  const [, frontMatter, articleContent] = frontMatterMatch;
  
  // Verifica se tem HTML
  if (!articleContent.includes('<p>') && !articleContent.includes('<h2>')) {
    console.log(`✅ Já está em markdown: ${filename}`);
    return;
  }

  // Converte HTML para Markdown
  const markdownContent = convertHtmlToMarkdown(articleContent);
  
  // Reconstrói o arquivo
  const newContent = `---\n${frontMatter}\n---\n\n${markdownContent}`;
  
  // Salva o arquivo
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`✅ Convertido: ${filename}`);
}

// Processa todos os artigos
console.log('🔄 Iniciando conversão de HTML para Markdown...\n');

articlesToConvert.forEach(filename => {
  processArticle(filename);
});

console.log('\n✅ Conversão concluída!');
