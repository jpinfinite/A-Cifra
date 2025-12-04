'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Article } from '@/types'

interface SearchBarProps {
  articles: Article[]
}

export function SearchBar({ articles }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Configurar Fuse.js para busca fuzzy
  const fuse = new Fuse(articles, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'excerpt', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'category.name', weight: 0.1 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  })

  // Buscar quando query mudar
  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = fuse.search(query)
      setResults(searchResults.map(result => result.item).slice(0, 5))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Input de Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="search"
          placeholder="Buscar artigos sobre Bitcoin, DeFi, NFTs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-blue focus:border-transparent outline-none bg-white shadow-sm"
          aria-label="Buscar artigos"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Limpar busca"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((article) => (
              <Link
                key={article.id}
                href={`/artigo/${article.slug}`}
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Categoria Badge */}
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-brand-primary-blue text-white shrink-0">
                    {article.category.name}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{article.author.name}</span>
                      <span>•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Ver todos resultados */}
          <div className="border-t border-gray-200 p-3">
            <Link
              href={`/artigos?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="text-sm text-brand-primary-blue hover:text-brand-medium-blue font-medium flex items-center justify-center gap-2"
            >
              Ver todos os resultados
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Sem resultados */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Nenhum resultado encontrado</p>
          <p className="text-sm text-gray-500 mt-1">
            Tente usar outras palavras-chave
          </p>
        </div>
      )}
    </div>
  )
}
