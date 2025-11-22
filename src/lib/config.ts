import { SiteConfig, Category } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'A Cifra',
  description:
    'Seu guia completo sobre criptomoedas, blockchain e investimentos digitais. Análises profundas, notícias atualizadas e educação financeira sobre Bitcoin, Ethereum, DeFi e NFTs.',
  url: 'https://a-cifra.com.br',
  logo: {
    src: '/images/logos/cifra-principal.png',
    alt: 'A Cifra - Blog sobre Criptomoedas',
  },
  social: {
    twitter: 'https://x.com/acifra_btc',
    instagram: 'https://www.instagram.com/cifras_coins',
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  },
}

export const categories: Category[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    slug: 'bitcoin',
    description: 'Tudo sobre Bitcoin, a primeira e maior criptomoeda do mundo',
    color: '#F7931A',
    icon: '₿',
  },
  {
    id: 'altcoins',
    name: 'Altcoins',
    slug: 'altcoins',
    description: 'Análises e notícias sobre criptomoedas alternativas',
    color: '#155C8B',
    icon: '🪙',
  },
  {
    id: 'defi',
    name: 'DeFi',
    slug: 'defi',
    description: 'Finanças descentralizadas e protocolos DeFi',
    color: '#E1A441',
    icon: '🏦',
  },
  {
    id: 'nfts',
    name: 'NFTs',
    slug: 'nfts',
    description: 'Tokens não fungíveis e arte digital',
    color: '#00283B',
    icon: '🎨',
  },
  {
    id: 'analises',
    name: 'Análises',
    slug: 'analises',
    description: 'Análises técnicas e fundamentais do mercado crypto',
    color: '#041924',
    icon: '📊',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    slug: 'ethereum',
    description: 'Tudo sobre Ethereum, smart contracts e ecossistema DeFi',
    color: '#627EEA',
    icon: '◆',
  },
  {
    id: 'seguranca',
    name: 'Segurança',
    slug: 'seguranca',
    description: 'Guias de segurança e proteção de ativos digitais',
    color: '#DC2626',
    icon: '🔒',
  },
  {
    id: 'educacao',
    name: 'Educação',
    slug: 'educacao',
    description: 'Aprenda sobre blockchain e criptomoedas',
    color: '#155C8B',
    icon: '📚',
  },
  {
    id: 'tutoriais',
    name: 'Tutoriais',
    slug: 'tutoriais',
    description: 'Guias práticos e tutoriais passo a passo',
    color: '#10B981',
    icon: '🎓',
  },
  {
    id: 'memecoin',
    name: 'Memecoin',
    slug: 'memecoin',
    description: 'Análises e notícias sobre memecoins e tokens virais',
    color: '#FF6B35',
    icon: '🐕',
  },
]
