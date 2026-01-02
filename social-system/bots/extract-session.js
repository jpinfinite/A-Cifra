const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    // Caminho padrão do Chrome no Windows para o usuário 'jpdes'
    const userDataDir = 'C:\\Users\\jpdes\\AppData\\Local\\Google\\Chrome\\User Data';

    console.log("⚠️  ATENÇÃO: Para capturar os cookies, o Google Chrome deve estar COMPLETAMENTE FECHADO.");
    console.log("⚠️  Se ele estiver aberto, este script falhará com erro de bloqueio.");
    console.log("⏳ Iniciando tentativa de captura em 3 segundos...");

    await new Promise(r => setTimeout(r, 3000));

    try {
        // Tenta lançar o Chrome usando o perfil do usuário
        const context = await chromium.launchPersistentContext(userDataDir, {
            channel: 'chrome', // Usa o navegador Chrome instalado
            headless: false,   // Abre visível para verificar
            viewport: null     // Usa tamanho janela padrão
        });

        console.log("🚀 Chrome aberto via script (Perfil do Usuário)");

        // --- INSTAGRAM ---
        try {
            const page = await context.newPage();
            console.log("📸 Acessando Instagram...");
            await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(5000); // Espera carregar sessão

            // Salva estado
            const storagePath = path.join(__dirname, '../storage/instagram.json');
            await context.storageState({ path: storagePath });
            console.log(`✅ Sessão Instagram salva em: ${storagePath}`);
            await page.close();
        } catch(e) { console.error("Erro IG:", e.message); }

        // --- FACEBOOK ---
        try {
            const page = await context.newPage();
            console.log("📘 Acessando Facebook...");
            await page.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(5000);

            const storagePath = path.join(__dirname, '../storage/facebook.json');
            await context.storageState({ path: storagePath });
            console.log(`✅ Sessão Facebook salva em: ${storagePath}`);
            await page.close();
        } catch(e) { console.error("Erro FB:", e.message); }

        console.log("🏁 Captura finalizada. Fechando navegador...");
        await context.close();

    } catch (e) {
        console.error("\n❌ ERRO CRÍTICO AO ABRIR O CHROME:");
        console.error(e.message);
        console.error("\n💡 SOLUÇÃO: Feche todas as janelas do Google Chrome e tente novamente.");
    }
})();
