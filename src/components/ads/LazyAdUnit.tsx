'use client'

import { useIntersectionObserver } from '@/hooks'
import { AdUnit } from './AdUnit'

interface LazyAdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Componente de anúncio com lazy loading
 * Só carrega o anúncio quando está próximo da viewport
 * Melhora performance e Core Web Vitals
 */
export function LazyAdUnit(props: LazyAdUnitProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px', // Carrega 200px antes de entrar na viewport
    freezeOnceVisible: true,
  })

  return (
    <div ref={ref} className={props.className}>
      {isVisible ? (
        <AdUnit {...props} />
      ) : (
        <div 
          className="bg-gray-50 dark:bg-gray-900 min-h-[250px] flex items-center justify-center"
          style={props.style}
        >
          <div className="text-gray-400 text-sm">Carregando anúncio...</div>
        </div>
      )}
    </div>
  )
}
