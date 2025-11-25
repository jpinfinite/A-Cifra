const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [384, 662, 1024, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 ano
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
    ],
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-markdown'],
  },
  
  // Headers para cache e performance
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.avif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Otimizações de produção
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk para bibliotecas grandes
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Chunk comum para código compartilhado
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            },
            // React e React-DOM em chunk separado
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30
            },
            // Markdown em chunk separado
            markdown: {
              test: /[\\/]node_modules[\\/](react-markdown|remark-gfm|rehype-raw)[\\/]/,
              name: 'markdown',
              chunks: 'all',
              priority: 25
            }
          }
        }
      }
    }
    
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
