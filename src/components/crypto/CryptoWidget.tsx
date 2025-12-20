'use client'

import { useState, useEffect } from 'react'
import { Text } from '@/components/ui'

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  image: string
}

export function CryptoWidget() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCryptos() {
      try {
        // Fetch data from CoinGecko (Top 5 coins by Market Cap + Ripple + Polkadot + Doge to match UI request, limiting to 5 for widget compact)
        // Using 'sparkline=false' to save bandwidth
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=bitcoin,ethereum,solana,binancecoin,ripple&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h',
          { next: { revalidate: 60 } } // Cache for 60 seconds
        )

        if (!response.ok) {
          throw new Error('CoinGecko API Error')
        }

        const data = await response.json()
        setCryptos(data)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar precos:', error)
        // Fallback data if API fails (rate limits usually)
        if (cryptos.length === 0) {
          setCryptos([
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 580000, price_change_percentage_24h: 1.2, market_cap: 0, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 18000, price_change_percentage_24h: -0.5, market_cap: 0, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
            { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 850, price_change_percentage_24h: 3.5, market_cap: 0, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' }
          ])
        }
        setLoading(false)
      }
    }

    fetchCryptos()
    const interval = setInterval(fetchCryptos, 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse border border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-brand-dark-blue to-brand-primary-blue rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          Precos ao Vivo
        </h3>
        <span className="text-xs text-gray-300">
          Atualizado agora
        </span>
      </div>

      <div className="space-y-3">
        {cryptos.map((crypto) => {
          const isPositive = crypto.price_change_percentage_24h >= 0

          return (
            <div
              key={crypto.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">
                      {crypto.symbol.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-300">
                      {crypto.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-white">
                    R$ {crypto.current_price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? 'UP' : 'DOWN'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <Text className="text-xs text-gray-300 text-center">
          Dados fornecidos por CoinGecko
        </Text>
      </div>
    </div>
  )
}
