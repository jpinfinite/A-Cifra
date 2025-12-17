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
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      const initAd = () => {
        try {
          if (typeof window !== 'undefined' && adRef.current) {
            // Check if container has width and is visible
            const width = adRef.current.offsetWidth
            if (width > 0 && window.getComputedStyle(adRef.current).display !== 'none') {
              (window.adsbygoogle = window.adsbygoogle || []).push({})
            } else {
              // Retry once after a delay if width is 0 (e.g., initial render in hidden tab or collapsed sidebar)
              setTimeout(() => {
                if (adRef.current?.offsetWidth && adRef.current.offsetWidth > 0) {
                  (window.adsbygoogle = window.adsbygoogle || []).push({})
                }
              }, 1000)
            }
          }
        } catch (e) {
          console.error('AdSense error:', e)
        }
      }

      // Initial attempt with small delay to ensure layout stability
      const timer = setTimeout(initAd, 1000)

      return () => clearTimeout(timer)
    }
  }, [isMounted])

  if (!isMounted) {
    return (
      <div className={`sidebar-ad-container ${sticky ? 'lg:sticky lg:top-24' : ''} ${className} min-h-[250px]`}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center min-h-[inherit] animate-pulse">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Publicidade
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`sidebar-ad-container ${sticky ? 'lg:sticky lg:top-24' : ''} ${className} min-h-[250px]`}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[inherit]">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          Publicidade
        </p>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '250px' }}
          data-ad-client="ca-pub-1151448515464841"
          data-ad-slot={slot}
          data-ad-format="vertical"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
