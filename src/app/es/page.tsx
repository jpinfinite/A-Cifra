import { MainLayout } from '@/components/layout'
import { getFeaturedArticle, getRecentArticles } from '@/data/articles'
import { generateMetadata } from '@/utils/seo'
import type { Article } from '@/types'
import { HomePageClient } from '@/components/HomePageClient'
import { getTranslations } from '@/i18n'

export const metadata = generateMetadata({
  title: 'A Cifra - Tu Guía Completa de Criptomonedas | Análisis y Educación',
  description: 'Descubre análisis profundos, noticias actualizadas y educación de calidad sobre Bitcoin, Ethereum, DeFi, NFTs y el futuro de las finanzas digitales.',
  keywords: ['criptomonedas', 'bitcoin', 'ethereum', 'blockchain', 'inversiones', 'finanzas', 'defi', 'nfts', 'análisis crypto', 'educación blockchain', 'trading'],
  url: '/es'
})

export default async function HomePage() {
  const featuredArticle = await getFeaturedArticle('es')
  const recentArticles = await getRecentArticles(12, 'es')
  const dictionary = getTranslations('es')

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
          <p>No hay artículos disponibles en este momento.</p>
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
    <MainLayout dictionary={dictionary} locale="es">
      <HomePageClient
        featuredArticle={serializedFeatured as unknown as Article}
        recentArticles={serializedRecent as unknown as Article[]}
        dictionary={dictionary}
        locale="es"
      />
    </MainLayout>
  )
}
