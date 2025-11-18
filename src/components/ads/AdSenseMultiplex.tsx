'use client'

import { AdSense } from './AdSense'

interface AdSenseMultiplexProps {
  adSlot: string
  className?: string
}

/**
 * Anúncio Multiplex - Grid de anúncios relacionados
 * Recomendado: Final do artigo, seção "Leia também"
 */
export function AdSenseMultiplex({ adSlot, className = '' }: AdSenseMultiplexProps) {
  return (
    <div className={`my-8 ${className}`}>
      <div className="text-center text-xs text-gray-400 mb-2">Conteúdo Relacionado</div>
      <AdSense
        adSlot={adSlot}
        adFormat="autorelaxed"
        className="min-h-[300px]"
      />
    </div>
  )
}
