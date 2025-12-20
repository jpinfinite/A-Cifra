'use client'

import { useEffect, useRef, useState } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' | 'autorelaxed'
  responsive?: string
  className?: string
  minHeight?: string | number
}

export function AdSlot({
  slot,
  format = 'rectangle',
  responsive = 'true',
  className = '',
  minHeight = '280px'
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pushedRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !adRef.current || pushedRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!pushedRef.current) {
            pushedRef.current = true
            try {


              (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (e) {
              console.error('AdSense push error:', e)
            }
          }
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(adRef.current)

    return () => observer.disconnect()
  }, [isMounted, slot])

  return (
    <div
      className={`flex justify-center items-center my-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '300px' }}
          data-ad-client="ca-pub-1151448515464841"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
        <span className="absolute text-[10px] text-gray-400 uppercase tracking-widest font-medium pointer-events-none -z-10">
          Publicidade
        </span>
      </div>
    </div>
  )
}
