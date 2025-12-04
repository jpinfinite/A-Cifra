import { MainLayout } from '@/components/layout'
import { getFeaturedArticle, getRecentArticles } from '@/data/articles'
import { generateMetadata } from '@/utils/seo'
import type { Article } from '@/types'
import { HomePageClient } from '@/components/HomePageClient'

export const metadata = generateMetadata({
  title: 'A Cifra - Seu guia completo sobre criptomoedas | Análises & Educação Crypto',
  description: 'Descubra análises profundas, notícias atualizadas e educação de qualidade sobre Bitcoin, Ethereum, DeFi, NFTs e o futuro das finanças digitais. Conteúdo especializado para investidores e entusiastas.',
  keywords: ['criptomoedas', 'bitcoin', 'ethereum', 'blockchain', 'investimentos', 'finanças', 'defi', 'nfts', 'análises crypto', 'educação blockchain', 'trading'],
  url: '/'
})

export default async function HomePage() {
  const featuredArticle = await getFeaturedArticle()
  const recentArticles = await getRecentArticles(6)

  // Get featured article, fallback to first from recent articles
  let displayFeaturedArticle = featuredArticle
  if (!displayFeaturedArticle && recentArticles.length > 0) {
    displayFeaturedArticle = recentArticles[0]
  }

  // If still no article, show empty state
  if (!displayFeaturedArticle) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p>Nenhum artigo disponível no momento.</p>
        </div>
      </MainLayout>
    )
  }

  // Serializar datas para passar para client component
  const serializedFeatured = {
    ...displayFeaturedArticle,
    publishedAt: displayFeaturedArticle.publishedAt?.toISOString() || new Date().toISOString(),
    updatedAt: displayFeaturedArticle.updatedAt?.toISOString()
  }

  const serializedRecent = recentArticles.map(article => ({
    ...article,
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    updatedAt: article.updatedAt?.toISOString()
  }))

  return (
    <MainLayout>
      <HomePageClient
        featuredArticle={serializedFeatured as unknown as Article}
        recentArticles={serializedRecent as unknown as Article[]}
      />
    </MainLayout>
  )
}
