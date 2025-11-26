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

export function getArticlesByLanguage(language: 'pt-BR' | 'en' = 'pt-BR'): ArticleFromFile[] {
  const articlesDirectory = language === 'en' 
    ? path.join(process.cwd(), 'content/articles/en')
    : path.join(process.cwd(), 'content/articles')

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

export function getArticleBySlug(slug: string, language: 'pt-BR' | 'en' = 'pt-BR'): ArticleFromFile | null {
  try {
    const articlesDirectory = language === 'en'
      ? path.join(process.cwd(), 'content/articles/en')
      : path.join(process.cwd(), 'content/articles')
    
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
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

export function getAllArticleSlugs(language?: 'pt-BR' | 'en'): string[] {
  if (language) {
    const articlesDirectory = language === 'en'
      ? path.join(process.cwd(), 'content/articles/en')
      : path.join(process.cwd(), 'content/articles')
    
    if (!fs.existsSync(articlesDirectory)) {
      return []
    }

    return fs.readdirSync(articlesDirectory)
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''))
  }

  // Get slugs from both languages
  const ptSlugs = getAllArticleSlugs('pt-BR')
  const enSlugs = getAllArticleSlugs('en')
  
  const allSlugs = [...ptSlugs, ...enSlugs]
  return Array.from(new Set(allSlugs))
}

// Aliases para compatibilidade com código existente - retornam Article[]
export function loadAllArticlesFromFiles(language: 'pt-BR' | 'en' = 'pt-BR'): Article[] {
  return getArticlesAsArticleType(language)
}

export function loadArticleBySlug(slug: string, language: 'pt-BR' | 'en' = 'pt-BR'): Article | null {
  return getArticleAsArticleType(slug, language)
}

// Função para converter ArticleFromFile para Article
function convertToArticle(fileArticle: ArticleFromFile): Article {
  // Encontrar categoria pelo slug, usar 'bitcoin' como fallback
  let category = categories.find(cat => cat.slug === fileArticle.categorySlug)
  
  if (!category) {
    console.warn(`Category not found for slug: ${fileArticle.categorySlug}, using 'bitcoin' as fallback`)
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
    publishedAt: new Date(fileArticle.publishedAt),
    updatedAt: fileArticle.updatedAt ? new Date(fileArticle.updatedAt) : undefined,
    category: category,
    tags: fileArticle.tags || [],
    seo: fileArticle.seo ? {
      metaTitle: fileArticle.seo.metaTitle || fileArticle.title,
      metaDescription: fileArticle.seo.metaDescription || fileArticle.excerpt,
      keywords: fileArticle.seo.keywords || []
    } : undefined,
    language: (fileArticle.language === 'pt-BR' || fileArticle.language === 'en') 
      ? fileArticle.language 
      : undefined,
    alternateLanguages: fileArticle.alternateLanguages
  }
}

// Funções públicas que retornam Article[]
export function getArticlesAsArticleType(language: 'pt-BR' | 'en' = 'pt-BR'): Article[] {
  const fileArticles = getArticlesByLanguage(language)
  return fileArticles.map(article => {
    try {
      return convertToArticle(article)
    } catch (error) {
      console.error(`Error converting article ${article.slug}:`, error)
      return null
    }
  }).filter((article): article is Article => article !== null)
}

export function getArticleAsArticleType(slug: string, language: 'pt-BR' | 'en' = 'pt-BR'): Article | null {
  const fileArticle = getArticleBySlug(slug, language)
  if (!fileArticle) return null
  try {
    return convertToArticle(fileArticle)
  } catch (error) {
    console.error(`Error converting article ${slug}:`, error)
    return null
  }
}

// Export do tipo para uso externo
export type { ArticleFromFile }
