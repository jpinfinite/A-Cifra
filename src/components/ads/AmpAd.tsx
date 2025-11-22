'use client'

import { useEffect } from 'react'

interface AmpAdProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AmpAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '' 
}: AmpAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`amp-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1151448515464841"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
