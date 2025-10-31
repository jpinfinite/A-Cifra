import { Article } from '@/types'
import { ArticleCard } from './ArticleCard'
import { cn } from '@/utils/cn'

interface ArticleGridProps {
  articles: Article[]
  featuredArticle?: Article
  className?: string
}

export function ArticleGrid({ articles, featuredArticle, className }: ArticleGridProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Featured Article */}
      {featuredArticle && (
        <section aria-labelledby="featured-article">
          <h2 id="featured-article" className="sr-only">
            Artigo em destaque
          </h2>
          <ArticleCard article={featuredArticle} featured className="mb-8" />
        </section>
      )}

      {/* Articles Grid */}
      {articles.length > 0 && (
        <section aria-labelledby="recent-articles">
          <h2 id="recent-articles" className="sr-only">
            Artigos recentes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {articles.length === 0 && !featuredArticle && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3v6m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum artigo encontrado
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Não há artigos disponíveis no momento. Volte em breve para ver novos conteúdos.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}