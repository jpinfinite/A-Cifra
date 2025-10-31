import { MetadataRoute } from 'next'
import { siteConfig, categories } from '@/lib/config'
import { getAllArticles } from '@/data/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static pages
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
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Article pages
  let articlePages: MetadataRoute.Sitemap = []
  
  try {
    const articles = await getAllArticles()
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/artigo/${article.slug}`,
      lastModified:
        article.updatedAt && article.updatedAt instanceof Date
          ? article.updatedAt
          : article.publishedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating article sitemap:', error)
    }
  }

  return [...staticPages, ...categoryPages, ...articlePages]
}