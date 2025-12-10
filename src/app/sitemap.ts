import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/data/articles'
import { categories } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://a-cifra.com.br'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/artigos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Páginas de categorias
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Artigos PT
  const ptArticles = await getAllArticles('pt-BR')
  const ptArticlePages: MetadataRoute.Sitemap = ptArticles.map(article => ({
    url: `${baseUrl}/artigo/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Artigos EN
  const enArticles = await getAllArticles('en')
  const enArticlePages: MetadataRoute.Sitemap = enArticles.map(article => ({
    url: `${baseUrl}/en/article/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Artigos ES
  const esArticles = await getAllArticles('es')
  const esArticlePages: MetadataRoute.Sitemap = esArticles.map(article => ({
    url: `${baseUrl}/es/article/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Homepages multilíngues
  const multiLangHomePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }
  ]

  return [...staticPages, ...multiLangHomePages, ...categoryPages, ...ptArticlePages, ...enArticlePages, ...esArticlePages]
}
