export const locales = ['pt', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

export const localeNames: Record<Locale, string> = {
  pt: 'Português',
  es: 'Español'
}

export const localeFlags: Record<Locale, string> = {
  pt: '🇧🇷',
  es: '🇪🇸'
}
