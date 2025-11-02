const fs = require('fs');
const path = require('path');

// Metadados completos para cada artigo
const articlesData = {
  'xrp-pagamentos-globais.md': {
    id: 'xrp-ripple',
    slug: 'xrp-pagamentos-globais',
    title: 'XRP e Ripple: Revolucionando Pagamentos Globais',
    excerpt: 'Descubra como o XRP e a Ripple estão transformando pagamentos internacionais com transações rápidas, baratas e eficientes para bancos e instituições financeiras.',
    categorySlug: 'altcoins',
    tags: ['xrp', 'ripple', 'pagamentos', 'remessas', 'bancos']
  },
  'web3-internet-descentralizada-futuro.md': {
    id: 'web3-internet-descentralizada',
    slug: 'web3-internet-descentralizada-futuro',
    title: 'Web3: A Internet Descentralizada do Futuro',
    excerpt: 'Entenda o que é Web3, como ela difere da Web2, e por que representa o futuro da internet com descentralização, propriedade de dados e novas oportunidades.',
    categorySlug: 'educacao',
    tags: ['web3', 'descentralização', 'blockchain', 'futuro', 'internet']
  },
  'dao-organizacoes-autonomas-descentralizadas.md': {
    id: 'dao-organizacoes',
    slug: 'dao-organizacoes-autonomas-descentralizadas',
    title: 'DAOs: Organizações Autônomas Descentralizadas',
    excerpt: 'Entenda o que são DAOs, como funcionam, casos de uso e por que representam uma nova forma de organização e governança descentralizada.',
    categorySlug: 'defi',
    tags: ['dao', 'governança', 'descentralização', 'web3', 'organizações']
  },
  'analise-fundamentalista-avaliar-projetos-cripto.md': {
    id: 'analise-fundamentalista',
    slug: 'analise-fundamentalista-avaliar-projetos-cripto',
    title: 'Análise Fundamentalista: Como Avaliar Projetos Cripto',
    excerpt: 'Aprenda a fazer análise fundamentalista de criptomoedas: avaliar equipe, tecnologia, tokenomics e potencial de adoção para tomar decisões de investimento informadas.',
    categorySlug: 'analises',
    tags: ['análise fundamentalista', 'investimento', 'avaliação', 'due diligence', 'pesquisa']
  },
  'analise-tecnica-indicadores-essenciais-cripto.md': {
    id: 'analise-tecnica-indicadores',
    slug: 'analise-tecnica-indicadores-essenciais-cripto',
    title: 'Análise Técnica: Indicadores Essenciais para Cripto',
    excerpt: 'Domine os principais indicadores técnicos para trading de criptomoedas: RSI, MACD, Médias Móveis, Volume e padrões gráficos para tomar decisões informadas.',
    categorySlug: 'analises',
    tags: ['análise técnica', 'trading', 'indicadores', 'rsi', 'macd', 'gráficos']
  },
  'avalanche-subnets-escalabilidade-blockchain.md': {
    id: 'avalanche-subnets',
    slug: 'avalanche-subnets-escalabilidade-blockchain',
    title: 'Avalanche: Subnets e Escalabilidade Blockchain',
    excerpt: 'Conheça o Avalanche, a blockchain de alta performance com subnets customizáveis e consenso inovador que processa milhares de transações por segundo.',
    categorySlug: 'altcoins',
    tags: ['avalanche', 'avax', 'subnets', 'escalabilidade', 'defi']
  },
  'cosmos-atom-internet-blockchains.md': {
    id: 'cosmos-atom',
    slug: 'cosmos-atom-internet-blockchains',
    title: 'Cosmos (ATOM): A Internet das Blockchains',
    excerpt: 'Descubra como o Cosmos está criando um ecossistema interconectado de blockchains independentes através do protocolo IBC e o Cosmos Hub.',
    categorySlug: 'altcoins',
    tags: ['cosmos', 'atom', 'ibc', 'interoperabilidade', 'tendermint']
  },
  'the-graph-indexacao-dados-blockchain.md': {
    id: 'the-graph-grt',
    slug: 'the-graph-indexacao-dados-blockchain',
    title: 'The Graph (GRT): Indexação de Dados Blockchain',
    excerpt: 'Conheça o The Graph, o protocolo de indexação que permite consultas rápidas e eficientes de dados blockchain, essencial para dApps e DeFi.',
    categorySlug: 'altcoins',
    tags: ['the graph', 'grt', 'indexação', 'dados', 'web3']
  }
};

const articlesDir = path.join(__dirname, '../content/articles');

Object.entries(articlesData).forEach(([filename, data]) => {
  const filePath = path.join(articlesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filename}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Criar novo front-matter completo
  const newFrontMatter = `---
id: '${data.id}'
slug: '${data.slug}'
title: "${data.title}"
excerpt: "${data.excerpt}"
coverImage:
  src: '/images/${filename.replace('.md', '.jpg')}'
  alt: '${data.title}'
  width: 1200
  height: 630
author:
  name: "Jonatha Pereira"
  avatar: "/Jonatha-Pereira-SEO.png"
publishedAt: "2025-10-31"
updatedAt: "2025-10-31"
categorySlug: "${data.categorySlug}"
tags: [${data.tags.map(t => `"${t}"`).join(', ')}]
seo:
  metaTitle: "${data.title} | A Cifra"
  metaDescription: "${data.excerpt}"
  keywords: [${data.tags.map(t => `"${t}"`).join(', ')}]
---`;
  
  // Substituir todo o front-matter
  content = content.replace(/^---[\s\S]*?---/, newFrontMatter);
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Corrigido: ${filename}`);
});

console.log('\n✅ Todos os artigos foram corrigidos com sucesso!');
