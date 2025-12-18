'use client'

import { useEffect, useState, useRef } from 'react'

interface SidebarAdProps {
  slot?: string
  sticky?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function SidebarAd({
  slot,
  sticky = false,
  className = ''
}: SidebarAdProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !adRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // Carrega quando estiver a 200px de entrar na tela
    )

    observer.observe(adRef.current)

    return () => observer.disconnect()
  }, [isMounted])

  useEffect(() => {
    if (isVisible) {
      const initAd = () => {
        try {
          if (typeof window !== 'undefined') {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        } catch (e) {
          console.error('AdSense error:', e)
        }
      }

      // Delay pequeno para garantir layout
      const timer = setTimeout(initAd, 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!isMounted) {
    return (
      <div className={`sidebar-ad-container ${sticky ? 'lg:sticky lg:top-24' : ''} ${className} min-h-[250px] bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse`} />
    )
  }

  return (
    <div
      ref={adRef}
      className={`sidebar-ad-container ${sticky ? 'lg:sticky lg:top-24' : ''} ${className} min-h-[250px] overflow-hidden`}
    >
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[inherit]">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          Publicidade
        </p>

        {isVisible ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minWidth: '250px' }}
            data-ad-client="ca-pub-1151448515464841"
            data-ad-slot={slot}
            data-ad-format="vertical"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="min-h-[250px] flex items-center justify-center text-gray-400">
            Carregando...
          </div>
        )}
      </div>
    </div>
  )
}
