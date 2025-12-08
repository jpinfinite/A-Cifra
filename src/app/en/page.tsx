import { MainLayout } from '@/components/layout'
import { getFeaturedArticle, getRecentArticles } from '@/data/articles'
import { generateMetadata } from '@/utils/seo'
import type { Article } from '@/types'
import { HomePageClient } from '@/components/HomePageClient'
import { getTranslations } from '@/i18n'

export const metadata = generateMetadata({
  title: 'A Cifra - Your Complete Crypto Guide | Analysis & Education',
  description: 'Discover in-depth analysis, breaking news and quality education about Bitcoin, Ethereum, DeFi, NFTs and the future of digital finance.',
  keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'investing', 'finance', 'defi', 'nfts', 'crypto analysis', 'blockchain education', 'trading'],
  url: '/en'
})

export default async function HomePage() {
  const featuredArticle = await getFeaturedArticle('en')
  const recentArticles = await getRecentArticles(12, 'en')
  const dictionary = getTranslations('en')

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
          <p>No articles available at the moment.</p>
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
    <MainLayout dictionary={dictionary} locale="en">
      <HomePageClient
        featuredArticle={serializedFeatured as unknown as Article}
        recentArticles={serializedRecent as unknown as Article[]}
        dictionary={dictionary}
        locale="en"
      />
    </MainLayout>
  )
}
