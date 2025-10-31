import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { BookOpen, Search, TrendingUp, Shield, Target, Clock, Brain } from '@/components/icons/SocialIcons'

export const metadata: Metadata = {
  title: 'Glossário Cripto - Termos e Definições | A Cifra',
  description: 'Glossário completo de criptomoedas e blockchain. Entenda os termos técnicos, siglas e conceitos do universo crypto com definições claras e exemplos práticos.',
  keywords: ['glossário cripto', 'dicionário crypto', 'termos blockchain', 'definições bitcoin', 'conceitos DeFi', 'siglas cripto'],
}

const glossaryCategories = [
  {
    title: 'Conceitos Fundamentais',
    icon: BookOpen,
    terms: [
      {
        term: 'Blockchain',
        definition: 'Livro-razão digital distribuído e imutável que registra transações em uma rede de computadores. Cada bloco contém transações e está conectado ao anterior formando uma corrente.',
        example: 'A blockchain do Bitcoin registra todas as transações desde 2009 de forma transparente e segura.'
      },
      {
        term: 'Criptomoeda',
        definition: 'Moeda digital ou virtual que usa criptografia para segurança. Opera independentemente de bancos centrais e baseia-se em tecnologia blockchain.',
        example: 'Bitcoin e Ethereum são as criptomoedas mais conhecidas do mercado.'
      },
      {
        term: 'Bitcoin (BTC)',
        definition: 'Primeira e maior criptomoeda do mundo, criada em 2009 por Satoshi Nakamoto. Considerada ouro digital devido à sua escassez e valor de reserva.',
        example: 'O Bitcoin atingiu nova máxima histórica em 2024 após aprovação dos ETFs nos EUA.'
      },
      {
        term: 'Ethereum (ETH)',
        definition: 'Plataforma blockchain que permite criação de smart contracts e aplicações descentralizadas (dApps). Segunda maior criptomoeda por capitalização.',
        example: 'A maioria dos projetos DeFi e NFTs são construídos na rede Ethereum.'
      }
    ]
  },
  {
    title: 'Tecnologia e Infraestrutura',
    icon: Brain,
    terms: [
      {
        term: 'Smart Contract',
        definition: 'Programa de computador que executa automaticamente termos de um contrato quando condições pré-determinadas são atendidas, sem necessidade de intermediários.',
        example: 'Um smart contract pode liberar pagamento automaticamente quando uma entrega é confirmada.'
      },
      {
        term: 'DeFi (Decentralized Finance)',
        definition: 'Sistema financeiro construído em blockchain que oferece serviços tradicionais (empréstimos, trocas, etc.) sem intermediários centralizados.',
        example: 'Protocolos DeFi como Aave e Uniswap permitem empréstimos e trocas sem bancos.'
      },
      {
        term: 'Layer 2',
        definition: 'Soluções de escalabilidade construídas sobre uma blockchain principal (Layer 1) para processar transações mais rapidamente e com custos menores.',
        example: 'Arbitrum e Optimism são soluções Layer 2 para Ethereum que reduzem taxas e aumentam velocidade.'
      },
      {
        term: 'NFT (Non-Fungible Token)',
        definition: 'Token digital único e não fungível que representa posse de um item específico, digital ou físico. Usado para arte, colecionáveis, ingressos, etc.',
        example: 'O NFT "Everydays: The First 5000 Days" de Beeple foi vendido por US$ 69 milhões.'
      }
    ]
  },
  {
    title: 'Investimento e Trading',
    icon: TrendingUp,
    terms: [
      {
        term: 'HODL',
        definition: 'Estratégia de manter criptomoedas a longo prazo, independentemente da volatilidade. Originou-se de um erro de digitação de "hold" em 2013.',
        example: 'Muitos investidores HODL Bitcoin acreditando em seu potencial de valorização a longo prazo.'
      },
      {
        term: 'DCA (Dollar Cost Averaging)',
        definition: 'Estratégia de investir valores fixos regularmente, independentemente do preço, para reduzir o impacto da volatilidade.',
        example: 'Investir R$ 100 em Bitcoin todo mês é uma estratégia DCA.'
      },
      {
        term: 'Market Cap',
        definition: 'Valor total de mercado de uma criptomoeda, calculado multiplicando o preço atual pelo número de tokens em circulação.',
        example: 'Bitcoin tem a maior market cap entre as criptomoedas, ultrapassando US$ 1 trilhão.'
      },
      {
        term: 'Altcoin',
        definition: 'Qualquer criptomoeda diferente do Bitcoin. Inclui Ethereum, Solana, Cardano e milhares de outras.',
        example: 'Solana é uma altcoin popular conhecida por sua alta velocidade de transação.'
      }
    ]
  },
  {
    title: 'Segurança e Privacidade',
    icon: Shield,
    terms: [
      {
        term: 'Wallet',
        definition: 'Software ou dispositivo que armazena chaves privadas e permite gerenciar criptomoedas. Pode ser quente (conectada à internet) ou fria (offline).',
        example: 'Ledger e Trezor são exemplos de cold wallets consideradas muito seguras.'
      },
      {
        term: 'Chave Privada',
        definition: 'Senha secreta que dá acesso e controle sobre criptomoedas em uma carteira. Deve ser mantida em sigilo absoluto.',
        example: 'Perder a chave privada significa perder acesso permanente às criptomoedas.'
      },
      {
        term: 'Seed Phrase',
        definition: 'Lista de 12-24 palavras que funciona como backup da carteira. Permite restaurar acesso em caso de perda do dispositivo.',
        example: '"apple banana cherry..." é um exemplo de seed phrase que deve ser guardada com segurança.'
      },
      {
        term: '2FA (Two-Factor Authentication)',
        definition: 'Camada extra de segurança que exige dois fatores de autenticação (senha + código/tempo) para acessar contas.',
        example: 'Google Authenticator é amplamente usado para 2FA em exchanges e carteiras.'
      }
    ]
  },
  {
    title: 'Conceitos Avançados',
    icon: Target,
    terms: [
      {
        term: 'Halving',
        definition: 'Evento programado que reduz pela metade a recompensa de mineração de novas moedas. Ocorre aproximadamente a cada 4 anos no Bitcoin.',
        example: 'O halving do Bitcoin em 2024 reduziu a recompensa de 6.25 para 3.125 BTC.'
      },
      {
        term: 'Staking',
        definition: 'Processo de travar criptomoedas para suportar operações de blockchain proof-of-stake, recebendo recompensas em troca.',
        example: 'Staking de Ethereum oferece rendimentos anuais de aproximadamente 3-5%.'
      },
      {
        term: 'Yield Farming',
        definition: 'Estratégia DeFi de fornecer liquidez a protocolos em troca de recompensas, geralmente em tokens do protocolo.',
        example: 'Yield farmers buscam as melhores APYs em diferentes protocolos DeFi.'
      },
      {
        term: 'DAO (Decentralized Autonomous Organization)',
        definition: 'Organização autônoma descentralizada governada por código e detentores de tokens, sem hierarquia tradicional.',
        example: 'MakerDAO é uma das DAOs mais antigas, governando o protocolo DAI.'
      }
    ]
  }
]

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
