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
  tags
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
      name: author
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
      '@id': `https://a-cifra.com.br${url}`
    },
    articleSection: category,
    keywords: tags.join(', ')
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
