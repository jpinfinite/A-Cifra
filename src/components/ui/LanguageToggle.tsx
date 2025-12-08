'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'

interface LanguageToggleProps {
  currentLang: 'pt-BR' | 'en' | 'es'
  alternateSlug?: string
  alternateSlugPt?: string
  alternateSlugEn?: string
  alternateSlugEs?: string
  className?: string
}

/**
 * Componente de alternância de idioma
 * Permite trocar entre versões PT-BR e EN dos artigos
 */
export function LanguageToggle({
  currentLang,
  alternateSlug,
  alternateSlugPt,
  alternateSlugEn,
  alternateSlugEs,
  className = ''
}: LanguageToggleProps) {
  // Backwards compatibility handling
  let ptSlug = alternateSlugPt
  let enSlug = alternateSlugEn
  const esSlug = alternateSlugEs

  if (alternateSlug) {
    if (currentLang === 'pt-BR') enSlug = alternateSlug
    else if (currentLang === 'en') ptSlug = alternateSlug
  }

  if (!ptSlug && !enSlug && !esSlug) {
    return null
  }

  return (
    <div className={`language-toggle flex flex-wrap gap-2 ${className}`}>
      {ptSlug && currentLang !== 'pt-BR' && (
        <Link
          href={`/artigo/${ptSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors duration-200"
          aria-label="Ler em Português"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">Ler em Português</span>
          <span className="text-xs opacity-75">🇧🇷 PT</span>
        </Link>
      )}

      {enSlug && currentLang !== 'en' && (
        <Link
          href={`/en/article/${enSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors duration-200"
          aria-label="Read in English"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">Read in English</span>
          <span className="text-xs opacity-75">🇺🇸 EN</span>
        </Link>
      )}

      {esSlug && currentLang !== 'es' && (
        <Link
          href={`/es/article/${esSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 transition-colors duration-200"
          aria-label="Leer en Español"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">Leer en Español</span>
          <span className="text-xs opacity-75">🇪🇸 ES</span>
        </Link>
      )}
    </div>
  )
}
