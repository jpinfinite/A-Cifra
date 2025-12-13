'use client'

import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        try {
          if (typeof window !== 'undefined') {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        } catch (e) {
           console.error('AdSense error:', e)
        }
      }, 500) // Delay to ensure container has width

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
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-1151448515464841"
          data-ad-slot={slot}
          data-ad-format="vertical"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
