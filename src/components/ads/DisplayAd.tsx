'use client'

import { useEffect } from 'react'

interface DisplayAdProps {
  slot?: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function DisplayAd({ 
  slot,
  format = 'auto',
  className = '' 
}: DisplayAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense error handled silently
    }
  }, [])

  return (
    <div className={`display-ad-container my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1151448515464841"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
