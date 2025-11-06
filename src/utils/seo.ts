import type { Metadata } from 'next'
import { Article, Category } from '@/types'
import { siteConfig } from '@/lib/config'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noIndex = false
}: SEOProps): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description
  const metaImage = image || `${siteConfig.url}/images/og-default.png`
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: [...keywords, 'criptomoedas', 'bitcoin', 'blockchain', 'investimentos'],
    authors: author ? [{ name: author }] : [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      type: type,
      locale: 'pt_BR',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@acifra',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    }
  }

  return metadata
}

export function generateArticleMetadata(article: Article): Metadata {
  return generateMetadata({
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt,
    keywords: article.seo?.keywords,
    image: article.coverImage.src,
    url: `/artigo/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt.toISOString(),
    modifiedTime: article.updatedAt?.toISOString(),
    author: article.author.name,
    section: article.category.name,
    tags: article.tags,
    noIndex: article.seo?.noIndex
  })
}

export function generateCategoryMetadata(category: Category): Metadata {
  return generateMetadata({
    title: `${category.name} - Artigos sobre ${category.name}`,
    description: category.description,
    keywords: [category.name.toLowerCase(), 'artigos', 'análises'],
    url: `/categoria/${category.slug}`,
    type: 'website'
  })
}

export function generatePageMetadata(
  title: string,
  description: string,
  url: string,
  keywords: string[] = []
): Metadata {
  return generateMetadata({
    title,
    description,
    keywords,
    url,
    type: 'website'
  })
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(article: Article, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: {
      '@type': 'ImageObject',
      url: article.coverImage.src,
      width: article.coverImage.width,
      height: article.coverImage.height,
      alt: article.coverImage.alt
    },
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.avatar
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.logo.src,
        alt: siteConfig.logo.alt
      }
    },
    datePublished: article.publishedAt.toISOString(),
    dateModified: (article.updatedAt || article.publishedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    keywords: article.tags.join(', '),
    articleSection: article.category.name,
    wordCount: article.content.split(' ').length,
    inLanguage: 'pt-BR'
  }
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/busca?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.logo.src,
        alt: siteConfig.logo.alt
      },
      sameAs: Object.values(siteConfig.social).filter(Boolean)
    }
  }
}