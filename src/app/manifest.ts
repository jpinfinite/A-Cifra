import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'A Cifra - Blog sobre Criptomoedas',
    short_name: 'A Cifra',
    description: 'Seu guia completo sobre criptomoedas, blockchain e investimentos digitais',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#155C8B',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/logos/favcoin.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/logos/favcoin.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['finance', 'news', 'education'],
    lang: 'pt-BR',
    dir: 'ltr',
  }
}
