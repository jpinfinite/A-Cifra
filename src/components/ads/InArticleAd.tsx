'use client'

import { useEffect } from 'react'

export function InArticleAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-1151448515464841"
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  )
}
