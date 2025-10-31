'use client'

import { useEffect } from 'react'
import { ArticleGrid, FeaturedArticleCard } from '@/components/content'
import { Container, Heading, Text, CategoryIcon } from '@/components/ui'
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
      <section className="py-20 bg-gradient-to-br from-brand-dark-blue to-brand-medium-blue text-white relative overflow-hidden">
        <Container>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-brand-gold/20 backdrop-blur-sm rounded-full text-sm font-medium text-brand-gold mb-6 border border-brand-gold/30">
              <span className="w-2 h-2 bg-brand-gold rounded-full mr-2 animate-pulse"></span>
              Newsletter Exclusiva
            </div>
            
            <Heading level={2} className="mb-6 text-white text-3xl md:text-4xl">
              Não perca <span className="text-gradient-gold">nenhuma novidade</span>
            </Heading>
            <Text className="mb-8 text-gray-300 text-lg leading-relaxed">
              Receba as principais notícias e análises do mercado crypto diretamente no seu email. 
              Conteúdo exclusivo para assinantes.
            </Text>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-200 placeholder-gray-500"
                required
                aria-label="Email para newsletter"
              />
              <button
                type="submit"
                className="btn-gold text-lg px-8 py-4 min-h-touch font-semibold"
              >
                Inscrever-se
              </button>
            </form>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sem spam</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Cancelamento a qualquer momento</span>
              </div>
            </div>
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-primary-blue/10 rounded-full blur-3xl"></div>
        </Container>
      </section>
    </>
  )
}
