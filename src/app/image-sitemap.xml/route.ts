import { getAllArticles } from '@/data/articles'
import { siteConfig } from '@/lib/config'

export async function GET() {
  const articles = await getAllArticles()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${articles.map(article => `  <url>
    <loc>${siteConfig.url}/artigo/${article.slug}</loc>
    <image:image>
      <image:loc>${siteConfig.url}${article.coverImage.src}</image:loc>
      <image:title>${article.coverImage.alt}</image:title>
      <image:caption>${article.title}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
