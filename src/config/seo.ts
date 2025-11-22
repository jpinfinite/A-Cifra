/**
 * Configurações centralizadas de SEO
 */

export const seoConfig = {
  siteName: 'A Cifra',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://acifra.com',
  defaultTitle: 'A Cifra - Blog sobre Criptomoedas | Análises & Educação Crypto',
  defaultDescription: 'Seu guia completo sobre criptomoedas, blockchain e investimentos digitais. Análises profundas, notícias atualizadas e educação financeira sobre Bitcoin, Ethereum, DeFi e NFTs.',
  defaultKeywords: [
    'criptomoedas',
    'bitcoin',
    'ethereum',
    'blockchain',
    'investimentos',
    'finanças',
    'defi',
    'nfts',
    'análises crypto',
    'educação blockchain',
    'altcoins',
    'memecoin',
  ],
  author: {
    name: 'Jonatha Pereira',
    email: 'cifraaessenciacoin@gmail.com',
  },
  social: {
    twitter: '@acifra',
    facebook: 'https://facebook.com/acifra',
    instagram: 'https://instagram.com/acifra',
  },
  locale: 'pt_BR',
  themeColor: '#155C8B',
  images: {
    default: '/images/cifra-principal.png',
    logo: '/images/logos/favcoin.png',
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-JDX167JXHF',
  },
  adsense: {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1151448515464841',
  },
  verification: {
    google: 'EQ1NeuKXQewCi95LfnGYswqQP4ZANquqMzEc0OllRbE',
    bing: '22305352092034B05EEE259DED78FD7D',
  },
}

export const structuredDataConfig = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}${seoConfig.images.logo}`,
    sameAs: [
      seoConfig.social.twitter,
      seoConfig.social.facebook,
      seoConfig.social.instagram,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: seoConfig.author.email,
      contactType: 'Customer Service',
      availableLanguage: ['Portuguese'],
    },
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/busca?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
}
