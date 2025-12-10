import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A Cifra - Noticias y Educación sobre Criptomonedas',
  description: 'Aprenda sobre Bitcoin, criptomonedas, DeFi, NFTs y tecnología blockchain',
  alternates: {
    canonical: 'https://a-cifra.com.br/es',
    languages: {
      'pt-BR': 'https://a-cifra.com.br',
      'en': 'https://a-cifra.com.br/en',
      'es': 'https://a-cifra.com.br/es'
    }
  }
}

export default function EsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
