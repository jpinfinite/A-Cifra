/**
 * GERADOR DE ARTIGOS IA PRO (Llama 3 + Cloudflare)
 * Gera artigos longos, estruturados e profundos usando IA.
 *
 * Uso: node scripts/gerar-artigos-ia.js
 */

const fs = require('fs');
const path = require('path');

// Configuração
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct'; // Modelo mais inteligente e grátis

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
                    max_tokens: 3000 // Permitir longas respostas
                })
            }
        );
        const json = await response.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors));
        return json.result.response;
    } catch (e) {
        console.error("❌ Erro na IA:", e.message);
        return null; // Retorna null para o chamador tratar
    }
}

async function generateFullArticle(topic) {
    console.log(`\n🧠 Escrevendo artigo sobre: "${topic.title}"...`);

    const systemPrompt = `
    Você é o editor-chefe do portal "A Cifra", especialista em criptomoedas, blockchain e economia digital.
    Seu estilo de escrita é:
    - Profissional e Autoridade: Use dados, termos técnicos corretos e argumentos sólidos.
    - Otimizado para SEO: Use parágrafos curtos, negrito em palavras-chave e estrutura clara.
    - Imersivo: Prenda a atenção do leitor do início ao fim.
    - Português do Brasil.
    `;

    // 1. Gerar Introdução e Contexto (400+ palavras)
    console.log("   ✍️  Gerando Introdução...");
    const introPrompt = `Escreva uma introdução profunda e abrangente (mínimo 400 palavras) para o artigo "${topic.title}".
    Comece com um gancho forte sobre o cenário de 2025/2026.
    Explique a "dor" do mercado e por que "${topic.keyword}" é a solução.
    Não coloque título, comece direto no texto. Use Markdown.`;

    const intro = await generateTextWithAI(systemPrompt, introPrompt);
    if (!intro) return null; // Falha na API

    // 2. Gerar Desenvolvimento Técnico (Fundamentos)
    console.log("   ✍️  Gerando Parte Técnica...");
    const techPrompt = `Escreva a fundamentação técnica de "${topic.keyword}" (Mínimo 600 palavras).
    - O que é e Como Funciona "debaixo do capô" (Explain like I'm 5 mas com profundidade).
    - Diferenciais técnicos vs concorrentes.
    - Use analogias.
    - Subtítulos H2 (##).
    Use Markdown.`;

    const techBody = await generateTextWithAI(systemPrompt, techPrompt);
    if (!techBody) return null;

    // 3. Gerar Análise de Mercado (Tendências)
    console.log("   ✍️  Gerando Análise de Mercado...");
    const marketPrompt = `Faça uma análise de mercado para "${topic.keyword}" em 2026 (Mínimo 500 palavras).
    - Potencial de valorização e Market Cap.
    - Adoção institucional e parcerias.
    - Riscos e Desafios.
    - Subtítulos H2 (##).
    Use Markdown.`;

    const marketBody = await generateTextWithAI(systemPrompt, marketPrompt);
    if (!marketBody) return null;

    // 4. Gerar Conclusão e FAQ
    console.log("   ✍️  Gerando Conclusão...");
    const footerPrompt = `Escreva a conclusão e um FAQ detalhado para "${topic.title}".
    - Conclusão: Resumo com call-to-action intelectual.
    - FAQ: 5 perguntas frequentes com respostas completas.
    - Disclaimer final.
    Use Markdown.`;

    const footer = await generateTextWithAI(systemPrompt, footerPrompt);
    if (!footer) return null;

    // Montar Artigo Final
    return `${intro}\n\n${techBody}\n\n${marketBody}\n\n${footer}`;
}

function createFrontmatter(topic) {
    const today = new Date().toISOString().split('T')[0];
    // Se o tópico tiver publishDate (do planner), usa ela. Se não, usa hoje.
    const date = topic.publishDate || today;

    const slug = topic.keyword.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    return `---
id: '${slug}-${date}'
title: '${topic.title}'
slug: '${slug}'
excerpt: 'Análise completa sobre ${topic.keyword}. Descubra as previsões, tecnologias e oportunidades para 2026 neste guia exclusivo A Cifra.'
coverImage:
  src: '/images/${topic.category}/2025-12/${slug}.webp'
  alt: '${topic.title}'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '${date}'
updatedAt: '${date}'
categorySlug: '${topic.category}'
tags: ["${topic.category}", "tendencias-2026", "tecnologia"]
seo:
  metaTitle: '${topic.title} | Análise 2026'
  metaDescription: 'Guia definitivo sobre ${topic.keyword}. Previsões de mercado e análise técnica para investidores inteligentes.'
  keywords: ["${topic.keyword}", "criptomoedas 2026", "investimento"]
monetization:
  priority: 'high'
  affiliateLinks: ["binance", "bitget"]
---

# ${topic.title}

`;
}

async function main() {
    console.log('🚀 Gerador de Artigos IA - A Cifra\n');

    // Carregar sugestões (Prioridade para Pauta Semanal)
    let suggestions = [];
    const weeklyPlanPath = path.join(__dirname, '../data/weekly-plan.json');
    const trendingPath = path.join(__dirname, '../data/trending-report.json');

    if (fs.existsSync(weeklyPlanPath)) {
        console.log('📅 Carregando pauta semanal (weekly-plan.json)...');
        const plan = JSON.parse(fs.readFileSync(weeklyPlanPath, 'utf8'));
        suggestions = plan.suggestions || [];
    } else if (fs.existsSync(trendingPath)) {
        console.log('🔥 Carregando tendências (trending-report.json)...');
        const report = JSON.parse(fs.readFileSync(trendingPath, 'utf8'));
        suggestions = report.suggestions || [];
    } else {
        console.log('❌ Nenhum plano encontrado.');
        console.log('   Execute "node scripts/planejar-pauta.js" para criar uma pauta semanal.');
        console.log('   Ou "node scripts/monitor-tendencias.js" para tendências diárias.');
        return;
    }

    // Processar cada sugestão
    console.log(`🎯 Total de artigos para gerar: ${suggestions.length}\n`);

    for (let i = 0; i < suggestions.length; i++) {
        const topic = suggestions[i];
        console.log(`[${i+1}/${suggestions.length}] Processando: ${topic.title}`);

        try {
            // Verificar se já existe para não gastar IA à toa
            const slug = topic.keyword.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const potentialPath = path.join(__dirname, '../content/articles', `${slug}.md`);
            if (fs.existsSync(potentialPath)) {
                console.log(`   ⚠️  Artigo já existe, pulando.`);
                continue;
            }

            const content = await generateFullArticle(topic);
            if (!content) {
                console.log(`   ⚠️  Falha ao gerar texto (API pode estar sobrecarregada), tentando próximo...`);
                continue;
            }

            const fullArticle = createFrontmatter(topic) + content;
            fs.writeFileSync(potentialPath, fullArticle);
            console.log(`   ✅ Artigo salvo: ${slug}.md`);

        } catch (error) {
            console.error(`   ❌ Falha em ${topic.title}:`, error);
        }
    }

    console.log('\n✨ Processo Concluído! Agora rode "node scripts/fix-missing-images.js" para criar as capas.');
}

main();
