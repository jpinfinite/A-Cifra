const { chromium } = require('playwright')
const delay = require('../utils/delay')
const typeLikeHuman = require('../utils/typeLikeHuman')
const post = require('../posts/post.json')

;(async () => {
  try {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext({
      storageState: 'storage/facebook.json'
    })

    const page = await context.newPage()
    await page.goto('https://www.facebook.com/')
    await delay(5000, 8000)

    // Criar publicação
    await page.click('text=No que você está pensando')
    await delay()

    await typeLikeHuman(page, '[role="textbox"]', post.caption)
    await delay()

    // Upload imagem
    // O seletor de input file do Facebook as vezes fica escondido ou é dinâmico
    const fileInput = await page.waitForSelector('input[type="file"]')
    await fileInput.setInputFiles(post.image)

    await delay(5000, 7000)

    // Publicar
    await page.click('text=Publicar')

    console.log('✅ Post publicado no Facebook')

    await delay(10000, 15000)
    await browser.close()
  } catch (err) {
      console.error("Erro na postagem Facebook:", err)
  }
})()
