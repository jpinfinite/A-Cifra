import sanitizeHtml from 'sanitize-html'
import { Article } from '@/types'
import { categories } from '@/lib/config'
import { loadAllArticlesFromFiles, loadArticleBySlug } from '@/utils/articleLoader'
import { convertConfigToArticles, articlesConfig } from './articlesConfig'

/* -----------------------------------------------------------------
 * MAP DE CATEGORIAS (lookup O(1))
 * ----------------------------------------------------------------- */
const categoryMap = new Map<string, typeof categories[number]>(
  categories.map(cat => [cat.slug, cat])
)

/**
 * Recupera a categoria a partir do slug.
 * Lança erro caso não exista – evita o uso do operador !.
 */
export function getCategoryOrThrow(slug: string) {
  const cat = categoryMap.get(slug)
  if (!cat) {
    throw new Error(`Categoria não encontrada: ${slug}`)
  }
  return cat
}

/**
 * Artigos em memória carregados da configuração
 * A configuração de artigos agora está em articlesConfig.ts para fácil manutenção
 */
const inMemoryArticles: Article[] = convertConfigToArticles(articlesConfig)

/**
 * Função helper para ordenar artigos por data
 */
function sortArticlesByDate(articles: Article[]): Article[] {
  return articles.slice().sort((a, b) => {
    const timeA = a.publishedAt?.getTime() || 0
    const timeB = b.publishedAt?.getTime() || 0
    return timeB - timeA
  })
}

/**
 * Carrega todos os artigos (de arquivos + configuração em memória)
 * Artigos são carregados de duas fontes:
 * 1. Markdown files em content/articles/ (se existirem)
 * 2. Configuração em articlesConfig.ts (fallback e override)
 */
/**
 * Carrega todos os artigos (de arquivos + configuração em memória)
 * Artigos são carregados de duas fontes:
 * 1. Markdown files em content/articles/ (se existirem)
 * 2. Configuração em articlesConfig.ts (fallback e override)
 */
export async function getAllArticles(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Promise<Article[]> {
  try {
    const fileArticles = loadAllArticlesFromFiles(language)

    // Mesclar artigos de arquivo com artigos em memória (apenas para pt-BR ou se decidirmos ter config multilíngue)
    // Por enquanto, inMemoryArticles são primariamente pt-BR.
    // Se language != pt-BR, talvez devêssemos retornar apenas fileArticles se inMemory não tiver suporte.
    // Mas mantendo lógica original de fallback:

    // Se não for PT-BR, vamos priorizar apenas os arquivos carregados da pasta específica
    if (language !== 'pt-BR') {
       return sortArticlesByDate(fileArticles)
    }

    const fileArticleSlugs = new Set(fileArticles.map(a => a.slug))
    const configArticles = inMemoryArticles.filter(a => !fileArticleSlugs.has(a.slug))

    const allArticles = [...fileArticles, ...configArticles]
    return sortArticlesByDate(allArticles)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading all articles:', error)
    }
    // Fallback apenas se for pt-BR
    return language === 'pt-BR' ? sortArticlesByDate(inMemoryArticles) : []
  }
}

/**
 * Busca um artigo pelo slug
 */
export async function getArticleBySlug(slug: string, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Promise<Article | undefined> {
  try {
    // Tenta carregar de arquivo primeiro
    const fileArticle = loadArticleBySlug(slug, language)
    if (fileArticle) return fileArticle

    // Fallback para artigos em memória (apenas se PT)
    if (language === 'pt-BR') {
       return inMemoryArticles.find(article => article.slug === slug)
    }
    return undefined
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error loading article by slug ${slug}:`, error)
    }
    if (language === 'pt-BR') {
       return inMemoryArticles.find(article => article.slug === slug)
    }
    return undefined
  }
}

/**
 * Busca artigos por categoria
 */
export async function getArticlesByCategory(categorySlug: string, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Promise<Article[]> {
  try {
    const allArticles = await getAllArticles(language)
    return allArticles
      .filter(article => article.category.slug === categorySlug)
      .sort((a, b) => {
        const timeA = a.publishedAt?.getTime() || 0
        const timeB = b.publishedAt?.getTime() || 0
        return timeB - timeA
      })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error loading articles by category ${categorySlug}:`, error)
    }
    return []
  }
}

/**
 * Retorna o artigo em destaque (mais recente)
 */
export async function getFeaturedArticle(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Promise<Article | undefined> {
  try {
    const allArticles = await getAllArticles(language)
    return allArticles[0]
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading featured article:', error)
    }
    return language === 'pt-BR' ? inMemoryArticles[0] : undefined
  }
}

/**
 * Retorna os artigos mais recentes
 */
export async function getRecentArticles(limit: number = 6, language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): Promise<Article[]> {
  try {
    const allArticles = await getAllArticles(language)
    return allArticles.slice(0, limit)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading recent articles:', error)
    }
    return language === 'pt-BR' ? sortArticlesByDate(inMemoryArticles).slice(0, limit) : []
  }
}

/**
 * Sanitiza o conteúdo HTML de um artigo
 */
export function sanitizeArticleContent(rawHtml: string): string {
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'video', 'h1', 'h2', 'h3', 'blockquote', 'div'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      a: ['href', 'target', 'rel'],
      div: ['class']
    },
    allowedClasses: {
      div: ['tip-box', 'alert-box', 'conclusion-box', 'article-image', 'comparison-box'],
    }
  })
}

// Exporta também para compatibilidade
export const sampleArticles = inMemoryArticles
