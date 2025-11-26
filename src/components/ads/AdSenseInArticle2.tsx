'use client'

import { useEffect } from 'react'

interface AdSenseInArticle2Props {
  slot?: string
  className?: string
}

/**
 * Segundo Anúncio In-Article - Para usar no final do artigo
 * Usa slot diferente para evitar conflitos
 */
export function AdSenseInArticle2({ 
  slot = '3416033223', // Slot In-Article 2 configurado
  className = '' 
}: AdSenseInArticle2Props) {
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
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-1151448515464841"
        data-ad-slot={slot}
      />
    </div>
  )
}
