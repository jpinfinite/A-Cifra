'use client'

import { affiliateConfig } from '@/config/affiliates'

interface ExchangeAffiliateLinksProps {
  variant?: 'default' | 'compact' | 'sidebar'
  className?: string
  exchanges?: ('bitget' | 'binance' | 'coinbase')[]
}

export function ExchangeAffiliateLinks({ 
  variant = 'default',
  className = '',
  exchanges = ['bitget', 'binance', 'coinbase']
}: ExchangeAffiliateLinksProps) {
  
  if (variant === 'compact') {
    return (
      <div className={`my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          🎁 <strong>Ganhe bônus</strong> ao abrir sua conta:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="https://share.bitget.com/u/YCFYDWVG?clacCode=CECZRBTM"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Bitget - Até $5.000
          </a>
          <a
            href="https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_DYYIY&utm_source=default&utm_medium=web_share_copy"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Binance - Cashback
          </a>
          <a
            href="https://coinbase.com/join/SQ2J3GP?src=android-link"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Coinbase - $10
          </a>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎁 Abra Sua Conta
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ganhe bônus de boas-vindas ao se cadastrar:
        </p>
        <div className="space-y-3">
          <a
            href="https://share.bitget.com/u/YCFYDWVG?clacCode=CECZRBTM"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            <div className="font-bold">Bitget</div>
            <div className="text-xs mt-1">Até $5.000 em bônus</div>
          </a>
          <a
            href="https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_DYYIY&utm_source=default&utm_medium=web_share_copy"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors text-center"
          >
            <div className="font-bold">Binance</div>
            <div className="text-xs mt-1">Cashback em USDC</div>
          </a>
          <a
            href="https://coinbase.com/join/SQ2J3GP?src=android-link"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            <div className="font-bold">Coinbase</div>
            <div className="text-xs mt-1">Ganhe $10 em Bitcoin</div>
          </a>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Links de afiliado - Você ganha bônus e nós também 🤝
        </p>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`my-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎁 Comece a Investir com Bônus
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Abra sua conta em uma das melhores exchanges e ganhe bônus de boas-vindas
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Bitget */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
              B
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Bitget</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exchange Global</p>
            </div>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
            <li>✅ Até $5.000 em bônus</li>
            <li>✅ Taxas baixas (0.1%)</li>
            <li>✅ Copy trading</li>
            <li>✅ Futures e spot</li>
          </ul>
          <a
            href="https://share.bitget.com/u/YCFYDWVG?clacCode=CECZRBTM"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-center"
          >
            Abrir Conta na Bitget →
          </a>
        </div>

        {/* Binance */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
              B
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Binance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Maior do Mundo</p>
            </div>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
            <li>✅ Cashback em USDC</li>
            <li>✅ 600+ criptomoedas</li>
            <li>✅ Maior liquidez</li>
            <li>✅ Staking e Earn</li>
          </ul>
          <a
            href="https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_DYYIY&utm_source=default&utm_medium=web_share_copy"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors text-center"
          >
            Abrir Conta na Binance →
          </a>
        </div>

        {/* Coinbase */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
              C
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Coinbase</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mais Segura</p>
            </div>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
            <li>✅ Ganhe $10 em Bitcoin</li>
            <li>✅ Regulada nos EUA</li>
            <li>✅ Interface simples</li>
            <li>✅ Ideal para iniciantes</li>
          </ul>
          <a
            href="https://coinbase.com/join/SQ2J3GP?src=android-link"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-center"
          >
            Abrir Conta na Coinbase →
          </a>
        </div>
      </div>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        💡 Links de afiliado: Você ganha bônus ao se cadastrar e nós recebemos uma comissão. É uma parceria que beneficia todos! 🤝
      </p>
    </div>
  )
}
