'use client'

import { useState, useMemo } from 'react'

import { Search, X, Filter } from 'lucide-react'

import { Article } from '@/types'
import { categories } from '@/lib/config'


interface ArticleFiltersProps {
  articles: Article[]
  onFilteredArticles: (filtered: Article[]) => void
}

export function ArticleFilters({ articles, onFilteredArticles }: ArticleFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique years from articles
  const availableYears = useMemo(() => {
    const years = articles
      .filter(article => article.publishedAt) // Filtra artigos sem data
      .map(article => {
        const date = article.publishedAt instanceof Date
          ? article.publishedAt
          : new Date(article.publishedAt as any)
        return date.getFullYear()
      })
    return Array.from(new Set(years)).sort((a, b) => b - a)
  }, [articles])

  // Filter articles based on search and filters
  const filteredArticles = useMemo(() => {
    let filtered = articles

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(term) ||
        article.excerpt?.toLowerCase().includes(term) ||
        article.tags?.some(tag => tag?.toLowerCase().includes(term))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.category.slug === selectedCategory
      )
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(article => {
        if (!article.publishedAt) return false
        const date = article.publishedAt instanceof Date
          ? article.publishedAt
          : new Date(article.publishedAt as any)
        return date.getFullYear().toString() === selectedYear
      })
    }

    return filtered
  }, [articles, searchTerm, selectedCategory, selectedYear])

  // Update parent component when filters change
  useMemo(() => {
    onFilteredArticles(filteredArticles)
  }, [filteredArticles, onFilteredArticles])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedYear('all')
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedYear !== 'all'

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="search"
            placeholder="Buscar por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent outline-none"
            aria-label="Buscar artigos por título, conteúdo ou tags"
            role="searchbox"
            aria-describedby="search-description"
          />
          <span id="search-description" className="sr-only">
            Digite para buscar artigos em tempo real
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpar busca"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
          aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          aria-expanded={showFilters}
          aria-controls="filters-panel"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-brand-primary-blue text-white text-xs rounded-full">
              {[searchTerm, selectedCategory !== 'all', selectedYear !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'}
          {hasActiveFilters && ` encontrado${filteredArticles.length === 1 ? '' : 's'}`}
        </div>
      </div>

      {/* Filters */}
      <div
        id="filters-panel"
        className={`${showFilters ? 'block' : 'hidden'} lg:block`}
        role="region"
        aria-label="Painel de filtros de artigos"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent outline-none"
              aria-label="Filtrar artigos por categoria"
            >
              <option value="all">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent outline-none"
              aria-label="Filtrar artigos por ano de publicação"
            >
              <option value="all">Todos os anos</option>
              {availableYears.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Limpar todos os filtros ativos"
            >
              <X className="h-4 w-4" />
              <span>Limpar filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div
          className="flex flex-wrap gap-2 mt-4"
          role="status"
          aria-live="polite"
          aria-label="Filtros ativos"
        >
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary-blue text-white text-sm rounded-full">
              Busca: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="hover:bg-brand-medium-blue rounded-full p-0.5"
                aria-label={`Remover filtro de busca: ${searchTerm}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary-blue text-white text-sm rounded-full">
              {categories.find(c => c.slug === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory('all')}
                className="hover:bg-brand-medium-blue rounded-full p-0.5"
                aria-label={`Remover filtro de categoria: ${categories.find(c => c.slug === selectedCategory)?.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedYear !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary-blue text-white text-sm rounded-full">
              Ano: {selectedYear}
              <button
                onClick={() => setSelectedYear('all')}
                className="hover:bg-brand-medium-blue rounded-full p-0.5"
                aria-label={`Remover filtro de ano: ${selectedYear}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
