'use client'
{ useEffect, useState } from 'react'
import { trackEvent } from '@/utils/analytics'

interface CTAMetrics {
  views: number
  clicks: number
  ctr: number
  exchange: string
  ctaType: string
}

interface ArticleMetrics {
  slug: string
  title: string
  views: number
  clicks: number
  ctr: number
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<{
    totalViews: number
    totalClicks: number
    overallCTR: number
    byExchange: CTAMetrics[]
    byArticle: ArticleMetrics[]
    byCTAType: CTAMetrics[]
  }>({
    totalViews: 0,
    totalClicks: 0,
    overallCTR: 0,
    byExchange: [],
    byArticle: [],
    byCTAType: []
  })

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular dados (em produção, buscar do GA4 API)
    const fetchMetrics = async () => {
      setLoading(true)

      // Dados simulados para demonstração
      const mockData = {
        totalViews: 3450,
        totalClicks: 156,
        overallCTR: 4.52,
        byExchange: [
          { exchange: 'Bitget', views: 1200, clicks: 65, ctr: 5.42, ctaType: 'all' },
          { exchange: 'Binance', views: 1150, clicks: 52, ctr: 4.52, ctaType: 'all' },
          { exchange: 'Coinbase', views: 1100, clicks: 39, ctr: 3.55, ctaType: 'all' }
        ],
        byArticle: [
          { slug: 'bitcoin-100k-dezembro-2025', title: 'Bitcoin $100K Dezembro', views: 850, clicks: 68, ctr: 8.0 },
          { slug: 'como-investir-criptomoedas-2025', title: 'Como Investir em Cripto', views: 720, clicks: 45, ctr: 6.25 },
          { slug: 'melhores-exchanges-brasil-2025', title: 'Melhores Exchanges', views: 680, clicks: 38, ctr: 5.59 },
          { slug: 'staking-criptomoedas-guia-2025', title: 'Staking Guia Completo', views: 520, clicks: 28, ctr: 5.38 },
          { slug: 'defi-guia-completo-iniciantes-2025', title: 'DeFi Guia Completo', views: 480, clicks: 22, ctr: 4.58 }
        ],
        byCTAType: [
          { ctaType: 'urgency', views: 1850, clicks: 95, ctr: 5.14, exchange: 'all' },
          { ctaType: 'inline-primary', views: 1200, clicks: 48, ctr: 4.0, exchange: 'all' },
          { ctaType: 'inline-secondary', views: 400, clicks: 13, ctr: 3.25, exchange: 'all' }
        ]
      }

      setTimeout(() => {
        setMetrics(mockData)
        setLoading(false)
      }, 1000)
    }

    fetchMetrics()
  }, [timeRange])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Dashboard de Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitoramento de performance dos CTAs de afiliados
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['24h', '7d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {range === '24h' ? 'Últimas 24h' : range === '7d' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Visualizações
              </h3>
              <span className="text-2xl">👁️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatNumber(metrics.totalViews)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              +12.5% vs período anterior
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Cliques
              </h3>
              <span className="text-2xl">🖱️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatNumber(metrics.totalClicks)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              +18.3% vs período anterior
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                CTR Médio
              </h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPercent(metrics.overallCTR)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              +0.8pp vs período anterior
            </p>
          </div>
        </div>

        {/* Performance por Exchange */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🏦 Performance por Exchange
          </h2>
          <div className="space-y-4">
            {metrics.byExchange.map((item, index) => (
              <div key={item.exchange} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.exchange}
                    </h3>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPercent(item.ctr)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Visualizações:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {formatNumber(item.views)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Cliques:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {formatNumber(item.clicks)}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(item.clicks / metrics.totalClicks) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Artigos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📝 Top 5 Artigos com Melhor Conversão
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Artigo
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Visualizações
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Cliques
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    CTR
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.byArticle.map((article, index) => (
                  <tr
                    key={article.slug}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                              index === 2 ? 'text-orange-600' :
                                'text-gray-400'
                          }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            /{article.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatNumber(article.views)}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatNumber(article.clicks)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${article.ctr >= 7 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          article.ctr >= 5 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {formatPercent(article.ctr)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance por Tipo de CTA */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎨 Performance por Tipo de CTA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.byCTAType.map(item => (
              <div
                key={item.ctaType}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {item.ctaType === 'urgency' ? '⚡ Urgency CTA' :
                    item.ctaType === 'inline-primary' ? '🎯 Inline Primary' :
                      '💡 Inline Secondary'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Visualizações</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatNumber(item.views)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cliques</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatNumber(item.clicks)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">CTR</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPercent(item.ctr)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights e Recomendações */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            💡 Insights e Recomendações
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Urgency CTAs</strong> têm o melhor desempenho (5.14% CTR). Considere usar mais em artigos de análise de preço.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 text-xl">📊</span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Bitget</strong> lidera em conversões. Destaque mais este parceiro em CTAs principais.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚡</span>
              <p className="text-gray-700 dark:text-gray-300">
                Artigos sobre <strong>Bitcoin</strong> convertem 60% melhor. Priorize CTAs nesses conteúdos.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 dark:text-purple-400 text-xl">🎯</span>
              <p className="text-gray-700 dark:text-gray-300">
                CTR geral de 4.52% está <strong>acima da média do mercado</strong> (3-4%). Continue otimizando!
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
