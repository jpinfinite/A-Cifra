'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  fill = false 
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [, setHasError] = useState(false)

  // Garantir que o src está correto
  const correctSrc = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`
  
  useEffect(() => {
    setImageSrc(src)
    setHasError(false)
    setIsLoading(true)
  }, [src])

  const handleError = () => {
    console.warn(`Erro ao carregar imagem: ${src}`)
    setHasError(true)
    setIsLoading(false)
    // Fallback para uma imagem padrão
    setImageSrc('/images/general/placeholder.svg')
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  if (fill) {
    return (
      <div className={cn('relative w-full h-full', className)}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        <img
          src={correctSrc}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div 
          className="bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      <img
        src={correctSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  )
}