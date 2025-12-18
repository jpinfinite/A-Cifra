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
  image?: string // Campo vindo do frontmatter (string simples)
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
  faq?: {
    question: string
    answer: string
  }[]
}

export function getArticlesByLanguage(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): ArticleFromFile[] {
  const rootDir = path.join(process.cwd(), 'content/articles')
  const dirsToRead: string[] = []

  if (language === 'en') {
    dirsToRead.push(path.join(rootDir, 'en'))
  } else if (language === 'es') {
    dirsToRead.push(path.join(rootDir, 'es'))
  } else {
    // pt-BR: Lê raiz (legado) E pasta pt-BR (novo padrão)
    dirsToRead.push(rootDir)
    dirsToRead.push(path.join(rootDir, 'pt-BR'))
  }

  const allArticles: ArticleFromFile[] = []
  const processedSlugs = new Set<string>()

  for (const dir of dirsToRead) {
    if (!fs.existsSync(dir)) continue

    const fileNames = fs.readdirSync(dir)
    fileNames.forEach(fileName => {
      if (!fileName.endsWith('.md')) return

      const slug = fileName.replace(/\.md$/, '')
      if (processedSlugs.has(slug)) return // Evita duplicatas se houver mesmo slug na raiz e pt-BR (prioriza o primeiro que ler - raiz neste caso)

      try {
        const fullPath = path.join(dir, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        // Extração automática de FAQs
        let extractedFaq = data.faq as { question: string, answer: string }[] | undefined
        if (!extractedFaq) {
          const faqRegex = /##\s*(?:FAQ|Perguntas Frequentes)([\s\S]*?)(?:##|$)/i
          const faqMatch = content.match(faqRegex)
          if (faqMatch && faqMatch[1]) {
             const faqSection = faqMatch[1]
             const qaRegex = /###\s+(.*?)\n+([\s\S]*?)(?=(?:###|$))/g
             const matches = Array.from(faqSection.matchAll(qaRegex))
             if (matches.length > 0) {
               extractedFaq = matches.map(match => ({
                 question: match[1].trim(),
                 answer: match[2].trim()
               }))
             }
          }
        }

        allArticles.push({
          ...data,
          content,
          faq: extractedFaq,
          slug,
          language
        } as ArticleFromFile)

        processedSlugs.add(slug)
      } catch (e) {
        console.error(`Error reading article ${fileName}:`, e)
      }
    })
  }

  return allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getArticleBySlug(slug: string, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): ArticleFromFile | null {
  try {
    const rootDir = path.join(process.cwd(), 'content/articles')
    const possiblePaths: string[] = []

    if (language === 'en') {
      possiblePaths.push(path.join(rootDir, 'en', `${slug}.md`))
    } else if (language === 'es') {
      possiblePaths.push(path.join(rootDir, 'es', `${slug}.md`))
    } else {
      // pt-BR: tenta raiz e subpasta
      possiblePaths.push(path.join(rootDir, `${slug}.md`))        // Legado
      possiblePaths.push(path.join(rootDir, 'pt-BR', `${slug}.md`)) // Novo
    }

    for (const fullPath of possiblePaths) {
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        return {
          ...data,
          content,
          slug,
          language
        } as ArticleFromFile
      }
    }

    return null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error loading article ${slug}:`, error)
    }
    return null
  }
}

export function getAllArticleSlugs(language?: 'pt-BR' | 'en' | 'es'): string[] {
  if (language) {
    const articles = getArticlesByLanguage(language)
    return articles.map(a => a.slug)
  }

  const ptSlugs = getAllArticleSlugs('pt-BR')
  const enSlugs = getAllArticleSlugs('en')
  const esSlugs = getAllArticleSlugs('es')

  return Array.from(new Set([...ptSlugs, ...enSlugs, ...esSlugs]))
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
  // Tentar encontrar categoria pelo slug ou pelo nome
  let category = categories.find(cat => cat.slug === fileArticle.categorySlug)

  if (!category && (fileArticle as any).category) {
     const catNameRaw = (fileArticle as any).category.toString().toLowerCase()
     category = categories.find(cat => cat.name.toLowerCase() === catNameRaw || cat.slug === catNameRaw || cat.slug.replace('-', '') === catNameRaw.replace(' ', ''))
  }

  if (!category) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Category not found for article: ${fileArticle.title}, slug: ${fileArticle.categorySlug || (fileArticle as any).category}, using 'bitcoin' as fallback`)
    }
    category = categories.find(cat => cat.slug === 'bitcoin') || categories[0]
  }

  // Determinar imagem de capa: prioriza coverImage objeto, depois image string, depois fallback
  const imageSrc = fileArticle.coverImage?.src || fileArticle.image || '/images/default.jpg'

  return {
    id: fileArticle.id,
    title: fileArticle.title,
    slug: fileArticle.slug,
    excerpt: fileArticle.excerpt,
    content: fileArticle.content,
    coverImage: {
      src: imageSrc,
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
    readingTime: Math.ceil(fileArticle.content.split(/\s+/).length / 200),
    faq: fileArticle.faq
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
