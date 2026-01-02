const { chromium } = require('playwright');
const path = require('path');

(async () => {
    // Launch headless false to be visible AND executablePath to system one IF needed,
    // but Playwright default usually works unless we want persistent user context.
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("📘 Abrindo Facebook para intervenção manual...");
    await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded' });

    console.log("⚠️  ATENÇÃO: A janela ficará aberta por 5 minutos para você resolver o Login/2FA.");
    console.log("ℹ️  Após resolver, o script salvará a sessão automaticamente.");

    // Fill credentials again to speed up
    try {
        await page.fill('#email', 'j.p.designgraficoinfinite@gmail.com');
        await page.fill('#pass', '24092011J$@a');
        await page.click('[name="login"]');
    } catch (e) {
        // If already logged in or elements missing, user takes over
    }

    // Wait very long time for user interaction
    await page.waitForTimeout(300000); // 5 minutes

    const storagePath = path.join(__dirname, '../storage/facebook.json');
    await context.storageState({ path: storagePath });
    console.log(`✅ Sessão Facebook (re)salva em: ${storagePath}`);

    await browser.close();
})();
