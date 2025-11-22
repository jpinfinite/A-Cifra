'use client'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-brand-primary-blue text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 font-medium transition-all duration-200"
    >
      Pular para o conteúdo principal
    </a>
  )
}
