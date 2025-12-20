'use client'

import React from 'react'

export function ArticleImage({ src, alt, ...props }: any) {
  // Helper logic for WebP
  const isLocal = src?.startsWith('/')
  const webpSrc = isLocal && /\.(jpg|jpeg|png)$/i.test(src)
    ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    : null

  return (
    <figure className="my-10">
      <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          src={src || ''}
          alt={alt || ''}
          className="rounded-2xl w-full shadow-xl hover:shadow-2xl transition-shadow duration-300"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget
            // Verificação de segurança para evitar loop infinito
            if (target.src.indexOf('cifra-principal.png') === -1) {
              target.src = '/images/general/cifra-principal.png'
              target.classList.add('grayscale')
            }
          }}
          {...props}
        />
      </picture>
      {alt && (
        <figcaption className="text-center text-sm text-gray-600 mt-3 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}
