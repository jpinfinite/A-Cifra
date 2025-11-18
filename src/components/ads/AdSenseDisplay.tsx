'use client'

import { AdSense } from './AdSense'

interface AdSenseDisplayProps {
  adSlot: string
  className?: string
}

/**
 * Anúncio Display Responsivo - Banner padrão
 * Recomendado: Sidebar, topo da página, entre seções
 */
export function AdSenseDisplay({ adSlot, className = '' }: AdSenseDisplayProps) {
  return (
    <div className={`my-6 ${className}`}>
      <div className="text-center text-xs text-gray-400 mb-2">Publicidade</div>
      <AdSense
        adSlot={adSlot}
        adFormat="auto"
        fullWidthResponsive={true}
        className="min-h-[250px]"
      />
    </div>
  )
}
