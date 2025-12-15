'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  loading?: 'lazy' | 'eager'
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  quality = 85,
  loading = 'lazy',
  onError
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fallback para imagem padrão se houver erro
  const fallbackSrc = '/images/general/placeholder.svg'

  // Garantir que o src está correto
  const imageSrc = imageError ? fallbackSrc : (src.startsWith('/') ? src : `/${src}`)

  const handleError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Erro ao carregar imagem: ${src}`)
    }
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}

      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        loading={priority ? undefined : loading}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        // Força o unoptimized para static export
        unoptimized={process.env.NODE_ENV === 'production'}
      />
    </div>
  )
}
