/**
 * GERADOR DE ARTIGOS IA PRO - VERSÃO LONG-FORM (1500+ Palavras)
 * Focado em profundidade, SEO e narrativas de 2026.
 */

const fs = require('fs');
const path = require('path');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

// Novos Tópicos Identificados
const NEW_TOPICS = [
    {
        keyword: 'Buyback Meta Crypto',
        title: 'O Fenômeno Buyback: Por Que Projetos Deflacionários Vão Liderar 2026?',
        category: 'analises'
    },
    {
        keyword: 'RWA DePIN Convergence',
        title: 'RWA + DePIN: A Mega Tendência de 2026 Que Une o Mundo Real e Digital',
        category: 'defi'
    },
    {
        keyword: 'Restaking Ethereum 2026',
        title: 'Restaking e Liquid Staking 2.0: Maximizando Renda Passiva no Ethereum',
        category: 'ethereum'
    },
    {
        keyword: 'AI Agents Crypto Narratives',
        title: 'Agentes de IA na Blockchain: O Futuro da Automação Descentralizada',
        category: 'tecnologia'
    },
    {
        keyword: 'Yield Bearing Stablecoins',
        title: 'Stablecoins que Pagam Juros: O Fim do Dinheiro Parado em 2026',
        category: 'defi'
    }
];

async function generateTextWithAI(systemPrompt, userPrompt) {
    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    max_tokens: 3500 // Aumentado para respostas maiores
                })
            }
        );
        const json = await response.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors));
        return json.result.response;
    } catch (e) {
        console.error("❌ Erro na IA:", e.message);
        return null;
    }
}

async function generateFullArticle(topic) {
    console.log(`\n🧠 Escrevendo artigo DENSO (1500+ palavras): "${topic.title}"...`);

    const systemPrompt = `
    Você é um analista sênior de criptomoedas, escrevendo para um público que busca profundidade técnica e financeira.
    Objetivo: Escrever um artigo longo, detalhado e otimizado para SEO.
    Estilo: Autoritativo, Visionário, Analítico.
    Idioma: Português do Brasil.
    `;

    // 1. Introdução (400 palavras)
    console.log("   ✍️  Parte 1: Introdução e Contexto Macro...");
    const intro = await generateTextWithAI(systemPrompt, `
        Escreva uma introdução profunda (mínimo 400 palavras) para "${topic.title}".
        - Contextualize o cenário de 2025/2026.
        - Explique a "dor" do mercado que essa tecnologia resolve.
        - Termine com uma tese forte sobre por que "${topic.keyword}" vai explodir.
        - Use Markdown. Sem título principal.
    `);
    if (!intro) return null;

    // 2. Fundamentos Técnicos (500 palavras)
    console.log("   ✍️  Parte 2: Deep Dive Técnico...");
    const tech = await generateTextWithAI(systemPrompt, `
        Aprofunde-se na tecnologia por trás de "${topic.keyword}". (Mínimo 500 palavras).
        - Como funciona "debaixo do capô"?
        - Diferenças cruciais para tecnologias anteriores.
        - Use analogias inteligentes.
        - Use subtítulos H2 (##).
    `);
    if (!tech) return null;

    // 3. Análise de Mercado e Previsões (400 palavras)
    console.log("   ✍️  Parte 3: Análise de Mercado...");
    const market = await generateTextWithAI(systemPrompt, `
        Faça uma análise de mercado para "${topic.keyword}" em 2026. (Mínimo 400 palavras).
        - Quem são os grandes players (institucionais)?
        - Projeção de crescimento (Market Cap).
        - Comparação com ciclos de 2021 e 2024.
        - Use subtítulos H2 (##).
    `);
    if (!market) return null;

    // 4. Conclusão e FAQ (300 palavras)
    console.log("   ✍️  Parte 4: Conclusão e FAQ...");
    const footer = await generateTextWithAI(systemPrompt, `
        Escreva a conclusão e FAQ para "${topic.title}".
        - Conclusão: O veredito final para o investidor.
        - 5 Perguntas Frequentes (FAQ) detalhadas.
        - Disclaimer sobre riscos.
        Use subtítulos H2 (##).
    `);
    if (!footer) return null;

    return `${intro}\n\n${tech}\n\n${market}\n\n${footer}`;
}

function createFrontmatter(topic) {
    const today = new Date().toISOString().split('T')[0];
    const slug = topic.keyword.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    return `---
id: '${slug}-${today}'
title: '${topic.title}'
slug: '${slug}'
excerpt: 'Análise aprofundada (Long-Form) sobre ${topic.keyword}. Um guia técnico e financeiro completo para o ciclo de 2026.'
coverImage:
  src: '/images/${topic.category}/2025-12/${slug}.webp'
  alt: '${topic.title}'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '${today}'
updatedAt: '${today}'
categorySlug: '${topic.category}'
tags: ["${topic.category}", "deep-dive", "tendencias-2026"]
seo:
  metaTitle: '${topic.title} | Análise Completa 2026'
  metaDescription: 'Artigo técnico sobre ${topic.keyword}. Entenda os fundamentos, tecnologia e potencial de valorização para 2026.'
  keywords: ["${topic.keyword}", "bull run 2026", "cripto analise"]
monetization:
  priority: 'high'
  affiliateLinks: ["binance", "bitget"]
---

# ${topic.title}

`;
}

async function main() {
    console.log('🚀 Iniciando Geração de Artigos Long-Form (1500+ palavras)...\n');

    for (let i = 0; i < NEW_TOPICS.length; i++) {
        const topic = NEW_TOPICS[i];
        try {
            const content = await generateFullArticle(topic);
            if (!content) continue;

            const fullArticle = createFrontmatter(topic) + content;
            const slug = topic.keyword.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

            // Garantir diretório
            const dir = path.join(__dirname, '../content/articles');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(path.join(dir, `${slug}.md`), fullArticle);
            console.log(`   ✅ Artigo Salvo: ${slug}.md (~${fullArticle.length/5} palavras est.)`);

        } catch (error) {
            console.error(`   ❌ Falha em ${topic.title}:`, error);
        }
    }
    console.log('\n✨ Todos os artigos gerados! Próximo passo: Imagens.');
}

main();
