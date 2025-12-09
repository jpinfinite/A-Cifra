const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function setupBotProfile() {
    console.log('🤖 CONFIGURAÇÃO DO BOT - ALL-NETWORKS');
    console.log('═════════════════════════════════════');

    const botProfileDir = path.join(os.homedir(), '.chrome-bot-profile');

    if (!fs.existsSync(botProfileDir)) {
        fs.mkdirSync(botProfileDir);
    }

    console.log(`📂 Perfil: ${botProfileDir}`);
    console.log('⚡ Abrindo navegador...');

    console.log('\n👉 TAREFAS DE LOGIN (Faça todas):');
    console.log('   1. [Reddit]    reddit.com (NOVO!)');
    console.log('   2. [Pinterest] pinterest.com');
    console.log('   3. [LinkedIn]  linkedin.com');
    console.log('   4. [Medium]    medium.com');
    console.log('   5. [Twitter]   twitter.com');
    console.log('   6. [Facebook]  facebook.com');
    console.log('   7. [Instagram] instagram.com');
    console.log('\n✅ Quando terminar, FECHE A JANELA.');

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: botProfileDir,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        ]
    });

    const page = await browser.newPage();

    // Hack Stealth
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    try {
        await page.goto('https://www.pinterest.com/login/', { waitUntil: 'domcontentloaded' });
    } catch (e) {}

    browser.on('disconnected', () => {
        console.log('\n✅ Sessões salvas! Pinterest adicionado.');
    });
}

if (require.main === module) {
    setupBotProfile();
}
