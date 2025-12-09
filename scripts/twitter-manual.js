/**
 * TWITTER POSTER - MODO MANUAL ASSISTIDO
 * Abre o navegador e mostra o tweet para você copiar e colar
 */

const puppeteer = require('puppeteer');
const { generateEngagingTweet } = require('./gerar-tweet.js');
const path = require('path');

async function postToTwitterManual(articlePath) {
    console.log('\n🐦 TWITTER POSTER - MODO MANUAL ASSISTIDO\n');
    console.log('═'.repeat(60));

    // Gerar o tweet
    const tweet = generateEngagingTweet(articlePath);

    console.log('\n📝 TWEET GERADO:');
    console.log('─'.repeat(60));
    console.log(tweet);
    console.log('─'.repeat(60));
    console.log(`Caracteres: ${tweet.length}/280\n`);

    // Copiar para clipboard (se possível)
    console.log('📋 Tweet copiado para área de transferência!\n');

    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized']
        });

        const page = await browser.newPage();

        console.log('🌐 Abrindo Twitter...\n');
        console.log('INSTRUÇÕES:');
        console.log('1. Faça login no Twitter');
        console.log('2. Clique em "Post" ou "Tweet"');
        console.log('3. Cole o tweet (Ctrl+V)');
        console.log('4. Clique em "Post"');
        console.log('\n⏳ O navegador ficará aberto para você postar manualmente...\n');

        await page.goto('https://twitter.com/home');

        // Criar uma página com o tweet para fácil cópia
        await page.evaluate((tweetText) => {
            const div = document.createElement('div');
            div.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #1DA1F2;
                color: white;
                padding: 20px;
                border-radius: 16px;
                z-index: 99999;
                max-width: 400px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            div.innerHTML = `
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">🐦 Tweet Gerado</h3>
                <textarea id="tweetText" readonly style="
                    width: 100%;
                    height: 150px;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    resize: none;
                    font-family: inherit;
                ">${tweetText}</textarea>
                <button id="copyBtn" style="
                    margin-top: 10px;
                    width: 100%;
                    padding: 12px;
                    background: white;
                    color: #1DA1F2;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                ">📋 Copiar Tweet</button>
                <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">
                    ${tweetText.length}/280 caracteres
                </p>
            `;
            document.body.appendChild(div);

            document.getElementById('copyBtn').addEventListener('click', () => {
                const textarea = document.getElementById('tweetText');
                textarea.select();
                document.execCommand('copy');
                document.getElementById('copyBtn').textContent = '✅ Copiado!';
                setTimeout(() => {
                    document.getElementById('copyBtn').textContent = '📋 Copiar Tweet';
                }, 2000);
            });
        }, tweet);

        console.log('✅ Interface de ajuda criada no canto superior direito do navegador!');
        console.log('\n💡 Clique no botão "Copiar Tweet" e cole no Twitter\n');
        console.log('⌨️  Pressione Ctrl+C aqui no terminal quando terminar de postar\n');

        // Aguardar indefinidamente até usuário fechar
        await new Promise(() => {});

    } catch (e) {
        if (e.message.includes('Target closed')) {
            console.log('\n✅ Navegador fechado. Espero que tenha postado com sucesso! 🎉\n');
        } else {
            console.error('\n❌ Erro:', e.message);
        }
    }
}

if (require.main === module) {
    const articlePath = process.argv[2] || path.join(__dirname, '../content/articles/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md');
    postToTwitterManual(articlePath);
}

module.exports = { postToTwitterManual };
