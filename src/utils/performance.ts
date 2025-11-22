/**
 * Utilitários para otimização de performance
 */

/**
 * Debounce function - atrasa a execução até que pare de ser chamada
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function - limita a frequência de execução
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Lazy load de scripts externos
 */
export function loadScript(src: string, async = true): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verifica se o script já foi carregado
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = async

    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

    document.body.appendChild(script)
  })
}

/**
 * Preload de recursos críticos
 */
export function preloadResource(href: string, as: string, type?: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (type) link.type = type

  document.head.appendChild(link)
}

/**
 * Prefetch de recursos para navegação futura
 */
export function prefetchResource(href: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href

  document.head.appendChild(link)
}

/**
 * Verifica se o usuário prefere reduzir movimento (acessibilidade)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Verifica se a conexão é lenta (save-data ou slow-2g/2g)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }

  const connection = (navigator as any).connection
  return (
    connection?.saveData ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g'
  )
}

/**
 * Obtém métricas de Web Vitals
 */
export function reportWebVitals(metric: any) {
  // Envia para Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // Log em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
