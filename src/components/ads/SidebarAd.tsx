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
      try {
        if (typeof window !== 'undefined') {
          // Check if ad slot is not already filled to avoid "already have ads" error
          // However, Google scripts handle this mostly, but in Strict Mode it fires twice.
          // We just push and catch errors.
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch {
         // Ignorar erro de 'adsbygoogle.push() error: All 'ins' elements... already have ads in them'
         // Isso acontece em desenvolvimento devido ao React Strict Mode
      }
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
