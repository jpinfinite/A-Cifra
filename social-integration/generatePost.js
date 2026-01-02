const fs = require('fs')

module.exports = function generatePost(article) {
  // Logic updated to handle JSON and MD files, matching current project structure
  let title = ''
  let slug = article.file.replace(/\.(json|md)$/, '')
  let imagePath = ''

  if (article.file.endsWith('.json')) {
      try {
          const data = JSON.parse(article.content)
          title = data.title
          // Use the lcpImage path directly from JSON
          // Removing leading slash for compatibility if needed, but absolute path construction handles it
          imagePath = data.lcpImage || `/images/articles/${slug}.webp`
      } catch (e) {
          console.error("Error parsing JSON content for post generation", e)
          return
      }
  } else {
      const titleMatch = article.content.match(/title:\s*(.*)/)
      title = titleMatch?.[1]
      // Fallback or extraction for MD files
      imagePath = `/images/articles/${slug}.webp`
  }

  // Ensure image path is correct relative to the bot execution context
  // The system expects 'image' to be a path it can read.
  // If the image is in public/xxx, we need to resolve it to the full local path.
  // The 'public' dir is at ../public from social-integration folder.

  // Clean up image path if it starts with /
  const cleanImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
  const fullLocalImagePath = `../public/${cleanImagePath}`


  const caption = `📰 Novo artigo no A-Cifra

${title}

Leia agora 👇
https://a-cifra.com.br/artigo/${slug}`

  const hashtags = '#bitcoin #cripto #investimentos #blockchain #web3 #financas'

  fs.writeFileSync(
    './social-bot/posts/post.json', // Writing directly to social-bot posts for immediate use
    JSON.stringify({
      caption,
      hashtags,
      image: fullLocalImagePath
    }, null, 2)
  )

  // Also save to social-integration/posts for record
  fs.writeFileSync(
      './social-integration/posts/post.json',
      JSON.stringify({
        caption,
        hashtags,
        image: fullLocalImagePath
      }, null, 2)
    )
}
