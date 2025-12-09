/**
 * POSTAGEM SEGURA NO TWITTER
 * Fecha o Chrome automaticamente antes de postar
 */

const { exec } = require('child_process');
const { postArticleToTwitter } = require('./postar-twitter.js');
const path = require('path');

async function killChrome() {
    return new Promise((resolve) => {
        console.log('🔴 Fechando Chrome...');
        exec('taskkill /F /IM chrome.exe /T', (error) => {
            // Ignorar erro se Chrome não estiver rodando
            setTimeout(() => {
                console.log('✅ Chrome fechado!\n');
                resolve();
            }, 3000); // Aguardar 3 segundos para garantir
        });
    });
}

async function postSafe(articlePath, style = 'engajador') {
    console.log('🛡️  POSTAGEM SEGURA NO TWITTER\n');

    // Fechar Chrome primeiro
    await killChrome();

    // Aguardar mais um pouco
    console.log('⏳ Aguardando sistema estabilizar...\n');
    await new Promise(r => setTimeout(r, 2000));

    // Postar
    await postArticleToTwitter(articlePath, style);
}

// CLI
if (require.main === module) {
    const articlePath = process.argv[2] || path.join(__dirname, '../content/articles/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md');
    const style = process.argv[3] || 'engajador';

    postSafe(articlePath, style);
}

module.exports = { postSafe };
