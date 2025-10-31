import { notFound } from 'next/navigation'
import { MainLayout, Breadcrumb } from '@/components/layout'
import { ArticleGrid } from '@/components/content'
import { Container, Heading, Text, CategoryIcon } from '@/components/ui'
import { getArticlesByCategory } from '@/data/articles'
import { categories } from '@/lib/config'
import { generateCategoryMetadata } from '@/utils/seo'
import { BreadcrumbItem } from '@/types'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = categories.find(c => c.slug === params.slug)
  
  if (!category) {
    return {
      title: 'Categoria não encontrada'
    }
  }
  
  return generateCategoryMetadata(category)
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(c => c.slug === params.slug)
  
  if (!category) {
    notFound()
  }
  
  const articles = await getArticlesByCategory(category.slug)
  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Categorias', href: '/categorias' },
    { label: category.name, href: `/categoria/${category.slug}`, current: true }
  ]

  return (
    <MainLayout>
      <Container className="py-8">
        <Breadcrumb items={breadcrumbs} className="mb-8" />
        
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4">
            <CategoryIcon category={category.slug} className="w-16 h-16 mx-auto" />
          </div>
          
          <Heading level={1} className="mb-4">
            {category.name}
          </Heading>
          
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto mb-6">
            {category.description}
          </Text>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>{articles.length} artigos</span>
            <span>•</span>
            <span>Atualizado regularmente</span>
          </div>
        </div>

        {/* Articles */}
        {articles.length > 0 ? (
          <ArticleGrid 
            articles={otherArticles}
            featuredArticle={featuredArticle}
          />
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3v6m0 0l-3-3m3 3l3-3"
                  />
                </svg>
              </div>
              <Heading level={3} className="mb-2">
                Em breve, novos artigos
              </Heading>
              <Text className="text-gray-500 mb-6">
                Estamos preparando conteúdo exclusivo sobre {category.name.toLowerCase()}. 
                Volte em breve para conferir!
              </Text>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary-blue text-white font-semibold rounded-lg hover:bg-brand-medium-blue transition-colors duration-200"
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        )}
      </Container>
    </MainLayout>
  )
}

