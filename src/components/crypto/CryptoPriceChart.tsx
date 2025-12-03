'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContegend } from 'recharts'
import { Heading, Text } from '@/components/ui'

interface CryptoPriceChartProps {
  symbol?: string
  days?: number
  height?: number
}

interface PriceData {
  date: string
  price: number
  timestamp: number
}

export function CryptoPriceChart({
  symbol = 'bitcoin',
  days = 7,
  height = 400
}: CryptoPriceChartProps) {
  const [data, setData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number | null>(null)

  useEffect(() => {
    fetchPriceData()
  }, [symbol, days])

  async function fetchPriceData() {
    setLoading(true)
    setError(null)

    try {
      // CoinGecko API (gratuita, sem API key)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=brl&days=${days}`
      )

      if (!response.ok) {
        throw new Error('Erro ao buscar dados')
      }

      const result = await response.json()

      // Processar dados
      const prices: PriceData[] = result.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        }),
        price: Math.round(price),
        timestamp
      }))

      setData(prices)

      // Calcular preço atual e variação
      if (prices.length > 0) {
        const current = prices[prices.length - 1].price
        const first = prices[0].price
        const change = ((current - first) / first) * 100

        setCurrentPrice(current)
        setPriceChange(change)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8">
        <Text className="text-red-800">❌ {error}</Text>
      </div>
    )
  }

  const isPositive = (priceChange || 0) >= 0

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={3} className="mb-2">
            {symbol.charAt(0).toUpperCase() + symbol.slice(1)}
          </Heading>
          {currentPrice && (
            <div className="flex items-baseline gap-3">
              <Text className="text-3xl font-bold text-gray-900">
                R$ {currentPrice.toLocaleString('pt-BR')}
              </Text>
              {priceChange !== null && (
                <span className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '↗' : '↘'} {Math.abs(priceChange).toFixed(2)}%
                </span>
              )}
            </div>
          )}
          <Text className="text-sm text-gray-500 mt-1">
            Últimos {days} dias
          </Text>
        </div>

        {/* Botões de período */}
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => fetchPriceData()}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${days === d
                  ? 'bg-brand-primary-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Preço']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-xs text-gray-500 text-center">
          Dados fornecidos por CoinGecko • Atualizado em tempo real
        </Text>
      </div>
    </div>
  )
}

