/**
 * PLANEJADOR DE PAUTA SEMANAL AUTOMÁTICO
 * Gera um cronograma de 25 artigos (5 por dia, Seg a Sex)
 * Baseado em categorias e tendências de 2026.
 */

const fs = require('fs');
const path = require('path');

// Configuração da Semana (Começando próxima Segunda)
// Hoje é 07/12 (Sábado). Próxima Seg é 09/12.
const START_DATE = new Date('2025-12-09');

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

// Estrutura da Pauta
const PAUTA = [
  // SEGUNDA-FEIRA: BITCOIN & MACRO
  {
    date: addDays(START_DATE, 0),
    day: 'Segunda-feira',
    topics: [
      { keyword: 'Bitcoin Halving 2028', title: 'Ciclos do Bitcoin: O Que Esperar do Halving de 2028?', category: 'bitcoin', priority: 'high' },
      { keyword: 'ETFs de Bitcoin Spot Options', title: 'Opções de ETFs de Bitcoin: Como Impactam a Volatilidade?', category: 'bitcoin', priority: 'medium' },
      { keyword: 'Bitcoin Sovereign Wealth Funds', title: 'Países Comprando Bitcoin: A Nova Corrida do Ouro Digital', category: 'bitcoin', priority: 'high' },
      { keyword: 'Lightning Network 2026', title: 'Lightning Network em 2026: Pagamentos Instantâneos Globalizados', category: 'bitcoin', priority: 'medium' },
      { keyword: 'Mineração Verde Bitcoin', title: 'Mineração Sustentável: O Futuro Verde do Bitcoin', category: 'bitcoin', priority: 'low' }
    ]
  },

  // TERÇA-FEIRA: ETHEREUM & L2
  {
    date: addDays(START_DATE, 1),
    day: 'Terça-feira',
    topics: [
      { keyword: 'Ethereum Danksharding', title: 'Danksharding: A Atualização que Vai Escalar o Ethereum para Milhões', category: 'ethereum', priority: 'high' },
      { keyword: 'Arbitrum vs Optimism 2026', title: 'Arbitrum vs Optimism: Quem Vence a Guerra das L2 em 2026?', category: 'altcoins', priority: 'medium' },
      { keyword: 'Base Chain Coinbase', title: 'Base Chain: O Gigante da Coinbase Dominando o DeFi', category: 'altcoins', priority: 'high' },
      { keyword: 'ZK-Rollups Privacy', title: 'ZK-Rollups: Privacidade e Escalabilidade Total no Ethereum', category: 'ethereum', priority: 'medium' },
      { keyword: 'Ethereum Staking Líquido', title: 'Lido e Rocket Pool: O Estado do Staking Líquido em 2026', category: 'ethereum', priority: 'low' }
    ]
  },

  // QUARTA-FEIRA: DEFI & RWA (Finanças)
  {
    date: addDays(START_DATE, 2),
    day: 'Quarta-feira',
    topics: [
      { keyword: 'Tokenização Títulos Públicos', title: 'Títulos do Tesouro Tokenizados: Renda Fixa na Blockchain', category: 'defi', priority: 'high' },
      { keyword: 'DeFi 2.0 Real Yield', title: 'Real Yield: O Fim dos Tokens Inflacionários no DeFi', category: 'defi', priority: 'medium' },
      { keyword: 'DEX vs CEX 2026', title: 'DEX vs CEX: Por Que o Volume Está Migrando para Descentralizadas', category: 'defi', priority: 'medium' },
      { keyword: 'Empréstimos Sem Colateral DeFi', title: 'Crédito On-Chain: O Santo Graal dos Empréstimos DeFi', category: 'defi', priority: 'high' },
      { keyword: 'Stablecoins Algorítmicas Seguras', title: 'Stablecoins de Nova Geração: Aprendendo com os Erros do Passado', category: 'defi', priority: 'low' }
    ]
  },

  // QUINTA-FEIRA: ALTCOINS & TENDÊNCIAS (IA/GameFi)
  {
    date: addDays(START_DATE, 3),
    day: 'Quinta-feira',
    topics: [
      { keyword: 'Fetch.ai e Ocean Protocol', title: 'A Fusão dos Gigantes de IA: Superinteligência Descentralizada', category: 'altcoins', priority: 'high' },
      { keyword: 'Solana Firedancer', title: 'Solana Firedancer: O Cliente que Pode Processar 1 Milhão de TPS', category: 'altcoins', priority: 'high' },
      { keyword: 'Render Network GPU', title: 'Render Network: O Poder Computacional para o Metaverso e IA', category: 'altcoins', priority: 'medium' },
      { keyword: 'Illuvium e Star Atlas', title: 'Jogos AAA na Blockchain: O Retorno do GameFi', category: 'games', priority: 'medium' },
      { keyword: 'Memecoins Utilitárias', title: 'A Evolução das Memecoins: De Piada para Ecossistema', category: 'altcoins', priority: 'low' }
    ]
  },

  // SEXTA-FEIRA: EDUCAÇÃO & SEGURANÇA
  {
    date: addDays(START_DATE, 4),
    day: 'Sexta-feira',
    topics: [
      { keyword: 'Carteira Multisig Tutorial', title: 'Como Criar uma Carteira Multisig para Proteção Máxima', category: 'educacao', priority: 'high' },
      { keyword: 'Golpes Cripto 2026', title: 'Os 5 Novos Golpes de Phishing em 2026 e Como Evitar', category: 'educacao', priority: 'high' },
      { keyword: 'Impostos Cripto Guia', title: 'Guia Definitivo de Impostos para Criptoativos 2026', category: 'educacao', priority: 'medium' },
      { keyword: 'Herança de Criptomoedas', title: 'Planejamento Sucessório: Como Deixar Cripto para Seus Herdeiros', category: 'educacao', priority: 'medium' },
      { keyword: 'Análise On-Chain Básica', title: 'Como Ler a Blockchain: Guia de Análise On-Chain para Iniciantes', category: 'educacao', priority: 'low' }
    ]
  }
];

function main() {
  console.log('📅 Gerando Pauta Semanal (25 Artigos)...\n');

  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  // Achatar a estrutura para formato de lista simples que o gerador entende, mas mantendo a data
  const flatSuggestions = [];

  PAUTA.forEach(day => {
    console.log(`📌 ${day.day} (${day.date}):`);
    day.topics.forEach(t => {
      console.log(`   - ${t.title}`);

      flatSuggestions.push({
        ...t,
        trend: 'scheduled',
        searchVolume: 0, // Não relevante agora
        relevance: 100,
        publishDate: day.date // Campo importante para o gerador
      });
    });
    console.log('');
  });

  const report = {
    date: new Date().toISOString(),
    weekStart: START_DATE,
    suggestions: flatSuggestions
  };

  fs.writeFileSync(
    path.join(dataDir, 'weekly-plan.json'),
    JSON.stringify(report, null, 2)
  );

  console.log(`✅ Pauta salva em data/weekly-plan.json`);
  console.log(`🚀 Pronto para gerar 25 artigos! Execute o gerador.`);
}

main();
