import Link from 'next/link'
import { Metadata } from 'next'

import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { categories } from '@/lib/config'


export const metadata: Metadata = {
  title: 'Categorias - Explore Tópicos sobre Criptomoedas',
  description: 'Navegue por todas as categorias de conteúdo sobre criptomoedas, blockchain, DeFi, NFTs e muito mais.',
  openGraph: {
    title: 'Categorias - A Cifra',
    description: 'Explore nosso conteúdo organizado por tópicos sobre criptomoedas',
    type: 'website',
  },
}

export default function CategoriasPage() {
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="text-center mb-12">
          <Heading level={1} className="mb-4">
            Categorias
          </Heading>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
            Explore nosso conteúdo organizado por tópicos sobre criptomoedas, blockchain e tecnologia
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-brand-primary-blue hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-light-blue rounded-lg flex items-center justify-center group-hover:bg-brand-primary-blue transition-colors">
                  <span className="text-2xl" role="img" aria-label={category.name}>
                    {category.icon || '📁'}
                  </span>
                </div>
                <div className="flex-1">
                  <Heading level={3} className="mb-2 group-hover:text-brand-primary-blue transition-colors">
                    {category.name}
                  </Heading>
                  <Text size="sm" className="text-gray-600 line-clamp-2">
                    {category.description}
                  </Text>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Seção adicional */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-brand-light-blue to-brand-primary-blue/10 rounded-2xl p-8">
            <Heading level={2} className="mb-4">
              Não encontrou o que procura?
            </Heading>
            <Text className="text-gray-600 mb-6 max-w-xl mx-auto">
              Explore todos os nossos artigos ou use a busca para encontrar conteúdo específico
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/artigos"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary-blue text-white font-semibold rounded-lg hover:bg-brand-medium-blue transition-colors duration-200"
              >
                Ver Todos os Artigos
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-primary-blue font-semibold rounded-lg border-2 border-brand-primary-blue hover:bg-brand-light-blue transition-colors duration-200"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  )
}
