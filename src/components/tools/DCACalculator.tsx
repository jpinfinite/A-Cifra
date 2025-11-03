'use client'

import { useState } from 'react'
import { Target } from '@/components/icons/SocialIcons'

export function DCACalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState('')
  const [months, setMonths] = useState('')
  const [result, setResult] = useState<{
    totalInvested: number
    averagePrice: number
    totalCoins: number
  } | null>(null)

  const calculate = () => {
    const amount = parseFloat(monthlyAmount)
    const period = parseInt(months)

    if (!amount || !period || amount <= 0 || period <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos')
      return
    }

    const totalInvested = amount * period
    // Simulação simples - em produção, usar dados reais de preço
    const averagePrice = 50000 // Preço médio simulado
    const totalCoins = totalInvested / averagePrice

    setResult({
      totalInvested,
      averagePrice,
      totalCoins
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-brand-gold">
          <Target size="24" />
        </div>
        <h3 className="text-lg font-semibold">Calculadora DCA</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Calcule o resultado de investimentos periódicos (Dollar Cost Averaging) 
        em diferentes criptomoedas.
      </p>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Valor mensal (R$)"
          value={monthlyAmount}
          onChange={(e) => setMonthlyAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <input
          type="number"
          placeholder="Período (meses)"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold">
          <option>Bitcoin (BTC)</option>
          <option>Ethereum (ETH)</option>
          <option>Outras</option>
        </select>
        <button 
          onClick={calculate}
          className="w-full py-2 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors"
        >
          Calcular
        </button>

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Resultado:</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Total Investido:</strong> R$ {result.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Preço Médio:</strong> R$ {result.averagePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Total de Moedas:</strong> {result.totalCoins.toFixed(8)} BTC</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
