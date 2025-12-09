const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function checkLogin() {
    console.log('🕵️‍♂️ MONITOR DE STATUS DO BOT');
    console.log('═══════════════════════════');

    const botProfileDir = path.join(os.homedir(), '.chrome-bot-profile');
    if (!fs.existsSync(botProfileDir)) {
        console.log('🔴 Perfil não encontrado. Execute: node scripts/configurar-bot.js');
        return;
    }

    console.log('⚡ Verificando sessões...');
    const browser = await puppeteer.launch({
        userDataDir: botProfileDir,
        headless: true, // Check silencioso
        ignoreDefaultArgs: ['--enable-automation'],
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // Check Twitter
    console.log('🐦 Verificando Twitter...');
    await page.goto('https://twitter.com/home', { waitUntil: 'networkidle2' });
    if (page.url().includes('login') || page.url().includes('logout')) {
        console.log('   ❌ Twitter: OFFLINE (Precisa logar)');
    } else {
        console.log('   ✅ Twitter: ONLINE');
    }

    // Check Facebook
    console.log('📘 Verificando Facebook...');
    await page.goto('https://mbasic.facebook.com/', { waitUntil: 'networkidle2' });
    if (page.url().includes('login') || (await page.$('input[name="email"]'))) {
        console.log('   ❌ Facebook: OFFLINE (Precisa logar)');
    } else {
        console.log('   ✅ Facebook: ONLINE');
    }

    await browser.close();
    console.log('\n🏁 Verificação concluída.');
    console.log('Se precisar logar: node scripts/configurar-bot.js');
}

if (require.main === module) {
    checkLogin();
}
