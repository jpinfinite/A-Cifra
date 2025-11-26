/**
 * Breadcrumbs Component
 * Navegação breadcrumb com Schema.org markup para SEO
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Schema.org JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://a-cifra.com.br'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `https://a-cifra.com.br${item.href}`
      }))
    ]
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-2 text-sm text-gray-600', className)}
      >
        {/* Home */}
        <Link
          href="/"
          className="flex items-center hover:text-brand-primary-blue transition-colors"
          aria-label="Voltar para página inicial"
        >
          <Home className="h-4 w-4" />
        </Link>

        {/* Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={item.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {isLast ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-brand-primary-blue transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
