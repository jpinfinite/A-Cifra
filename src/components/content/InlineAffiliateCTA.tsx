'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackAffiliateCTAView, trackAffiliateCTAClick } from '@/utils/analytics'

interface InlineAffiliateCTAProps {
  text?: string
  exchange?: 'bitget' | 'binance' | 'coinbase' | 'all'
  variant?: 'primary' | 'secondary' | 'minimal'
}

export function InlineAffiliateCTA({
  text = 'Abra sua conta e ganhe bônus',
  exchange = 'all',
  variant = 'primary'
}: InlineAffiliateCTAProps) {
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
              'inline',
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
      'inline',
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
      color: 'blue'
    },
    binance: {
      name: 'Binance',
      url: 'https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=pt-BR&ref=GRO_28502_DYYIY&utm_source=default&utm_medium=web_share_copy',
      bonus: 'cashback em USDC',
      color: 'yellow'
    },
    coinbase: {
      name: 'Coinbase',
      url: 'https://coinbase.com/join/SQ2J3GP?src=android-link',
      bonus: '$10 em Bitcoin',
      color: 'indigo'
    }
  }

  if (variant === 'minimal') {
    const ex = exchange === 'all' ? exchanges.bitget : exchanges[exchange]
    return (
      <span ref={ctaRef}>
        <a
          href={ex.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => handleClick(ex.name, ex.url)}
          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline decoration-2 underline-offset-2"
        >
          {text} →
        </a>
      </span>
    )
  }

  if (variant === 'secondary') {
    const ex = exchange === 'all' ? exchanges.bitget : exchanges[exchange]
    return (
      <div ref={ctaRef} className="my-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 <strong>Dica:</strong> {text}{' '}
          <a
            href={ex.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick(ex.name, ex.url)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline"
          >
            na {ex.name} e ganhe {ex.bonus}
          </a>
        </p>
      </div>
    )
  }

  // Primary variant
  if (exchange === 'all') {
    return (
      <div ref={ctaRef} className="my-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
        <p className="text-center text-gray-700 dark:text-gray-300 mb-3 font-medium">
          🎁 {text}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href={exchanges.bitget.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick('Bitget', exchanges.bitget.url)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-center text-sm"
          >
            Bitget - {exchanges.bitget.bonus}
          </a>
          <a
            href={exchanges.binance.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick('Binance', exchanges.binance.url)}
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors text-center text-sm"
          >
            Binance - {exchanges.binance.bonus}
          </a>
          <a
            href={exchanges.coinbase.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => handleClick('Coinbase', exchanges.coinbase.url)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-center text-sm"
          >
            Coinbase - {exchanges.coinbase.bonus}
          </a>
        </div>
      </div>
    )
  }

  // Single exchange
  const ex = exchanges[exchange]
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    indigo: 'bg-indigo-600 hover:bg-indigo-700'
  }

  return (
    <div ref={ctaRef} className="my-6 text-center">
      <a
        href={ex.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => handleClick(ex.name, ex.url)}
        className={`inline-block px-6 py-3 ${colorClasses[ex.color]} text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105`}
      >
        🎁 {text} na {ex.name} - Ganhe {ex.bonus} →
      </a>
    </div>
  )
}

