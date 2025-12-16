
const fs = require('fs');
const path = require('path');
const { postToMedium } = require('./medium-poster');

const articlesToPost = [
    'top-5-ferramentas-analise-criptomoedas-gratuitas.md',
    'imposto-renda-cripto-2026-guia-completo.md',
    'carteira-fria-vs-quente-melhor-para-iniciantes-2025.md'
];

async function main() {
    console.log(`🚀 Iniciando distribuição no MEDIUM de ${articlesToPost.length} artigos...`);

    for (let i = 0; i < articlesToPost.length; i++) {
        const filename = articlesToPost[i];
        const filePath = path.join(process.cwd(), 'src/content/articles', filename);

        console.log(`\n📢 [${i+1}/${articlesToPost.length}] Publicando: ${filename}`);

        try {
            await postToMedium(filePath);
            console.log(`✅ Artigo ${i+1} finalizado.`);
        } catch (e) {
            console.error(`❌ Falha ao publicar artigo ${i+1}:`, e);
        }

        if (i < articlesToPost.length - 1) {
            console.log('⏳ Aguardando 1 minuto entre posts...');
            await new Promise(r => setTimeout(r, 60000));
        }
    }

    console.log('🏁 Distribuição Medium finalizada!');
}

main();
