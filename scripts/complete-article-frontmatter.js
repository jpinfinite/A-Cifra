const fs = require('fs');
const path = require('path');

// Mapeamento de artigos com seus metadados
const articlesMetadata = {
  'polygon-zkevm-ethereum-escalabilidade.md': {
    id: 'polygon-zkevm',
    slug: 'polygon-zkevm-ethereum-escalabilidade',
    categorySlug: 'altcoins'
  },
  'avalanche-subnets-escalabilidade-blockchain.md': {
    id: 'avalanche-subnets',
    slug: 'avalanche-subnets-escalabilidade-blockchain',
    categorySlug: 'altcoins'
  },
  'cosmos-atom-internet-blockchains.md': {
    id: 'cosmos-atom',
    slug: 'cosmos-atom-internet-blockchains',
    categorySlug: 'altcoins'
  },
  'the-graph-indexacao-dados-blockchain.md': {
    id: 'the-graph-grt',
    slug: 'the-graph-indexacao-dados-blockchain',
    categorySlug: 'altcoins'
  },
  'xrp-pagamentos-globais.md': {
    id: 'xrp-ripple',
    slug: 'xrp-pagamentos-globais',
    categorySlug: 'altcoins'
  },
  'web3-internet-descentralizada-futuro.md': {
    id: 'web3-internet-descentralizada',
    slug: 'web3-internet-descentralizada-futuro',
    categorySlug: 'educacao'
  },
  'dao-organizacoes-autonomas-descentralizadas.md': {
    id: 'dao-organizacoes',
    slug: 'dao-organizacoes-autonomas-descentralizadas',
    categorySlug: 'defi'
  },
  'analise-fundamentalista-avaliar-projetos-cripto.md': {
    id: 'analise-fundamentalista',
    slug: 'analise-fundamentalista-avaliar-projetos-cripto',
    categorySlug: 'analises'
  },
  'analise-tecnica-indicadores-essenciais-cripto.md': {
    id: 'analise-tecnica-indicadores',
    slug: 'analise-tecnica-indicadores-essenciais-cripto',
    categorySlug: 'analises'
  }
};

const articlesDir = path.join(__dirname, '../content/articles');

Object.entries(articlesMetadata).forEach(([filename, metadata]) => {
  const filePath = path.join(articlesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filename}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Adicionar id, slug e categorySlug após o ---
  if (!content.includes('id:')) {
    content = content.replace(
      /^---\n/,
      `---\nid: '${metadata.id}'\ntitle: `
    );
    content = content.replace(/^title: /, '');
  }
  
  if (!content.includes('slug:')) {
    content = content.replace(
      /^title: /m,
      `slug: '${metadata.slug}'\ntitle: `
    );
  }
  
  if (!content.includes('categorySlug:')) {
    content = content.replace(
      /^publishedAt: /m,
      `categorySlug: '${metadata.categorySlug}'\npublishedAt: `
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Completado: ${filename}`);
});

console.log('\n✅ Todos os metadados foram adicionados!');
