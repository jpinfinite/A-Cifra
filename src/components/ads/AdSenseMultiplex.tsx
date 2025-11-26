'use client'

import { useEffect } from 'react'

interface AdSenseMultiplexProps {
  slot?: string
  className?: string
}

/**
 * Anúncio Multiplex - Artigos relacionados com anúncios (RPM $4-6)
 * Posicionar no final do artigo
 */
export function AdSenseMultiplex({ 
  slot = '5064156814', // Slot Footer/Multiplex configurado
  className = '' 
}: AdSenseMultiplexProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch {
      // AdSense error handled silently
    }
  }, [])

  return (
    <div className={`my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-1151448515464841"
        data-ad-slot={slot}
      />
    </div>
  )
}
