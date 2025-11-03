import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { BookOpen, Target, Clock, Alert, TrendingUp, Lightbulb, Search } from '@/components/icons/SocialIcons'
import { DCACalculator, ProfitLossCalculator, StakingCalculator } from '@/components/tools'

export const metadata: Metadata = {
  title: 'Calculadoras e Ferramentas Cripto | A Cifra',
  description: 'Ferramentas essenciais para investidores cripto. Calculadoras de DCA, lucro/prejuízo, staking, mineração e conversão de moedas digitais.',
  keywords: ['calculadora cripto', 'ferramentas bitcoin', 'DCA calculator', 'lucro cripto', 'staking calculator', 'mining calculator'],
}

export default function FerramentasPage() {
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
            Calculadoras e Ferramentas
          </Heading>
          <Text className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ferramentas essenciais para planejar e analisar seus investimentos em criptomoedas. 
            Calcule DCA, lucros, staking e muito mais.
          </Text>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* DCA Calculator */}
          <DCACalculator />

          {/* Profit/Loss Calculator */}
          <ProfitLossCalculator />

          {/* Staking Calculator */}
          <StakingCalculator />

          {/* Mining Calculator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Alert size="24" />
              </div>
              <h3 className="text-lg font-semibold">Calculadora Mining</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Estime lucratividade da mineração de criptomoedas 
              considerando hardware e custos de energia.
            </p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Hash rate (TH/s)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <input
                type="number"
                placeholder="Custo energia (kWh)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum Classic (ETC)</option>
                <option>Outras</option>
              </select>
              <button className="w-full py-2 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors">
                Calcular
              </button>
            </div>
          </div>

          {/* Currency Converter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Search size="24" />
              </div>
              <h3 className="text-lg font-semibold">Conversor de Moedas</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Converta entre criptomoedas e moedas fiduciárias 
              em tempo real.
            </p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Valor"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option>De: Bitcoin (BTC)</option>
                <option>De: Ethereum (ETH)</option>
                <option>De: Real (BRL)</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option>Para: Real (BRL)</option>
                <option>Para: Dólar (USD)</option>
                <option>Para: Bitcoin (BTC)</option>
              </select>
              <button className="w-full py-2 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors">
                Converter
              </button>
            </div>
          </div>

          {/* Portfolio Tracker */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Target size="24" />
              </div>
              <h3 className="text-lg font-semibold">Acompanhador de Carteira</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Acompanhe o desempenho da sua carteira de criptomoedas 
              com análise detalhada.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Ativo (BTC, ETH...)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <input
                type="number"
                placeholder="Quantidade"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <input
                type="number"
                placeholder="Preço médio (R$)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button className="w-full py-2 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors">
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div className="bg-brand-dark-blue rounded-2xl p-8 text-white mb-12">
          <Heading level={2} className="text-2xl mb-6 text-center">
            Como Usar Nossas Ferramentas
          </Heading>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <BookOpen size="32" />
              </div>
              <h3 className="font-semibold mb-2">Planejamento</h3>
              <p className="text-gray-300 text-sm">
                Use as calculadoras para planejar estratégias de investimento 
                e entender potenciais retornos.
              </p>
            </div>
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <Clock size="32" />
              </div>
              <h3 className="font-semibold mb-2">Acompanhamento</h3>
              <p className="text-gray-300 text-sm">
                Monitore seus investimentos e calcule lucros/prejuízos 
                em tempo real.
              </p>
            </div>
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <TrendingUp size="32" />
              </div>
              <h3 className="font-semibold mb-2">Análise</h3>
              <p className="text-gray-300 text-sm">
                Analise diferentes cenários e tome decisões 
                mais informadas.
              </p>
            </div>
            <div className="text-center">
              <div className="text-brand-gold mx-auto mb-3">
                <Target size="32" />
              </div>
              <h3 className="font-semibold mb-2">Otimização</h3>
              <p className="text-gray-300 text-sm">
                Otimize suas estratégias de DCA, staking e 
                alocação de ativos.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-12">
          <div className="flex items-start gap-3">
              <div className="text-yellow-600 flex-shrink-0 mt-1">
                <Alert size="24" />
              </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                Aviso Importante
              </h3>
              <div className="text-yellow-700 text-sm space-y-2">
                <p>
                  <strong>Estas ferramentas têm finalidade educacional e de planejamento.</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Os cálculos são baseados em dados históricos e projeções</li>
                  <li>Não garantem resultados futuros ou lucros</li>
                  <li>Considere taxas, impostos e volatilidade do mercado</li>
                  <li>Sempre faça sua própria pesquisa (DYOR)</li>
                  <li>Consulte profissionais qualificados antes de investir</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <Heading level={2} className="text-2xl mb-6">
            Dicas para Uso das Ferramentas
          </Heading>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-brand-primary-blue mb-4">
                📊 Calculadora DCA
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Considere a volatilidade histórica do ativo</li>
                <li>• Simule diferentes períodos de investimento</li>
                <li>• Compare com investimento único (lump sum)</li>
                <li>• Inclua taxas de corretagem nos cálculos</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-brand-primary-blue mb-4">
                💰 Lucro/Prejuízo
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Inclua todas as taxas de transação</li>
                <li>• Considere impostos sobre ganhos de capital</li>
                <li>• Use para análise de múltiplas operações</li>
                <li>• Acompanhe o custo médio de aquisição</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-brand-primary-blue mb-4">
                🎯 Staking
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Verifique o APY real (líquido de taxas)</li>
                <li>• Considere o período de lock-up</li>
                <li>• Pesquise a segurança do protocolo</li>
                <li>• Simule diferentes cenários de mercado</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-brand-primary-blue mb-4">
                ⚡ Mining
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Inclua custos de eletricidade e refrigeração</li>
                <li>• Considere a dificuldade de rede variável</li>
                <li>• Pesquise a eficiência do hardware</li>
                <li>• Calcule o ROI considerando depreciação</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Text className="mb-6">
            Precisa de ajuda para usar nossas ferramentas? 
            <br />
            Nossa equipe está disponível para auxiliar!
          </Text>
          <div className="flex gap-4 justify-center">
            <a
              href="/contatos"
              className="inline-block px-8 py-3 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors"
            >
              Fale Conosco
            </a>
            <a
              href="/glossario"
              className="inline-block px-8 py-3 border border-brand-primary-blue text-brand-primary-blue rounded-lg hover:bg-brand-primary-blue hover:text-white transition-colors"
            >
              Glossário
            </a>
          </div>
        </div>
      </Container>
    </MainLayout>
  )
}
