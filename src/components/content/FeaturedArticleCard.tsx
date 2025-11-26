import Link from 'next/link'
import Image from 'next/image'

import { Calendar, Clock, User, Tag } from 'lucide-react'

import { Card, CardContent, Text, Heading } from '@/components/ui'
import { Article } from '@/types'
import { cn } from '@/utils/cn'
import { generateImageSizes } from '@/utils/image'
import { findBestImage } from '@/utils/imageMapper'


interface FeaturedArticleCardProps {
  article: Article
  className?: string
}

export function FeaturedArticleCard({ article, className }: FeaturedArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const estimatedReadTime = Math.ceil(article.content.split(' ').length / 200)
  
  // Obter imagem otimizada baseada na categoria (featured sempre tem imagem)
  const imageData = article.coverImage?.src 
    ? article.coverImage 
    : findBestImage(article.category.slug, article.tags)
  
  const imageSrc = imageData?.src || '/images/general/placeholder.svg'
  const imageAlt = imageData?.alt || article.title

  return (
    <Card
      hover
      className={cn(
        'group overflow-hidden bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue text-white',
        className
      )}
    >
      <Link
        href={`/artigo/${article.slug}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded-xl"
        aria-label={`Ler artigo: ${article.title}`}
      >
        <div className="flex flex-col lg:flex-row min-h-[300px]">
          {/* Article Content */}
          <CardContent className="flex-1 p-8 flex flex-col justify-center">
            {/* Category Badge */}
            <div className="mb-4">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: article.category.color,
                  color: 'white'
                }}
              >
                {article.category.name}
              </span>
            </div>

            {/* Article Title */}
            <Heading
              level={1}
              className="text-2xl lg:text-3xl xl:text-4xl mb-4 text-white group-hover:text-brand-gold transition-colors duration-200 line-clamp-3"
            >
              {article.title}
            </Heading>

            {/* Article Excerpt */}
            <Text
              className="text-lg mb-6 text-gray-300 line-clamp-3 leading-relaxed"
            >
              {article.excerpt}
            </Text>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 backdrop-blur-sm"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {article.tags.length > 4 && (
                  <span className="text-xs text-white/70">
                    +{article.tags.length - 4} mais
                  </span>
                )}
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div className="flex items-center space-x-4">
                {/* Author */}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{article.author.name}</span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{estimatedReadTime} min</span>
                </div>
              </div>

              {/* Publication Date */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt.toISOString()}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
            </div>
          </CardContent>

          {/* Article Image */}
          <div className="lg:w-1/2 xl:w-2/5 relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-600">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              sizes={generateImageSizes({
                mobile: '100vw',
                tablet: '100vw',
                desktop: '50vw'
              })}
              priority
              quality={90}
            />
            
            {/* Overlay gradient for better text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/60 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </Link>
    </Card>
  )
}