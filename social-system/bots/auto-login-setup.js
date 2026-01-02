const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log("🚀 Iniciando login automático...");
    // Launch headless to run in background environment
    const browser = await chromium.launch({ headless: true });

    // --- INSTAGRAM ---
    try {
        console.log("📸 Tentando login Instagram...");
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://www.instagram.com/accounts/login/');
        // Wait for form
        try {
            await page.waitForSelector('input[name="username"]', { timeout: 10000 });
        } catch(e) {
            console.log("⚠️ Timeout esperando form IG. Tentando screenshot debug...");
            // In headless, sometimes things render differently.
        }

        await page.fill('input[name="username"]', 'j.p.designgraficoinfinite@gmail.com');
        // Assuming "senha " was label
        await page.fill('input[name="password"]', '24092011J$@a');

        await page.click('button[type="submit"]');

        console.log("⏳ Aguardando login IG completar...");
        await page.waitForTimeout(8000);

        // Basic verification: Check if login form is gone or password error appeared
        // This is a naive check.

        const storagePath = path.join(__dirname, '../storage/instagram.json');
        await context.storageState({ path: storagePath });
        console.log(`✅ Sessão Instagram salva em: ${storagePath}`);

        await context.close();
    } catch (e) {
        console.error("❌ Falha no login Instagram:", e.message);
    }

    // --- FACEBOOK ---
    try {
        console.log("📘 Tentando login Facebook...");
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://www.facebook.com/');
        await page.waitForSelector('#email', { timeout: 10000 });

        await page.fill('#email', 'j.p.designgraficoinfinite@gmail.com');
        await page.fill('#pass', '24092011J$@a');

        await page.click('[name="login"]');

        console.log("⏳ Aguardando login FB completar...");
        await page.waitForTimeout(8000);

        const storagePath = path.join(__dirname, '../storage/facebook.json');
        await context.storageState({ path: storagePath });
        console.log(`✅ Sessão Facebook salva em: ${storagePath}`);

        await context.close();
    } catch (e) {
         console.error("❌ Falha no login Facebook:", e.message);
    }

    await browser.close();
})();
