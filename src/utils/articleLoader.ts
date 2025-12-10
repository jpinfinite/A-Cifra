import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article } from '@/types'
import { categories } from '@/lib/config'

// Interface interna para artigos carregados de arquivos
interface ArticleFromFile {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  author?: {
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt?: string
  categorySlug: string
  tags: string[]
  language?: string
  alternateLanguages?: {
    [key: string]: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

export function getArticlesByLanguage(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): ArticleFromFile[] {
  let articlesDirectory = path.join(process.cwd(), 'content/articles')
  if (language === 'en') {
    articlesDirectory = path.join(process.cwd(), 'content/articles/en')
  } else if (language === 'es') {
    articlesDirectory = path.join(process.cwd(), 'content/articles/es')
  }

  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        ...data,
        content,
        slug,
        language
      } as ArticleFromFile
    })
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  return articles
}

export function getArticleBySlug(slug: string, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): ArticleFromFile | null {
  try {
    let articlesDirectory = path.join(process.cwd(), 'content/articles')
    if (language === 'en') {
      articlesDirectory = path.join(process.cwd(), 'content/articles/en')
    } else if (language === 'es') {
      articlesDirectory = path.join(process.cwd(), 'content/articles/es')
    }

    const fullPath = path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      ...data,
      content,
      slug,
      language
    } as ArticleFromFile
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error loading article ${slug}:`, error)
    }
    return null
  }
}

export function getAllArticleSlugs(language?: 'pt-BR' | 'en' | 'es'): string[] {
  if (language) {
    let articlesDirectory = path.join(process.cwd(), 'content/articles')
    if (language === 'en') {
      articlesDirectory = path.join(process.cwd(), 'content/articles/en')
    } else if (language === 'es') {
      articlesDirectory = path.join(process.cwd(), 'content/articles/es')
    }

    if (!fs.existsSync(articlesDirectory)) {
      return []
    }

    return fs.readdirSync(articlesDirectory)
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''))
  }

  // Get slugs from all languages
  const ptSlugs = getAllArticleSlugs('pt-BR')
  const enSlugs = getAllArticleSlugs('en')
  const esSlugs = getAllArticleSlugs('es')

  const allSlugs = [...ptSlugs, ...enSlugs, ...esSlugs]
  return Array.from(new Set(allSlugs))
}

// Aliases para compatibilidade com código existente - retornam Article[]
export function loadAllArticlesFromFiles(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Article[] {
  return getArticlesAsArticleType(language)
}

export function loadArticleBySlug(slug: string, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Article | null {
  return getArticleAsArticleType(slug, language)
}

// Função para converter ArticleFromFile para Article
function convertToArticle(fileArticle: ArticleFromFile): Article {
  // Encontrar categoria pelo slug, usar 'bitcoin' como fallback
  let category = categories.find(cat => cat.slug === fileArticle.categorySlug)

  if (!category) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Category not found for slug: ${fileArticle.categorySlug}, using 'bitcoin' as fallback`)
    }
    category = categories.find(cat => cat.slug === 'bitcoin') || categories[0]
  }

  return {
    id: fileArticle.id,
    title: fileArticle.title,
    slug: fileArticle.slug,
    excerpt: fileArticle.excerpt,
    content: fileArticle.content,
    coverImage: {
      src: fileArticle.coverImage?.src || '/images/default.jpg',
      alt: fileArticle.coverImage?.alt || fileArticle.title,
      width: fileArticle.coverImage?.width || 1200,
      height: fileArticle.coverImage?.height || 630
    },
    author: {
      name: fileArticle.author?.name || 'Jonatha Pereira',
      avatar: fileArticle.author?.avatar || '/Jonatha-Pereira-SEO.png'
    },
    publishedAt: fileArticle.publishedAt ? new Date(fileArticle.publishedAt) : new Date(),
    updatedAt: fileArticle.updatedAt ? new Date(fileArticle.updatedAt) : undefined,
    category: category,
    tags: fileArticle.tags || [],
    seo: fileArticle.seo ? {
      metaTitle: fileArticle.seo.metaTitle || fileArticle.title,
      metaDescription: fileArticle.seo.metaDescription || fileArticle.excerpt,
      keywords: fileArticle.seo.keywords || []
    } : undefined,
    language: (fileArticle.language === 'pt-BR' || fileArticle.language === 'en' || fileArticle.language === 'es')
      ? fileArticle.language
      : undefined,
    alternateLanguages: fileArticle.alternateLanguages,
    readingTime: Math.ceil(fileArticle.content.split(/\s+/).length / 200)
  }
}

// Funções públicas que retornam Article[]
export function getArticlesAsArticleType(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Article[] {
  const fileArticles = getArticlesByLanguage(language)
  return fileArticles.map(article => {
    try {
      return convertToArticle(article)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error converting article ${article.slug}:`, error)
      }
      return null
    }
  }).filter((article): article is Article => article !== null)
}

export function getArticleAsArticleType(slug: string, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Article | null {
  const fileArticle = getArticleBySlug(slug, language)
  if (!fileArticle) return null
  try {
    return convertToArticle(fileArticle)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error converting article ${slug}:`, error)
    }
    return null
  }
}

// Export do tipo para uso externo
export type { ArticleFromFile }
