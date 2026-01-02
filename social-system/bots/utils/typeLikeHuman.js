module.exports = async function typeLikeHuman(page, selector, text) {
  for (const char of text) {
    await page.type(selector, char)
    await page.waitForTimeout(50 + Math.random() * 120)
  }
}
