'use client'

import { useState, useEffect } from 'react'
import { getTranslations, type Locale } from '@/i18n'

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('pt')
  const [translations, setTranslations] = useState(getTranslations('pt'))

  useEffect(() => {
    // Obter idioma do localStorage ou navegador
    const savedLocale = localStorage.getItem('locale') as Locale
    const browserLocale = navigator.language.split('-')[0] as Locale
    
    const currentLocale = savedLocale || 
                          (['pt', 'en'].includes(browserLocale) ? browserLocale : 'pt')
    
    setLocale(currentLocale as Locale)
    setTranslations(getTranslations(currentLocale as Locale))
  }, [])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    
    return value || key
  }

  return { t, locale }
}
