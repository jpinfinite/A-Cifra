import { notFound } from 'next/navigation'

import { MainLayout } from '@/components/layout'
import { ArticleLayout } from '@/components/content'
import { Container } from '@/components/ui'
import { RelatedArticles, Comments } from '@/components/article'
import { CryptoWidget } from '@/components/crypto/CryptoWidget'
import { NewsletterCTA } from '@/components/newsletter'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo'
import { getArticleBySlug, getAllArticles } from '@/data/articles'
import { generateArticleMetadata } from '@/utils/seo'
import { getRelatedArticles } from '@/utils/relatedArticles'

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
  const relatedArticles = getRelatedArticles(article, allArticles, 6).map(a => ({
    ...a,
    content: '' // Otimização: remove conteúdo markdown para reduzir tamanho do HTML
  }))

  const breadcrumbItems = [
    { label: 'Categorias', href: '/categorias' },
    { label: article.category.name, href: `/categoria/${article.category.slug}` },
    { label: article.title, href: `/artigo/${article.slug}` }
  ]

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'}/artigo/${article.slug}`


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

      {/* FAQ Schema */}
      {article.faq && article.faq.length > 0 && (
        <FAQSchema faqs={article.faq} />
      )}

      <Container size="xl" className="py-8">
        {/* Language Toggle */}
        <div className="mb-6">
          <LanguageToggle
            currentLang="pt-BR"
            alternateSlugEn={article.alternateLanguages?.en}
            alternateSlugEs={article.alternateLanguages?.es}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Article Content (com anúncios integrados) */}
            <ArticleLayout
              article={article}
              breadcrumbs={breadcrumbItems}
              relatedArticles={relatedArticles}
              url={currentUrl}
            />

            {/* Newsletter CTA */}
            <NewsletterCTA variant="inline" className="my-12" />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} className="mt-12" />

            {/* Comments Section */}
            <Comments />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Anúncio Superior Sidebar Artigo */}
            <div className="sticky top-24 space-y-8">
              <CryptoWidget />
              <SidebarAd
                slot="4860266399"
                sticky={false}
                className="min-h-[600px]"
              />

              {/* Newsletter Sidebar */}
              <NewsletterCTA variant="sidebar" />


            </div>
          </aside>
        </div>
      </Container>
    </MainLayout>
  )
}
