import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import { Clock, TrendingUp } from 'lucide-react'

interface RelatedArticlesProps {
  articles: Article[]
  title?: string
  className?: string
}

export function RelatedArticles({ 
  articles, 
  title = '📚 Leia Também',
  className = '' 
}: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className={`${className}`}>
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/artigo/${article.slug}`}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            {article.coverImage?.src && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.coverImage.src}
                  alt={article.coverImage.alt || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.category && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                    {article.category.name}
                  </span>
                )}
              </div>
            )}

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>5 min</span>
                </div>
                {article.publishedAt && (
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
