'use client'

import { useState, useMemo, useCallback } from 'react'

import { ArticleGrid } from '@/components/content'
import { ArticleFilters } from '@/components/content/ArticleFilters'
import { Text } from '@/components/ui'
import { Article } from '@/types'


interface ArticlesPageClientProps {
  articles: Article[]
}

export default function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  // Converter strings de data de volta para Date objects
  const articlesWithDates = useMemo(() => articles.map(article => ({
    ...article,
    publishedAt: new Date(article.publishedAt as string | Date),
    updatedAt: article.updatedAt ? new Date(article.updatedAt as string | Date) : undefined
  })), [articles])

  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articlesWithDates)

  const handleFilteredArticles = useCallback((filtered: Article[]) => {
    setFilteredArticles(filtered)
  }, [])

  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  return (
    <>
      {/* Filters and Search */}
      <ArticleFilters
        articles={articlesWithDates}
        onFilteredArticles={handleFilteredArticles}
      />

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <ArticleGrid
          articles={otherArticles}
          featuredArticle={featuredArticle}
        />
      ) : (
        <div className="text-center py-12">
          <Text size="lg" className="text-gray-600 mb-4">
            Nenhum artigo encontrado com os filtros selecionados.
          </Text>
          <Text className="text-gray-500">
            Tente ajustar os filtros ou limpar a busca.
          </Text>
        </div>
      )}

      {/* Results Summary */}
      {filteredArticles.length > 0 && (
        <div className="text-center mt-12">
          <Text className="text-gray-500">
            Mostrando {filteredArticles.length} de {articles.length} artigos
          </Text>
        </div>
      )}
    </>
  )
}
