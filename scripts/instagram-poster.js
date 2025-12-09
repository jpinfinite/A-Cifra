const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postToInstagram(caption, imagePath) {
    console.log('📸 Iniciando Instagram Poster (Stealth Mobile)...');

    if (!imagePath || !fs.existsSync(imagePath)) {
        console.error('❌ ERRO: Instagram exige imagem válida!');
        console.error(`   Caminho não encontrado: ${imagePath}`);
        return;
    }

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
                '--disable-infobars',
                '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
            ]
        });

        const page = await browser.newPage();
        // Viewport de iPhone X
        await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

        console.log('   🔗 Acessando Instagram...');
        await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle2' });

        // Verificar Login
        if (page.url().includes('login')) {
            console.error('   ❌ Não logado no Instagram!');
            console.log('   👉 Execute "node scripts/configurar-bot.js" e faça login.');
            await browser.close();
            return;
        }

        // Tentar fechar popups chatos (Save Info, Notifications)
        try {
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                const txt = await page.evaluate(el => el.textContent, btn);
                if (txt.includes('Agora não') || txt.includes('Not Now') || txt.includes('Cancelar')) {
                    await btn.click();
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        } catch (e) {}

        console.log('   ➕ Iniciando criação de post...');

        // Clicar no botão 'Novo Post' (+)
        // O seletor muda muito, vamos tentar por aria-label ou svg
        let newPostBtn = await page.$('svg[aria-label="New post"]');
        if (!newPostBtn) newPostBtn = await page.$('svg[aria-label="Nova publicação"]');

        if (!newPostBtn) {
            // Tentar encontrar pelo menu de navegação
            const nav = await page.$$('div[role="button"]');
            // Difícil achar sem seletor específico. Vamos tentar upload direto.
            console.log('   ⚠️ Botão + não achado fácil, tentando forçar input file...');
        }

        // O Instagram Web mobile tem um input[type=file] escondido quando clica no +?
        // Às vezes não. Mas podemos injetar um input file se necessário, ou clicar no botão correto.

        // Estratégia melhor: Procurar botão pelo SVG path ou algo consistente
        // Ou clicar no botão central do rodapé (geralmente index 2 ou 3)
        // Mas o seletor `svg[aria-label="New post"]` costuma funcionar no topo ou rodapé.

        // Se achou o botão, clicar e esperar o file chooser
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            newPostBtn ? newPostBtn.click() : page.click('div[role="menuitem"] svg') // Tentativa cega
        ]).catch(() => [null]);

        if (fileChooser) {
            console.log(`   📂 Fazendo upload: ${path.basename(imagePath)}`);
            await fileChooser.accept([imagePath]);
            await new Promise(r => setTimeout(r, 3000));

            // Função auxiliar para clicar por texto
            const clickByText = async (textOptions) => {
                const divs = await page.$$('div, span, button'); // Procura em elementos comuns
                for (const el of divs) {
                    const t = await page.evaluate(e => e.textContent, el);
                    if (t && textOptions.some(opt => t.includes(opt))) {
                        await el.click();
                        return true;
                    }
                }
                return false;
            };

            // Fluxo de edição (Next > Next > Share)
            console.log('   ➡️  Avançando (Edição)...');
            await new Promise(r => setTimeout(r, 2000));
            await clickByText(['Next', 'Avançar']);

            // Segunda tela (Filtros) -> Next de novo
            console.log('   ➡️  Avançando (Filtros)...');
            await new Promise(r => setTimeout(r, 2000));
            await clickByText(['Next', 'Avançar']);

            // Tela final: Legenda
            console.log('   ✍️  Escrevendo legenda...');
            try {
                await page.waitForSelector('textarea[aria-label="Write a caption..."]', { timeout: 5000 });
                await page.type('textarea[aria-label="Write a caption..."]', caption);
            } catch (e) {
                // Tenta genérico
                await page.type('textarea', caption);
            }
            await new Promise(r => setTimeout(r, 1000));

            console.log('   🚀 Compartilhando...');
            const shared = await clickByText(['Share', 'Compartilhar']);

            if (shared) {
                console.log('   ✅ Postado no Instagram!');
                await new Promise(r => setTimeout(r, 10000)); // Esperar upload
            } else {
                console.error('   ❌ Botão de compartilhar não encontrado.');
                await page.screenshot({ path: 'debug-insta-share.png' });
            }

        } else {
            console.error('   ❌ Não consegui abrir o seletor de arquivos.');
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro Instagram:', e.message);
    }
}

if (require.main === module) {
    // Teste isolado
    const msg = "Teste Instagram #crypto";
    // Tenta achar uma imagem de teste
    const img = process.argv[3] || path.join(__dirname, '../public/images/logo.png'); // fallback
    postToInstagram(msg, img);
}

module.exports = { postToInstagram };
