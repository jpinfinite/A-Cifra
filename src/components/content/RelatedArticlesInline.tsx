'use client'

import Link from 'next/link'
import { Article } from '@/types'
import { ArrowRight } from 'lucide-react'

interface RelatedArticlesInlineProps {
  articles: Article[]
  title?: string
}

export default function RelatedArticlesInline({ 
  articles, 
  title = "📚 Leia também" 
}: RelatedArticlesInlineProps) {
  if (!articles || articles.length === 0) return null

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-brand-primary-blue shadow-sm">
      <h3 className="text-xl font-bold text-brand-dark-blue mb-4 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/artigo/${article.slug}`}
            className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-all duration-200 hover:shadow-md"
          >
            <ArrowRight className="w-5 h-5 text-brand-primary-blue mt-1 group-hover:translate-x-1 transition-transform" />
            <div className="flex-1">
              <h4 className="font-semibold text-brand-dark-blue group-hover:text-brand-primary-blue transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
