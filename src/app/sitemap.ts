import { MetadataRoute } from 'next'
import { getAllArticles } from '@/data/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acifra.com'
  
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contatos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Páginas de categorias
  const categories = [
    'bitcoin',
    'ethereum',
    'altcoins',
    'defi',
    'nfts',
    'memecoin',
    'tutoriais',
    'seguranca',
    'analises',
    'educacao',
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categoria/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  // Páginas de artigos
  const articles = await getAllArticles()
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/artigo/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...articlePages]
}
