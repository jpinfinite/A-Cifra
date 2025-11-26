'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto'
}

/**
 * Componente de imagem responsiva com suporte a WebP/AVIF
 * Gera automaticamente srcset para diferentes tamanhos
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 662px, 1024px',
  aspectRatio = 'video'
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Extrair nome base e extensão
  const getImageVariants = (imageSrc: string) => {
    const basePath = imageSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '')

    // Verificar se já existem variantes otimizadas
    const hasOptimizedVariants = imageSrc.includes('-sm') || imageSrc.includes('-md') || imageSrc.includes('-lg')

    if (hasOptimizedVariants) {
      return {
        avif: {
          sm: `${basePath}-sm.avif`,
          md: `${basePath}-md.avif`,
          lg: `${basePath}-lg.avif`,
        },
        webp: {
          sm: `${basePath}-sm.webp`,
          md: `${basePath}-md.webp`,
          lg: `${basePath}-lg.webp`,
        },
        fallback: imageSrc
      }
    }

    // Se não tem variantes, usar apenas a imagem original
    return {
      avif: { sm: '', md: '', lg: '' },
      webp: { sm: '', md: '', lg: '' },
      fallback: imageSrc
    }
  }

  const variants = getImageVariants(src)
  const hasOptimizedVariants = variants.avif.sm !== ''

  const aspectRatioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: ''
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget

    // Se falhar, tentar fallback direto
    if (img.src !== variants.fallback) {
      img.src = variants.fallback
      return
    }

    setHasError(true)
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200',
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <span className="text-gray-400 text-sm">Imagem não disponível</span>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}

      <picture>
        {/* AVIF - Melhor compressão (apenas se existir) */}
        {hasOptimizedVariants && (
          <source
            type="image/avif"
            srcSet={`${variants.avif.sm} 384w`}
            sizes={sizes}
          />
        )}

        {/* WebP - Boa compressão e compatibilidade (apenas se existir) */}
        {hasOptimizedVariants && (
          <source
            type="image/webp"
            srcSet={`${variants.webp.sm} 384w`}
            sizes={sizes}
          />
        )}

        {/* Fallback JPEG/PNG */}
        <img
          src={variants.fallback}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </div>
  )
}
