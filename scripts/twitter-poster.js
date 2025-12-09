const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function postToTwitter(text) {
    console.log('🐦 Iniciando Twitter Poster (Perfil Dedicado Stealth)...');

    // Caminho do perfil (O MESMO QUE VOCÊ LOGOU)
    const botProfileDir = path.join(os.homedir(), '.chrome-bot-profile');

    if (!fs.existsSync(botProfileDir)) {
        console.error('❌ Perfil do bot não encontrado!');
        return;
    }

    try {
        const browser = await puppeteer.launch({
            userDataDir: botProfileDir,
            headless: false, // Pode mudar para true depois se quiser invisível
            defaultViewport: null,
            ignoreDefaultArgs: ['--enable-automation'], // CRUCIAL para não ser detectado
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled', // CRUCIAL
                '--disable-infobars',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            ]
        });

        const page = await browser.newPage();

        // Hack Stealth Extra
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        console.log('   🔗 Acessando Twitter...');

        // Vai para a Home primeiro para carregar cookies com calma
        await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2', timeout: 60000 });

        await new Promise(r => setTimeout(r, 2000));

        // Verificar login via presença do botão de postar ou url
        if (page.url().includes('login') || page.url().includes('logout')) {
            // Às vezes vai para logout se a sessão caiu
            console.error('   ❌ Opa, parece que o login não persistiu ou expirou.');
            await browser.close();
            return;
        }

        console.log('   ✍️  Abrindo compositor...');
        await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'networkidle2' });

        const selector = '[data-testid="tweetTextarea_0"]';

        try {
            await page.waitForSelector(selector, { timeout: 20000 });

            console.log('   📝 Digitando tweet...');
            await page.click(selector);
            await new Promise(r => setTimeout(r, 500));

            await page.type(selector, text, { delay: 50 });
            await new Promise(r => setTimeout(r, 1000));

            console.log('   🚀 Enviando...');
            await page.keyboard.down('Control');
            await page.keyboard.press('Enter');
            await page.keyboard.up('Control');

            console.log('   ✅ TWEET ENVIADO COM SUCESSO!');
            await new Promise(r => setTimeout(r, 5000));
        } catch (e) {
            console.error('   ❌ Erro na interação:', e.message);
            // Salvar screenshot para debug
            try { await page.screenshot({ path: 'erro-twitter.png' }); } catch {}
        }

        await browser.close();

    } catch (e) {
        console.error('   ❌ Erro crítico:', e.message);
    }
}

if (require.main === module) {
    const message = process.argv[2] || "Automação A Cifra: Sistema online! 🚀 #Bitcoin";
    postToTwitter(message);
}

module.exports = { postToTwitter };
