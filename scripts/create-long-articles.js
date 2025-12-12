
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuração Cloudflare
const CLOUDFLARE_API_TOKEN = 'OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1';
const CLOUDFLARE_ACCOUNT_ID = 'bcc4a32437bc8c7a9ec9c37872e2b23e';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Tópicos para novos artigos
const NEW_ARTICLES = [
  {
    title: 'Web3 Gaming: O Futuro dos Jogos Descentralizados e da Propriedade Digital',
    slug: 'web3-gaming-futuro-jogos-descentralizados',
    category: 'Games',
    tags: ['web3', 'games', 'nft', 'play-to-earn', 'blockchain gaming']
  },
  {
    title: 'Regulação de Criptomoedas no Brasil: O Que Esperar para 2026',
    slug: 'regulacao-criptomoedas-brasil-2026',
    category: 'Regulação',
    tags: ['regulação', 'brasil', 'drexx', 'banco central', 'leis cripto']
  },
  {
    title: 'Inteligência Artificial e Blockchain: A Convergência Tecnológica da Década',
    slug: 'inteligencia-artificial-blockchain-convergencia',
    category: 'Tecnologia',
    tags: ['ia', 'blockchain', 'convergência', 'futuro', 'tecnologia']
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
                    max_tokens: 4000
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
    console.log(`\n🧠 Gerando artigo: "${title}"...`);

    const systemPrompt = `
    Você é um jornalista sênior de tecnologia e finanças, especialista em criptomoedas.
    Objetivo: Escrever um artigo EXTREMAMENTE DETALHADO e PROFUNDO.
    Meta: O artigo final deve ter no mínimo 1600 palavras.
    Estilo: Analítico, visionário, técnico mas acessível, autoritativo.
    Formato: Markdown estrito.
    Idioma: Português do Brasil.
    `;

    // 1. Introdução
    console.log("   ATUANDO: ✍️  Parte 1: Introdução...");
    const intro = await generateTextWithAI(systemPrompt, `
        Escreva uma introdução longa e detalhada para o artigo: "${title}".
        - Mínimo 300 palavras.
        - Comece com o contexto histórico e a relevância atual.
        - Defina os problemas que o tema resolve.
        - Não use título H1 (já será adicionado automaticamente).
    `);
    if (!intro) return null;

    // 2. Desenvolvimento Técnico
    console.log("   ATUANDO: ✍️  Parte 2: Desenvolvimento Técnico...");
    const part2 = await generateTextWithAI(systemPrompt, `
        Escreva a seção de aprofundamento técnico para: "${title}".
        - Mínimo 500 palavras.
        - Explique a tecnologia por trás, mecanismos, e arquitetura.
        - Use exemplos reais e estudos de caso.
        - Use subtítulos H2 (##) para organizar.
    `);
    if (!part2) return null;

    // 3. Impacto e Mercado
    console.log("   ATUANDO: ✍️  Parte 3: Impacto de Mercado e Futuro...");
    const part3 = await generateTextWithAI(systemPrompt, `
        Faça uma análise de mercado e impacto futuro sobre "${title}".
        - Mínimo 500 palavras.
        - Discuta tendências para 2025 e 2026.
        - Impactos econômicos e sociais.
        - Riscos e desafios.
        - Use subtítulos H2 (##).
    `);
    if (!part3) return null;

    // 4. Conclusão e FAQ
    console.log("   ATUANDO: ✍️  Parte 4: Conclusão e FAQ...");
    const part4 = await generateTextWithAI(systemPrompt, `
        Escreva a conclusão e FAQ para "${title}".
        - Mínimo 400 palavras.
        - Conclusão sintetizando os pontos principais.
        - 5 Perguntas Frequentes (FAQ) detalhadas.
        - Use subtítulos H2 (##) para 'Conclusão' e 'Perguntas Frequentes'.
    `);
    if (!part4) return null;

    return `${intro}\n\n${part2}\n\n${part3}\n\n${part4}`;
}

async function main() {
    console.log('🚀 ATIVANDO MODO CRIADOR: Gerando 3 Novos Artigos Longos\n');

    for (const articleInfo of NEW_ARTICLES) {
        console.log(`\n════════════════════════════════════════════════════════════`);
        console.log(`📄 Criando: ${articleInfo.title}`);

        try {
            const content = await generateFullArticleContent(articleInfo.title);

            if (content) {
                const wordCount = content.split(/\s+/).length;

                const frontmatter = {
                    title: articleInfo.title,
                    date: new Date().toISOString(),
                    category: articleInfo.category,
                    tags: articleInfo.tags,
                    excerpt: content.substring(0, 150).replace(/[#*]/g, '').trim() + '...',
                    coverImage: '/images/default-cover.jpg', // Placeholder, ideal seria gerar img
                    author: 'Jonatha Pereira',
                    status: 'published'
                };

                const fileContent = matter.stringify(content, frontmatter);
                const fileName = `${articleInfo.slug}.md`;
                const filePath = path.join(ARTICLES_DIR, fileName);

                fs.writeFileSync(filePath, fileContent);
                console.log(`   ✅ SUCESSO! Artigo criado: ${fileName}`);
                console.log(`   📊 Contagem de palavras: ~${wordCount}`);

            } else {
                console.log("   ❌ FALHA: A IA não retornou conteúdo válido.");
            }

        } catch (err) {
            console.error(`   ❌ ERRO ao criar ${articleInfo.title}:`, err);
        }

        // Delay para evitar Rate Limit
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log(`\n✨ Processo finalizado.`);
}

main();
