'use client'

import { useEffect, useState } from 'react'

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
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-[280px] w-full flex items-center justify-center animate-pulse">
          <span className="text-xs text-gray-400">Publicidade</span>
        </div>
      </div>
    )
  }

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
