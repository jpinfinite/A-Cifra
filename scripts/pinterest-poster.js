const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postToPinterest(title, description, link, imagePath) {
    console.log('📌 Iniciando Pinterest Poster...');

    if (!imagePath || !fs.existsSync(imagePath)) {
        console.error('❌ ERRO: Pinterest exige imagem válida!');
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
            args: ['--start-maximized', '--no-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        console.log('   🔗 Acessando Pin Builder...');
        await page.goto('https://www.pinterest.com/pin-builder/', { waitUntil: 'networkidle2' });

        if (page.url().includes('login')) {
            console.error('   ❌ Não logado no Pinterest!');
            await browser.close();
            return;
        }

        // Upload de Imagem
        console.log('   🖼️  Fazendo upload da imagem...');
        const inputUpload = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
        if (inputUpload) {
            await inputUpload.uploadFile(imagePath);
            await new Promise(r => setTimeout(r, 3000)); // Esperar preview
        } else {
            console.error('   ❌ Input de upload não encontrado.');
            await browser.close();
            return;
        }

        // Função auxiliar de clique por texto e preencher
        console.log('   ✍️  Preenchendo detalhes...');

        // Título: "Adicione um título"
        try {
            const titleInput = await page.waitForSelector('input[placeholder="Adicione um título"], textarea[id*="title"]', { timeout: 5000 });
            if (titleInput) {
                await titleInput.click();
                await titleInput.type(title.substring(0, 99));
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (e) { console.log('   ⚠️ Falha ao digitar título.'); }

        // Descrição: "Adicione uma descrição detalhada"
        try {
            // Tenta placeholder exato primeiro (mais garantido)
            const descDiv = await page.waitForSelector('textarea[placeholder="Adicione uma descrição detalhada"], div[role="textbox"]', { timeout: 3000 });
            if (descDiv) {
                await descDiv.click();
                await descDiv.type(description.substring(0, 490));
            }
        } catch(e) { console.log('   ⚠️ Falha ao digitar descrição.'); }

        // Link: "Adicione um link"
        try {
            const linkInput = await page.waitForSelector('input[placeholder="Adicione um link"], input[type="url"]', { timeout: 3000 });
            if (linkInput) {
                await linkInput.click();
                await linkInput.type(link);
            }
        } catch(e) { console.log('   ⚠️ Falha ao digitar link.'); }

        await new Promise(r => setTimeout(r, 2000));

        // SELECIONAR PASTA (CRUCIAL)
        console.log('   📂 Selecionando pasta...');
        try {
            // Clicar no dropdown "Escolha uma pasta"
            const dropdown = await page.evaluateHandle(() => {
                const els = Array.from(document.querySelectorAll('div[role="button"], button'));
                return els.find(e => e.textContent.includes('Escolha uma pasta') || e.getAttribute('aria-label')?.includes('Pasta'));
            });

            if (dropdown) {
                await dropdown.click();
                await new Promise(r => setTimeout(r, 2000));

                // Clicar na primeira pasta da lista (qualquer uma que aparecer)
                // Geralmente são itens com role="button" dentro do menu
                const firstBoard = await page.evaluateHandle(() => {
                    const items = Array.from(document.querySelectorAll('div[role="listitem"], div[data-test-id*="board-row"]'));
                    return items[0]; // Pega a primeira
                });

                if (firstBoard) await firstBoard.click();
            }
        } catch(e) {
            console.log('   ⚠️ Erro ao selecionar pasta (pode já estar selecionada).');
        }

        await new Promise(r => setTimeout(r, 2000));

        console.log('   🚀 Publicando...');

        // Botão Publicar (Vermelho)
        const clickByText = async (textOptions) => {
            const buttons = await page.$$('button, div[role="button"]');
            for (const btn of buttons) {
                const t = await page.evaluate(e => e.textContent, btn);
                if (t && textOptions.some(opt => t.trim() === opt)) { // Match exato ajuda
                    await btn.click();
                    return true;
                }
            }
            // Tentativa parcial se exato falhar
             for (const btn of buttons) {
                const t = await page.evaluate(e => e.textContent, btn);
                if (t && textOptions.some(opt => t.includes(opt))) {
                    await btn.click();
                    return true;
                }
            }
            return false;
        };

        const saved = await clickByText(['Publicar', 'Salvar', 'Publish', 'Save']);

        if (saved) {
            console.log('   ✅ Pin publicado (Salvo)!');
            await new Promise(r => setTimeout(r, 5000));
        } else {
            console.error('   ❌ Botão de salvar não encontrado.');
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro Pinterest:', e.message);
    }
}

if (require.main === module) {
    const title = "Teste Bitcoin";
    const desc = "Bitcoin sobe news";
    const link = "https://a-cifra.com.br";
    const img = process.argv[2] || path.join(__dirname, '../public/images/logo.png');
    postToPinterest(title, desc, link, img);
}

module.exports = { postToPinterest };
