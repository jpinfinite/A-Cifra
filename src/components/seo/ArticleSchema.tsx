/**
 * Article Schema Component
 * Adiciona JSON-LD para artigos melhorando SEO
 */

interface ArticleSchemaProps {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt: string
  image: string
  url: string
  category: string
  tags: string[]
  wordCount?: number
  language?: string
}

export function ArticleSchema({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  image,
  url,
  category,
  tags,
  wordCount,
  language = 'pt-BR'
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: `https://a-cifra.com.br${image}`,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://a-cifra.com.br'
    },
    publisher: {
      '@type': 'Organization',
      name: 'A Cifra',
      url: 'https://a-cifra.com.br',
      logo: {
        '@type': 'ImageObject',
        url: 'https://a-cifra.com.br/images/logos/favcoin.png',
        width: 600,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    articleSection: category,
    keywords: tags.join(', '),
    inLanguage: language,
    ...(wordCount && { wordCount })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
