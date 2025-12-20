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
  subtitle?: string
  excerpt: string
  content: string
  blocks?: {
    type: 'text' | 'ad'
    content?: string
    slot?: string
  }[]
  image?: string // Campo vindo do frontmatter (string simples)
  lcpImage?: string // Campo JSON
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
  intro?: string // JSON intro
  conclusion?: string // JSON conclusion
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
      // Support .md and .json
      if (!fileName.endsWith('.md') && !fileName.endsWith('.json')) return

      const slug = fileName.replace(/\.(md|json)$/, '')
      if (processedSlugs.has(slug)) return

      try {
        const fullPath = path.join(dir, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        let articleData: ArticleFromFile

        if (fileName.endsWith('.json')) {
            const jsonData = JSON.parse(fileContents)
            // Map JSON structure to ArticleFromFile
            // JSON format: { slug, title, subtitle, lcpImage, intro, blocks, conclusion }
            // Needs mapping to required fields like id, excerpt, publishedAt etc.
            articleData = {
                id: jsonData.slug,
                title: jsonData.title,
                slug: jsonData.slug,
                subtitle: jsonData.subtitle,
                excerpt: jsonData.intro || jsonData.subtitle || '',
                content: '', // No markdown content
                blocks: jsonData.blocks,
                image: jsonData.lcpImage,
                coverImage: {
                    src: jsonData.lcpImage,
                    alt: jsonData.title
                },
                publishedAt: new Date().toISOString(), // Fallback if not present
                // Try to infer or default others
                categorySlug: 'criptomoedas', // Default
                tags: [],
                intro: jsonData.intro,
                conclusion: jsonData.conclusion,
                language
            }
        } else {
            const { data, content } = matter(fileContents)
            // Extração automática de FAQs (existente)
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
            articleData = {
                ...data,
                content,
                faq: extractedFaq,
                slug,
                language
            } as ArticleFromFile
        }

        allArticles.push(articleData)
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

    // Paths for JSON and MD
    if (language === 'en') {
      possiblePaths.push(path.join(rootDir, 'en', `${slug}.json`))
      possiblePaths.push(path.join(rootDir, 'en', `${slug}.md`))
    } else if (language === 'es') {
      possiblePaths.push(path.join(rootDir, 'es', `${slug}.json`))
      possiblePaths.push(path.join(rootDir, 'es', `${slug}.md`))
    } else {
      // pt-BR
      possiblePaths.push(path.join(rootDir, `${slug}.json`))
      possiblePaths.push(path.join(rootDir, `${slug}.md`))
      possiblePaths.push(path.join(rootDir, 'pt-BR', `${slug}.json`))
      possiblePaths.push(path.join(rootDir, 'pt-BR', `${slug}.md`))
    }

    for (const fullPath of possiblePaths) {
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        if (fullPath.endsWith('.json')) {
            const jsonData = JSON.parse(fileContents)
             return {
                id: jsonData.slug,
                title: jsonData.title,
                slug: jsonData.slug,
                subtitle: jsonData.subtitle,
                excerpt: jsonData.intro || jsonData.subtitle || '',
                content: '',
                blocks: jsonData.blocks,
                image: jsonData.lcpImage,
                coverImage: {
                    src: jsonData.lcpImage,
                    alt: jsonData.title
                },
                publishedAt: jsonData.publishedAt || new Date().toISOString(),
                categorySlug: jsonData.category || 'criptomoedas',
                tags: jsonData.tags || [],
                intro: jsonData.intro,
                conclusion: jsonData.conclusion,
                language
            } as ArticleFromFile
        } else {
            const { data, content } = matter(fileContents)
            return {
              ...data,
              content,
              slug,
              language
            } as ArticleFromFile
        }
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
        // Suppress warning if it's just a newly generated article without strict category
       // console.warn(...)
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
    blocks: fileArticle.blocks, // Pass blocks through
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
    readingTime: Math.ceil((fileArticle.content.length + (JSON.stringify(fileArticle.blocks || []).length)) / 1000), // Estimate
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
