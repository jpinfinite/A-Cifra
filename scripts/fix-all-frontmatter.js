const fs = require('fs');
const path = require('path');

const articlesToFix = [
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
  
  // Corrigir title: title:
  content = content.replace(/^title: title: /m, 'title: ');
  
  // Remover ogImage (não é necessário)
  content = content.replace(/^ogImage:\n  url: .+\n/m, '');
  
  // Mover categorySlug para antes de publishedAt
  const categorySlugMatch = content.match(/^categorySlug: "(.+)"$/m);
  if (categorySlugMatch) {
    const categorySlug = categorySlugMatch[1];
    content = content.replace(/^categorySlug: ".+"\n/m, '');
    content = content.replace(/^publishedAt: /m, `categorySlug: "${categorySlug}"\npublishedAt: `);
  }
  
  // Adicionar seo se não existir
  if (!content.includes('seo:')) {
    const titleMatch = content.match(/^title: "(.+)"$/m);
    const excerptMatch = content.match(/^excerpt: "(.+)"$/m);
    const tagsMatch = content.match(/^tags: \[(.+)\]$/m);
    
    if (titleMatch && excerptMatch && tagsMatch) {
      const title = titleMatch[1];
      const excerpt = excerptMatch[1];
      const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, ''));
      
      const seoBlock = `seo:
  metaTitle: "${title} | A Cifra"
  metaDescription: "${excerpt}"
  keywords: [${tags.map(t => `"${t}"`).join(', ')}]`;
      
      content = content.replace(/^---\n\n/m, `---\n${seoBlock}\n---\n\n`);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Corrigido: ${filename}`);
});

console.log('\n✅ Todos os artigos foram corrigidos!');
