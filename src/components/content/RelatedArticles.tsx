import Link from 'next/link'
import Image from 'next/image'
import { RelatedArticlesProps } from '@/types'

export function RelatedArticles({ 
  articles, 
  title = "Artigos Relacionados", 
  maxItems = 3 
}: RelatedArticlesProps) {
  const displayArticles = articles.slice(0, maxItems)

  if (displayArticles.length === 0) return null

  return (
    <div className="my-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🔗 {title}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={`/artigo/${article.slug}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={article.coverImage.src}
                alt={article.coverImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-2 py-1 bg-brand-primary-blue text-white text-xs font-semibold rounded">
                  {article.category.name}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-primary-blue transition-colors">
                {article.title}
              </h4>
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.author.name}</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}