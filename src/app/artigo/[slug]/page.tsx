import { notFound } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { ArticleLayout } from '@/components/content'
import { Container } from '@/components/ui'
import { getArticleBySlug, getAllArticles } from '@/data/articles'
import { generateArticleMetadata, generateArticleStructuredData } from '@/utils/seo'
import { getRelatedArticles } from '@/utils/relatedArticles'
import { BreadcrumbItem } from '@/types'

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
  
  return generateArticleMetadata(article)
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
  const relatedArticles = getRelatedArticles(article, allArticles, 5)
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Categorias', href: '/categorias' },
    { label: article.category.name, href: `/categoria/${article.category.slug}` },
    { label: article.title, href: `/artigo/${article.slug}`, current: true }
  ]

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://acifra.com'}/artigo/${article.slug}`
  const structuredData = generateArticleStructuredData(article, currentUrl)

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Container size="md" className="py-8">
        <ArticleLayout 
          article={article} 
          breadcrumbs={breadcrumbs}
          relatedArticles={relatedArticles}
        />
      </Container>
    </MainLayout>
  )
}