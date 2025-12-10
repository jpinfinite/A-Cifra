export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: ImageData
  author: AuthorData
  publishedAt: Date
  updatedAt?: Date
  category: Category
  tags: string[]
  seo?: SEOData
  monetization?: MonetizationData
  language?: 'pt-BR' | 'en' | 'es'
  alternateLanguages?: {
    [key: string]: string
  }
  readingTime?: number
}

export interface ImageData {
  src: string
  alt: string
  width: number
  height: number
}

export interface AuthorData {
  name: string
  avatar?: string
  bio?: string
  social?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface MonetizationData {
  priority: 'high' | 'medium' | 'low'
  affiliateLinks: ('bitget' | 'binance' | 'coinbase')[]
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

// Tipos para estrutura de artigos
export interface ArticleStructureProps {
  frontmatter: {
    title: string
    excerpt: string
    coverImage: ImageData
    author: AuthorData
    publishedAt: string
  }
  content: string
  relatedArticles?: Article[]
}

// Tipos para monetização
export interface AffiliateConfig {
  bitget: {
    link: string
    bonus: string
    features: string[]
  }
  binance: {
    link: string
    bonus: string
    features: string[]
  }
  coinbase: {
    link: string
    bonus: string
    features: string[]
  }
}

// Tipos para validação
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface ArticleValidation {
  frontmatter: ValidationResult
  content: ValidationResult
  seo: ValidationResult
  monetization: ValidationResult
}

// Tipos para componentes
export interface InfoBoxProps {
  type: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: React.ReactNode
}

export interface ComparisonTableProps {
  headers: string[]
  rows: (string | number | React.ReactNode)[][]
  caption?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps {
  items: FAQItem[]
  title?: string
}

export interface DisclaimerBoxProps {
  type?: 'investment' | 'general' | 'risk'
  children?: React.ReactNode
}

export interface RelatedArticlesProps {
  articles: Article[]
  title?: string
  maxItems?: number
}

// Tipos para scripts utilitários
export interface NewArticleConfig {
  title: string
  category: string
  author: string
  tags: string[]
  monetizationPriority: 'high' | 'medium' | 'low'
}

export interface ImageOptimizationConfig {
  quality: number
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[]
  sizes: number[]
}

export interface DeployConfig {
  environment: 'development' | 'staging' | 'production'
  buildCommand: string
  outputDir: string
}
