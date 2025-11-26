'use client'

import { useState } from 'react'

import { ArticleGrid } from '@/components/content'
import { ArticleFilters } from '@/components/content/ArticleFilters'
import { Text } from '@/components/ui'
import { Article } from '@/types'


interface ArticlesPageClientProps {
  articles: Article[]
}

export default function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles)

  const handleFilteredArticles = (filtered: Article[]) => {
    setFilteredArticles(filtered)
  }

  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  return (
    <>
      {/* Filters and Search */}
      <ArticleFilters
        articles={articles}
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
