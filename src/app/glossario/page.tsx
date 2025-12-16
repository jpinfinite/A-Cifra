import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { BookOpen, Search, TrendingUp, Shield, Target, Clock, Brain } from '@/components/icons/SocialIcons'

export const metadata: Metadata = {
  title: 'Glossário Cripto - Termos e Definições | A Cifra',
  description: 'Glossário completo de criptomoedas e blockchain. Entenda os termos técnicos, siglas e conceitos do universo crypto com definições claras e exemplos práticos.',
  keywords: ['glossário cripto', 'dicionário crypto', 'termos blockchain', 'definições bitcoin', 'conceitos DeFi', 'siglas cripto'],
}

import { glossaryData } from '@/data/glossaryTerms'

const iconMap = {
  BookOpen,
  Brain,
  TrendingUp,
  Shield,
  Target,
  Clock
}

const glossaryCategories = glossaryData.map(cat => ({
  ...cat,
  icon: iconMap[cat.iconName as keyof typeof iconMap] || BookOpen
}))

export default function GlossarioPage() {
  return (
    <MainLayout>
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-brand-gold">
              <BookOpen size="48" />
            </div>
          </div>
          <Heading level={1} className="mb-4">
            Glossário Cripto
          </Heading>
          <Text className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dicionário completo do universo cripto. Entenda os termos técnicos, siglas e conceitos
            essenciais para navegar com segurança no mundo das criptomoedas e blockchain.
          </Text>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size="20" />
            </div>
            <input
              type="text"
              placeholder="Buscar termos no glossário..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {glossaryCategories.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-brand-gold">
                    <Icon size="28" />
                  </div>
                  <Heading level={2} className="text-2xl">
                    {category.title}
                  </Heading>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.terms.map((item, termIndex) => (
                    <div key={termIndex} className="border-l-4 border-brand-gold pl-6 py-2">
                      <h3 className="text-lg font-semibold text-brand-primary-blue mb-2">
                        {item.term}
                      </h3>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {item.definition}
                      </p>
                      {item.example && (
                        <div className="bg-brand-light-blue/10 rounded-lg p-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Exemplo:</span> {item.example}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Resources */}
        <div className="mt-16 bg-brand-dark-blue rounded-2xl p-8 text-white">
          <Heading level={2} className="text-2xl mb-6 text-center">
            Recursos Adicionais
          </Heading>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <Clock size="32" />
              </div>
              <h3 className="font-semibold mb-2">Aprendizado Contínuo</h3>
              <p className="text-gray-300 text-sm">
                O universo cripto evolui rapidamente. Continue aprendendo com nossos artigos e análises.
              </p>
            </div>
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <Shield size="32" />
              </div>
              <h3 className="font-semibold mb-2">Segurança Primeiro</h3>
              <p className="text-gray-300 text-sm">
                Entenda os conceitos de segurança para proteger seus investimentos e dados.
              </p>
            </div>
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <Target size="32" />
              </div>
              <h3 className="font-semibold mb-2">Estratégia Inteligente</h3>
              <p className="text-gray-300 text-sm">
                Use o conhecimento para tomar decisões informadas e estratégicas.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Text className="mb-6">
            Tem alguma dúvida sobre termos cripto?
            <br />
            Nossa equipe está aqui para ajudar!
          </Text>
          <a
            href="/contatos"
            className="inline-block px-8 py-3 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors"
          >
            Fale Conosco
          </a>
        </div>
      </Container>
    </MainLayout>
  )
}
