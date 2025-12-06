/**
 * Monitor de Tendências Diário
 * Pesquisa tópicos em alta e sugere artigos
 * Execute: node scripts/monitor-tendencias.js
 */

const fs = require('fs');
const path = require('path');

const TRENDING_TOPICS_FILE = 'data/trending-topics.json';

// Simulação de pesquisa de tendências (você pode integrar com Google Trends API)
async function fetchTrendingTopics() {
  console.log('🔍 Pesquisando tendências em cripto...\n');

  // Em produção, use Google Trends API, CoinGecko API, ou scraping
  const topics = [
    {
      keyword: 'Agentes de IA em Crypto',
      searchVolume: 25000,
      trend: 'explosive',
      category: 'analises',
      relevance: 98
    },
    {
      keyword: 'Tokenização de Ativos Reais RWA 2026',
      searchVolume: 18000,
      trend: 'rising',
      category: 'defi',
      relevance: 95
    },
    {
      keyword: 'Solana vs Ethereum 2026 Guerra das L1s',
      searchVolume: 15600,
      trend: 'stable',
      category: 'analises',
      relevance: 92
    },
    {
      keyword: 'Melhores Carteiras de Hardware 2026',
      searchVolume: 12400,
      trend: 'rising',
      category: 'educacao',
      relevance: 90
    },
    {
      keyword: 'Airdrops Confirmados 2026 Lista Completa',
      searchVolume: 35000,
      trend: 'explosive',
      category: 'educacao',
      relevance: 99
    }
  ];

  return topics;
}

// Analisa quais artigos já existem
function getExistingArticles() {
  const articlesDir = path.join(__dirname, '../content/articles');
  const files = fs.readdirSync(articlesDir);

  return files
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(articlesDir, f), 'utf8');
      const titleMatch = content.match(/title:\s*['"](.+)['"]/);
      const slugMatch = content.match(/slug:\s*['"](.+)['"]/);
      return {
        filename: f,
        title: titleMatch ? titleMatch[1] : '',
        slug: slugMatch ? slugMatch[1] : ''
      };
    });
}

// Sugere novos artigos baseado em gaps
function suggestNewArticles(trending, existing) {
  const suggestions = [];

  trending.forEach(topic => {
    // Verifica se já não existe artigo similar (busca exata da keyword ou slug)
    const exists = existing.some(article =>
      article.title.toLowerCase().includes(topic.keyword.toLowerCase()) ||
      article.slug.includes(topic.keyword.toLowerCase().replace(/ /g, '-'))
    );

    if (!exists && topic.relevance >= 75) {
      suggestions.push({
        title: generateArticleTitle(topic),
        category: topic.category,
        priority: topic.trend === 'explosive' ? 'high' : 'medium',
        estimatedTraffic: topic.searchVolume,
        keyword: topic.keyword
      });
    }
  });

  return suggestions.slice(0, 10); // Top 10 sugestões
}

function generateArticleTitle(topic) {
  const templates = {
    bitcoin: `${topic.keyword}: Análise Completa e Previsões`,
    altcoins: `${topic.keyword} em 2026: Guia Definitivo`,
    educacao: `${topic.keyword}: Tutorial Passo a Passo para Iniciantes`,
    defi: `${topic.keyword}: Maximize Seus Ganhos com Segurança`,
    regulacao: `${topic.keyword}: O Que Muda e Como Se Preparar`
  };

  return templates[topic.category] || `${topic.keyword}: Guia Completo 2026`;
}

async function main() {
  console.log('📊 Monitor de Tendências - A Cifra\n');
  console.log('═'.repeat(50));

  // 1. Buscar tendências
  const trending = await fetchTrendingTopics();
  console.log(`\n✅ ${trending.length} tópicos em alta identificados\n`);

  // 2. Verificar artigos existentes
  const existing = getExistingArticles();
  console.log(`📚 ${existing.length} artigos já publicados\n`);

  // 3. Gerar sugestões
  const suggestions = suggestNewArticles(trending, existing);

  // 4. Salvar relatório
  const report = {
    date: new Date().toISOString(),
    trending: trending,
    suggestions: suggestions,
    stats: {
      totalTrending: trending.length,
      totalExisting: existing.length,
      newSuggestions: suggestions.length
    }
  };

  // Criar diretório se não existir
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'trending-report.json'),
    JSON.stringify(report, null, 2)
  );

  // 5. Exibir sugestões
  console.log('💡 SUGESTÕES DE NOVOS ARTIGOS:\n');
  console.log('═'.repeat(50));

  suggestions.forEach((sug, idx) => {
    console.log(`\n${idx + 1}. ${sug.title}`);
    console.log(`   📂 Categoria: ${sug.category}`);
    console.log(`   🔥 Prioridade: ${sug.priority}`);
    console.log(`   📈 Tráfego estimado: ${sug.estimatedTraffic.toLocaleString()} buscas/mês`);
    console.log(`   🔑 Keyword: ${sug.keyword}`);
  });

  console.log('\n' + '═'.repeat(50));
  console.log(`\n📄 Relatório completo salvo em: data/trending-report.json`);
  console.log('\n✨ Para gerar artigos automaticamente, execute:');
  console.log('   node scripts/gerar-artigos-batch.js\n');
}

main().catch(console.error);
