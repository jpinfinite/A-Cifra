import { Calendar, Clock, User } from 'lucide-react'
import { Heading, Text, Button, Image } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { Article, BreadcrumbItem } from '@/types'
import { cn } from '@/utils/cn'
import ArticleContent from '@/components/ArticleContent'
import { ShareButtons } from '@/components/article'
import RelatedArticlesInline from './RelatedArticlesInline'
// Anúncios agora são gerenciados dentro do ArticleContent

interface ArticleLayoutProps {
  article: Article
  breadcrumbs?: BreadcrumbItem[]
  relatedArticles?: Article[]
  className?: string
}

export function ArticleLayout({ article, breadcrumbs = [], relatedArticles = [], className }: ArticleLayoutProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    }).format(date)
  }

  const estimatedReadTime = Math.ceil(article.content.split(' ').length / 200)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''



  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage.src,
    author: {
      '@type': 'Person',
      name: article.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: 'A Cifra',
      logo: {
        '@type': 'ImageObject',
        url: '/images/cifra-principal.png'
      }
    },
    datePublished: article.publishedAt?.toISOString() || new Date().toISOString(),
    dateModified: article.updatedAt?.toISOString() || article.publishedAt?.toISOString() || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    },
    keywords: article.tags.join(', ')
  }

  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8">
        {/* Category Badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name}
          </span>
        </div>

        {/* Article Title */}
        <Heading level={1} className="mb-4 leading-tight">
          {article.title}
        </Heading>

        {/* Article Excerpt */}
        <Text size="lg" className="text-gray-600 mb-6 leading-relaxed">
          {article.excerpt}
        </Text>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Por {article.author.name}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt?.toISOString()}>
              {article.publishedAt && formatDate(article.publishedAt)}
            </time>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{estimatedReadTime} min de leitura</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-off-white text-brand-primary-blue"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="pb-6 border-b border-gray-200">
           <ShareButtons url={currentUrl} title={article.title} />
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      {/* Article Content with Related Links */}
      <ArticleContent content={article.content} relatedArticles={relatedArticles} />

      {/* Related Articles Inline - Aumenta pageviews e monetização */}
      {relatedArticles.length > 0 && (
        <RelatedArticlesInline
          articles={relatedArticles.slice(0, 3)}
          title="📚 Continue Aprendendo"
        />
      )}

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        {/* Author Info */}
        <div className="flex items-start space-x-4 mb-8">
          {article.author.avatar && (
            <div className="flex-shrink-0">
              <Image
                src={article.author.avatar}
                alt={`Foto de ${article.author.name}`}
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <Heading level={4} className="mb-2">
              {article.author.name}
            </Heading>
            <Text className="text-gray-600">
              Especialista em criptomoedas e blockchain, compartilhando conhecimento
              para ajudar você a navegar no mundo das finanças digitais.
            </Text>
          </div>
        </div>

        {/* Share Again */}
        <div className="flex items-center justify-between">
          <Text size="sm" className="text-gray-500">
            Última atualização: {formatDate(article.updatedAt || article.publishedAt)}
          </Text>

          <div className="flex items-center space-x-2">
            <Text size="sm" className="text-gray-700">Gostou? Compartilhe:</Text>
            <Button
              variant="ghost"
              size="sm"
              className="text-brand-primary-blue hover:text-brand-medium-blue"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 border-l-4 border-brand-gold text-sm text-gray-600 rounded-r-lg">
        <p className="font-bold text-gray-800 mb-1">Aviso Legal:</p>
        <p>
          O conteúdo deste artigo é apenas para fins informativos e educacionais. Não constitui consultoria financeira, de investimento ou jurídica. O mercado de criptomoedas é volátil e envolve riscos significativos. Sempre faça sua própria pesquisa (DYOR) e consulte um profissional financeiro antes de tomar decisões de investimento.
        </p>
      </div>
    </article>
  )
}
