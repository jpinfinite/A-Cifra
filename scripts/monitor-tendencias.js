/**
 * Monitor de Tendências 2026
 * Define os tópicos quentes para o gerador de artigos
 */

const fs = require('fs');
const path = require('path');

const TRENDING_TOPICS = [
  {
    keyword: 'Agentes de IA em Crypto',
    title: 'Agentes Autônomos de IA: A Próxima Grande Narrativa Crypto de 2026',
    searchVolume: 55000,
    trend: 'explosive',
    category: 'analises',
    relevance: 99
  },
  {
    keyword: 'RWA Tokenização Imobiliária',
    title: 'RWA em 2026: Como a Tokenização de Imóveis Vai Mudar o Mercado',
    searchVolume: 42000,
    trend: 'rising',
    category: 'defi',
    relevance: 95
  },
  {
    keyword: 'Ethereum Pectra Upgrade',
    title: 'Atualização Pectra do Ethereum: O Que Esperar em 2026?',
    searchVolume: 35000,
    trend: 'rising',
    category: 'ethereum',
    relevance: 92
  },
  {
    keyword: 'Jogos Web3 Play-to-Earn 2.0',
    title: 'GameFi 2.0: Os Jogos Web3 que Vão Dominar em 2026',
    searchVolume: 60000,
    trend: 'stable',
    category: 'games',
    relevance: 88
  },
  {
    keyword: 'Privacidade On-Chain Zero Knowledge',
    title: 'Zero-Knowledge Proofs (ZK): O Futuro da Privacidade em 2026',
    searchVolume: 28000,
    trend: 'rising',
    category: 'educacao',
    relevance: 90
  }
];

function main() {
  console.log('📊 Gerando lista de tendências 2026...');

  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const report = {
    date: new Date().toISOString(),
    suggestions: TRENDING_TOPICS
  };

  fs.writeFileSync(
    path.join(dataDir, 'trending-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log(`✅ ${TRENDING_TOPICS.length} tópicos salvos em data/trending-report.json`);
}

main();
