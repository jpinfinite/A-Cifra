import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A Cifra - Cryptocurrency News & Education',
  description: 'Learn about Bitcoin, cryptocurrencies, DeFi, NFTs and blockchain technology',
  alternates: {
    canonical: 'https://a-cifra.com.br/en',
    languages: {
      'pt-BR': 'https://a-cifra.com.br',
      'en': 'https://a-cifra.com.br/en'
    }
  }
}

export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
