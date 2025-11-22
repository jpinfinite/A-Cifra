import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ${className}`}
    >
      <Link 
        href="/" 
        className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
        aria-label="Página inicial"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <div key={item.url} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
