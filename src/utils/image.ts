/**
 * Generate responsive image sizes for different breakpoints
 */
export function generateImageSizes(sizes: {
  mobile?: string
  tablet?: string
  desktop?: string
  default?: string
}): string {
  const { mobile = '100vw', tablet = '50vw', desktop = '33vw', default: defaultSize = '100vw' } = sizes
  
  return `(max-width: 768px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop || defaultSize}`
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
): string {
  // If it's already an external URL or data URL, return as is
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src
  }

  const { width, height, quality = 75, format } = options
  const params = new URLSearchParams()

  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  if (quality !== 75) params.set('q', quality.toString())
  if (format) params.set('f', format)

  const queryString = params.toString()
  return queryString ? `${src}?${queryString}` : src
}

/**
 * Generate blur data URL for image placeholders
 */
export function generateBlurDataUrl(width: number = 10, height: number = 10): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  
  if (!canvas) {
    // Fallback for SSR
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGN0ZBIi8+Cjwvc3ZnPgo='
  }

  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Create a simple gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#F5F7FA')
  gradient.addColorStop(0.5, '#E5E7EB')
  gradient.addColorStop(1, '#F5F7FA')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

/**
 * Check if image format is supported
 */
export function isImageFormatSupported(format: string): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  try {
    return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0
  } catch {
    return false
  }
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg'
  
  if (isImageFormatSupported('avif')) return 'avif'
  if (isImageFormatSupported('webp')) return 'webp'
  return 'jpeg'
}