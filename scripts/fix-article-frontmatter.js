const fs = require('fs');
const path = require('path');

// Artigos que precisam ser corrigidos
const articlesToFix = [
  'polygon-zkevm-ethereum-escalabilidade.md',
  'avalanche-subnets-escalabilidade-blockchain.md',
  'cosmos-atom-internet-blockchains.md',
  'the-graph-indexacao-dados-blockchain.md',
  'xrp-pagamentos-globais.md',
  'web3-internet-descentralizada-futuro.md',
  'dao-organizacoes-autonomas-descentralizadas.md',
  'analise-fundamentalista-avaliar-projetos-cripto.md',
  'analise-tecnica-indicadores-essenciais-cripto.md'
];

const articlesDir = path.join(__dirname, '../content/articles');

articlesToFix.forEach(filename => {
  const filePath = path.join(articlesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filename}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Substituir date por publishedAt
  content = content.replace(/^date: "(.+)"$/m, 'publishedAt: "$1"');
  
  // Adicionar updatedAt se não existir
  if (!content.includes('updatedAt:')) {
    content = content.replace(
      /^publishedAt: "(.+)"$/m,
      'publishedAt: "$1"\nupdatedAt: "$1"'
    );
  }
  
  // Corrigir formato do coverImage (deve ser objeto, não string)
  content = content.replace(
    /^coverImage: "(.+)"$/m,
    (match, imagePath) => {
      const imageName = imagePath.split('/').pop();
      return `coverImage:\n  src: '${imagePath}'\n  alt: '${imageName.replace(/\.(jpg|png|webp)$/, '')}'\n  width: 1200\n  height: 630`;
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Corrigido: ${filename}`);
});

console.log('\n✅ Todos os artigos foram corrigidos!');
