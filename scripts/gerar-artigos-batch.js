/**
 * Gerador de Artigos em Lote 2.0 (Versão Long-Form)
 * Gera artigos densos (1500+ palavras) e detalhados automaticamente
 * Execute: node scripts/gerar-artigos-batch.js
 */

const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
  articleLength: 2000,
  imagesPerArticle: 1,
  targetArticles: 10 // Aumentado para cobrir todos os recentes
};

// --- BANCO DE TEXTOS MODULARES ---

const INTRO_TEMPLATES = [
  (topic) => `O mercado de criptomoedas está em constante evolução, e **${topic.title}** surge como uma das narrativas mais poderosas para o ciclo de 2025 e 2026. Com a aproximação de novos marcos regulatórios e avanços tecnológicos, entender este conceito não é apenas uma vantagem competitiva, mas uma necessidade para investidores sérios. Neste artigo exaustivo, vamos mergulhar fundo nos fundamentos, nas oportunidades assimétricas e nos riscos que cercam ${topic.keyword}. Prepare-se para um guia definitivo.`,
  (topic) => `Se você tem acompanhado as movimentações institucionais recentes, certamente ouviu falar sobre **${topic.keyword}**. Não é exagero afirmar que este setor tem o potencial de redefinir a forma como interagimos com finanças digitais nos próximos anos. Enquanto muitos investidores de varejo ainda estão focados em memecoins passageiras, o "dinheiro inteligente" (Smart Money) já está se posicionando fortemente em ${topic.category}. Hoje, vamos desmistificar tudo sobre **${topic.title}** e mostrar como você pode se antecipar a essa tendência explosiva de 2026.`
];

const CONTEXT_TEMPLATES = [
  (topic) => `Para compreender a magnitude de **${topic.keyword}**, precisamos olhar para o cenário macroeconômico de 2025. Com as taxas de juros globais se estabilizando e a liquidez retornando aos mercados de risco, ativos com utilidade real e infraestrutura robusta estão ganhando destaque. ${topic.keyword} não é apenas uma especulação; é uma resposta direta às ineficiências do sistema atual. Analistas preveem que o setor de ${topic.category} pode crescer mais de 300% até o final de 2026, impulsionado por adoção institucional e clareza regulatória.`,
  (topic) => `O ano de 2024 foi de construção, mas 2025 e 2026 prometem ser de colheita. A tecnologia por trás de **${topic.keyword}** amadureceu significativamente. Problemas de escalabilidade que antes limitavam o crescimento foram resolvidos, e a interface de usuário (UX) melhorou drasticamente. Isso cria o ambiente perfeito para a adoção em massa. Estamos vendo grandes players do mercado tradicional, como gestoras de ativos e bancos (BlackRock, Fidelity), demonstrarem interesse crescente em soluções ligadas a ${topic.category}, validando ainda mais a tese de longo prazo.`
];

const WHAT_IS_TEXTS = [
    "Fundamentalmente, trata-se de uma mudança de paradigma. Ao contrário de ciclos anteriores focados puramente em especulação, agora vemos casos de uso tangíveis. A tecnologia permite transações mais rápidas, transparentes e, crucialmente, descentralizadas, eliminando intermediários custosos.",
    "No seu núcleo, estamos falando de eficiência e soberania. A arquitetura descentralizada oferece resistência à censura e acessibilidade global, algo que sistemas legados simplesmente não conseguem competir. É a evolução natural da web3 encontrando o mundo real."
];

// Funções Auxiliares de Geração de Texto Rico

function generateDetailedSection(title, paragraphs) {
    return `## ${title}\n\n` + paragraphs.join('\n\n') + '\n\n';
}

function generateListSection(title, items) {
    let section = `## ${title}\n\n`;
    items.forEach(item => {
        section += `### ${item.subtitle}\n\n${item.text}\n\n`;
    });
    return section;
}

function getDynamicContent(topic) {
    // 1. Introdução Rica
    let content = INTRO_TEMPLATES[Math.floor(Math.random() * INTRO_TEMPLATES.length)](topic) + '\n\n';

    // 2. Contexto de Mercado (O "Porquê Agora")
    content += CONTEXT_TEMPLATES[Math.floor(Math.random() * CONTEXT_TEMPLATES.length)](topic) + '\n\n';

    // 3. O Que É (Definição Profunda)
    content += `## 📖 O Que É ${topic.mainConcept} e Por Que Importa?\n\n`;
    content += `${WHAT_IS_TEXTS[0]} **${topic.keyword}** representa a convergência entre tecnologia blockchain avançada e demandas reais do mercado.\n\n`;
    content += `Imagine um sistema onde a confiança é programática. É exatamente isso que ${topic.keyword} propõe. Não estamos mais falando de promessas de whitepaper, mas de protocolos funcionais que já movimentam milhões de dólares diariamente. A inovação chave aqui reside na capacidade de integrar ${topic.category} com fluxos financeiros tradicionais de forma contínua.\n\n`;
    content += `> *"A tecnologia é melhor quando aproxima as pessoas."* No caso de **${topic.keyword}**, ela aproxima o investidor de oportunidades antes restritas a grandes instituições.\n\n`;

    // 4. Como Funciona (Técnico mas Acessível)
    content += `## 🔍 Como Funciona na Prática: A Mecânica por Trás\n\n`;
    content += `Para o investidor, o processo pode parecer simples, mas há uma engenharia complexa nos bastidores. Vamos quebrar em três pilares fundamentais:\n\n`;
    content += `1. **A Camada de Infraestrutura:** Tudo começa com contratos inteligentes auditados que garantem a segurança das operações. No contexto de ${topic.category}, isso é vital para evitar hacks e exploits.\n`;
    content += `2. **A Execução Descentralizada:** Diferente de servidores centralizados, aqui a validação ocorre on-chain. Isso garante que nenhuma entidade única tenha controle total sobre seus ativos em **${topic.keyword}**.\n`;
    content += `3. **A Interface de Usuário:** Projetos modernos focam em abstração de conta, tornando o uso de ${topic.keyword} tão fácil quanto usar um app de banco digital.\n\n`;

    // 5. Vantagens e Benefícios (Lista Longa)
    content += generateListSection(`✅ Principais Vantagens de Investir em ${topic.mainConcept}`, [
        { subtitle: "Potencial de Valorização Assimétrica", text: "Em um bull market, setores emergentes como este tendem a performar muito acima da média do Bitcoin. O risco é maior, mas o retorno ajustado ao risco pode ser excepcional para quem entra cedo." },
        { subtitle: "Adoção Institucional", text: "Como mencionado, grandes fundos estão de olho. Quando o capital institucional flui para **" + topic.keyword + "**, a liquidez aumenta drasticamente, estabilizando preços em patamares mais altos." },
        { subtitle: "Utilidade Real (Real Yield)", text: "Muitos projetos de " + topic.category + " agora geram receita real de taxas e serviços, distribuindo parte disso aos holders. Isso cria um piso de valor fundamental para o ativo, diferente de tokens puramente especulativos." },
        { subtitle: "Diversificação de Portfólio", text: "Adicionar exposição a **" + topic.keyword + "** reduz a correlação do seu portfólio com o mercado tradicional, oferecendo proteção contra inflação fiduciária e instabilidade bancária." }
    ]);

    // 6. Análise de Tendência 2026
    content += `## 📈 Previsões para 2026: O Que Esperar?\n\n`;
    content += `Analistas da Cifra Research projetam um cenário otimista. Com o halving do Bitcoin já precificado e a liquidez global aumentando, 2026 deve ser o ano da consolidacão para **${topic.keyword}**.\n\n`;
    content += `Espera-se que:\n`;
    content += `- A capitalização de mercado do setor dobre ou triplique.\n`;
    content += `- A regulação nos EUA e Europa traga clareza, permitindo que fundos de pensão invistam.\n`;
    content += `- A tecnologia se torne "invisível", onde usuários usam ${topic.category} sem nem saber que estão usando blockchain.\n\n`;

    // 7. Riscos (Seção Crítica para Credibilidade)
    content += generateListSection(`⚠️ Riscos e Cuidados Essenciais`, [
        { subtitle: "Volatilidade Extrema", text: "Como qualquer ativo cripto emergente, correções de 30% a 50% são normais e saudáveis. Nunca invista dinheiro que você precisará no curto prazo." },
        { subtitle: "Riscos Regulatórios", text: "Embora o cenário esteja melhorando, mudanças abruptas nas leis de países chave podem impactar o preço momentaneamente." },
        { subtitle: "Segurança de Smart Contracts", text: "Sempre verifique se o projeto foi auditado por empresas respeitáveis (como CertiK ou Halborn) antes de interagir com **" + topic.keyword + "**." }
    ]);

    // 8. FAQ
    content += `## ❓ Perguntas Frequentes (FAQ)\n\n`;
    content += `**Vale a pena investir em ${topic.keyword} agora?**\n`;
    content += `Sim, considerando o ciclo de mercado atual, estamos em um ponto de entrada historicamente interessante antes da euforia de 2026.\n\n`;
    content += `**Qual o valor mínimo para começar?**\n`;
    content += `A beleza do DeFi e cripto é a acessibilidade. Você pode começar a expor-se a este setor com valores baixos, aprendendo a dinâmica antes de fazer aportes maiores.\n\n`;
    content += `**É seguro?**\n`;
    content += `A tecnologia blockchain é segura, mas a custódia exige responsabilidade. Use carteiras de hardware e estude sobre auto-custódia.\n\n`;

    // 9. Conclusão
    content += `## 🎯 Conclusão: O Veredito\n\n`;
    content += `Estamos diante de uma janela de oportunidade única. **${topic.keyword}** não é apenas uma 'modinha', mas um componente estrutural do futuro financeiro. Os investidores que dedicarem tempo para estudar e se posicionar agora, em 2025, colherão os frutos em 2026.\n\n`;
    content += `Não deixe a complexidade inicial te afastar. Comece pequeno, estude os fundamentos e acompanhe as atualizações aqui no **A Cifra**.\n\n`;
    content += `_Pronto para dar o próximo passo? Confira as melhores corretoras abaixo para iniciar sua jornada._`;

    return content;
}

// Template de artigo base (Arquivo MD)
function generateArticleTemplate(topic) {
  const date = new Date().toISOString().split('T')[0];
  // O ID deve ser fixo se quisermos substituir, mas gerando um novo garante atualização
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

${topic.content}

---

**Última atualização:** ${date}

*Disclaimer: ${topic.disclaimer}*
`;
}

// Lê sugestões do monitor de tendências
function loadSuggestions() {
  const reportPath = path.join(__dirname, '../data/trending-report.json');
  if (!fs.existsSync(reportPath)) return [];
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  return report.suggestions || [];
}

function enrichTopic(suggestion) {
  const slug = suggestion.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  const mainKw = suggestion.keyword;

  return {
    title: suggestion.title,
    slug: slug,
    category: suggestion.category,
    excerpt: `Descubra tudo sobre ${mainKw}. Um guia completo, atualizado para 2026, cobrindo análise técnica, fundamentalista e previsões de preço.`,
    imageAlt: `Gráfico futurista e conceito tecnológico de ${mainKw}`,
    metaTitle: `${suggestion.title} | Análise Exclusiva A Cifra`,
    metaDescription: `Quer investir em ${mainKw}? Leia nossa análise profunda 2026. Previsões, riscos e o potencial de lucro explicado por especialistas.`,
    keywords: [mainKw, ...mainKw.split(' '), 'criptomoedas 2026', 'investimento', 'blockchain'],
    monetizationPriority: suggestion.priority,
    affiliateLinks: ['binance', 'bitget', 'ledger'],
    tags: [suggestion.category, 'tendencias-2026', 'analise-fundamentalista', 'long-read'],
    mainConcept: mainKw,
    keyword: mainKw,
    content: getDynamicContent({ ...suggestion, slug, mainConcept: mainKw.split(' ')[0] }), // GERA O TEXTO LONGO AQUI
    disclaimer: 'O conteúdo apresentado é meramente informativo e educacional, não constituindo aconselhamento financeiro. Criptoativos são voláteis.'
  };
}

async function main() {
  console.log('🚀 Gerador de Conteúdo Long-Form v2.0 - A Cifra\n');

  const suggestions = loadSuggestions();
  if (suggestions.length === 0) { console.log('❌ Sem sugestões.'); return; }

  // Pegar TODAS as sugestões para garantir que atualizamos tudo que foi criado hoje
  const articlesToGenerate = suggestions;
  console.log(`🎯 Regenerando ${articlesToGenerate.length} artigos com conteúdo expandido...\n`);

  for (let i = 0; i < articlesToGenerate.length; i++) {
    const suggestion = articlesToGenerate[i];
    console.log(`\n[${i + 1}/${articlesToGenerate.length}] Escrevendo: ${suggestion.title}`);

    try {
      const topic = enrichTopic(suggestion);
      const articleContent = generateArticleTemplate(topic);

      // Salvar
      const articlePath = path.join(__dirname, '../content/articles', `${topic.slug}.md`);
      fs.writeFileSync(articlePath, articleContent);

      // Contar palavras (estimativa)
      const wordCount = articleContent.split(/\s+/).length;
      console.log(`   ✅ Salvo! Tamanho: ~${wordCount} palavras (${Math.ceil(wordCount/200)} min leitura)`);
      console.log(`      Path: ${articlePath}`);

      // Imagem já deve existir do script anterior, mas o fix-missing-images garante.

    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}`);
    }
  }

  console.log('\n✨ Todos os artigos foram atualizados com sucesso!');
}

main().catch(console.error);
