'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from '@/components/icons/SocialIcons'

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
}

export function CryptoTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=pt'
        )
        
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        setPrices(data)
        setLoading(false)
        setError(false)
      } catch (err) {
        console.error('Error fetching crypto prices:', err)
        setError(true)
        setLoading(false)
      }
    }

    fetchPrices()
    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchPrices, 60000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-brand-dark-blue text-white py-3 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-gold"></div>
            <span className="text-sm">Carregando cotações...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-brand-dark-blue text-white py-3 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>⚠️ Erro ao carregar cotações</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-dark-blue text-white py-3 overflow-hidden border-b border-gray-800">
      <div className="relative">
        <div className="animate-scroll flex gap-8 whitespace-nowrap">
          {/* Primeira cópia */}
          {prices.map((crypto) => (
            <div key={`${crypto.id}-1`} className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-brand-gold">
                {crypto.symbol.toUpperCase()}
              </span>
              <span className="font-mono">
                R$ {crypto.current_price.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
              <span className={`flex items-center gap-1 ${
                crypto.price_change_percentage_24h >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
          
          {/* Segunda cópia para loop infinito */}
          {prices.map((crypto) => (
            <div key={`${crypto.id}-2`} className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-brand-gold">
                {crypto.symbol.toUpperCase()}
              </span>
              <span className="font-mono">
                R$ {crypto.current_price.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
              <span className={`flex items-center gap-1 ${
                crypto.price_change_percentage_24h >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
