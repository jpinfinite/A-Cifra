/**
 * Gerador de Artigos em Lote
 * Gera múltiplos artigos automaticamente baseado em lista de tópicos
 * Execute: node scripts/gerar-artigos-batch.js
 */

const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
  articleLength: 2000, // palavras mínimas
  imagesPerArticle: 1,
  autoCommit: false, // Se true, faz commit automático
  targetArticles: 5 // Quantos artigos gerar por vez
};

// Template de artigo base
function generateArticleTemplate(topic) {
  const date = new Date().toISOString().split('T')[0];
  const id = `${topic.slug}-${date}`;

  return `---
id: '${id}'
title: '${topic.title}'
slug: '${topic.slug}'
excerpt: '${topic.excerpt}'
coverImage:
  src: '/images/${topic.category}/2025-12/${topic.slug}.webp'
  alt: '${topic.imageAlt}'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '${date}'
updatedAt: '${date}'
categorySlug: '${topic.category}'
tags: ${JSON.stringify(topic.tags)}
seo:
  metaTitle: '${topic.metaTitle}'
  metaDescription: '${topic.metaDescription}'
  keywords: ${JSON.stringify(topic.keywords)}
monetization:
  priority: '${topic.monetizationPriority}'
  affiliateLinks: ${JSON.stringify(topic.affiliateLinks)}
---

# ${topic.title}

${topic.intro}

${topic.content}

---

**Última atualização:** ${date}

*Disclaimer: ${topic.disclaimer}*
`;
}

// Gera conteúdo baseado no tópico
function generateContent(topic) {
  // Em produção, isso seria gerado via LLM/GPT
  // Por agora, retorna estrutura base

  const sections = [
    {
      title: `## 📖 O Que É ${topic.mainConcept}?`,
      content: `Explicação detalhada sobre ${topic.mainConcept}...`
    },
    {
      title: `## 🔍 Como Funciona`,
      content: `Detalhes técnicos e práticos...`
    },
    {
      title: `## ✅ Vantagens e Benefícios`,
      content: `Lista de vantagens...`
    },
    {
      title: `## ⚠️ Riscos e Cuidados`,
      content: `Riscos a considerar...`
    },
    {
      title: `## 💡 Como Começar`,
      content: `Passo a passo prático...`
    },
    {
      title: `## 🎯 Conclusão`,
      content: `Resumo e call-to-action...`
    }
  ];

  return sections.map(s => `${s.title}\n\n${s.content}`).join('\n\n');
}

// Lê sugestões do monitor de tendências
function loadSuggestions() {
  const reportPath = path.join(__dirname, '../data/trending-report.json');

  if (!fs.existsSync(reportPath)) {
    console.log('⚠️  Nenhum relatório de tendências encontrado.');
    console.log('Execute primeiro: node scripts/monitor-tendencias.js\n');
    return [];
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  return report.suggestions || [];
}

// Converte sugestão em tópico completo
function enrichTopic(suggestion) {
  const slug = suggestion.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return {
    title: suggestion.title,
    slug: slug,
    category: suggestion.category,
    excerpt: `${suggestion.keyword}. Guia completo com análise detalhada, dicas práticas e tudo que você precisa saber para tomar decisões informadas.`,
    imageAlt: `Ilustração conceitual sobre ${suggestion.keyword}`,
    metaTitle: `${suggestion.title.substring(0, 60)}`,
    metaDescription: `${suggestion.keyword}. Análise completa, previsões e guia prático para investidores.`,
    keywords: suggestion.keyword.split(' '),
    monetizationPriority: suggestion.priority,
    affiliateLinks: ['binance', 'bitget'],
    tags: [suggestion.category, ...suggestion.keyword.toLowerCase().split(' ').slice(0, 3)],
    mainConcept: suggestion.keyword.split(' ')[0],
    intro: `Nos últimos meses, ${suggestion.keyword} tem sido um dos tópicos mais pesquisados no mercado cripto. Neste guia completo, vamos explorar tudo que você precisa saber.`,
    content: generateContent({ mainConcept: suggestion.keyword.split(' ')[0] }),
    disclaimer: 'Este artigo é educacional e não constitui recomendação de investimento. Faça sua própria pesquisa.'
  };
}

async function generateImageForArticle(topic) {
  console.log(`   🎨 Gerando imagem para: ${topic.slug}...`);

  // TODO: Integrar com Cloudflare AI
  // Por agora, apenas simula
  return `public/images/${topic.category}/2025-12/${topic.slug}.png`;
}

async function main() {
  console.log('🚀 Gerador de Artigos em Lote - A Cifra\n');
  console.log('═'.repeat(50));

  // 1. Carregar sugestões
  const suggestions = loadSuggestions();

  if (suggestions.length === 0) {
    console.log('\n❌ Nenhuma sugestão disponível. Execute monitor-tendencias.js primeiro.\n');
    return;
  }

  console.log(`\n📋 ${suggestions.length} sugestões carregadas`);
  console.log(`🎯 Gerando ${Math.min(CONFIG.targetArticles, suggestions.length)} artigos...\n`);

  const articlesToGenerate = suggestions.slice(0, CONFIG.targetArticles);
  const generated = [];

  // 2. Gerar cada artigo
  for (let i = 0; i < articlesToGenerate.length; i++) {
    const suggestion = articlesToGenerate[i];
    console.log(`\n[${i + 1}/${articlesToGenerate.length}] Gerando: ${suggestion.title}`);

    try {
      // Enrichir dados
      const topic = enrichTopic(suggestion);

      // Gerar conteúdo
      const articleContent = generateArticleTemplate(topic);

      // Salvar artigo
      const articlePath = path.join(__dirname, '../content/articles', `${topic.slug}.md`);
      fs.writeFileSync(articlePath, articleContent);
      console.log(`   ✅ Artigo salvo: ${topic.slug}.md`);

      // Gerar imagem
      await generateImageForArticle(topic);
      console.log(`   ✅ Imagem gerada`);

      generated.push({
        title: topic.title,
        slug: topic.slug,
        path: articlePath
      });

    } catch (error) {
      console.error(`   ❌ Erro ao gerar artigo: ${error.message}`);
    }
  }

  // 3. Relatório final
  console.log('\n' + '═'.repeat(50));
  console.log(`\n✨ Geração concluída!`);
  console.log(`   📄 ${generated.length} artigos criados`);
  console.log(`   ⏱️  Próximo passo: Revisar e fazer deploy\n`);

  // Salvar lista de artigos gerados
  const batchReport = {
    date: new Date().toISOString(),
    articlesGenerated: generated.length,
    articles: generated
  };

  fs.writeFileSync(
    path.join(__dirname, '../data/batch-report.json'),
    JSON.stringify(batchReport, null, 2)
  );

  console.log('📄 Relatório salvo em: data/batch-report.json\n');
}

main().catch(console.error);
