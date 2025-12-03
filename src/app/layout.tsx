import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Poppins } from 'next/font/google'

import '@/styles/globals.css'

import { StructuredData } from '@/components/ui/StructuredData'
import { generateWebsiteStructuredData } from '@/utils/seo'


// Otimização de fontes com estratégia de preload e display swap
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['Inter', 'system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    default: 'A Cifra - Blog sobre Criptomoedas | Análises & Educação Crypto',
    template: '%s | A Cifra - Seu Portal Cripto'
  },
  description: 'Seu guia completo sobre criptomoedas, blockchain e investimentos digitais. Análises profundas, notícias atualizadas e educação financeira sobre Bitcoin, Ethereum, DeFi e NFTs.',
  keywords: ['criptomoedas', 'bitcoin', 'ethereum', 'blockchain', 'investimentos', 'finanças', 'defi', 'nfts', 'análises crypto', 'educação blockchain'],
  authors: [{ name: 'Jonatha Pereira', url: 'https://a-cifra.com.br' }],
  creator: 'Jonatha Pereira',
  publisher: 'A Cifra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://a-cifra.com.br'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logos/favcoin.png',
    apple: '/images/logos/favcoin.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'A Cifra',
  },
  verification: {
    google: 'EQ1NeuKXQewCi95LfnGYswqQP4ZANquqMzEc0OllRbE',
    other: {
      'msvalidate.01': '22305352092034B05EEE259DED78FD7D',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://a-cifra.com.br',
    title: 'A Cifra - Blog sobre Criptomoedas | Análises & Educação Crypto',
    description: 'Seu guia completo sobre criptomoedas, blockchain e investimentos digitais. Análises profundas e educação sobre o mundo crypto.',
    siteName: 'A Cifra',
    images: [
      {
        url: '/images/cifra-principal.png',
        width: 1200,
        height: 630,
        alt: 'A Cifra - Blog sobre Criptomoedas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A Cifra - Blog sobre Criptomoedas | Análises & Educação Crypto',
    description: 'Seu guia completo sobre criptomoedas, blockchain e investimentos digitais.',
    images: ['/images/cifra-principal.png'],
    creator: '@acifra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#155C8B',
    'msapplication-TileColor': '#155C8B',
    'referrer': 'origin',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://news.google.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preload recursos críticos */}
        <link rel="preload" href="/images/logos/favcoin.png" as="image" type="image/png" />
        <link rel="preload" href="/images/cifra-principal.png" as="image" type="image/png" />

        {/* Structured Data */}
        <StructuredData data={generateWebsiteStructuredData()} />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-white" suppressHydrationWarning>
        {/* Google AdSense - Script principal com auto ads habilitado */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1151448515464841"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Google Reader Revenue Manager - Assinaturas */}
        <Script
          src="https://news.google.com/swg/js/v1/swg-basic.js"
          strategy="afterInteractive"
          async
        />
        <Script id="reader-revenue-manager" strategy="afterInteractive">
          {`
            (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
              basicSubscriptions.init({
                type: "NewsArticle",
                isPartOfType: ["Product"],
                isPartOfProductId: "CAowlPfdCw:openaccess",
                clientOptions: {
                  theme: "light",
                  lang: "pt-BR"
                },
              });
            });
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TFBC1HD2BR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TFBC1HD2BR');
          `}
        </Script>

        {/* Google News - Removido temporariamente devido a erro CORS */}

        {/* Skip link para acessibilidade */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-brand-primary-blue text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          Pular para o conteúdo principal
        </a>

        {/* Conteúdo principal */}
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  )
}
