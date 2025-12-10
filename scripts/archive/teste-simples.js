const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Iniciando Teste Simples do Puppeteer...');
  const browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized', '--no-sandbox']
  });
  const page = await browser.newPage();
  console.log('🔗 Acessando Google...');
  await page.goto('https://google.com');
  console.log('✅ Puppeteer está funcionando!');
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
  console.log('👋 Fechado.');
})();
