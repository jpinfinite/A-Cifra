'use client'

import { useEffect } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdUnit({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '',
  style = {}
}: AdUnitProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  // Não renderizar em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center min-h-[250px] ${className}`}
        style={style}
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Ad Placeholder ({format})
        </p>
      </div>
    )
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
