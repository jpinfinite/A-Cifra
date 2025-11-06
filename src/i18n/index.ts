import { Locale, defaultLocale } from './config'
import ptTranslations from './locales/pt.json'
import enTranslations from './locales/en.json'

const translations = {
  pt: ptTranslations,
  en: enTranslations
}

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale]
}

export function translate(locale: Locale, key: string): string {
  const t = getTranslations(locale)
  const keys = key.split('.')
  
  let value: any = t
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  
  return value || key
}

export * from './config'
