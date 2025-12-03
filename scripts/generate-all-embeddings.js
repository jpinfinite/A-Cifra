/**
 * Script: Generate All Embeddings
 * Gera embeddings para todos os artigos existentes
 *
 * Uso: node scripts/generate-all-embeddings.js
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const ARTICLES_DIR = path.join(__dirname, '../content/articles')
const API_URL = process.env.CLOUDFLARE_API_URL || 'http://localhost:8788'

async function getAllArticles() {
  const articles = []
  const files = fs.readdirSync(ARTICLES_DIR)

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    try {
      const filePath = path.join(ARTICLES_DIR, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      if (data.slug && data.title) {
        articles.push({
          id: data.id || data.slug,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt || '',
          category: data.categorySlug || 'geral',
          content: content.substring(0, 2000), // Primeiros 2000 chars
        })
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error.message)
    }
  }

  return articles
}

async function generateEmbeddings(articles) {
  console.log(`\n🤖 Gerando embeddings para ${articles.length} artigos...\n`)

  try {
    const response = await fetch(`${API_URL}/api/generate-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articles }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate embeddings')
    }

    const result = await response.json()

    console.log('\n✅ Embeddings gerados com sucesso!')
    console.log(`📊 Processados: ${result.processed}/${result.total}`)
    console.log(`💾 Salvos no Cloudflare KV`)

    return result
  } catch (error) {
    console.error('\n❌ Erro ao gerar embeddings:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Iniciando geração de embeddings...\n')

  // 1. Carregar todos os artigos
  console.log('📚 Carregando artigos...')
  const articles = await getAllArticles()
  console.log(`✅ ${articles.length} artigos carregados\n`)

  // 2. Gerar embeddings
  await generateEmbeddings(articles)

  console.log('\n🎉 Processo concluído!')
  console.log('\n💡 Próximos passos:')
  console.log('   1. Teste a busca semântica em /api/semantic-search')
  console.log('   2. Integre no componente SearchBar')
  console.log('   3. Monitore performance no Cloudflare Dashboard')
}

main().catch(error => {
  console.error('\n💥 Erro fatal:', error)
  process.exit(1)
})
