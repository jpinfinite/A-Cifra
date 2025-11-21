import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utils/cn'
import { BreadcrumbItem } from '@/types'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items.length) return null

  // Generate breadcrumb schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-1 text-sm', className)}
      >
        <ol className="flex items-center space-x-1">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-brand-primary-blue transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-blue focus-visible:ring-offset-2 rounded p-1"
            aria-label="Página inicial"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" aria-hidden="true" />
              
              {isLast ? (
                <span
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-brand-primary-blue transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-blue focus-visible:ring-offset-2 rounded px-1 py-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
    </>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Category mapping for better labels
  const categoryLabels: Record<string, string> = {
    'bitcoin': 'Bitcoin',
    'altcoins': 'Altcoins',
    'defi': 'DeFi',
    'nfts': 'NFTs',
    'analises': 'Análises',
    'educacao': 'Educação',
    'categoria': 'Categorias',
    'artigo': 'Artigos',
    'sobre': 'Sobre',
    'contato': 'Contato',
    'privacidade': 'Política de Privacidade',
    'termos': 'Termos de Uso'
  }

  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Skip 'categoria' segment in breadcrumb display but keep in path
    if (segment === 'categoria') {
      return
    }

    const label = categoryLabels[segment] || 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    breadcrumbs.push({
      label,
      href: currentPath,
      current: index === segments.length - 1
    })
  })

  return breadcrumbs
}