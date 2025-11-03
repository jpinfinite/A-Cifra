import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { StructuredData } from '@/components/ui/StructuredData'
import { generateWebsiteStructuredData } from '@/utils/seo'
import '@/styles/globals.css'

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
  authors: [{ name: 'Jonatha Pereira', url: 'https://acifra.com' }],
  creator: 'Jonatha Pereira',
  publisher: 'A Cifra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://acifra.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://acifra.com',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <head>
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon e icons */}
        <link rel="icon" href="/images/logos/favcoin.png" sizes="any" />
        <link rel="icon" href="/images/logos/favcoin.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logos/favcoin.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme e PWA */}
        <meta name="theme-color" content="#155C8B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="A Cifra" />
        
        {/* Viewport otimizado */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        
        {/* SEO e performance */}
        <meta name="msapplication-TileColor" content="#155C8B" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured Data */}
        <StructuredData data={generateWebsiteStructuredData()} />
        
        {/* Melhorias de SEO e segurança */}
        <meta name="referrer" content="origin" />
        <meta name="google-site-verification" content="EQ1NeuKXQewCi95LfnGYswqQP4ZANquqMzEc0OllRbE" />
        <meta name="yandex-verification" content="" />
        
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TFBC1HD2BR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TFBC1HD2BR');
            `
          }}
        />
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1151448515464841" crossOrigin="anonymous"></script>
        
        {/* Ezoic Integration */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
        
        {/* Google News - Subscribe with Google */}
        <script async type="application/javascript" src="https://news.google.com/swg/js/v1/swg-basic.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
                basicSubscriptions.init({
                  type: "NewsArticle",
                  isPartOfType: ["Product"],
                  isPartOfProductId: "CAow5_bdCw:openaccess",
                  clientOptions: { theme: "light", lang: "pt-BR" },
                });
              });
            `
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-white">
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