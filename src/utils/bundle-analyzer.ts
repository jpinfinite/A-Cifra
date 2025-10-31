/**
 * Bundle analysis utilities for development
 */

export function logBundleInfo() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis enabled in development mode')
  }
}

/**
 * Dynamic import wrapper with error handling
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    console.error('Dynamic import failed:', error)
    if (fallback) {
      return fallback
    }
    throw error
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'
  ]

  fontLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
  })
}

/**
 * Lazy load non-critical components
 */
export const LazyComponents = {
  // Example: lazy load heavy components
  // SearchModal: dynamic(() => import('@/components/SearchModal'), {
  //   loading: () => <div>Loading...</div>
  // })
}