const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postToFacebook(articleUrl) {
    console.log(`📘 Iniciando Facebook Share (Via Botão do Site)...`);
    console.log(`   🔗 Artigo: ${articleUrl}`);

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

        // 1. Abrir página do artigo
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        console.log('   🔗 Navegando para o artigo...');
        await page.goto(articleUrl, { waitUntil: 'domcontentloaded' });

        // 2. Clicar no botão de compartilhar
        console.log('   🖱️  Procurando botão de compartilhar...');
        // Tenta aria-label OU href do sharer
        const shareBtn = await page.waitForSelector('a[aria-label="Compartilhar no Facebook"], a[href*="facebook.com/sharer"]', { timeout: 10000 });

        if (!shareBtn) {
            throw new Error('Botão de compartilhar não encontrado no site.');
        }

        // Preparar captura de popup
        const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));

        // Clicar
        await shareBtn.click();
        console.log('   ✅ Clique no botão realizado. Aguardando popup...');

        // 3. Lidar com Popup
        const popup = await newPagePromise;
        await popup.setViewport({ width: 800, height: 600 });
        await new Promise(r => setTimeout(r, 2000)); // Esperar carga inicial

        if (!popup) {
            throw new Error('Popup do Facebook não abriu.');
        }

        console.log('   🪟 Popup aberto. Título: ' + await popup.title());

        // Esperar botão de publicar no popup
        // O Facebook Desktop Popup tem um botão azul "Publicar no Facebook" no rodapé
        // Geralmente é um aria-label="Publicar no Facebook" ou textContent

        console.log('   ✍️  Procurando botão de confirmar no popup...');

        const clicked = await popup.evaluate(async () => {
            const findBtn = () => {
                const els = document.querySelectorAll('div[role="button"], span, button');
                for (const el of els) {
                    const txt = (el.innerText || el.getAttribute('aria-label') || '').toLowerCase();
                    if (txt === 'publicar no facebook' || txt === 'post to facebook') {
                        return el;
                    }
                }
                return null;
            };

            // Tentar por 10 segundos
            for (let i = 0; i < 20; i++) {
                const btn = findBtn();
                if (btn) {
                    btn.click();
                    return true;
                }
                await new Promise(r => setTimeout(r, 500));
            }
            return false;
        });

        if (clicked) {
            console.log('   ✅ Botão PUBLICAR clicado no Popup!');
            await new Promise(r => setTimeout(r, 5000)); // Esperar fechar
            console.log('   🎉 Postado com sucesso!');
        } else {
             // Fallback: Tentar clicar no botão azul genérico no canto inferior direito
             console.log('   ⚠️ Tentando fallback de botão...');
             await popup.keyboard.press('Tab');
             await popup.keyboard.press('Tab');
             // Às vezes o enter funciona se o foco estiver certo
             // Mas vamos tentar screenshot para debug se falhar
             console.error('   ❌ Botão de publicar específico não encontrado.');
             await popup.screenshot({ path: 'debug-fb-popup.png' });
        }

        await popup.close().catch(() => {});
        await page.close();
        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro crítico:', e.message);
    }
}

if (require.main === module) {
    const url = process.argv[2] || "https://a-cifra.com.br/artigo/teste";
    postToFacebook(url);
}

module.exports = { postToFacebook };
