'use client'

import { useEffect, useState } from 'react'

interface AdSenseMultiplexProps {
  slot?: string
  className?: string
}

/**
 * Anúncio Multiplex - Artigos relacionados com anúncios (RPM $4-6)
 * Posicionar no final do artigo
  */
export function AdSenseMultiplex({
  slot = '2742082553', // Slot Relacionados/Multiplex
  className = ''
}: AdSenseMultiplexProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch {
        // AdSense error handled silently
      }
    }
  }, [isMounted])

  if (!isMounted) {
    return (
      <div className={`my-8 ${className}`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px] w-full flex items-center justify-center animate-pulse">
          <span className="text-xs text-gray-400">Publicidade Recomendada</span>
        </div>
      </div>
    )
  }

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
