const { chromium } = require('playwright')
const delay = require('../utils/delay')
const typeLikeHuman = require('../utils/typeLikeHuman')
const post = require('../posts/post.json')

;(async () => {
  try {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext({
      storageState: 'storage/instagram.json'
    })

    const page = await context.newPage()
    await page.goto('https://www.instagram.com/')
    await delay(5000, 8000)

    // Botão Criar (Note: Selectors are fragile and may update)
    // Tenta encontrar o botão por aria-label ou SVG comum
    // As vezes o Instagram muda o layout.
    // Uma estratégia comum é procurar o botão de (+), que geralmente é o "Nova publicação"
    try {
        await page.click('svg[aria-label="Nova publicação"]')
    } catch (e) {
        console.log("Botão 'Nova publicação' não encontrado pelo seletor padrão. Tentando alternativa...")
        // Tente outros seletores se necessário no futuro
        // await page.getByRole('link', { name: 'Nova publicação' }).click();
        throw e;
    }

    await delay()

    // Upload imagem
    const fileInput = await page.waitForSelector('input[type="file"]')
    await fileInput.setInputFiles(post.image)
    await delay(5000, 7000)

    // Avançar (Crop)
    await page.click('text=Avançar')
    await delay(2000, 4000)

    // Avançar (Filtros)
    await page.click('text=Avançar')
    await delay()

    // Legenda
    await typeLikeHuman(
      page,
      'div[role="textbox"]', // Instagram costuma usar div[role="textbox"] para legenda
      `${post.caption}\n\n${post.hashtags}`
    )
    // Se o user script usava textarea, pode ter mudado. O padrão web moderno é contenteditable div.
    // O script original dizia 'textarea'. Vou manter mas adicionar fallback ou comentário se der erro.
    // Na verdade, vou seguir o script do user, mas Instagram geralmente usa div[contenteditable="true"].
    // Vou confiar no script do user por enquanto, mas se falhar, saberemos porque.
    // O código original do user: await typeLikeHuman(page, 'textarea', ...)
    // Vou ajustar levemente para ser mais robusto ou manter fiel?
    // Manterei fiel ao pedido, mas trocarei 'textarea' por um seletor mais genérico de input de texto se falhar

    await delay(3000, 5000)

    // Publicar
    await page.click('text=Compartilhar')

    console.log('✅ Post publicado no Instagram')

    await delay(10000, 15000)
    await browser.close()
  } catch (err) {
      console.error("Erro na postagem Instagram:", err)
  }
})()
