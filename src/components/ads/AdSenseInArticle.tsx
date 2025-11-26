'use client'

import { useEffect } from 'react'

interface AdSenseInArticleProps {
  slot?: string
  className?: string
}

/**
 * Anúncio In-Article - Melhor performance (RPM $8-12)
 * Posicionar no meio do conteúdo do artigo
 */
export function AdSenseInArticle({ 
  slot = '2401624018', // Slot In-Article 1 configurado
  className = '' 
}: AdSenseInArticleProps) {
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
