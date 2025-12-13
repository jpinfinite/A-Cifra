
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct'; // Or a stronger model like llama-3-70b if available, but staying safe
const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Prompts Loader
function loadPrompt(category, name, version = '1.0') {
    const filePath = path.join(__dirname, `../prompts/${category}/${name}_v${version}.json`);
    try {
        if (!fs.existsSync(filePath)) {
             // Fallback to finding the latest version if specific version not found could be implemented,
             // but for now strict versioning is safer for regression testing.
             throw new Error(`Prompt file not found: ${filePath}`);
        }
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (e) {
        console.error(`❌ Failed to load prompt ${category}/${name}_v${version}:`, e.message);
        return null;
    }
}

// Utils
async function runAI(systemPrompt, userPrompt, outputJson = false, temperature = 0.7) {
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
                    temperature: temperature
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
    const promptIntent = loadPrompt('analysis', 'intent', '1.0');
    if (!promptIntent) return;

    const intentJson = await runAI(promptIntent.prompt.replace('{TEMA}', topic), "Analise este tema.", true, promptIntent.temperature);
    if (!intentJson) return;
    console.log("   Intent detected:", intentJson['Intenção de busca principal'] || 'N/A');

    // 2. Editorial Planning
    console.log("2️⃣  Creating Editorial Plan...");
    const promptEditorial = loadPrompt('analysis', 'editorial', '1.0');
    if (!promptEditorial) return;

    const planJson = await runAI(promptEditorial.prompt.replace('{INTENCAO_JSON}', JSON.stringify(intentJson)), "Crie o plano editorial.", true, promptEditorial.temperature);
    if (!planJson) return;
    console.log("   Title suggestion:", planJson.title);
    console.log("   Sections to write:", planJson.sections ? planJson.sections.length : 0);

    // * FUTURE: Anti-Cannibalization Check would go here
    // * Logic: Embed(topic) -> VectorDB search -> Similarity check -> Abort if > 0.85

    // 3. Block Writing
    console.log("3️⃣  Writing Blocks...");
    const promptBlock = loadPrompt('writing', 'block', '1.0');
    if (!promptBlock) return;

    let fullContent = "";
    let context = `Title: ${planJson.title}\nDescription: ${planJson.metaDescription}\nIntent: ${JSON.stringify(intentJson)}`;

    // Ensure sections exist
    const sections = planJson.sections || ["Introdução", "Desenvolvimento", "Conclusão"];

    for (const section of sections) {
        process.stdout.write(`   Writing "${section}"... `);
        const blockContent = await runAI(
            promptBlock.system_prompt || "Você é um jornalista especializado em criptomoedas.", // Could also be loaded from prompt role
            promptBlock.prompt
                .replace('{TITULO_DA_SECAO}', section)
                .replace('{CONTEXTO_DO_ARTIGO}', context)
                .replace('{CONTEUDO_ANTERIOR}', fullContent.slice(-500)),
            false,
            promptBlock.temperature
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

    // 4. Anti-AI / Humanization Pass (Optional)
    // console.log("4️⃣  Applying Anti-AI Filter...");
    // const promptAntiAi = loadPrompt('anti_ai', 'anti_detect', '1.0');
    // For now we skip to save tokens, but logic is ready:
    // fullContent = await runAI(promptAntiAi.prompt.replace('{TEXTO}', fullContent), ...);

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
        status: "published",
        pipeline: "antigravity-v1"
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
