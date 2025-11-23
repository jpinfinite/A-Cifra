import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'

  return {
    rules: [
      // Regra geral para todos os bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
      // Googlebot - permite indexação completa
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Googlebot-Image - permite todas as imagens
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Bingbot - permite indexação completa
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Bloquear bots de IA que coletam dados para treinamento
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'Amazonbot',
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'meta-externalagent',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
