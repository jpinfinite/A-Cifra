import { MainLayout } from '@/components/layout'
import { getFeaturedArticle, getRecentArticles } from '@/data/articles'
import { generateMetadata } from '@/utils/seo'
import type { Article } from '@/types'
import { HomePageClient } from '@/components/HomePageClient'
import { getTranslations } from '@/i18n'

export const metadata = generateMetadata({
  title: 'A Cifra - Seu guia completo sobre criptomoedas | Análises & Educação Crypto',
  description: 'Descubra análises profundas, notícias atualizadas e educação de qualidade sobre Bitcoin, Ethereum, DeFi, NFTs e o futuro das finanças digitais. Conteúdo especializado para investidores e entusiastas.',
  keywords: ['criptomoedas', 'bitcoin', 'ethereum', 'blockchain', 'investimentos', 'finanças', 'defi', 'nfts', 'análises crypto', 'educação blockchain', 'trading'],
  url: '/'
})

export default async function HomePage() {
  const featuredArticle = await getFeaturedArticle('pt-BR')
  const recentArticles = await getRecentArticles(12, 'pt-BR')
  const dictionary = getTranslations('pt')

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

  // Serializar datas para passar para client component e remover conteúdo pesado
  const serializedFeatured = {
    ...displayFeaturedArticle,
    content: '', // Otimização: remove conteúdo markdown para reduzir tamanho do HTML
    excerpt: displayFeaturedArticle.excerpt || '',
    publishedAt: displayFeaturedArticle.publishedAt?.toISOString() || new Date().toISOString(),
    updatedAt: displayFeaturedArticle.updatedAt?.toISOString()
  }

  const serializedRecent = recentArticles.map(article => ({
    ...article,
    content: '', // Otimização: remove conteúdo markdown para reduzir tamanho do HTML
    excerpt: article.excerpt || '',
    publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
    updatedAt: article.updatedAt?.toISOString()
  }))

  return (
    <MainLayout dictionary={dictionary} locale="pt-BR">
      <HomePageClient
        featuredArticle={serializedFeatured as unknown as Article}
        recentArticles={serializedRecent as unknown as Article[]}
        dictionary={dictionary}
        locale="pt-BR"
      />
    </MainLayout>
  )
}
