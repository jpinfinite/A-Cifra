const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.facebook.com/')
  console.log('👉 Faça login manualmente')

  await page.waitForTimeout(60000)

  await context.storageState({ path: 'storage/facebook.json' })
  await browser.close()

  console.log('✅ Sessão Facebook salva')
})()
