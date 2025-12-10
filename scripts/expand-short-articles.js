
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const MIN_WORD_COUNT = 1500;
const BATCH_SIZE = 10; // Aumentar lote para acelerar

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
                    max_tokens: 4000 // Tentar pedir mais tokens
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

async function generateFullArticleContent(title, currentContent = "") {
    console.log(`\n🧠 Expandindo artigo: "${title}"...`);

    const systemPrompt = `
    Você é um redator sênior de criptomoedas, especialista em SEO e finanças.
    Objetivo: Reescrever e expandir um artigo para que tenha ALTA PROFUNDIDADE e qualidade.
    Meta: O artigo final deve ter aproximadamente 1200 palavras.
    Estilo: Jornalístico, analítico, imparcial, autoritativo.
    Formato: Markdown estrito.
    Idioma: Português do Brasil.
    Conteúdo Original (para referência): ${currentContent.substring(0, 1000)}...
    `;

    // 1. Introdução
    console.log("   ATUANDO: ✍️  Parte 1: Introdução Engajadora...");
    const intro = await generateTextWithAI(systemPrompt, `
        Escreva uma introdução PODEROSA para o artigo: "${title}".
        - Mínimo 200 palavras.
        - Comece com um "gancho" forte.
        - Contextualize historicamente e explique por que isso importa AGORA.
        - Não use título H1.
    `);
    if (!intro) return null;

    // 2. Fundamentos Técnicos
    console.log("   ATUANDO: ✍️  Parte 2: Aprofundamento Técnico...");
    const part2 = await generateTextWithAI(systemPrompt, `
        Escreva a seção de Fundamentos Técnicos para: "${title}".
        - Mínimo 350 palavras.
        - Explique COMO funciona em detalhes técnicos.
        - Use analogias para simplificar conceitos complexos.
        - Use listas e bullet points onde apropriado.
        - Use subtítulos H2 (##) e H3 (###).
    `);
    if (!part2) return null;

    // 3. Análise de Mercado e Futuro
    console.log("   ATUANDO: ✍️  Parte 3: Análise de Mercado e Tendências 2025/2026...");
    const part3 = await generateTextWithAI(systemPrompt, `
        Faça uma análise de mercado profunda sobre "${title}".
        - Mínimo 350 palavras.
        - Discuta adoção institucional, regulação e movimentos de preço.
        - Faça projeções realistas para 2025 e 2026.
        - Mencione riscos e oportunidades.
        - Use subtítulos H2 (##).
    `);
    if (!part3) return null;

    // 4. Conclusão e FAQ
    console.log("   ATUANDO: ✍️  Parte 4: Conclusão, Dicas Práticas e FAQ...");
    const part4 = await generateTextWithAI(systemPrompt, `
        Escreva a conclusão e uma seção de FAQ para "${title}".
        - Resumo executivo dos principais pontos.
        - Dicas práticas para investidores (o que fazer, o que evitar).
        - 3 Perguntas Frequentes (FAQ) com respostas ricas.
        - Use subtítulos H2 (##).
    `);
    if (!part4) return null;

    return `${intro}\n\n${part2}\n\n${part3}\n\n${part4}`;
}

function findShortArticles() {
    const files = fs.readdirSync(ARTICLES_DIR);
    const shortArticles = [];

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(ARTICLES_DIR, file);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = matter(content);

            const words = parsed.content.split(/\s+/).filter(w => w.length > 0);
            const wordCount = words.length;

            if (wordCount < MIN_WORD_COUNT) {
                shortArticles.push({
                    file,
                    filePath,
                    wordCount,
                    data: parsed.data
                });
            }
        } catch (e) {
            console.error(`Erro ao ler ${file}:`, e.message);
        }
    }

    // Ordenar por menor contagem primeiro (prioridade crítica)
    return shortArticles.sort((a, b) => a.wordCount - b.wordCount);
}

async function main() {
    console.log('🚀 ATIVANDO MODO REDATOR: Expansão de Artigos Curtos\n');
    console.log(`Critério: Artigos com menos de ${MIN_WORD_COUNT} palavras.`);

    const shorts = findShortArticles();
    console.log(`\n📋 Encontrados ${shorts.length} artigos que precisam de expansão.`);

    if (shorts.length === 0) {
        console.log("✨ Nenhum artigo curto encontrado! Tudo certo.");
        return;
    }

    const toProcess = shorts.slice(0, BATCH_SIZE);
    console.log(`🔥 Processando lote de ${toProcess.length} artigos...`);

    let successCount = 0;

    for (const article of toProcess) {
        console.log(`\n════════════════════════════════════════════════════════════`);
        console.log(`📄 Editando: ${article.file}`);
        console.log(`   Palavras atuais: ${article.wordCount} | Meta: 2000+`);

        try {
            // Ler conteúdo atual para referência (opcional, mas ajuda o modelo)
             const rawContent = fs.readFileSync(article.filePath, 'utf8');
             const { content: currentContent } = matter(rawContent);

            const newBody = await generateFullArticleContent(article.data.title || article.data.metaTitle, currentContent);

            if (newBody) {
                const newWordCount = newBody.split(/\s+/).length;

                // Atualizar frontmatter
                const newDate = new Date().toISOString();
                const updatedData = {
                    ...article.data,
                    updatedAt: newDate
                    // Poderíamos adicionar um campo 'aiExpanded: true' se quiséssemos rastrear
                };

                const newFileContent = matter.stringify(newBody, updatedData);

                fs.writeFileSync(article.filePath, newFileContent);
                console.log(`   ✅ SUCESSO! Artigo reescrito. Novo tamanho: ~${newWordCount} palavras.`);
                successCount++;
            } else {
                console.log("   ❌ FALHA: A IA não retornou conteúdo válido.");
            }

        } catch (err) {
            console.error(`   ❌ ERRO no processamento de ${article.file}:`, err);
        }

        // Delay para evitar Rate Limit
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log(`\n✨ Lote finalizado. ${successCount}/${toProcess.length} processados.`);
    console.log(`   Rode o script novamente para processar o próximo lote.`);
}

main();
