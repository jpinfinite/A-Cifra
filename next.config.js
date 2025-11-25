const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a-cifra.pages.dev',
      },
      {
        protocol: 'https',
        hostname: '*.a-cifra.pages.dev',
      },
      {
        protocol: 'https',
        hostname: 'a-cifra.com.br',
      },
      // Adicione outros domínios confiáveis conforme necessário
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
}

module.exports = withBundleAnalyzer(nextConfig)
