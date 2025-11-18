'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
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
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}
