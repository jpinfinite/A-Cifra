'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n'

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('pt')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Obter idioma do localStorage ou navegador
    const savedLocale = localStorage.getItem('locale') as Locale
    const browserLocale = navigator.language.split('-')[0] as Locale
    
    const locale = savedLocale || 
                   (locales.includes(browserLocale) ? browserLocale : 'pt')
    
    setCurrentLocale(locale)
  }, [])

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale)
    localStorage.setItem('locale', locale)
    setIsOpen(false)
    
    // Recarregar a página para aplicar o novo idioma
    window.location.reload()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Selecionar idioma"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {localeFlags[currentLocale]} {localeNames[currentLocale]}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  currentLocale === locale ? 'bg-brand-off-white' : ''
                }`}
              >
                <span className="text-xl">{localeFlags[locale]}</span>
                <span className={`text-sm ${
                  currentLocale === locale 
                    ? 'font-semibold text-brand-primary-blue' 
                    : 'text-gray-700'
                }`}>
                  {localeNames[locale]}
                </span>
                {currentLocale === locale && (
                  <span className="ml-auto text-brand-primary-blue">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
