'use client'

import { useState } from 'react'
import { Lightbulb } from '@/components/icons/SocialIcons'

export function StakingCalculator() {
  const [stakingAmount, setStakingAmount] = useState('')
  const [apy, setApy] = useState('')
  const [result, setResult] = useState<{
    dailyReward: number
    monthlyReward: number
    yearlyReward: number
    totalAfterYear: number
  } | null>(null)

  const calculate = () => {
    const amount = parseFloat(stakingAmount)
    const apyValue = parseFloat(apy)

    if (!amount || !apyValue || amount <= 0 || apyValue <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos')
      return
    }

    const yearlyReward = (amount * apyValue) / 100
    const monthlyReward = yearlyReward / 12
    const dailyReward = yearlyReward / 365
    const totalAfterYear = amount + yearlyReward

    setResult({
      dailyReward,
      monthlyReward,
      yearlyReward,
      totalAfterYear
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-brand-gold">
          <Lightbulb size="24" />
        </div>
        <h3 className="text-lg font-semibold">Calculadora Staking</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Simule rendimentos de staking em diferentes criptomoedas 
        proof-of-stake.
      </p>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Valor em staking (R$)"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <input
          type="number"
          placeholder="APY anual (%)"
          value={apy}
          onChange={(e) => setApy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold">
          <option>Ethereum (ETH)</option>
          <option>Cardano (ADA)</option>
          <option>Solana (SOL)</option>
        </select>
        <button 
          onClick={calculate}
          className="w-full py-2 bg-brand-primary-blue text-white rounded-lg hover:bg-brand-medium-blue transition-colors"
        >
          Calcular
        </button>

        {result && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Rendimentos Estimados:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Por Dia:</strong> R$ {result.dailyReward.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Por Mês:</strong> R$ {result.monthlyReward.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Por Ano:</strong> R$ {result.yearlyReward.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="pt-2 border-t border-blue-300"><strong>Total após 1 ano:</strong> R$ {result.totalAfterYear.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
