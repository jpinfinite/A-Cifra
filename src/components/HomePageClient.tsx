'use client'

import { useEffect } from 'react'
import { ArticleGrid, FeaturedArticleCard } from '@/components/content'
import { Container, Heading, Text, CategoryIcon } from '@/components/ui'
import NewsletterForm from '@/components/content/NewsletterForm'
import { AdUnit } from '@/components/ads'
import type { Article } from '@/types'

interface HomePageClientProps {
  featuredArticle: Article
  recentArticles: Article[]
}

export function HomePageClient({ featuredArticle, recentArticles }: HomePageClientProps) {
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

  return (
    <>
      {/* Hero Section Premium */}
      <section className="hero-gradient text-white py-20 md:py-32 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            {/* Badge principal */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-6 border border-white/20">
              <span className="w-2 h-2 bg-brand-gold rounded-full mr-2 animate-pulse"></span>
              Seu Portal Cripto de Confiança
            </div>
            
            <Heading level={1} className="mb-6 text-white text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-gradient-gold">Seu guia completo</span><br />
              sobre criptomoedas
            </Heading>
            
            <Text size="xl" className="mb-8 text-brand-off-white text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
              Descubra análises profundas, notícias atualizadas e educação de qualidade 
              sobre Bitcoin, Ethereum, DeFi, NFTs e o futuro das finanças digitais.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#artigos-recentes"
                className="btn-gold text-lg px-8 py-4 min-h-touch group"
              >
                <span className="flex items-center space-x-2">
                  <span>Explorar Artigos</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="/categoria/educacao"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-primary-blue transition-all duration-200 min-h-touch text-lg"
              >
                Começar a Aprender
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
              Explore por <span className="text-gradient">Categoria</span>
            </Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Encontre conteúdo especializado sobre os temas que mais interessam você
            </Text>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Bitcoin', slug: 'bitcoin' },
              { name: 'Ethereum', slug: 'ethereum' },
              { name: 'Altcoins', slug: 'altcoins' },
              { name: 'DeFi', slug: 'defi' },
              { name: 'NFTs', slug: 'nfts' },
              { name: 'Segurança', slug: 'seguranca' },
              { name: 'Análises', slug: 'analises' },
              { name: 'Educação', slug: 'educacao' }
            ].map((category, index) => (
              <a
                key={category.slug}
                href={`/categoria/${category.slug}`}
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
                  <span className="text-xs text-brand-primary-blue font-medium">Ver artigos →</span>
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
              Artigos <span className="text-gradient">Recentes</span>
            </Heading>
            <Text className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Fique por dentro das últimas novidades e análises do mercado de criptomoedas
            </Text>
          </div>
          
          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-16 scroll-reveal">
              <FeaturedArticleCard article={featuredArticle} />
            </div>
          )}
          
          {/* Other Recent Articles */}
          {recentArticles && recentArticles.length > 1 && (
            <div className="scroll-reveal">
              <ArticleGrid 
                articles={recentArticles.slice(1)} 
              />
            </div>
          )}
          
          {/* Google AdSense - Display */}
          <div className="scroll-reveal my-12">
            <AdUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_HEADER || '1234567890'} format="auto" />
          </div>
          
          <div className="text-center mt-16 scroll-reveal">
            <a
              href="/artigos"
              className="btn-gradient text-lg px-8 py-4 min-h-touch group inline-flex items-center space-x-2"
            >
              <span>Ver Todos os Artigos</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
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
