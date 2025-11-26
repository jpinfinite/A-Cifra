
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

import type { Article } from '@/types'
import { categories } from '@/lib/config'


const articlesDirectory = path.join(process.cwd(), 'artigos')

export async function getMarkdownArticles(): Promise<Article[]> {
  try {
    // Check if artigos directory exists
    if (!fs.existsSync(articlesDirectory)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Artigos directory not found')
      }
      return []
    }

    const fileNames = fs.readdirSync(articlesDirectory)
    const markdownFiles = fileNames.filter(name => name.endsWith('.md') && name !== 'README.md')
    
    const articles: Article[] = []
    
    for (let i = 0; i < markdownFiles.length; i++) {
      const fileName = markdownFiles[i]
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      // Process markdown content to HTML
      const processedContent = await remark()
        .use(html)
        .process(content)
      
      // Find category
      const category = categories.find(c => c.slug === data.category) || categories[0]
      
      // Get default image based on category
      const getDefaultImage = (categorySlug: string) => {
        const imageMap: Record<string, string> = {
          'bitcoin': '/images/bitcoin/bitcoin-guide-2025.jpg',
          'ethereum': '/images/trading/crypto-trading-analysis.jpg',
          'altcoins': '/images/bitcoin/cryptocurrency-concept-with-bitcoin.jpg',
          'defi': '/images/trading/crypto-analysis-charts.jpg',
          'nfts': '/images/trading/crypto-trading-analysis.jpg',
          'analises': '/images/trading/crypto-analysis-charts.jpg',
          'educacao': '/images/bitcoin/bitcoin-guide-2025.jpg',
          'seguranca': '/images/bitcoin/cryptocurrency-concept-with-bitcoin.jpg'
        }
        return imageMap[categorySlug] || '/images/bitcoin/bitcoin-guide-2025.jpg'
      }
      
      // Create article object
      const article: Article = {
        id: String(100 + i), // Start from 100 to avoid conflicts
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: processedContent.toString(),
        coverImage: {
          src: data.coverImage || getDefaultImage(data.category),
          alt: data.title,
          width: 1200,
          height: 630
        },
        author: {
          name: data.author || 'Jonatha Pereira',
          avatar: '/Jonatha-Pereira-SEO.png'
        },
        publishedAt: new Date(data.publishedAt),
        updatedAt: new Date(data.updatedAt || data.publishedAt),
        category,
        tags: data.tags || [],
        seo: {
          metaTitle: data.seo?.metaTitle || data.title,
          metaDescription: data.seo?.metaDescription || data.excerpt,
          keywords: data.seo?.keywords || data.tags || []
        }
      }
      
      articles.push(article)
    }
    
    // Sort by publication date (newest first)
    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading markdown articles:', error)
    }
    return []
  }
}

export async function getMarkdownArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articles = await getMarkdownArticles()
    return articles.find(article => article.slug === slug) || null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading article by slug:', error)
    }
    return null
  }
}