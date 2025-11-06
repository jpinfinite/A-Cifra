import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article } from '@/types'
import { getCategoryOrThrow } from '@/data/articles'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

/**
 * Carrega um artigo individual de um arquivo markdown
 */
export function loadArticleFromFile(filename: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Ensure dates are valid
    const publishedDate = new Date(data.publishedAt)
    if (isNaN(publishedDate.getTime())) {
      console.error(`Invalid publishedAt date in ${filename}: ${data.publishedAt}`)
      return null
    }

    const updatedDate = data.updatedAt ? new Date(data.updatedAt) : publishedDate
    if (isNaN(updatedDate.getTime())) {
      console.error(`Invalid updatedAt date in ${filename}: ${data.updatedAt}`)
      return null
    }

    // Get category from categorySlug or use the category object if provided
    const category = data.categorySlug 
      ? getCategoryOrThrow(data.categorySlug)
      : data.category

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: content,
      coverImage: data.coverImage,
      author: data.author,
      publishedAt: publishedDate,
      updatedAt: updatedDate,
      category: category,
      tags: data.tags || [],
      seo: data.seo
    }
  } catch (error) {
    console.error(`Error loading article from ${filename}:`, error)
    return null
  }
}

/**
 * Carrega todos os artigos da pasta content/articles
 */
export function loadAllArticlesFromFiles(): Article[] {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return []
    }

    const filenames = fs.readdirSync(articlesDirectory)
    const articles = filenames
      .filter(filename => filename.endsWith('.md') && filename !== 'README.md' && filename !== '_template.md')
      .map(filename => loadArticleFromFile(filename))
      .filter((article): article is Article => article !== null)

    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  } catch (error) {
    console.error('Error loading articles from files:', error)
    return []
  }
}

/**
 * Carrega um artigo específico pelo slug
 */
export function loadArticleBySlug(slug: string): Article | null {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return null
    }

    const filenames = fs.readdirSync(articlesDirectory)
    
    for (const filename of filenames) {
      if (!filename.endsWith('.md')) continue
      
      const article = loadArticleFromFile(filename)
      if (article && article.slug === slug) {
        return article
      }
    }

    return null
  } catch (error) {
    console.error(`Error loading article by slug ${slug}:`, error)
    return null
  }
}

/**
 * Carrega um artigo com suporte a idiomas
 * Tenta carregar primeiro a versão no idioma especificado (ex: article.en.md)
 * Se não encontrar, carrega a versão padrão (article.md)
 */
export function loadArticleBySlugWithLocale(slug: string, locale: string = 'pt'): Article | null {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return null
    }

    const filenames = fs.readdirSync(articlesDirectory)
    
    // Primeiro tenta carregar a versão localizada
    if (locale !== 'pt') {
      const localizedFilename = filenames.find(filename => {
        if (!filename.endsWith('.md')) return false
        const article = loadArticleFromFile(filename)
        return article && article.slug === slug && filename.includes(`.${locale}.md`)
      })
      
      if (localizedFilename) {
        return loadArticleFromFile(localizedFilename)
      }
    }
    
    // Fallback para versão padrão (português)
    for (const filename of filenames) {
      if (!filename.endsWith('.md') || filename.includes('.en.md')) continue
      
      const article = loadArticleFromFile(filename)
      if (article && article.slug === slug) {
        return article
      }
    }

    return null
  } catch (error) {
    console.error(`Error loading article by slug ${slug} with locale ${locale}:`, error)
    return null
  }
}

/**
 * Carrega todos os artigos com suporte a idiomas
 * Filtra apenas artigos do idioma especificado
 */
export function loadAllArticlesFromFilesWithLocale(locale: string = 'pt'): Article[] {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return []
    }

    const filenames = fs.readdirSync(articlesDirectory)
    const articles = filenames
      .filter(filename => {
        if (!filename.endsWith('.md') || filename === 'README.md' || filename === '_template.md') {
          return false
        }
        
        // Se for inglês, só pega arquivos .en.md
        if (locale === 'en') {
          return filename.includes('.en.md')
        }
        
        // Se for português, só pega arquivos sem .en.md
        return !filename.includes('.en.md')
      })
      .map(filename => loadArticleFromFile(filename))
      .filter((article): article is Article => article !== null)

    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  } catch (error) {
    console.error('Error loading articles from files with locale:', error)
    return []
  }
}
