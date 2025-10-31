export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  author: {
    name: string
    avatar?: string
  }
  publishedAt: Date
  updatedAt?: Date
  category: Category
  tags: string[]
  seo: SEOData
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon?: string
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  logo: {
    src: string
    alt: string
  }
  social: {
    twitter?: string
    facebook?: string
    instagram?: string
    whatsapp?: string
  }
  analytics: {
    googleAnalyticsId?: string
  }
}

export interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

export interface NavigationItem {
  label: string
  href: string
  current?: boolean
  children?: NavigationItem[]
}

export interface Author {
  id: string
  name: string
  bio?: string
  avatar?: string
  social?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

export interface SEOData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
}

export interface ArticleFilters {
  category?: string
  tags?: string[]
  author?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Alias para BlogPost (compatibilidade com nova nomenclatura)
export type BlogPost = Article

// Tipos para componentes de conteúdo
export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}