'use client'

import { AdSense } from './AdSense'

interface AdSenseInArticleProps {
  adSlot: string
  className?: string
}

/**
 * Anúncio In-Article - Aparece dentro do conteúdo do artigo
 * Recomendado: Colocar após 2-3 parágrafos do artigo
 */
export function AdSenseInArticle({ adSlot, className = '' }: AdSenseInArticleProps) {
  return (
    <div className={`my-8 ${className}`}>
      <div className="text-center text-xs text-gray-400 mb-2">Publicidade</div>
      <AdSense
        adSlot={adSlot}
        adFormat="fluid"
        adLayout="in-article"
        className="max-w-4xl mx-auto"
      />
    </div>
  )
}
