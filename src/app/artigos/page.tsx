import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { getAllArticles } from '@/data/articles'
import { generatePageMetadata } from '@/utils/seo'
import ArticlesPageClient from './ArticlesPageClient'

export const metadata = generatePageMetadata(
  'Todos os Artigos',
  'Explore todos os nossos artigos sobre criptomoedas, blockchain, DeFi, NFTs e análises de mercado.',
  '/artigos',
  ['artigos', 'criptomoedas', 'blog', 'análises', 'educação']
)

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  // Serializar datas para passar para client component
  const serializedArticles = articles.map(article => ({
    ...article,
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    updatedAt: article.updatedAt?.toISOString()
  }))

  return (
    <MainLayout>
      <Container className="py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Heading level={1} className="mb-4">
            Todos os Artigos
          </Heading>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto mb-6">
            Explore nossa coleção completa de artigos sobre criptomoedas,
            blockchain e o futuro das finanças digitais.
          </Text>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>{articles.length} artigos publicados</span>
            <span>•</span>
            <span>Conteúdo atualizado diariamente</span>
          </div>
        </div>

        {/* Client-side filtering and display */}
        <ArticlesPageClient articles={serializedArticles as any} />
      </Container>
    </MainLayout>
  )
}
