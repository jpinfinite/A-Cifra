import { Article } from '@/types'

interface ArticleSchemaProps {
  article: Article
  url: string
}

export function ArticleSchema({ article, url }: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage?.src ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'}${article.coverImage.src}` : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Equipe A Cifra',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'}/autor/${article.author?.name?.toLowerCase().replace(/\s+/g, '-')}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'A Cifra',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: article.tags?.join(', '),
    articleSection: article.category?.name,
    inLanguage: 'pt-BR',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
