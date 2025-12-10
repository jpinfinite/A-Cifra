
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

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
                    max_tokens: 3500
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

async function generateFullArticleContent(title) {
    console.log(`\n🧠 Expandindo artigo: "${title}"...`);

    const systemPrompt = `
    Você é um analista sênior de criptomoedas e finanças.
    Objetivo: Escrever um artigo longo, detalhado e otimizado para SEO, com tempo de leitura entre 6 a 10 minutos (1500 a 2500 palavras).
    Estilo: Autoritativo, Educativo, Profissional.
    Idioma: Português do Brasil.
    `;

    // 1. Introdução
    console.log("   ✍️  Parte 1: Introdução...");
    const intro = await generateTextWithAI(systemPrompt, `
        Escreva uma introdução profunda e abrangente (mínimo 400 palavras) para o artigo: "${title}".
        - Contextualize o tema.
        - Explique a importância atual.
        - Use Markdown. Sem título H1.
    `);
    if (!intro) return null;

    // 2. Desenvolvimento Técnico
    console.log("   ✍️  Parte 2: Desenvolvimento Técnico...");
    const dev1 = await generateTextWithAI(systemPrompt, `
        Desenvolva a parte técnica ou conceitual principal de "${title}". (Mínimo 600 palavras).
        - Aprofunde-se nos detalhes.
        - Use exemplos práticos.
        - Use subtítulos H2 (##).
    `);
    if (!dev1) return null;

    // 3. Análise de Mercado
    console.log("   ✍️  Parte 3: Análise de Mercado...");
    const dev2 = await generateTextWithAI(systemPrompt, `
        Faça uma análise de mercado, tendências futuras ou aplicação prática sobre "${title}". (Mínimo 600 palavras).
        - Cenários futuros (2025/2026).
        - Impactos no mercado.
        - Use subtítulos H2 (##).
    `);
    if (!dev2) return null;

    // 4. Conclusão e FAQ
    console.log("   ✍️  Parte 4: Conclusão e FAQ...");
    const footer = await generateTextWithAI(systemPrompt, `
        Escreva a conclusão e FAQ para "${title}".
        - Resumo dos pontos principais.
        - 5 Perguntas Frequentes (FAQ) com respostas detalhadas.
        - Use subtítulos H2 (##).
    `);
    if (!footer) return null;

    return `${intro}\n\n${dev1}\n\n${dev2}\n\n${footer}`;
}

function findShortArticles() {
    if (!fs.existsSync(ARTICLES_DIR)) return [];

    const files = fs.readdirSync(ARTICLES_DIR);
    const shortArticles = [];

    files.forEach(file => {
        if (!file.endsWith('.md')) return;

        const filePath = path.join(ARTICLES_DIR, file);
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { content, data } = matter(fileContent);

            const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
            const readingTime = Math.ceil(wordCount / 225);

            // Verificamos se é muito curto (<= 2 min)
            if (readingTime <= 2) {
                shortArticles.push({
                    file,
                    filePath,
                    wordCount,
                    data // Metadata (frontmatter)
                });
            }
        } catch (err) {
            console.error(`Erro ao ler ${file}:`, err.message);
        }
    });
    return shortArticles;
}

async function main() {
    console.log('🚀 Iniciando Reparo de Artigos Curtos (V2 - Robust)...\n');

    const shorts = findShortArticles();
    console.log(`Encontrados ${shorts.length} artigos para expandir.`);

    let processedCount = 0;

    // Process loop
    for (const article of shorts) {
        console.log(`\n📄 Processando [${processedCount + 1}/${shorts.length}]: ${article.file} (${article.wordCount} palavras)`);

        try {
            const title = article.data.title;
            if (!title) {
                console.log("   ❌ Erro: Título não encontrado no frontmatter.");
                continue;
            }

            const newContent = await generateFullArticleContent(title);

            if (newContent) {
                 // Mantemos os metadados, atualizamos o corpo
                const updatedContent = matter.stringify(newContent, article.data);

                // matter.stringify adiciona uma quebra de linha extra as vezes, mas ok.
                // Também precisamos garantir que o H1 (Title) está presente se o markdown não tiver?
                // O script original adicionava `# ${title}`. O gerador de AI não adiciona.
                // Vamos adicionar manualmente após o frontmatter.

                const finalContent = matter.stringify(`# ${title}\n\n${newContent}`, article.data);

                fs.writeFileSync(article.filePath, finalContent);
                console.log(`   ✅ Artigo atualizado com sucesso!`);
                processedCount++;
            } else {
                console.log("   ❌ Erro: Falha ao gerar conteúdo.");
            }

            // Pause to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));

        } catch (error) {
            console.error(`   ❌ Erro fatal em ${article.file}:`, error);
        }
    }

    console.log(`\n✨ Finalizado V2! ${processedCount} artigos expandidos.`);
}

main();
