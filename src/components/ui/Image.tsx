'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface ImageProps extends NextImageProps {
  fallbackSrc?: string
}

export function Image({
  src,
  alt,
  fallbackSrc = '/images/general/cifra-principal.png',
  className,
  onError,
  ...props
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
    onError?.(error)
  }

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      decoding="async"
      className={cn(
        hasError && 'grayscale',
        className
      )}
      {...props}
    />
  )
}
