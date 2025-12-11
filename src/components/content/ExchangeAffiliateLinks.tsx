'use client'

import Image from 'next/image'

interface ExchangeAffiliateLinksProps {
  variant?: 'default' | 'compact' | 'sidebar'
  className?: string
}

const exchanges = [
  {
    name: 'Bitget',
    url: 'https://share.bitget.com/u/YCFYDWVG?clacCode=CECZRBTM',
    logo: '/images/logos/Bitget-Exchange-Brand-Logo-PNG.png',
    benefits: ['Até $5.000 em bônus', 'Taxas baixas (0.1%)', 'Copy trading', 'Futures e spot'],
    shortBenefit: 'Até $5.000 em Bônus',
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Exchange Global'
  },
  {
    name: 'Binance',
    url: 'https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_DYYIY&utm_source=default&utm_medium=web_share_copy',
    logo: '/images/exchanges/binance-logo.png',
    benefits: ['Cashback em USDC', '600+ criptomoedas', 'Maior liquidez', 'Staking e Earn'],
    shortBenefit: 'Cashback em USDC',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: 'Maior do Mundo'
  },
  {
    name: 'OKX',
    url: 'https://www.okx.com/pt-br/join/63767913',
    logo: '/images/logos/OKX.png',
    benefits: ['Mystery Box até $10k', 'Carteira Web3 Poderosa', 'Baixas taxas', 'Plataforma Profissional'],
    shortBenefit: 'Ganhe Mystery Box',
    color: 'bg-gray-900 hover:bg-gray-800',
    description: 'Web3 & Trading'
  },
  {
    name: 'Gate.io',
    url: 'https://www.gate.com/share/A1dGXAxY',
    logo: '/images/logos/Gateio.png',
    benefits: ['1700+ Criptomoedas', 'Startup Launchpad', 'Bônus de Boas-vindas', 'Encontre Gemas Cedo'],
    shortBenefit: 'Encontre Gemas',
    color: 'bg-emerald-600 hover:bg-emerald-700',
    description: 'Casa das Altcoins'
  },
  {
    name: 'Kraken',
    url: 'https://invite.kraken.com/JDNW/sb8s5jxz',
    logo: '/images/logos/kraken.png',
    benefits: ['Segurança Institucional', 'Suporte Humano 24/7', 'Margin Trading', 'Interface Pro'],
    shortBenefit: 'Segurança Máxima',
    color: 'bg-purple-700 hover:bg-purple-800',
    description: 'Segurança Top'
  },
  {
    name: 'Coinbase',
    url: 'https://coinbase.com/join/SQ2J3GP?src=android-link',
    logo: '/images/exchanges/coinbase-logo.png',
    benefits: ['Ganhe $10 em Bitcoin', 'Regulada Publicamente', 'Interface Simples', 'Ideal para Iniciantes'],
    shortBenefit: 'Ganhe $10 em BTC',
    color: 'bg-indigo-600 hover:bg-indigo-700',
    description: 'Mais Segura'
  }
]

export function ExchangeAffiliateLinks({
  variant = 'default',
  className = ''
}: ExchangeAffiliateLinksProps) {

  // Variant Compact (Dentro de artigos, banners pequenos)
  if (variant === 'compact') {
    return (
      <div className={`my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          🎁 <strong>Ganhe bônus exclusivos</strong> ao abrir sua conta:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {exchanges.map((exchange) => (
            <a
              key={exchange.name}
              href={exchange.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`flex items-center justify-center gap-2 px-3 py-2 ${exchange.color} text-white font-medium rounded-lg transition-colors text-xs sm:text-sm text-center`}
            >
              <div className="w-5 h-5 relative flex-shrink-0">
                 <Image
                  src={exchange.logo}
                  alt={exchange.name}
                  fill
                  className="object-contain rounded bg-white"
                />
              </div>
              <span className="truncate">{exchange.name}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }

  // Variant Sidebar (Lateral dos artigos)
  if (variant === 'sidebar') {
    return (
      <div className={`p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎁 Bônus Crypto
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Melhores ofertas de boas-vindas:
        </p>
        <div className="space-y-3">
          {exchanges.map((exchange) => (
            <a
              key={exchange.name}
              href={exchange.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`block w-full px-4 py-3 ${exchange.color} text-white font-medium rounded-lg transition-colors text-center shadow-sm hover:shadow-md hover:scale-[1.02] transform duration-200`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-5 h-5 relative">
                  <Image
                    src={exchange.logo}
                    alt={exchange.name}
                    fill
                    className="object-contain rounded-sm bg-white"
                  />
                </div>
                <div className="font-bold">{exchange.name}</div>
              </div>
              <div className="text-xs opacity-90">{exchange.shortBenefit}</div>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Você ganha bônus e nós ajudamos a manter o site 🤝
        </p>
      </div>
    )
  }

  // Variant Default (Página inicial ou lista completa)
  return (
    <div className={`my-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎁 Top Exchanges com Bônus
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Selecionamos as melhores corretoras do mundo para você investir com segurança, baixas taxas e ganhar recompensas exclusivas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
        {exchanges.map((exchange) => (
          <div key={exchange.name} className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 border border-gray-100 shadow-sm relative overflow-hidden">
                <Image
                  src={exchange.logo}
                  alt={exchange.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{exchange.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exchange.description}</p>
              </div>
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300 mb-5 space-y-2">
              {exchange.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-green-500">✅</span>
                  {benefit}
                </li>
              ))}
            </ul>
            <a
              href={exchange.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`block w-full px-4 py-3 ${exchange.color} text-white font-bold rounded-lg transition-all hover:scale-[1.02] text-center shadow-md`}
            >
              Abrir Conta na {exchange.name} →
            </a>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        💡 Disclaimer: Ao usar nossos links de convite, você garante os melhores bônus de cadastro e apoia a produção de conteúdo educativo gratuito do A Cifra.
      </p>
    </div>
  )
}
