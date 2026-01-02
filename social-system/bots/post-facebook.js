const { chromium } = require('playwright')
const delay = require('./utils/delay')
const typeLikeHuman = require('./utils/typeLikeHuman')
const fs = require('fs')
const path = require('path')

const CURRENT_POST_PATH = path.join(__dirname, '../posts/current.json')

;(async () => {
  try {
    if (!fs.existsSync(CURRENT_POST_PATH)) {
        console.error("❌ Arquivo de post não encontrado.")
        process.exit(1)
    }
    const post = JSON.parse(fs.readFileSync(CURRENT_POST_PATH, 'utf-8'))

    if (!fs.existsSync(post.image)) {
        console.error(`❌ Imagem não encontrada: ${post.image}`)
        process.exit(1)
    }

    const STORAGE_PATH = path.join(__dirname, '../storage/facebook.json')
     if (!fs.existsSync(STORAGE_PATH)) {
         const OLD_STORAGE = path.join(__dirname, '../../social-bot/storage/facebook.json')
         if (fs.existsSync(OLD_STORAGE)) {
             console.log("⚠️ Usando sessão do social-bot antigo...")
             fs.copyFileSync(OLD_STORAGE, STORAGE_PATH)
         } else {
             console.error("❌ Sessão não encontrada. Faça login primeiro.")
             process.exit(1)
         }
    }

    // Launch visible to allow manual intervention if needed
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext({
      storageState: STORAGE_PATH
    })

    const page = await context.newPage()
    await page.goto('https://www.facebook.com/')

    // Check if we were redirected to login/checkpoint
    // Give time to load
    await delay(3000, 5000)

    if (page.url().includes('login') || page.url().includes('checkpoint') || page.url().includes('two_step_verification')) {
        console.log("⚠️  Facebook pediu Login/2FA. Aguardando você resolver na janela...")
        // Wait until user navigates back to home feed (by checking URL or element)
        try {
            const waitForInterface = async () => {
                 // Try to wait for the post box which signifies feed is loaded
                 await page.waitForSelector('text=No que você está pensando', { timeout: 300000 }) // 5 min wait
            }
            await waitForInterface()
            console.log("✅ Login detectado. Prosseguindo...")
            // Update storage with new valid session
            await context.storageState({ path: STORAGE_PATH })
        } catch (e) {
            console.error("⏳ Tempo esgotado para login manual.")
            throw e
        }
    }

    await delay(2000, 4000)

    try {
        await page.click('text=No que você está pensando')
    } catch (e) {
        // Fallback for different layouts
        await page.click('[role="button"]:has-text("No que você está pensando")')
    }
    await delay()

    await typeLikeHuman(page, '[role="textbox"]', post.caption)
    await delay()

    const fileInput = await page.waitForSelector('input[type="file"]')
    await fileInput.setInputFiles(post.image)

    await delay(5000, 7000)

    await page.click('text=Publicar')

    console.log('✅ Post publicado no Facebook')

    await delay(10000, 15000)
    await browser.close()
  } catch (err) {
      console.error("Erro na postagem Facebook:", err)
      process.exit(1)
  }
})()
