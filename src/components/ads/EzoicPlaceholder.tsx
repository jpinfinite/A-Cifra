/**
 * Componente de Placeholder para Anúncios Ezoic
 * 
 * Use este componente para sugerir posições de anúncios ao Ezoic.
 * O Ezoic vai usar IA para otimizar automaticamente.
 * 
 * @example
 * <EzoicPlaceholder id={101} />
 * <EzoicPlaceholder id={102} className="my-4" />
 */

interface EzoicPlaceholderProps {
  /** ID único do placeholder (use números diferentes: 101, 102, 103...) */
  id: number
  /** Classes CSS adicionais */
  className?: string
}

export function EzoicPlaceholder({ id, className = '' }: EzoicPlaceholderProps) {
  return (
    <div 
      id={`ezoic-pub-ad-placeholder-${id}`}
      className={`ezoic-ad ${className}`}
      data-ezoic-ad-id={id}
    />
  )
}

/**
 * Placeholder para anúncios no topo da página
 */
export function EzoicTopAd() {
  return <EzoicPlaceholder id={101} className="mb-6" />
}

/**
 * Placeholder para anúncios no meio do conteúdo
 */
export function EzoicInContentAd() {
  return <EzoicPlaceholder id={102} className="my-6" />
}

/**
 * Placeholder para anúncios no rodapé
 */
export function EzoicBottomAd() {
  return <EzoicPlaceholder id={103} className="mt-6" />
}

/**
 * Placeholder para anúncios na sidebar
 */
export function EzoicSidebarAd() {
  return <EzoicPlaceholder id={104} className="mb-4" />
}
