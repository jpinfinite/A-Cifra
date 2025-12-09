/**
 * BOT JORNALISTA - A CIFRA
 * Automação 24/7 de criação e postagem de artigos
 * ------------------------------------------------
 * - Coleta RSS
 * - Filtra novos tópicos
 * - Gera artigos completos (Cloudflare AI)
 * - Busca imagens relacionadas (Pexels)
 * - Salva artigo com frontmatter
 * - Traduz automaticamente
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { exec } = require('child_process');
const pexelsFetcher = require('./pexels-image-fetcher.js');

// ==============================
// CONFIG
// ==============================
const CONFIG = {
    intervalHours: 6,
    articlesPerCycle: 2,
    rssUrl: 'https://br.cointelegraph.com/rss',
    cloudflare: {
        token: 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1',
        accountId: 'bcc4a32437bc8c7a9ec9c37872e2b23e',
        model: '@cf/meta/llama-3.1-8b-instruct'
    },
    paths: {
        history: path.join(__dirname, '../data/post_history.json'),
        articles: path.join(__dirname, '../content/articles')
    }
};

const INTERVAL_MS = CONFIG.intervalHours * 60 * 60 * 1000;

// ==============================
// HELPERS
// ==============================

function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slugify(str) {
    return str.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 80);
}

function safeReadJSON(file, fallback = []) {
    try {
        return fs.existsSync(file)
            ? JSON.parse(fs.readFileSync(file, 'utf8'))
            : fallback;
    } catch {
        return fallback;
    }
}

async function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// ==============================
// IA MODULE
// ==============================

async function generateWithAI(messages) {
    const { token, accountId, model } = CONFIG.cloudflare;

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages,
                    max_tokens: 3000
                })
            }
        );

        const json = await response.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors));

        return json.result.response;
    } catch (e) {
        console.error('❌ IA Error:', e.message);
        return null;
    }
}

// ==============================
// SEO BOOSTER MODULE
// ==============================

async function seoBooster(article, title, category) {
    console.log("   🔍 Executando SEO BOOSTER com NLP...");

    const prompt = `
Você é um especialista em SEO técnico e semântico, com foco em artigos jornalísticos sobre criptomoedas.

Analise o ARTIGO a seguir e RETORNE APENAS UM JSON no formato:

{
  "entities": ["lista de entidades semânticas relevantes (ex: Bitcoin, Ethereum, SEC)"],
  "ner": ["entidades nomeadas importantes"],
  "lsiKeywords": ["conjunto de termos relacionados (LSI)"],
  "searchIntents": ["possíveis intenções do usuário"],
  "paaQuestions": ["People Also Ask questions do Google"],
  "contentGaps": ["pontos que faltam no artigo"],
  "schema": { /* Article or NewsArticle JSON-LD minimal structure */ },
  "improvedVersion": "versão otimizada do artigo, mantendo o estilo do autor e ampliando o conteúdo para SEO. Retorne o texto completo em Markdown."
}

Regras:
- Use NLP e entidades Google Style: organizations, assets, blockchains, tokens, protocols, events.
- A versão otimizada deve incluir as entidades de forma natural.
- Não repetir conteúdo; expandir, contextualizar e aprofundar.
- Traduza tudo para PT-BR.
- Evitar linguagem robótica.
- A improvedVersion deve ser 100% substituível como artigo final.

ARTIGO:
${article}

TÍTULO:
${title}

CATEGORIA:
${category}
    `.trim();

    try {
        const result = await generateWithAI([
            { role: "system", content: "Você é um especialista em SEO." },
            { role: "user", content: prompt }
        ]);

        // Limpar possíveis blocos de código markdown que a IA coloque
        const cleaned = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {
        // console.error("   ⚠️ ERRO ao interpretar JSON do SEO Booster (usando versão original):", err.message);
        return null;
    }
}

async function generateArticle(title, description, category) {
    console.log(`\n🧠 Escrevendo artigo (humanizado): "${title}"...`);

    // SYSTEM PROMPT — ESTILO JORNALÍSTICO PROFISSIONAL
    const systemPrompt = `
Você é o Editor-Chefe do portal jornalístico "A Cifra", especializado em economia digital, blockchain e criptomoedas.

Sua escrita deve ser:
- Jornalística, clara e imparcial.
- Natural e humana (nunca robótica).
- Organizada em Markdown, com escaneabilidade.
- Otimizada para SEO sem parecer artificial.
- Contextualizada, com explicações simples sobre termos técnicos.
- Totalmente original — nunca copie frases do RSS.
- Com análise de impacto, riscos e possíveis consequências.

Regras importantes:
1. Não invente valores, números, porcentagens ou datas específicas.
2. Não crie citações de pessoas reais.
3. Use frases curtas e diretas no padrão jornalístico brasileiro.
4. Evite adjetivos exagerados e sensacionalismo.
5. Quando houver especulação, indique claramente que é previsão.
6. Para conceitos técnicos, explique com analogias simples (“em termos simples…”).
    `;

    const parts = [
        {
            label: 'introdução',
            prompt: `
Escreva uma introdução jornalística altamente humana e natural (250–350 palavras) para a notícia:

TÍTULO: "${title}"
CONTEXTO DA FONTE RSS: ${description}

Instruções:
- Comece pelo lide: quem / o quê / onde / quando / por quê importa.
- Mantenha tom humano, como um repórter experiente explicando o fato.
- Conecte com o contexto maior do mercado cripto.
- Sem frases genéricas, sem repetir o título artificialmente.
- Nada de "Neste artigo" ou comentários meta.
- Não invente números ou dados específicos.

Estilo de escrita obrigatório:
- Ritmo natural.
- Vocabulário variado.
- Parágrafos curtos.
- Evite jargões sem explicação.
- Não escreva como IA; escreva como jornalista profissional.
            `
        },
        {
            label: 'corpo',
            prompt: `
Desenvolva o corpo principal da notícia de "${title}" em 600–700 palavras.

Siga esta estrutura:

## Contexto e detalhamento dos fatos
- Explique calmamente o que aconteceu.
- Traga informações de bastidores e contexto relevante.
- Adicione elementos que um leitor comum não sabe, mas um repórter sim.

## Consequências imediatas
- Explique como o mercado costuma reagir nesse tipo de situação (sem números).
- Destaque riscos, incertezas e possíveis leituras do setor.

## Aspectos técnicos
- Explique eventuais termos de blockchain, tokens, mineração, rede, layer-2.
- Sempre use analogias simples: "Em termos simples..." / "Na prática, isso significa que..."

## Panorama futuro
- Aponte dois ou três possíveis desdobramentos.
- Indique sempre quando algo é apenas possibilidade e não fato.

Regras:
- Use subtítulos H2 obrigatórios.
- Parágrafos de 2–4 frases.
- Nunca invente dados.
- Nada de previsões absolutas; use condicionais.

Estilo obrigatório (máscara de humanização):
- Evite repetições de estrutura.
- Varie conectivos.
- Ritmo natural, fluido.
- Clareza acima de tudo.
            `
        },
        {
            label: 'conclusão',
            prompt: `
Escreva uma conclusão humana (120–180 palavras) para a notícia "${title}".

Inclua:
- Um fechamento natural e orgânico.
- Uma reflexão sobre por que esse evento importa ao leitor.
- Sinalização de riscos e incertezas do mercado.
- Aviso: "Este texto não constitui recomendação de investimento."

Depois, crie um FAQ curto:
- 2 perguntas.
- Respostas curtas e diretas.

Estilo:
- Jornalístico.
- Calmo e claro.
- Nada de sensacionalismo.
            `
        }
    ];

    let content = '';

    for (const part of parts) {
        console.log(`   ✏️ Gerando ${part.label}...`);
        // USANDO O NOVO PIPELINE DE QUALIDADE
        const section = await autoGenerateHighQualityArticle(systemPrompt, part.prompt);
        if (!section) return null;
        content += section + '\n\n';
    }

    // APLICANDO SEO BOOSTER - Passo Final
    let seoMetadata = null;
    try {
        const improvedSEO = await seoBooster(content, title, category);
        if (improvedSEO && improvedSEO.improvedVersion) {
            console.log("   🚀 Artigo otimizado com NLP e SEO Semântico.");
            content = improvedSEO.improvedVersion;
            seoMetadata = improvedSEO;
        } else {
             console.log("   ⚠️ Pulo SEO Booster (sem resposta válida), mantendo original.");
        }
    } catch (e) {
         console.log("   ⚠️ Erro SEO Booster:", e.message);
    }

    return { content, seoMetadata };
}

// ==============================
// AUTO-QUALITY PIPELINE
// ==============================

async function autoGenerateHighQualityArticle(systemPrompt, userPrompt) {
    console.log("   🚀 Iniciando AUTO-QUALITY PIPELINE");

    // 1 — Geração inicial
    let article = await generateWithAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ]);

    if (!article || article.length < 50) {
        console.error("   ❌ Falha na geração inicial");
        return null;
    }

    // 2 — Avaliar a qualidade
    let firstEval = await evaluateArticleQuality(article);

    // 3 — Se a nota for baixa, corrigir automaticamente
    if (firstEval && firstEval.score < 85) {
        console.log("   🔧 Artigo insuficiente. Aplicando correções...");
        article = firstEval.suggestedFix || article;
    }

    // 4 — Humanização extra se necessário
    const human = await detectRoboticPatterns(article);
    if (human && human.roboticScore > 60) {
        console.log("   🤖 Detecção de robô alta — aplicando humanização...");
        article = await humanizeArticle(article);
    }

    // 5 — Segunda avaliação (após melhorias)
    const secondEval = await evaluateArticleQuality(article);

    // 6 — Escolher a melhor versão
    const finalVersion = chooseBestVersion(firstEval, secondEval);

    // 7 — Sanitização final
    const sanitized = sanitizeFinal(finalVersion);

    console.log("   🎉 Seção finalizada com sucesso!");
    return sanitized;
}

async function evaluateArticleQuality(text) {
    const qualityPrompt = `
Avalie a QUALIDADE HUMANA do artigo abaixo.

RETORNE APENAS UM JSON, seguindo EXATAMENTE esta estrutura:

{
  "score": 0-100,
  "label": "Excelente | Bom | Médio | Fraco",
  "problems": ["lista de problemas"],
  "suggestedFix": "refaça o texto totalmente corrigido se score < 85, caso contrário string vazia",
  "summaryQuality": "explicação breve"
}

CRITÉRIOS:
- Clareza e profundidade
- Ausência de construção robótica
- Variedade de vocabulário
- Estrutura lógica
- Transições naturais
- Conclusão coerente
- Especificidade e conteúdo real

ARTIGO:
${text}
    `.trim();

    try {
        const response = await generateWithAI([
            { role: "system", content: "Você é um revisor profissional de artigos." },
            { role: "user", content: qualityPrompt }
        ]);
        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

    } catch (e) {
        return {
            score: 70, // Assume médio
            label: "Erro",
            problems: ["Falha ao avaliar"],
            suggestedFix: text,
            summaryQuality: "Sem avaliação."
        };
    }
}

async function detectRoboticPatterns(text) {
    const prompt = `
Avalie se o texto abaixo parece escrito por uma IA.

RETORNE APENAS ESTE JSON:

{
  "roboticScore": 0-100,
  "reasons": ["motivos do porquê parece robótico"],
  "suggestFixes": ["como humanizar"]
}

TEXTO:
${text}
    `;

    try {
        const res = await generateWithAI([
             { role: "system", content: "Você é um especialista em detecção de IA." },
             { role: "user", content: prompt }
        ]);
        return JSON.parse(
            res.replace(/```json/g, "").replace(/```/g, "").trim()
        );
    } catch {
        return { roboticScore: 50 };
    }
}

async function humanizeArticle(text) {
    const prompt = `
Reescreva o texto abaixo de forma 100% humana, natural e orgânica.
Inclua:
- ritmo natural
- variação de frases longas e curtas
- transições suaves
- tom conversacional-profissional
- vocabulário realista
- exemplos naturais
- detalhes plausíveis

MANTENHA:
- mensagem
- fatos
- intenção

TEXTO:
${text}
    `;

    const res = await generateWithAI([
         { role: "system", content: "Você é um escritor profissional." },
         { role: "user", content: prompt }
    ]);
    return res || text;
}

function chooseBestVersion(firstEval, secondEval) {
    if (secondEval && firstEval && secondEval.score >= firstEval.score && secondEval.suggestedFix) {
        return secondEval.suggestedFix || "";
    }
    return (firstEval && firstEval.suggestedFix) ? firstEval.suggestedFix : "";
}

function sanitizeFinal(text) {
    if (!text) return "";
    return text
        .replace(/```+/g, "")
        .replace(/\u0000/g, "")
        .trim();
}

// ==============================
// RSS MODULE
// ==============================

function parseRSS(xml) {
    const items = [];
    const regexItem = /<item>([\s\S]*?)<\/item>/g;
    const tag = (xml, name) => {
        const r = new RegExp(`<${name}><!\\[CDATA\\[(.*?)\\]\\]><\\/${name}>|<${name}>(.*?)<\\/${name}>`);
        const m = xml.match(r);
        return m ? (m[1] || m[2] || '').trim() : '';
    };

    let match;
    while ((match = regexItem.exec(xml))) {
        const block = match[1];
        const title = tag(block, 'title');
        const desc = tag(block, 'description').replace(/<[^>]+>/g, '');

        if (!title) continue;

        items.push({
            title,
            description: desc,
            id: crypto.createHash('md5').update(title).digest('hex')
        });
    }
    return items;
}

// ==============================
// FRONTMATTER
// ==============================

function buildFrontmatter({ title, slug, category, date, image, seoMetadata }) {
    // Processar tags extras do SEO
    let tags = [`"${category}"`, '"noticias"', '"mercado"'];

    if (seoMetadata && seoMetadata.entities && Array.isArray(seoMetadata.entities)) {
        // Adicionar top 5 entidades como tags, limpando aspas
        const extraTags = seoMetadata.entities.slice(0, 5).map(t => `"${t.replace(/"/g, '')}"`);
        tags = [...tags, ...extraTags];
    }

    // Remover duplicatas
    tags = [...new Set(tags)];

    return `---
id: '${slug}-${date}'
title: '${title.replace(/'/g, "''")}'
slug: '${slug}'
excerpt: 'Resumo da notícia: ${title}.'
coverImage:
  src: '${image}'
  alt: '${title}'
  width: 1200
  height: 630
author:
  name: 'A Cifra News'
publishedAt: '${date}'
updatedAt: '${date}'
categorySlug: '${category}'
tags: [${tags.join(', ')}]
seo:
  metaTitle: '${title} | A Cifra'
  metaDescription: '${title} — análise completa.'
language: 'pt-BR'
---

# ${title}

`;
}

// ==============================
// MAIN CYCLE
// ==============================

async function executeCycle() {
    console.log(`\n⏰ Iniciando ciclo: ${new Date().toLocaleString()}`);

    ensureDirectory(path.dirname(CONFIG.paths.history));
    ensureDirectory(CONFIG.paths.articles);

    const history = safeReadJSON(CONFIG.paths.history);

    console.log('📡 Buscando RSS...');
    const xml = await httpGet(CONFIG.rssUrl);
    const items = parseRSS(xml);

    const newItems = items.filter(i => !history.includes(i.id));
    console.log(`   ➝ ${newItems.length} novas notícias.`);

    const toProcess = newItems.slice(0, CONFIG.articlesPerCycle);
    if (toProcess.length === 0) {
        console.log('   Nenhuma nova notícia. Aguardando próximo ciclo.');
        return;
    }

    for (const item of toProcess) {
        console.log(`\n   📰 ${item.title}`);

        const slug = slugify(item.title);
        const date = new Date().toISOString().split('T')[0];

        // Categoria simples
        const category = ['bitcoin', 'ethereum', 'defi']
            .find(c => item.title.toLowerCase().includes(c)) || 'analises';

        // 1. IA (Geração + Qualidade + SEO Booster)
        const result = await generateArticle(item.title, item.description, category);
        if (!result || !result.content) continue;

        const { content, seoMetadata } = result;

        // 2. Imagem
        let imagePath = '/images/placeholder.jpg';
        try {
            console.log('   📸 Buscando imagem...');

            const res = await pexelsFetcher.searchPhotos(item.title + ' crypto', { perPage: 1 });

            if (res.photos?.length) {
                const saved = await pexelsFetcher.saveImageForArticle(
                    res.photos[0],
                    `${slug}.jpg`,
                    true
                );
                imagePath = saved.path;
            }
        } catch (e) {
            console.log('   ⚠️ Erro na imagem:', e.message);
        }

        // 3. Salvar artigo
        const file = path.join(CONFIG.paths.articles, `${slug}.md`);
        const frontmatter = buildFrontmatter({
            title: item.title,
            slug,
            category,
            date,
            image: imagePath,
            seoMetadata
        });

        fs.writeFileSync(file, frontmatter + content);
        console.log(`   ✅ Artigo salvo: ${file}`);

        history.push(item.id);
    }

    fs.writeFileSync(CONFIG.paths.history, JSON.stringify(history, null, 2));

    // 4. Tradução
    console.log('   🌍 Traduzindo artigos...');
    exec('node scripts/traduzir-artigos.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`   ⚠️ Erro na tradução: ${error.message}`);
            return;
        }
        console.log('   🌎 Traduções concluídas.');

        // 5. Deploy Automático
        console.log('   🚀 Enviando para o GitHub (Deploy)...');
        exec('git add . && git commit -m "content: auto-generated articles" && git push origin main', (err, out, std) => {
            if (err) {
                console.error(`   ❌ Erro no deploy: ${err.message}`);
            } else {
                console.log('   ✅ Deploy enviado com sucesso! O site será atualizado em instantes.');

                // 6. Postar no Telegram
                const telegramPoster = require('./telegram-poster.js');
                console.log('   📡 Enviando notificações para o Telegram...');

                // Precisamos recuperar os itens processados neste ciclo.
                // Como 'toProcess' está no escopo acima, podemos re-iterar ou salvar em uma lista.
                // Mas o 'toProcess' tem os dados crus. Precisamos dos slugs gerados.
                // Vamos reconstruir o slug e URL.

                toProcess.forEach(item => {
                    const slug = slugify(item.title);
                    const url = `https://a-cifra.com.br/artigo/${slug}`;
                    // Tentar achar a imagem salva ou usar placeholder (aqui simplificado)
                    // Para imagem, idealmente teriamos salvo o caminho no objeto item ou array paralelo.
                    // Vamos usar apenas Texto se não tivermos a imagem fácil, ou tentar inferir.
                    // O script salvou como ${slug}.jpg.
                    const imageUrl = `https://a-cifra.com.br/images/articles/${slug}.jpg`;

                    telegramPoster.postToTelegram(item.title, url, imageUrl);
                });
            }
        });
    });
}

// ==============================
// START
// ==============================

console.log('🤖 BOT JORNALISTA - INICIANDO...\n');
executeCycle();
setInterval(() => executeCycle(), INTERVAL_MS);
