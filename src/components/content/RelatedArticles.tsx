import Link from 'next/link'

import { Article } from '@/types'
import { ArticleCard } from './ArticleCard'
import { Heading } from '@/components/ui'

interface RelatedArticlesProps {
  currentArticle: Article
  allArticles: Article[]
  maxResults?: number
}

export function RelatedArticles({
  currentArticle,
  allArticles,
  maxResults = 3
}: RelatedArticlesProps) {

  // Algoritmo de similaridade
  function calculateSimilarity(article: Article): number {
    let score = 0

    // Mesma categoria = +50 pontos
    if (article.category.slug === currentArticle.category.slug) {
      score += 50
    }

    // Tags em comum = +10 pontos por tag
    const commonTags = article.tags.filter(tag =>
      currentArticle.tags.includes(tag)
    )
    score += commonTags.length * 10

    // Palavras-chave no título = +5 pontos por palavra
    const currentWords = currentArticle.title.toLowerCase().split(' ')
    const articleWords = article.title.toLowerCase().split(' ')
    const commonWords = currentWords.filter(word =>
      word.length > 3 && articleWords.includes(word)
    )
    score += commonWords.length * 5

    // Penalizar artigos muito antigos
    const daysDiff = Math.abs(
      new Date(currentArticle.publishedAt).getTime() -
      new Date(article.publishedAt).getTime()
    ) / (1000 * 60 * 60 * 24)

    if (daysDiff > 180) score -= 10
    if (daysDiff > 365) score -= 20

    return score
  }

  // Encontrar artigos relacionados
  const relatedArticles = allArticles
    .filter(article => article.id !== currentArticle.id)
    .map(article => ({
      article,
      score: calculateSimilarity(article)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.article)

  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <Heading level={2} className="mb-8 text-center">
        Artigos Relacionados
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>

      {/* CTA para ver mais */}
      <div className="text-center mt-8">
        <Link
          href={`/categoria/${currentArticle.category.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors font-medium"
        >
          Ver mais artigos de {currentArticle.category.name}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

