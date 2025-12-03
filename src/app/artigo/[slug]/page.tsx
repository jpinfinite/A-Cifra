import { notFound } from 'next/navigation'

import { MainLayout } from '@/components/layout'
import { ArticleLayout } from '@/components/content'
import { Container, Breadcrumbs, ReadingTime } from '@/components/ui'
import { TableOfContents, ShareButtons, RelatedArticles } from '@/components/article'
import { NewsletterCTA } from '@/components/newsletter'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo'
import { getArticleBySlug, getAllArticles } from '@/data/articles'
import { generateArticleMetadata } from '@/utils/seo'
import { getRelatedArticles } from '@/utils/relatedArticles'
import { calculateReadingTime } from '@/utils/readingTime'

// Anúncios agora são gerenciados dentro do ArticleContent
interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Artigo não encontrado'
    }
  }

  const metadata = generateArticleMetadata(article)

  // Adiciona robots e canonical para melhor indexação
  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'}/artigo/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const articles = await getAllArticles()

  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  // Busca artigos relacionados para aumentar engajamento e monetização
  const allArticles = await getAllArticles()
  const relatedArticles = getRelatedArticles(article, allArticles, 6)

  const breadcrumbItems = [
    { label: 'Categorias', href: '/categorias' },
    { label: article.category.name, href: `/categoria/${article.category.slug}` },
    { label: article.title, href: `/artigo/${article.slug}` }
  ]

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'}/artigo/${article.slug}`
  const readingTime = calculateReadingTime(article.content || '')

  return (
    <MainLayout>
      {/* SEO Schema */}
      <ArticleSchema
        title={article.title}
        description={article.excerpt}
        author={article.author.name}
        publishedAt={article.publishedAt?.toISOString() || new Date().toISOString()}
        updatedAt={(article.updatedAt || article.publishedAt)?.toISOString() || new Date().toISOString()}
        image={article.coverImage.src}
        url={currentUrl}
        category={article.category.name}
        tags={article.tags}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <Container size="xl" className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Language Toggle */}
        {'alternateLanguages' in article && article.alternateLanguages && 'en' in article.alternateLanguages && (
          <div className="mb-6">
            <LanguageToggle
              currentLang="pt-BR"
              alternateSlug={article.alternateLanguages.en as string}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {article.title}
              </h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <ReadingTime minutes={readingTime} />
                {article.publishedAt && (
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>

              <ShareButtons url={currentUrl} title={article.title} className="mb-6" />
            </header>

            {/* Table of Contents */}
            {article.content && (
              <TableOfContents content={article.content} className="mb-8" />
            )}

            {/* Article Content (com anúncios integrados) */}
            <ArticleLayout
              article={article}
              breadcrumbs={[]}
              relatedArticles={relatedArticles}
            />

            {/* Newsletter CTA */}
            <NewsletterCTA variant="inline" className="my-12" />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} className="mt-12" />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Newsletter Sidebar */}
            <NewsletterCTA variant="sidebar" />
          </aside>
        </div>
      </Container>
    </MainLayout>
  )
}
