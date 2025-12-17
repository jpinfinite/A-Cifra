import { Article } from '@/types'

interface ArticleSchemaProps {
  article: Article
}

export function ArticleSchema({ article }: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage?.src ? `https://a-cifra.com.br${article.coverImage.src}` : undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString() || article.publishedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: 'https://a-cifra.com.br/sobre'
    },
    publisher: {
      '@type': 'Organization',
      name: 'A Cifra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://a-cifra.com.br/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://a-cifra.com.br/artigo/${article.slug}`
    },
    articleSection: article.category.name,
    keywords: article.tags.join(', '),
    wordCount: article.content.split(' ').length,
    inLanguage: article.language || 'pt-BR'
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A Cifra',
    url: 'https://a-cifra.com.br',
    logo: 'https://a-cifra.com.br/logo.png',
    sameAs: [
      'https://twitter.com/acifra_btc',
      'https://facebook.com/acifra',
      'https://instagram.com/acifra'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contato@a-cifra.com.br'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'A Cifra',
    url: 'https://a-cifra.com.br',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://a-cifra.com.br/busca?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
