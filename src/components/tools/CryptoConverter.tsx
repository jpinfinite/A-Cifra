
'use client'

import { useState, useEffect } from 'react'

export function CryptoConverter() {
  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState('bitcoin')
  const [toCurrency, setToCurrency] = useState('brl')
  const [result, setResult] = useState<number | null>(null)
  const [rates, setRates] = useState<any>(null)

  useEffect(() => {
    // Busca inicial de taxas
    fetchRates()
  }, [])

  useEffect(() => {
    calculate()
  }, [amount, fromCurrency, toCurrency, rates])

  async function fetchRates() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=brl,usd,eur')
      const data = await response.json()
      setRates(data)
    } catch (e) {
      console.error("Failed to fetch rates", e)
    }
  }

  function calculate() {
    if (!rates) return

    const val = parseFloat(amount)
    if (isNaN(val)) {
      setResult(null)
      return
    }

    // Logic: simple price gives price of ID in Currency.
    // e.g. bitcoin: { brl: 500000 }

    // If converting From Crypto -> Fiat
    if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
      setResult(val * rates[fromCurrency][toCurrency])
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Conversor de Cripto</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary-blue"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
            >
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="solana">Solana (SOL)</option>
              <option value="tether">Tether (USDT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Para</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
            >
              <option value="brl">Real (BRL)</option>
              <option value="usd">Dólar (USD)</option>
              <option value="eur">Euro (EUR)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">Resultado estimado</p>
          <p className="text-2xl font-bold text-brand-primary-blue">
            {result ? result.toLocaleString('pt-BR', { style: 'currency', currency: toCurrency.toUpperCase() }) : '---'}
          </p>
        </div>
      </div>
    </div>
  )
}
