const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Categorias válidas
const validCategories = [
  'bitcoin',
  'altcoins',
  'defi',
  'ethereum',
  'nfts',
  'trading',
  'seguranca',
  'educacao',
  'regulacao',
  'analises',
  'tutoriais',
  'memecoin'
];

// Função para inferir categoria baseada em tags e conteúdo
function inferCategory(data) {
  const tags = (data.tags || []).map(t => t.toLowerCase());
  const title = (data.title || '').toLowerCase();
  const excerpt = (data.excerpt || '').toLowerCase();
  
  // Regras de inferência
  if (tags.includes('bitcoin') || title.includes('bitcoin') || title.includes('btc')) {
    return 'bitcoin';
  }
  if (tags.includes('ethereum') || title.includes('ethereum') || title.includes('eth')) {
    return 'ethereum';
  }
  if (tags.includes('defi') || tags.includes('yield farming') || tags.includes('staking') || 
      title.includes('defi') || title.includes('staking') || title.includes('yield')) {
    return 'defi';
  }
  if (tags.includes('nft') || tags.includes('nfts') || title.includes('nft')) {
    return 'nfts';
  }
  if (tags.includes('trading') || tags.includes('análise técnica') || 
      title.includes('trading') || title.includes('análise')) {
    return 'analises';
  }
  if (tags.includes('segurança') || tags.includes('carteira') || 
      title.includes('segurança') || title.includes('proteger')) {
    return 'seguranca';
  }
  if (tags.includes('regulação') || tags.includes('imposto') || 
      title.includes('regulação') || title.includes('imposto')) {
    return 'regulacao';
  }
  if (tags.includes('tutorial') || tags.includes('guia') || 
      title.includes('como') || title.includes('guia') || title.includes('passo a passo')) {
    return 'tutoriais';
  }
  if (tags.includes('memecoin') || tags.includes('meme') || 
      title.includes('meme') || title.includes('doge') || title.includes('shib')) {
    return 'memecoin';
  }
  if (title.includes('o que é') || title.includes('entenda') || excerpt.includes('iniciante')) {
    return 'educacao';
  }
  
  // Altcoins como fallback para criptos que não são Bitcoin/Ethereum
  return 'altcoins';
}

// Processar artigos em português
function processArticles(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Diretório não encontrado: ${directory}`);
    return;
  }

  const files = fs.readdirSync(directory).filter(f => f.endsWith('.md'));
  let fixed = 0;
  let skipped = 0;

  console.log(`\nProcessando ${files.length} arquivos em ${directory}...`);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdown } = matter(content);

    // Verificar se categorySlug está undefined ou ausente
    if (!data.categorySlug || data.categorySlug === 'undefined') {
      const inferredCategory = inferCategory(data);
      data.categorySlug = inferredCategory;
      
      // Reescrever o arquivo
      const newContent = matter.stringify(markdown, data);
      fs.writeFileSync(filePath, newContent, 'utf8');
      
      console.log(`✓ ${file}: ${inferredCategory}`);
      fixed++;
    } else {
      skipped++;
    }
  });

  console.log(`\n✓ Corrigidos: ${fixed}`);
  console.log(`- Ignorados (já tinham categoria): ${skipped}`);
}

// Processar ambos os diretórios
console.log('=== Corrigindo categorySlug nos artigos ===');

const ptDir = path.join(process.cwd(), 'content/articles');
const enDir = path.join(process.cwd(), 'content/articles/en');

processArticles(ptDir);
processArticles(enDir);

console.log('\n✓ Processo concluído!');
