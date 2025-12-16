
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { postToTwitter } = require('./twitter-poster');

const articlesToPost = [
    'top-5-ferramentas-analise-criptomoedas-gratuitas.md',
    'imposto-renda-cripto-2026-guia-completo.md',
    // 'carteira-fria-vs-quente-melhor-para-iniciantes-2025.md' // Deixando um comentado para teste ou rodar todos
    'carteira-fria-vs-quente-melhor-para-iniciantes-2025.md'
];

async function main() {
    console.log(`🚀 Iniciando distribuição de ${articlesToPost.length} artigos...`);

    for (let i = 0; i < articlesToPost.length; i++) {
        const filename = articlesToPost[i];
        const filePath = path.join(process.cwd(), 'src/content/articles', filename);

        if (!fs.existsSync(filePath)) {
            console.error(`❌ Arquivo não encontrado: ${filename}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);

        // Construct Tweet
        const slug = filename.replace('.md', '');
        const url = `https://a-cifra.com.br/artigo/${slug}`;

        // Limit tags to first 3 to save space
        const tags = data.tags ? data.tags.slice(0, 3).map(t => `#${t.replace(/\s+/g, '')}`).join(' ') : '#Bitcoin #Cripto';

        const tweetText = `${data.title} 🚀\n\n${data.excerpt}\n\n👉 Leia completo: ${url}\n\n${tags}`;

        console.log(`\n📢 [${i+1}/${articlesToPost.length}] Preparando tweet para: ${data.title}`);

        try {
            await postToTwitter(tweetText);
            console.log(`✅ Tweet ${i+1} enviado.`);
        } catch (e) {
            console.error(`❌ Falha ao enviar tweet ${i+1}:`, e);
        }

        if (i < articlesToPost.length - 1) {
            console.log('⏳ Aguardando 2 minutos para segurança anti-spam...');
            await new Promise(r => setTimeout(r, 120000)); // 2 minutes delay
        }
    }

    console.log('🏁 Distribuição finalizada!');
}

main();
