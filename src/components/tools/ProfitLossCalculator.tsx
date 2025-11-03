'use client'

import { useState } from 'react'
import { TrendingUp } from '@/components/icons/SocialIcons'

export function ProfitLossCalculator() {
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [result, setResult] = useState<{
    profit: number
    profitPercent: number
    totalBuy: number
    totalSell: number
  } | null>(null)

  const calculate = () => {
    const buy = parseFloat(buyPrice)
    const sell = parseFloat(sellPrice)
    const qty = parseFloat(quantity)

    if (!buy || !sell || !qty || buy <= 0 || sell <= 0 || qty <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos')
      return
    }

    const totalBuy = buy * qty
    const totalSell = sell * qty
    const profit = totalSell - totalBuy
    const profitPercent = ((profit / totalBuy) * 100)

    setResult({
      profit,
      profitPercent,
      totalBuy,
      totalSell
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-brand-gold">
          <TrendingUp size="24" />
        </div>
        <h3 className="text-lg font-semibold">Lucro/Prejuízo</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Calcule seu lucro ou prejuízo em operações de criptomoedas, 
        incluindo taxas e impostos.
      </p>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Preço de compra (R$)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <input
          type="number"
          placeholder="Preço de venda (R$)"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <button 
          onClick={calculate}
          className="w-full py-2 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors"
        >
          Calcular
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${result.profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h4 className={`font-semibold mb-2 ${result.profit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              {result.profit >= 0 ? '✅ Lucro' : '❌ Prejuízo'}
            </h4>
            <div className={`space-y-1 text-sm ${result.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              <p><strong>Total Compra:</strong> R$ {result.totalBuy.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Total Venda:</strong> R$ {result.totalSell.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Resultado:</strong> R$ {result.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({result.profitPercent.toFixed(2)}%)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
