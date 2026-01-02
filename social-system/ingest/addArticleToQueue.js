const fs = require('fs')
const path = require('path')

module.exports = function addToQueue() {
  const QUEUE_PATH = path.join(__dirname, '../queue/queue.json')
  const POSTED_PATH = path.join(__dirname, '../queue/posted.json')
  const ARTICLES_PATH = path.join(__dirname, '../../content/articles')

  // Load existing data
  let queue = []
  if (fs.existsSync(QUEUE_PATH)) {
    try { queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8')) } catch(e) { console.error("Error reading queue", e) }
  }

  let posted = []
  if (fs.existsSync(POSTED_PATH)) {
    try { posted = JSON.parse(fs.readFileSync(POSTED_PATH, 'utf-8')) } catch(e) { console.error("Error reading posted", e) }
  }

  // Scan articles
  if (!fs.existsSync(ARTICLES_PATH)) {
      console.error("Articles directory not found")
      return
  }

  const files = fs.readdirSync(ARTICLES_PATH).filter(f => f.endsWith('.json'))

  const articles = files.map(file => {
    const content = fs.readFileSync(path.join(ARTICLES_PATH, file), 'utf-8')
    try {
        const data = JSON.parse(content)
        return {
            id: data.slug, // Using slug as ID
            title: data.title,
            slug: data.slug,
            url: `https://a-cifra.com.br/artigo/${data.slug}`,
            image: data.lcpImage || `/images/articles/${data.slug}.webp`,
            publishedAt: data.publishedAt || new Date().toISOString(),
            // file: file
        }
    } catch(e) {
        return null
    }
  }).filter(a => a !== null).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  // Ingest logic: Add new articles to queue if not in queue and not in posted
  let addedCount = 0

  // Checking mainly the most recent ones to avoid processing full history every time if list is huge
  // But for now, simple check is fine.

  for (const article of articles) {
      const alreadyQueued = queue.find(p => p.id === article.id)
      const alreadyPosted = posted.find(p => p.id === article.id)

      if (!alreadyQueued && !alreadyPosted) {
          queue.push({
              ...article,
              status: 'pending',
              addedAt: new Date().toISOString()
          })
          addedCount++
          console.log(`➕ Adicionado à fila: ${article.title}`)
      }
  }

  if (addedCount > 0) {
      fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2))
      console.log(`✅ ${addedCount} novos artigos adicionados à fila.`)
  } else {
      console.log("ℹ️ Nenhum artigo novo para adicionar.")
  }
}

// Allow running directly
if (require.main === module) {
    module.exports()
}
