'use client'

import { useEffect } from 'react'

import { ArticleGrid, FeaturedArticleCard } from '@/components/content'
import { Container, Heading, Text, CategoryIcon } from '@/components/ui'
import NewsletterForm from '@/components/content/NewsletterForm'
import type { Article } from '@/types'

// import { DisplayAd } from '@/components/ads' // Removido - usando apenas anúncios automáticos
import { SidebarAd } from '@/components/ads/SidebarAd'

interface HomePageClientProps {
  featuredArticle: Article
  recentArticles: Article[]
  dictionary: any // Using any for flexibility with JSON structure
  locale: 'pt-BR' | 'en' | 'es'
}

export function HomePageClient({ featuredArticle, recentArticles, dictionary, locale }: HomePageClientProps) {
  // Converter strings de data de volta para Date objects
  const featuredWithDate = featuredArticle ? {
    ...featuredArticle,
    publishedAt: new Date(featuredArticle.publishedAt as string | Date),
    updatedAt: featuredArticle.updatedAt ? new Date(featuredArticle.updatedAt as string | Date) : undefined
  } : undefined

  const recentWithDates = recentArticles.map(article => ({
    ...article,
    publishedAt: new Date(article.publishedAt as string | Date),
    updatedAt: article.updatedAt ? new Date(article.updatedAt as string | Date) : undefined
  }))

  // Scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, observerOptions)

    // Observar elementos com scroll-reveal
    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const homeDict = dictionary?.home || {}
  const categoriesDict = dictionary?.categories || {}

  const categories = [
    { name: categoriesDict.bitcoin || 'Bitcoin', slug: 'bitcoin' },
    { name: categoriesDict.ethereum || 'Ethereum', slug: 'ethereum' },
    { name: categoriesDict.altcoins || 'Altcoins', slug: 'altcoins' },
    { name: categoriesDict.defi || 'DeFi', slug: 'defi' },
    { name: categoriesDict.nfts || 'NFTs', slug: 'nfts' },
    { name: categoriesDict.security || 'Segurança', slug: 'seguranca' }, // Slug mantido em pt-BR por enquanto ou criar slugs localizados? Vamos manter slug original
    { name: categoriesDict.analysis || 'Análises', slug: 'analises' },
    { name: categoriesDict.education || 'Educação', slug: 'educacao' }
  ]

  return (
    <>
      {/* Hero Section Premium */}
      <section className="hero-gradient text-white py-20 md:py-32 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            {/* Badge principal */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-6 border border-white/20">
              <span className="w-2 h-2 bg-brand-gold rounded-full mr-2 animate-pulse"></span>
              {homeDict.badge}
            </div>

            <Heading level={1} className="mb-6 text-white text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-gradient-gold" dangerouslySetInnerHTML={{ __html: homeDict.title?.replace('criptomoedas', 'criptomoedas<br/>') || '' }} />
              {/* O replace acima é um hackzinho para manter a quebra de linha se for pt, mas ideal é o dict ter HTML ou ser apenas texto.
                  Vamos simplificar para apenas renderizar o título. O usuário quer estética premium. */}
              {homeDict.title}
            </Heading>

            <Text size="xl" className="mb-8 text-brand-off-white text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
              {homeDict.subtitle}
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#artigos-recentes"
                className="btn-gold text-lg px-8 py-4 min-h-touch group"
              >
                <span className="flex items-center space-x-2">
                  <span>{homeDict.exploreArticles}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href={locale === 'pt-BR' ? "/categoria/educacao" : (locale === 'en' ? "/en/category/education" : "/es/categoria/educacion")}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-primary-blue transition-all duration-200 min-h-touch text-lg"
              >
                {/* Fallback de rotas simplificado: mantemos rotas PT por enquanto se não criamos as outras, mas o ideal é localizar a rota.
                    Vamos manter /categoria/educacao para PT e links "mortos" ou redirecionados para as outras linguas se não existirem ainda as páginas de categoria.
                    Como não criei páginas de categoria EN/ES, vou deixar apontando para a mesma rota ou rota raiz por enquanto com um TODO.
                    Vou apontar para /categoria/educacao (vai renderizar a página PT, mas o usuário vê conteúdo).
                    Melhor: usar locale para prefixar.
                */}
                {homeDict.startLearning}
              </a>
            </div>
          </div>
        </Container>

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-gold/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-brand-primary-blue/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </section>

      {/* Categories Section Premium */}
      <section className="py-20 bg-brand-off-white">
        <Container>
          <div className="text-center mb-16 scroll-reveal">
            <Heading level={2} className="mb-4 text-3xl md:text-4xl">
              {homeDict.categoriesTitle}
            </Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              {homeDict.categoriesSubtitle}
            </Text>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <a
                key={category.slug}
                href={`/categoria/${category.slug}`} // TODO: Localizar URL de categorias
                className="group card-hover bg-white rounded-xl shadow-sm hover:shadow-xl p-6 text-center min-h-touch flex flex-col items-center justify-center border border-gray-100 scroll-reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-blue to-brand-medium-blue rounded-full flex items-center justify-center shadow-lg">
                    <CategoryIcon category={category.slug} className="w-8 h-8" />
                  </div>
                </div>
                <Text weight="semibold" className="text-brand-dark-blue group-hover:text-brand-primary-blue transition-colors duration-200 text-lg">
                  {category.name}
                </Text>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs text-brand-primary-blue font-medium">{homeDict.viewArticles} →</span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Articles Section Premium */}
      <section id="artigos-recentes" className="py-20">
        <Container>
          <div className="text-center mb-16 scroll-reveal">
            <Heading level={2} className="mb-4 text-3xl md:text-4xl">
              {homeDict.recentArticlesTitle}
            </Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              {homeDict.recentArticlesSubtitle}
            </Text>
          </div>

          {/* Layout de 2 colunas: Artigos + Anúncios */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Coluna Principal - Artigos (70%) */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Featured Article */}
              {featuredWithDate && (
                <div className="mb-16 scroll-reveal">
                  <FeaturedArticleCard article={featuredWithDate} />
                </div>
              )}

              {/* Other Recent Articles */}
              {recentWithDates && recentWithDates.length > 1 && (
                <div className="scroll-reveal">
                  <ArticleGrid
                    articles={recentWithDates.slice(1)}
                  />
                </div>
              )}

              <div className="text-center mt-16 scroll-reveal">
                <a
                  href="/artigos"
                  className="btn-gradient text-lg px-8 py-4 min-h-touch group inline-flex items-center space-x-2"
                >
                  <span>{homeDict.viewAllArticles}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Coluna Lateral - Anúncios Verticais (30%) */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="space-y-6">
                {/* Anúncio Vertical 1 - Sidebar Display */}
                <div className="sticky top-24">
                  <SidebarAd
                    slot="4860266399"
                    sticky={false}
                    className="min-h-[600px]"
                  />

                  {/* Anúncio Vertical 2 - Display Responsivo (Aparece abaixo ao rolar) */}
                  <div className="mt-6">
                    <SidebarAd
                      slot="7243051452"
                      sticky={false}
                      className="min-h-[250px]"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Newsletter Section Premium */}
      <section className="py-20 bg-gradient-to-br from-brand-dark-blue to-brand-medium-blue relative overflow-hidden">
        <Container>
          <div className="relative z-10">
            <NewsletterForm />
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-primary-blue/10 rounded-full blur-3xl"></div>
        </Container>
      </section>
    </>
  )
}
