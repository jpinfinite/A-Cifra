const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const ARTICLES_DIR = path.join(__dirname, '../content/articles')
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml')
const BASE_URL = 'https://a-cifra.com.br'

const STATIC_PAGES = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/artigos/', priority: 0.9, changefreq: 'daily' },
  { loc: '/categoria/bitcoin/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/ethereum/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/altcoins/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/defi/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/nfts/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/trading/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/seguranca/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/educacao/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/regulacao/', priority: 0.8, changefreq: 'daily' },
  { loc: '/categoria/analises/', priority: 0.8, changefreq: 'daily' },
  { loc: '/sobre/', priority: 0.5, changefreq: 'monthly' },
  { loc: '/contatos/', priority: 0.5, changefreq: 'monthly' },
  { loc: '/privacidade/', priority: 0.3, changefreq: 'yearly' },
  { loc: '/termos/', priority: 0.3, changefreq: 'yearly' },
]

function getArticles() {
  const articles = []
  const files = fs.readdirSync(ARTICLES_DIR)

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    try {
      const filePath = path.join(ARTICLES_DIR, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(content)

      if (data.slug && data.publishedAt) {
        articles.push({
          loc: `/artigo/${data.slug}/`,
          lastmod: data.updatedAt || data.publishedAt,
          priority: 0.7,
          changefreq: 'weekly'
        })
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error.message)
    }
  }

  return articles
}

function formatDate(date) {
  if (typeof date === 'string') {
    return date.split('T')[0]
  }
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }
  return new Date().toISOString().split('T')[0]
}

function generateSitemap() {
  console.log('🗺️  Gerando sitemap...\n')

  const articles = getArticles()
  const allUrls = [...STATIC_PAGES, ...articles]

  console.log(`📄 Páginas estáticas: ${STATIC_PAGES.length}`)
  console.log(`📝 Artigos: ${articles.length}`)
  console.log(`📊 Total de URLs: ${allUrls.length}\n`)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(url => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${formatDate(url.lastmod)}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  fs.writeFileSync(OUTPUT_PATH, sitemap)
  console.log(`✅ Sitemap gerado: ${OUTPUT_PATH}`)
  console.log(`🔗 URL: ${BASE_URL}/sitemap.xml`)
}

generateSitemap()
