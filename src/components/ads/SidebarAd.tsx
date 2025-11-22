'use client'

import { AdUnit } from './AdUnit'

interface SidebarAdProps {
  slot: string
  sticky?: boolean
}

export function SidebarAd({ slot, sticky = true }: SidebarAdProps) {
  return (
    <div className={`hidden lg:block ${sticky ? 'sticky top-24' : ''}`}>
      <AdUnit 
        slot={slot}
        format="rectangle"
        responsive={false}
        style={{ width: '300px', height: '600px' }}
      />
    </div>
  )
}
