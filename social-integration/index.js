const fs = require('fs')
const path = require('path')
const generatePost = require('./generatePost')
const runBot = require('./runBot')

const ARTICLES_PATH = path.join(__dirname, '../content/articles')
const LAST_POST = path.join(__dirname, 'last-posted.json')

// Get all files (JSON and MD)
const files = fs.readdirSync(ARTICLES_PATH).filter(f => f.endsWith('.json') || f.endsWith('.md'))

const articles = files.map(file => {
    const content = fs.readFileSync(path.join(ARTICLES_PATH, file), 'utf-8')
    let date = new Date(0) // Default to epoch

    if (file.endsWith('.json')) {
        try {
            const data = JSON.parse(content)
            if (data.publishedAt) date = new Date(data.publishedAt)
        } catch (e) {
            // Ignore parse errors, treat as old
        }
    } else {
        const dateMatch = content.match(/date:\s*(.*)/) || content.match(/publishedAt:\s*(.*)/)
        if (dateMatch) date = new Date(dateMatch[1])
    }

    return {
      file,
      date: date,
      content
    }
  })
  .sort((a, b) => b.date - a.date)

if (articles.length === 0) {
    console.log('ℹ️ Nenhum artigo encontrado.')
    process.exit()
}

const latest = articles[0]
console.log(`🔎 Artigo mais recente encontrado: ${latest.file}`)

const lastPosted = fs.existsSync(LAST_POST)
  ? JSON.parse(fs.readFileSync(LAST_POST))
  : {}

if (lastPosted.file === latest.file) {
  console.log('ℹ️ Artigo já publicado anteriormente. Nada a fazer.')
  process.exit()
}

console.log('🆕 Novo artigo detectado! Gerando post...')
generatePost(latest)

console.log('🤖 Disparando bots...')
runBot()

fs.writeFileSync(LAST_POST, JSON.stringify({ file: latest.file, date: new Date().toISOString() }, null, 2))
console.log('✅ Registro de postagem atualizado.')
