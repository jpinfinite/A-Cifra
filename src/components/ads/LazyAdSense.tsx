'use client'

import { useEffect, useRef, useState } from 'react'

interface LazyAdSenseProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
}

/**
 * Componente AdSense com lazy loading
 * Carrega anúncios apenas quando estão próximos da viewport
 */
export function LazyAdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}: LazyAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    if (!adRef.current) return

    // Intersection Observer para detectar quando o anúncio está próximo da viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px' // Carregar 200px antes de entrar na viewport
      }
    )

    observer.observe(adRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible || adLoaded) return

    // O script do AdSense já está carregado no layout.tsx
    // Apenas inicializar o anúncio quando visível
    function initializeAd() {
      try {
        if (adRef.current && !adLoaded && window.adsbygoogle) {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          setAdLoaded(true)
        }
      } catch {
        // AdSense error handled silently
      }
    }

    // Aguardar um pouco para garantir que o script do AdSense está carregado
    const timer = setTimeout(initializeAd, 100)
    return () => clearTimeout(timer)
  }, [isVisible, adLoaded])

  return (
    <div ref={adRef} className={className}>
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1151448515464841"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      ) : (
        // Placeholder enquanto não carrega
        <div 
          className="bg-gray-100 animate-pulse"
          style={{ minHeight: '250px' }}
          aria-label="Carregando anúncio"
        />
      )}
    </div>
  )
}

// Declaração de tipos para TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}
