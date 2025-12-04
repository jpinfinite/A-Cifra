'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackAffiliateCTAView, trackAffiliateCTAClick } from '@/utils/analytics'

interface UrgencyCTAProps {
  message?: string
  highlight?: string
  exchange?: 'bitget' | 'binance' | 'coinbase' | 'all'
  variant?: 'warning' | 'success' | 'info'
}

export function UrgencyCTA({
  message = 'Não perca esta oportunidade',
  highlight = 'Cadastre-se agora e ganhe bônus de boas-vindas',
  exchange = 'all',
  variant = 'warning'
}: UrgencyCTAProps) {
  const pathname = usePathname()
  const hasTrackedView = useRef(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Track CTA view when visible
  useEffect(() => {
    if (hasTrackedView.current || !ctaRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            hasTrackedView.current = true
            trackAffiliateCTAView(
              'urgency',
              variant,
              exchange,
              pathname || 'unknown',
              'article-content'
            )
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [exchange, variant, pathname])

  const handleClick = (exchangeName: string, url: string) => {
    trackAffiliateCTAClick(
      'urgency',
      variant,
      exchangeName,
      pathname || 'unknown',
      'article-content',
      url
    )
  }

  const exchanges = {
    bitget: {
      name: 'Bitget',
      url: 'https://share.bitget.com/u/YCFYDWVG?clacCode=CECZRBTM',
      bonus: 'até $5.000',
      icon: '🎁'
    },
    binance: {
      name: 'Binance',
      url: 'https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_DYYIY&utm_source=default&utm_medium=web_share_copy',
      bonus: 'cashback em USDC',
      icon: '💰'
    },
    coinbase: {
      name: 'Coinbase',
      url: 'https://coinbase.com/join/SQ2J3GP?src=android-link',
      bonus: '$10 em Bitcoin',
      icon: '🚀'
    }
  }

  const variantStyles = {
    warning: {
      bg: 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      border: 'border-orange-500 dark:border-orange-600',
      text: 'text-orange-900 dark:text-orange-100',
      icon: '⚡'
    },
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-500 dark:border-green-600',
      text: 'text-green-900 dark:text-green-100',
      icon: '✅'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-500 dark:border-blue-600',
      text: 'text-blue-900 dark:text-blue-100',
      icon: '💡'
    }
  }

  const style = variantStyles[variant]

  if (exchange === 'all') {
    return (
      <div ref={ctaRef} className={`my-8 p-6 ${style.bg} border-2 ${style.border} rounded-xl shadow-lg`}>
        <div className="text-center mb-4">
          <p className={`text-lg font-bold ${style.text} mb-2`}>
            {style.icon} {message}
          </p>
          <p className={`text-base ${style.text} opacity-90`}>
            {highlight}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={exchanges.bitget.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick('Bitget', exchanges.bitget.url)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-md text-center"
          >
            {exchanges.bitget.icon} Bitget - {exchanges.bitget.bonus}
          </a>
          <a
            href={exchanges.binance.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick('Binance', exchanges.binance.url)}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-md text-center"
          >
            {exchanges.binance.icon} Binance - {exchanges.binance.bonus}
          </a>
          <a
            href={exchanges.coinbase.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick('Coinbase', exchanges.coinbase.url)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-md text-center"
          >
            {exchanges.coinbase.icon} Coinbase - {exchanges.coinbase.bonus}
          </a>
        </div>
        <p className="text-center text-xs mt-4 opacity-70">
          ⏰ Oferta por tempo limitado
        </p>
      </div>
    )
  }

  // Single exchange
  const ex = exchanges[exchange]
  return (
    <div ref={ctaRef} className={`my-8 p-6 ${style.bg} border-2 ${style.border} rounded-xl shadow-lg text-center`}>
      <p className={`text-lg font-bold ${style.text} mb-2`}>
        {style.icon} {message}
      </p>
      <p className={`text-base ${style.text} opacity-90 mb-4`}>
        {highlight}
      </p>
      <a
        href={ex.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleClick(ex.name, ex.url)}
        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
      >
        {ex.icon} Abrir Conta na {ex.name} - Ganhe {ex.bonus} →
      </a>
      <p className="text-xs mt-3 opacity-70">
        ⏰ Bônus exclusivo para novos usuários
      </p>
    </div>
  )
}
