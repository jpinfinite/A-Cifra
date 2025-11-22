'use client'

import { useEffect } from 'react'

interface InArticleAdProps {
  slot?: string
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function InArticleAd({ slot, className = '' }: InArticleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <div className="w-full max-w-3xl">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          Publicidade
        </p>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client="ca-pub-1151448515464841"
          data-ad-slot={slot}
          data-ad-layout="in-article"
          data-ad-format="fluid"
        />
      </div>
    </div>
  )
}
