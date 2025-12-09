const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');

async function postWithOpera(text) {
    console.log('🅾️  Iniciando Opera Poster...');

    // 1. Caminhos HARDCODED baseados na investigação
    const operaExe = path.join(process.env.LOCALAPPDATA, 'Programs', 'Opera', 'launcher.exe');
    // const operaExe = path.join(process.env.LOCALAPPDATA, 'Programs', 'Opera', 'opera.exe'); // Alternativa

    const userDataDir = path.join(process.env.APPDATA, 'Opera Software', 'Opera Stable');

    console.log(`   🖥️  Executável alvo: ${operaExe}`);
    console.log(`   📂 Perfil alvo: ${userDataDir}`);

    if (!fs.existsSync(operaExe)) {
        console.error('❌ Executável não encontrado!');
        // Tentar listar o diretório para debug
        try {
            const progDir = path.join(process.env.LOCALAPPDATA, 'Programs');
            console.log('   Diretórios em Programs:', fs.readdirSync(progDir));
        } catch(e) {}
        return;
    }

    // 2. Tentar fechar Opera existente
    console.log('🔴 Fechando processos do Opera...');
    try {
        await new Promise(r => {
            exec('taskkill /F /IM opera.exe /T', () => setTimeout(r, 2000));
        });
    } catch (e) {}

    // 3. Lançar
    try {
        const browser = await puppeteer.launch({
            executablePath: operaExe,
            userDataDir: userDataDir,
            headless: false,
            defaultViewport: null,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const page = await browser.newPage();

        console.log('   🔗 Acessando Twitter...');

        // Tentar ir direto para composer
        await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Verificar login
        if (page.url().includes('login')) {
            console.log('   ⚠️  Detectado redirecionamento para Login.');
            console.log('   👉  Por favor, faça login MANUALMENTE no Opera agora.');
            console.log('   ⏳  Aguardando 2 minutos...');
            await new Promise(r => setTimeout(r, 120000));
        }

        console.log('   ✍️  Escrevendo Tweet...');
        const selector = '[data-testid="tweetTextarea_0"]';

        try {
            await page.waitForSelector(selector, { timeout: 15000 });
            await page.click(selector);
            await new Promise(r => setTimeout(r, 500));

            // Digitar caractere por caractere parece humano
            await page.type(selector, text, { delay: 50 });
            await new Promise(r => setTimeout(r, 1000));

            console.log('   🚀 Enviando (Ctrl+Enter)...');
            await page.keyboard.down('Control');
            await page.keyboard.press('Enter');
            await page.keyboard.up('Control');

            console.log('   ✅ Enviado!');
            await new Promise(r => setTimeout(r, 5000));

        } catch (e) {
            console.error('   ❌ Falha na interação: ' + e.message);
            console.log('   💡 O navegador permanecerá aberto por mais 30s para você checar/enviar manualmente.');
            await new Promise(r => setTimeout(r, 30000));
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro ao lançar navegador:', e.message);
    }
}

if (require.main === module) {
    const message = process.argv[2] || "Teste Opera A Cifra 🅾️🚀";
    postWithOpera(message);
}

module.exports = { postWithOpera };
