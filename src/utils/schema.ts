/**
 * Schema Markup Utilities
 * Gera structured data para SEO
 */

import type { Article } from '@/types'

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Gera Schema Markup para FAQ
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Gera Schema Markup para Artigo
 */
export function generateArticleSchema(article: Article, content: string) {
  const publishDate = article.publishedAt instanceof Date
    ? article.publishedAt.toISOString()
    : new Date(article.publishedAt).toISOString()

  const modifiedDate = article.updatedAt
    ? (article.updatedAt instanceof Date
        ? article.updatedAt.toISOString()
        : new Date(article.updatedAt).toISOString())
    : publishDate

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage?.src ? `https://a-cifra.com.br${article.coverImage.src}` : undefined,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: 'https://a-cifra.com.br'
    },
    publisher: {
      '@type': 'Organization',
      name: 'A Cifra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://a-cifra.com.br/images/logos/favcoin.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://a-cifra.com.br/artigo/${article.slug}`
    },
    articleSection: article.category.name,
    keywords: article.tags?.join(', '),
    wordCount: content.split(/\s+/).length,
    inLanguage: 'pt-BR'
  }
}

/**
 * Gera Schema Markup para Breadcrumb
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://a-cifra.com.br${item.url}`
    }))
  }
}

/**
 * Gera Schema Markup para Website
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'A Cifra',
    alternateName: 'ACifra',
    url: 'https://a-cifra.com.br',
    description: 'Seu guia completo sobre criptomoedas, Bitcoin, Ethereum, DeFi e NFTs',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://a-cifra.com.br/artigos?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'A Cifra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://a-cifra.com.br/images/logos/favcoin.png'
      }
    }
  }
}

/**
 * Gera Schema Markup para Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A Cifra',
    url: 'https://a-cifra.com.br',
    logo: 'https://a-cifra.com.br/images/logos/favcoin.png',
    description: 'Portal de notícias, análises e educação sobre criptomoedas',
    sameAs: [
      'https://twitter.com/acifra',
      'https://facebook.com/acifra',
      'https://instagram.com/acifra'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contato@a-cifra.com.br',
      contactType: 'Customer Service',
      availableLanguage: 'Portuguese'
    }
  }
}
