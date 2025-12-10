
const fs = require('fs');
const path = require('path');

// Configuração Cloudflare (Reutilizando credenciais existentes no projeto)
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
        Escreva uma introdução abrangente (mínimo 400 palavras) para o artigo: "${title}".
        - Contextualize o tema.
        - Explique a importância atual.
        - Use Markdown. Sem título H1 (já existe no arquivo).
    `);
    if (!intro) return null;

    // 2. Desenvolvimento Profundo
    console.log("   ✍️  Parte 2: Desenvolvimento Técnico/Conceitual...");
    const dev1 = await generateTextWithAI(systemPrompt, `
        Desenvolva a parte técnica ou conceitual principal de "${title}". (Mínimo 600 palavras).
        - Aprofunde-se nos detalhes.
        - Use exemplos práticos.
        - Use subtítulos H2 (##) para organizar.
    `);
    if (!dev1) return null;

    // 3. Análise/Aplicação Prática
    console.log("   ✍️  Parte 3: Análise e Aplicação...");
    const dev2 = await generateTextWithAI(systemPrompt, `
        Faça uma análise de mercado, tendências futuras ou aplicação prática sobre "${title}". (Mínimo 600 palavras).
        - Cenários futuros (2025/2026).
        - Impactos no mercado ou na vida do investidor.
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

function getFrontmatterAndContent(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^(---\r?\n[\s\S]*?\r?\n---)/);
    if (!match) return null;
    return {
        frontmatter: match[1],
        body: content.replace(match[0], '')
    };
}

// Extrair título do frontmatter
function getTitleFromFrontmatter(frontmatter) {
    const match = frontmatter.match(/title:\s*['"](.+?)['"]/);
    return match ? match[1] : null;
}

// Identificar artigos curtos
function findShortArticles() {
    const files = fs.readdirSync(ARTICLES_DIR);
    const shortArticles = [];

    files.forEach(file => {
        if (!file.endsWith('.md')) return;

        const filePath = path.join(ARTICLES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Remove frontmatter
        const cleanContent = content.replace(/^---[\s\S]*?---/, '');
        const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
        const readingTime = Math.ceil(wordCount / 225);

        if (readingTime <= 2) {
            shortArticles.push({
                file,
                filePath,
                wordCount
            });
        }
    });
    return shortArticles;
}

async function main() {
    console.log('🚀 Iniciando Reparo de Artigos Curtos...\n');

    const shorts = findShortArticles();
    console.log(`Encontrados ${shorts.length} artigos para expandir.`);

    // Processar apenas os primeiros 5 para teste inicial ou iterar todos?
    // Como o usuário pediu para "corrigir", vamos tentar processar em lote.
    // Para evitar timeout, vamos processar um subconjunto ou todos se forem poucos.
    // Dado que a lista parecia grande, vamos fazer um batch de 5 para começar e garantir que funciona.
    // O usuário pode rodar novamente para os próximos.
    // *Correction*: O prompt do usuário é imperativo. Vou tentar fazer o máximo possível.

    let processedCount = 0;

    for (const article of shorts) {
        console.log(`\n📄 Processando [${processedCount + 1}/${shorts.length}]: ${article.file} (${article.wordCount} palavras)`);

        try {
            const fileData = getFrontmatterAndContent(article.filePath);
            if (!fileData) {
                console.log("   ❌ Erro: Frontmatter não encontrado.");
                continue;
            }

            const title = getTitleFromFrontmatter(fileData.frontmatter);
            if (!title) {
                console.log("   ❌ Erro: Título não encontrado no frontmatter.");
                continue;
            }

            const newContent = await generateFullArticleContent(title);

            if (newContent) {
                // Atualizar frontmatter se necessário (ex: atualizar updatedAt?)
                // Por enquanto mantemos o original para não quebrar referências

                const finalContent = `${fileData.frontmatter}\n\n${newContent}\n`;

                fs.writeFileSync(article.filePath, finalContent);
                console.log(`   ✅ Artigo atualizado com sucesso! Nova estimativa: ~${newContent.split(/\s+/).length} palavras.`);
                processedCount++;
            } else {
                console.log("   ❌ Erro: Falha ao gerar conteúdo.");
            }

            // Pequena pausa para não sobrecarregar
            await new Promise(r => setTimeout(r, 2000));

        } catch (error) {
            console.error(`   ❌ Erro fatal em ${article.file}:`, error);
        }
    }

    console.log(`\n✨ Finalizado! ${processedCount} artigos expandidos.`);
}

main();
