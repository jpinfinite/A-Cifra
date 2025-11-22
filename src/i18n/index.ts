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
  
  let value: unknown = t
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      value = undefined
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

export * from './config'
