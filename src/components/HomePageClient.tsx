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
      {/* Hero Section Premium - Redesigned */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-slate-900 z-0">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-primary-blue/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-gold/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900"></div>
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-5xl mx-auto animate-fade-in space-y-8">
            {/* Badge principal */}
            <div className="inline-flex items-center px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-brand-gold mb-4 shadow-lg hover:bg-white/10 transition-colors">
              <span className="flex w-2 h-2 bg-green-400 rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              {homeDict.badge}
            </div>

            <Heading level={1} className="text-white text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                {homeDict.title}
              </span>
            </Heading>

            <Text size="xl" className="text-slate-300 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-light">
              {homeDict.subtitle}
            </Text>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8">
              <a
                href="#artigos-recentes"
                className="group relative px-8 py-4 bg-brand-gold text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>{homeDict.exploreArticles}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>

              <a
                href={locale === 'pt-BR' ? "/categoria/educacao" : (locale === 'en' ? "/en/category/education" : "/es/categoria/educacion")}
                className="group px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center"
              >
                <span>{homeDict.startLearning}</span>
                <span className="ml-2 text-brand-gold group-hover:rotate-12 transition-transform">🎓</span>
              </a>
            </div>

            {/* Stats/Social Proof (Optional enhancement) */}
            <div className="pt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto border-t border-white/5 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Notícias</div>
              </div>
              <div className="text-center border-l border-white/10 border-r">
                <div className="text-2xl font-bold text-brand-gold mb-1">+500</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Artigos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Gratuito</div>
              </div>
            </div>
          </div>
        </Container>
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
