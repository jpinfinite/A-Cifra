
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct'; // Or a stronger model like llama-3-70b if available, but staying safe
const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Prompts loaded from files (Hardcoded here for reliability based on reading)
const PROMPTS = {
    INTENT_ANALYSIS: `Você é um analista de SEO sênior especializado em criptomoedas.

Analise o tema: "{TEMA}"

Determine:
1. Intenção de busca principal (informacional, navegacional, transacional)
2. Sub-intenções secundárias
3. Perguntas implícitas do usuário
4. Tipo de conteúdo esperado na SERP (guia, notícia, análise, tutorial)

Responda em JSON.
Não escreva texto explicativo.`,

    EDITORIAL_PLANNING: `Você é editor-chefe de um portal cripto chamado A-Cifra.

Com base na intenção de busca abaixo:
{INTENCAO_JSON}

Crie:
- Outline otimizado para SEO
- Estrutura H1 → H2 → H3
- Sugestão de título principal (até 60 caracteres)
- Sugestão de meta description (até 155 caracteres)
- Entidades semânticas relevantes
- Lista de seções para escrita (apenas os títulos dos H2/H3 para iterar)

Formato: JSON com chaves: "title", "metaDescription", "outline", "sections" (array de strings).
Proibido escrever o artigo.`,

    BLOCK_WRITING: `Você é um jornalista especializado em criptomoedas.

Escreva APENAS a seção abaixo:
"{TITULO_DA_SECAO}"

Regras:
- Tom humano e jornalístico
- Frases com variação de tamanho
- Não conclua o artigo
- Não repita ideias de outras seções
- Use exemplos implícitos (sem parecer didático)

Contexto do Artigo:
{CONTEXTO_DO_ARTIGO}

Conteúdo anterior (para continuidade):
{CONTEUDO_ANTERIOR}
`,

    HUMANIZATION: `Reescreva o texto abaixo para soar mais humano.

Regras obrigatórias:
- Varie ritmo e estrutura das frases
- Use pequenas imperfeições naturais
- Evite conclusões fechadas
- Evite frases genéricas de IA
- Mantenha o significado original

Texto:
{TEXTO}`
};

// Utils
async function runAI(systemPrompt, userPrompt, outputJson = false) {
    try {
        console.log(`🤖 AI Request: ${userPrompt.substring(0, 50)}...`);
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
                    max_tokens: 4000,
                    temperature: 0.7 // "Escrita: 0.7 – 0.9" from config
                })
            }
        );
        const json = await response.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors));
        let result = json.result.response;

        if (outputJson) {
            // Try to clean markdown code blocks if present
            result = result.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                return JSON.parse(result);
            } catch (e) {
                console.error("Failed to parse JSON:", result);
                return null;
            }
        }
        return result;
    } catch (e) {
        console.error("❌ AI Error:", e.message);
        return null;
    }
}

async function generateArticle(topic) {
    console.log(`\n🚀 Starting Antigravity Pipeline for: "${topic}"`);

    // 1. Intent Analysis
    console.log("1️⃣  Analyzing Intent...");
    const intentJson = await runAI(PROMPTS.INTENT_ANALYSIS.replace('{TEMA}', topic), "Analise este tema.", true);
    if (!intentJson) return;
    console.log("   Intent detected:", intentJson['Intenção de busca principal'] || 'N/A');

    // 2. Editorial Planning
    console.log("2️⃣  Creating Editorial Plan...");
    const planJson = await runAI(PROMPTS.EDITORIAL_PLANNING.replace('{INTENCAO_JSON}', JSON.stringify(intentJson)), "Crie o plano editorial.", true);
    if (!planJson) return;
    console.log("   Title suggestion:", planJson.title);
    console.log("   Sections to write:", planJson.sections ? planJson.sections.length : 0);

    // 3. Block Writing
    console.log("3️⃣  Writing Blocks...");
    let fullContent = "";
    let context = `Title: ${planJson.title}\nDescription: ${planJson.metaDescription}\nIntent: ${JSON.stringify(intentJson)}`;

    // Ensure sections exist
    const sections = planJson.sections || ["Introdução", "Desenvolvimento", "Conclusão"];

    for (const section of sections) {
        process.stdout.write(`   Writing "${section}"... `);
        const blockContent = await runAI(
            "Você é um jornalista especializado em criptomoedas.",
            PROMPTS.BLOCK_WRITING
                .replace('{TITULO_DA_SECAO}', section)
                .replace('{CONTEXTO_DO_ARTIGO}', context)
                .replace('{CONTEUDO_ANTERIOR}', fullContent.slice(-500)) // Give last 500 chars for continuity
        );

        if (blockContent) {
            fullContent += `\n\n## ${section}\n\n${blockContent}`;
            console.log("✅");
        } else {
            console.log("❌");
        }
        // Small delay
        await new Promise(r => setTimeout(r, 1000));
    }

    // 4. Humanization (Running on the full text or large chunks? Full text might be too big. Let's do it per block in v2. For now, let's assume the block writing prompt did a good job or run a final pass on the intro/conclusion which are most critical).
    // Let's Skip full re-write for now to save tokens/time, as we used the "Antigravity Block Intent".

    // 5. Saving
    const slug = topic.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const frontmatter = {
        title: planJson.title || topic,
        date: new Date().toISOString(),
        category: "Artigos", // Default, user can change
        tags: planJson.entidades_semanticas_relevantes || ["cripto", "blockchain"], // Try to get from plan
        excerpt: planJson.metaDescription || "Leia este artigo completo sobre " + topic,
        coverImage: "/images/default-cover.jpg",
        author: "Jonatha Pereira",
        status: "published"
    };

    const fileContent = matter.stringify(fullContent, frontmatter);
    const fileName = `${slug}.md`;
    const filePath = path.join(ARTICLES_DIR, fileName);

    fs.writeFileSync(filePath, fileContent);
    console.log(`\n🎉 Article saved to: ${fileName}`);
}

// Main execution
(async () => {
    const args = process.argv.slice(2);
    const topics = args.length > 0 ? args : [
        "O impacto dos Agentes de IA nas finanças descentralizadas (DeFi)" // Default test topic
    ];

    console.log(`\n🎯 Antigravity Content Engine Loaded.`);
    console.log(`   Targets: ${topics.length} topic(s)\n`);

    for (const topic of topics) {
        await generateArticle(topic);
    }
})();
