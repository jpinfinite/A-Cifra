'use client'

import { AdUnit } from './AdUnit'

interface InArticleAdProps {
  slot: string
  className?: string
}

export function InArticleAd({ slot, className = '' }: InArticleAdProps) {
  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <AdUnit 
        slot={slot}
        format="fluid"
        responsive={true}
        className="w-full max-w-[728px]"
      />
    </div>
  )
}
