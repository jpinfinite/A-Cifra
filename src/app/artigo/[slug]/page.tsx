import { notFound } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { ArticleLayout } from '@/components/content'
import { Container, Breadcrumbs, ReadingTime } from '@/components/ui'
import { TableOfContents, ShareButtons, RelatedArticles } from '@/components/article'
import { NewsletterCTA } from '@/components/newsletter'
import { InArticleAd, SidebarAd } from '@/components/ads'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo'
import { getArticleBySlug, getAllArticles } from '@/data/articles'
import { generateArticleMetadata } from '@/utils/seo'
import { getRelatedArticles } from '@/utils/relatedArticles'
import { calculateReadingTime } from '@/utils/readingTime'
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://acifra.com'}/artigo/${params.slug}`,
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
    { name: 'Categorias', url: '/categorias' },
    { name: article.category.name, url: `/categoria/${article.category.slug}` },
    { name: article.title, url: `/artigo/${article.slug}` }
  ]

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://acifra.com'}/artigo/${article.slug}`
  const readingTime = calculateReadingTime(article.content || '')

  return (
    <MainLayout>
      {/* SEO Schema */}
      <ArticleSchema article={article} url={currentUrl} />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Container size="xl" className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
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

            {/* Article Content */}
            <ArticleLayout 
              article={article} 
              breadcrumbs={[]}
              relatedArticles={[]}
            />

            {/* Ad 1 - Após conteúdo inicial */}
            <InArticleAd slot="2401624018" />

            {/* Newsletter CTA */}
            <NewsletterCTA variant="inline" className="my-12" />

            {/* Ad 2 - Meio do artigo */}
            <InArticleAd slot="3416033223" />

            {/* Ad 3 - Antes dos artigos relacionados */}
            <InArticleAd slot="5028497790" />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} className="mt-12" />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Ad Sidebar - Topo */}
            <SidebarAd slot="4860266399" sticky={true} />

            {/* Newsletter Sidebar */}
            <NewsletterCTA variant="sidebar" />

            {/* Ad Sidebar - Meio */}
            <SidebarAd slot="5064156814" />
          </aside>
        </div>
      </Container>
    </MainLayout>
  )
}