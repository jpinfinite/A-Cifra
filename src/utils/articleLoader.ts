import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Article {
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

export function getArticlesByLanguage(language: 'pt-BR' | 'en' = 'pt-BR'): Article[] {
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
      } as Article
    })
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  return articles
}

export function getArticleBySlug(slug: string, language: 'pt-BR' | 'en' = 'pt-BR'): Article | null {
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
    } as Article
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

// Aliases para compatibilidade com código existente
export function loadAllArticlesFromFiles(language: 'pt-BR' | 'en' = 'pt-BR'): Article[] {
  return getArticlesByLanguage(language)
}

export function loadArticleBySlug(slug: string, language: 'pt-BR' | 'en' = 'pt-BR'): Article | null {
  return getArticleBySlug(slug, language)
}
