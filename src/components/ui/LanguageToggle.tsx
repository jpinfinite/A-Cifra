'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'

interface LanguageToggleProps {
  currentLang: 'pt-BR' | 'en'
  alternateSlug?: string
  className?: string
}

/**
 * Componente de alternância de idioma
 * Permite trocar entre versões PT-BR e EN dos artigos
 */
export function LanguageToggle({ 
  currentLang, 
  alternateSlug,
  className = '' 
}: LanguageToggleProps) {
  // Se não tem slug alternativo, não mostrar o toggle
  if (!alternateSlug) {
    return null
  }
  
  const isPortuguese = currentLang === 'pt-BR'
  const targetUrl = isPortuguese 
    ? `/en/article/${alternateSlug}`
    : `/artigo/${alternateSlug}`
  
  return (
    <div className={`language-toggle ${className}`}>
      <Link
        href={targetUrl}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary-blue/10 hover:bg-brand-primary-blue/20 text-brand-primary-blue transition-colors duration-200"
        aria-label={`Switch to ${isPortuguese ? 'English' : 'Portuguese'}`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isPortuguese ? 'Read in English' : 'Ler em Português'}
        </span>
        <span className="text-xs opacity-75">
          {isPortuguese ? '🇺🇸 EN' : '🇧🇷 PT'}
        </span>
      </Link>
    </div>
  )
}
