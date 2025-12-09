const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postToLinkedIn(text) {
    console.log('💼 Iniciando LinkedIn Poster...');

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
            args: ['--start-maximized', '--no-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        console.log('   🔗 Acessando LinkedIn Feed...');
        await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        if (page.url().includes('login')) {
            console.error('   ❌ Não logado no LinkedIn!');
            await browser.close();
            return;
        }

        // Tentar limpar modais
        try {
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                const label = await page.evaluate(el => el.getAttribute('aria-label'), btn);
                if (label && (label.includes('Dismiss') || label.includes('Fechar'))) await btn.click();
            }
        } catch (e) {}

        console.log('   ✍️  Abrindo caixa de postagem...');

        // Estratégia Dupla:
        // 1. Tentar clicar no botão "Start a post" pelo texto
        // 2. Tentar clicar na input falsa "Começar publicação" (share-box-feed-entry__trigger)

        let clicked = false;

        // Tentativa 1: CSS Correto do botão de input fake
        try {
            const trigger = await page.waitForSelector('.share-box-feed-entry__trigger', { timeout: 5000 });
            if (trigger) {
                await trigger.click();
                clicked = true;
            }
        } catch (e) {
            console.log('   ⚠️ Input trigger não achado, tentando botões de texto...');
        }

        // Tentativa 2: Texto
        if (!clicked) {
            const buttons = await page.$$('button span.artdeco-button__text');
            for (const span of buttons) {
                const t = await page.evaluate(s => s.textContent, span);
                if (t && (t.includes('Start a post') || t.includes('Começar publicação'))) {
                    await span.click();
                    clicked = true;
                    break;
                }
            }
        }

        if (!clicked) {
             console.error('   ❌ Não consegui abrir o modal de post.');
             await browser.close();
             return;
        }

        await new Promise(r => setTimeout(r, 3000));

        // Digitar
        console.log('   📝 Digitando...');

        // Área de texto
        await page.waitForSelector('.ql-editor', { timeout: 15000 });
        await page.click('.ql-editor');
        await page.type('.ql-editor', text, { delay: 30 });

        // Esperar preview
        await new Promise(r => setTimeout(r, 5000));

        console.log('   🚀 Publicando...');

        const posted = await clickByText(['Post', 'Publicar']);

        if (posted) {
            console.log('   ✅ Publicado no LinkedIn!');
            await new Promise(r => setTimeout(r, 5000));
        } else {
             console.error('   ❌ Botão de publicar não encontrado.');
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro LinkedIn:', e.message);
    }
}

if (require.main === module) {
    const msg = process.argv[2] || "Teste LinkedIn Automático #crypto";
    postToLinkedIn(msg);
}

module.exports = { postToLinkedIn };
