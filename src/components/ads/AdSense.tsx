'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal' | 'autorelaxed'
  adLayout?: string
  adLayoutKey?: string
  fullWidthResponsive?: boolean
  className?: string
}

export function AdSense({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  fullWidthResponsive = true,
  className = '',
  minHeight = '280px' // Default height to prevent CLS
}: AdSenseProps & { minHeight?: string }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              if (typeof window !== 'undefined') {
                (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle =
                  (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
                ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle as unknown[]).push({})
              }
            } catch {
              // Ignore already-loaded errors
            }
            // Disconnect after loading once
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' } // Load 200px before appearing
    )

    const element = document.getElementById(`adsense-${adSlot}`)
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [adSlot])

  return (
    <div
      id={`adsense-${adSlot}`}
      className={`adsense-container bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden my-6 ${className}`}
      style={{ minHeight }}
    >
      <div className="flex items-center justify-center h-full w-full text-xs text-gray-400 absolute z-0 pointer-events-none">
        Publicidade
      </div>
      <ins
        className="adsbygoogle relative z-10"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1151448515464841"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}
