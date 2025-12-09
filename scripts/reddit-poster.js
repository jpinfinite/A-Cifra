const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postToReddit(title, link) {
    console.log('🟠 Iniciando Reddit Poster (Perfil Pessoal)...');

    const botProfileDir = path.join(os.homedir(), '.chrome-bot-profile');

    if (!fs.existsSync(botProfileDir)) {
        console.error('❌ Perfil do bot não encontrado!');
        return;
    }

    try {
        const browser = await puppeteer.launch({
            userDataDir: botProfileDir,
            headless: false,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        // URL direta para postar no perfil
        // Substituir se o usuario mudar, mas por enquanto hardcoded para u/Comfortable-Dog-5860
        const submitUrl = 'https://www.reddit.com/user/Comfortable-Dog-5860/submit';

        console.log('   🔗 Acessando página de submit do perfil...');
        await page.goto(submitUrl, { waitUntil: 'networkidle2' });

        if (page.url().includes('login')) {
            console.error('   ❌ Não logado no Reddit!');
            await browser.close();
            return;
        }

        // Clicar na aba "Link" (as vezes abre em Post por padrão)
        // O Reddit moderno usa botões com texto "Link"
        try {
            const linkTab = await page.evaluateHandle(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText === 'Link');
            });
            if (linkTab) await linkTab.click();
        } catch(e) {}

        await new Promise(r => setTimeout(r, 2000));

        // Preencher Título: textarea[placeholder="Title"] ou input
        console.log('   ✍️  Preenchendo post...');

        await page.waitForSelector('textarea[placeholder="Title"], input[placeholder="Title"]', { timeout: 10000 });
        const titleInput = await page.$('textarea[placeholder="Title"], input[placeholder="Title"]');
        if (titleInput) {
            await titleInput.click();
            await titleInput.type(title.substring(0, 290)); // Reddit max 300
        }

        // Preencher URL: textarea[placeholder="Url"]
        await page.waitForSelector('textarea[placeholder="Url"], input[placeholder="Url"]', { timeout: 5000 });
        const urlInput = await page.$('textarea[placeholder="Url"], input[placeholder="Url"]');
        if (urlInput) {
            await urlInput.click();
            await urlInput.type(link);
        }

        await new Promise(r => setTimeout(r, 2000));

        console.log('   🚀 Publicando...');

        // Clicar em Post
        const clicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            // Procura botão "Post" exato
            const postBtn = btns.find(b => b.innerText === 'Post' && !b.disabled);
            if (postBtn) {
                postBtn.click();
                return true;
            }
            return false;
        });

        if (clicked) {
            console.log('   ✅ Botão POST clicado!');
            await new Promise(r => setTimeout(r, 5000)); // Esperar
            console.log('   🎉 Postado no Reddit!');
        } else {
            console.error('   ❌ Botão Post não encontrado ou desativado.');
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro Reddit:', e.message);
    }
}

if (require.main === module) {
    const title = "Teste A Cifra Bitcoin";
    const link = "https://a-cifra.com.br";
    postToReddit(title, link);
}

module.exports = { postToReddit };
