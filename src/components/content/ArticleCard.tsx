import Link from 'next/link'

import { Calendar, Clock, User, Tag } from 'lucide-react'

import { Card, CardContent, Text, Heading } from '@/components/ui'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { Article } from '@/types'
import { cn } from '@/utils/cn'
import { findBestImage } from '@/utils/imageMapper'


interface ArticleCardProps {
  article: Article
  featured?: boolean
  className?: string
}

export function ArticleCard({ article, featured = false, className }: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const estimatedReadTime = Math.ceil(article.content.split(' ').length / 200)

  // Obter imagem otimizada baseada na categoria
  const imageData = article.coverImage?.src
    ? article.coverImage
    : findBestImage(article.category.slug, article.tags)

  const imageSrc = imageData?.src || '/images/general/placeholder.svg'
  const imageAlt = imageData?.alt || article.title

  return (
    <Card
      hover
      className={cn(
        'group overflow-hidden',
        featured ? 'md:flex md:flex-row' : 'flex flex-col',
        className
      )}
    >
      <Link
        href={`/artigo/${article.slug}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-blue focus-visible:ring-offset-2 rounded-xl"
        aria-label={`Ler artigo: ${article.title}`}
      >
        {/* Article Image */}
        <div
          className={cn(
            'relative overflow-hidden',
            featured
              ? 'md:w-1/2 md:flex-shrink-0 h-48 md:h-auto'
              : 'w-full'
          )}
        >
          <ResponsiveImage
            src={imageSrc}
            alt={imageAlt}
            aspectRatio="video"
            sizes={featured
              ? '(max-width: 768px) 100vw, 50vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 662px, 662px'
            }
            className="transition-transform duration-500 group-hover:scale-110"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white shadow-sm"
              style={{
                backgroundColor: article.category.color,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' // Melhora contraste
              }}
              aria-label={`Categoria: ${article.category.name}`}
            >
              {article.category.name}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <CardContent
          className={cn(
            'flex flex-col justify-between',
            featured ? 'md:w-1/2 p-6' : 'p-4'
          )}
        >
          <div className="flex-1">
            {/* Article Title */}
            <Heading
              level={featured ? 2 : 3}
              className={cn(
                'group-hover:text-brand-primary-blue transition-colors duration-200 line-clamp-2',
                featured ? 'text-xl md:text-2xl mb-3' : 'text-lg mb-2'
              )}
            >
              {article.title}
            </Heading>

            {/* Article Excerpt */}
            <Text
              className={cn(
                'text-gray-600 line-clamp-3',
                featured ? 'text-base mb-4' : 'text-sm mb-3'
              )}
            >
              {article.excerpt}
            </Text>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-brand-off-white text-brand-primary-blue"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{article.tags.length - 3} mais
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              {/* Author */}
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author.name}</span>
              </div>

              {/* Reading Time */}
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{estimatedReadTime} min</span>
              </div>
            </div>

            {/* Publication Date */}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedAt?.toISOString()}>
                {article.publishedAt && formatDate(article.publishedAt)}
              </time>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
