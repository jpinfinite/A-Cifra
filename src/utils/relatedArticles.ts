import { Article } from '@/types'

/**
 * Encontra artigos relacionados baseado em tags e categoria
 */
export function getRelatedArticles(
  currentArticle: Article,
  allArticles: Article[],
  limit: number = 3
): Article[] {
  // Remove o artigo atual
  const otherArticles = allArticles.filter(a => a.id !== currentArticle.id)

  // Calcula score de relevância para cada artigo
  const scoredArticles = otherArticles.map(article => {
    let score = 0

    // Mesma categoria = +10 pontos
    if (article.category.slug === currentArticle.category.slug) {
      score += 10
    }

    // Tags em comum = +5 pontos por tag
    const commonTags = article.tags.filter(tag => 
      currentArticle.tags.includes(tag)
    )
    score += commonTags.length * 5

    // Artigos mais recentes = +1 ponto
    const daysDiff = Math.abs(
      article.publishedAt.getTime() - currentArticle.publishedAt.getTime()
    ) / (1000 * 60 * 60 * 24)
    if (daysDiff < 30) score += 1

    return { article, score }
  })

  // Ordena por score e retorna os top N
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article)
}

/**
 * Injeta links de artigos relacionados no conteúdo markdown
 */
export function injectRelatedLinksInContent(
  content: string,
  relatedArticles: Article[]
): string {
  if (!relatedArticles || relatedArticles.length === 0) return content

  // Divide o conteúdo em seções (por ##)
  const sections = content.split(/(?=^## )/m)
  
  // Se tiver menos de 3 seções, não injeta
  if (sections.length < 3) return content

  // Calcula posições para injetar (após 1/3 e 2/3 do conteúdo)
  const firstInjectionPoint = Math.floor(sections.length / 3)
  const secondInjectionPoint = Math.floor((sections.length * 2) / 3)

  // Prepara os blocos de artigos relacionados
  const firstBlock = createRelatedArticlesBlock(relatedArticles.slice(0, 2), "📚 Artigos Relacionados")
  const secondBlock = createRelatedArticlesBlock(relatedArticles.slice(1, 3), "💡 Continue Lendo")

  // Injeta os blocos
  sections.splice(firstInjectionPoint, 0, firstBlock)
  sections.splice(secondInjectionPoint + 1, 0, secondBlock)

  return sections.join('\n')
}

/**
 * Cria um bloco markdown com artigos relacionados
 */
function createRelatedArticlesBlock(articles: Article[], title: string): string {
  if (!articles || articles.length === 0) return ''

  const links = articles.map(article => 
    `- [${article.title}](/artigo/${article.slug})`
  ).join('\n')

  return `
<div class="cifra-related-box">
<strong>${title}</strong>

${links}
</div>
`
}

/**
 * Encontra palavras-chave no conteúdo e adiciona links inline
 */
export function addInlineLinks(
  content: string,
  relatedArticles: Article[]
): string {
  if (!relatedArticles || relatedArticles.length === 0) return content

  let modifiedContent = content

  // Para cada artigo relacionado, tenta adicionar um link inline
  relatedArticles.forEach(article => {
    // Extrai palavras-chave do título
    const keywords = extractKeywords(article.title)
    
    // Tenta encontrar a primeira ocorrência de cada palavra-chave
    for (const keyword of keywords) {
      // Regex para encontrar a palavra-chave (case insensitive, não dentro de links)
      const regex = new RegExp(
        `(?<!\\[)\\b(${keyword})\\b(?![^\\[]*\\])(?![^<]*>)`,
        'i'
      )
      
      const match = modifiedContent.match(regex)
      if (match) {
        // Substitui apenas a primeira ocorrência
        modifiedContent = modifiedContent.replace(
          regex,
          `[$1](/artigo/${article.slug} "${article.title}")`
        )
        break // Apenas um link por artigo
      }
    }
  })

  return modifiedContent
}

/**
 * Extrai palavras-chave relevantes de um título
 */
function extractKeywords(title: string): string[] {
  // Remove palavras comuns (stop words)
  const stopWords = ['o', 'a', 'de', 'da', 'do', 'em', 'para', 'com', 'e', 'ou', 'como', 'que', 'um', 'uma']
  
  return title
    .toLowerCase()
    .split(/[\s\-:]+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 3) // Pega as 3 primeiras palavras relevantes
}
