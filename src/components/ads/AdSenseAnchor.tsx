'use client'

import { useEffect } from 'react'

/**
 * Anúncio Âncora (Sticky Bottom) - Excelente para mobile (RPM $10-15)
 * Fica fixo na parte inferior da tela
 */
export function AdSenseAnchor() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: 'ca-pub-1151448515464841',
          enable_page_level_ads: true,
          overlays: { bottom: true }
        })
      }
    } catch (err) {
      console.error('AdSense Anchor error:', err)
    }
  }, [])

  return null // Anúncio âncora é gerenciado automaticamente pelo AdSense
}
