'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://a-cifra.com.br'

  // Schema.org structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': item.name,
        'item': `${baseUrl}${item.url}`
      }))
    ]
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visual Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          aria-label="Voltar para home"
        >
          <Home className="w-4 h-4" />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={item.url} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {isLast ? (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
