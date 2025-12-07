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
        return null;
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

    // 1. Gerar Introdução e Contexto
    console.log("   ✍️  Gerando Introdução...");
    const introPrompt = `Escreva uma introdução impactante (300-400 palavras) para o artigo "${topic.title}".
    Comece com um gancho forte sobre o cenário de 2025/2026.
    Explique por que "${topic.keyword}" é crucial agora.
    Não coloque título, comece direto no texto. Use Markdown.`;

    const intro = await generateTextWithAI(systemPrompt, introPrompt);

    // 2. Gerar Desenvolvimento Técnico
    console.log("   ✍️  Gerando Desenvolvimento...");
    const bodyPrompt = `Escreva o corpo técnico do artigo "${topic.title}".
    Divida em subtítulos H2 (##).
    Tópicos obrigatórios:
    - O que é e Como Funciona (Explicação técnica mas acessível)
    - Análise de Mercado e Potencial de Valorização
    - Comparação com concorrentes ou ciclos passados
    Use Markdown. Mínimo 600 palavras.`;

    const body = await generateTextWithAI(systemPrompt, bodyPrompt);

    // 3. Gerar Conclusão e FAQ
    console.log("   ✍️  Gerando Conclusão...");
    const footerPrompt = `Escreva a conclusão e um FAQ para "${topic.title}".
    - Conclusão: Resumo visionário sobre o futuro em 2030.
    - FAQ: 3 perguntas frequentes com respostas diretas.
    - Disclaimer final sobre riscos.
    Use Markdown.`;

    const footer = await generateTextWithAI(systemPrompt, footerPrompt);

    // Montar Artigo Final
    return `${intro}\n\n${body}\n\n${footer}`;
}

function createFrontmatter(topic) {
    const date = new Date().toISOString().split('T')[0];
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

    // Carregar sugestões
    const reportPath = path.join(__dirname, '../data/trending-report.json');
    if (!fs.existsSync(reportPath)) {
        console.log('❌ Execute "node scripts/monitor-tendencias.js" primeiro.');
        return;
    }
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const suggestions = report.suggestions || [];

    // Processar cada sugestão
    for (const topic of suggestions) {
        try {
            const content = await generateFullArticle(topic);
            if (!content) continue;

            const fullArticle = createFrontmatter(topic) + content;

            const slug = topic.keyword.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const filePath = path.join(__dirname, '../content/articles', `${slug}.md`);

            fs.writeFileSync(filePath, fullArticle);
            console.log(`   ✅ Artigo salvo: ${slug}.md`);

        } catch (error) {
            console.error(`   ❌ Falha em ${topic.title}:`, error);
        }
    }

    console.log('\n✨ Processo Concluído! Agora rode "node scripts/fix-missing-images.js" para criar as capas.');
}

main();
