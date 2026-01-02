const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.instagram.com/accounts/login/')
  console.log('👉 Faça login manualmente')

  await page.waitForTimeout(60000) // 1 min pra logar

  await context.storageState({ path: 'storage/instagram.json' })
  await browser.close()

  console.log('✅ Sessão Instagram salva')
})()
