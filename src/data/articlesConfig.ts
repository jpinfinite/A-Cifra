/**
 * Articles Configuration with Images
 * 
 * This file centralizes all article metadata and their associated images.
 * Easy to edit and maintain - simply update the articles array below.
 * 
 * ============================================================================
 * HOW TO USE THIS FILE:
 * ============================================================================
 * 
 * 1. ADDING A NEW ARTICLE:
 *    - Copy the template block below (search for "=== TEMPLATE ===")
 *    - Paste it into the articlesConfig array
 *    - Update all fields with your article information
 * 
 * 2. REQUIRED FIELDS:
 *    - id: Unique identifier (e.g., 'bitcoin-guide-2025')
 *    - title: Article title in Portuguese
 *    - slug: URL-friendly version of title (no spaces, lowercase)
 *    - excerpt: 1-2 sentence summary
 *    - coverImage: Main image object with src, alt, width, height
 *    - author: Author information with name and optional avatar
 *    - publishedAt: ISO date string (YYYY-MM-DD)
 *    - categorySlug: Reference to category (check @/lib/config for valid slugs)
 *    - tags: Array of relevant tags
 *    - seo: SEO metadata for search engines
 * 
 * 3. OPTIONAL FIELDS:
 *    - updatedAt: Last update date
 *    - content: Article content (can be empty, loaded from markdown files)
 *    - avatar: Author avatar image path
 *    - canonicalUrl: For SEO redirects
 *    - ogImage: Custom Open Graph image
 *    - noIndex: Set to true to prevent indexing
 * 
 * 4. IMAGE PATHS:
 *    - All images should be in public/images/ directory
 *    - Use paths like /images/category/filename.jpg
 *    - Keep image sizes around 1200x630 for cover images (OG image standard)
 * 
 * 5. CATEGORIES:
 *    - Use the categorySlug from your categories config
 *    - Example: 'bitcoin', 'ethereum', 'defi', 'altcoins', etc.
 * 
 * 6. SEO TIPS:
 *    - metaTitle: Should be 50-60 characters
 *    - metaDescription: Should be 150-160 characters
 *    - keywords: 5-10 relevant keywords
 *    - Use your main focus keyword in title and description
 * 
 * ============================================================================
 * Structure:
 * - id: Unique identifier
 * - title: Article title
 * - slug: URL-friendly slug
 * - excerpt: Short summary
 * - coverImage: Main article image
 * - author: Author information
 * - publishedAt: Publication date (ISO format string)
 * - updatedAt: Last update date (optional)
 * - category: Category reference
 * - tags: Article tags
 * - seo: SEO metadata
 */

import { Article } from '@/types'
import { categories } from '@/lib/config'

/**
 * Get category by slug for easier reference
 */
function getCategoryBySlug(slug: string) {
  return categories.find(cat => cat.slug === slug) || categories[0]
}

/**
 * ARTICLE CONFIGURATION - Easy to Edit Section
 * 
 * Add, remove, or modify articles here. Each article includes:
 * - Complete metadata
 * - Cover image information
 * - SEO details
 */
export const articlesConfig: Array<{
  id: string
  title: string
  slug: string
  excerpt: string
  contentPath: string
  coverImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt?: string
  categorySlug: string
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl?: string
    ogImage?: string
    noIndex?: boolean
  }
}> = [
  // Example articles - Remove or modify as needed
  {
    id: 'bitcoin-guide-2025',
    title: 'Bitcoin: Guia Completo para Iniciantes em 2025',
    slug: 'bitcoin-guia-completo-iniciantes-2025',
    excerpt: 'Tudo que você precisa saber sobre Bitcoin para começar seus investimentos em criptomoedas.',
    contentPath: 'bitcoin-guia-completo-iniciantes-2025.md',
    coverImage: {
      src: '/images/bitcoin/bitcoin-guide.jpg',
      alt: 'Bitcoin - Guia para Iniciantes',
      width: 1200,
      height: 630
    },
    author: {
      name: 'Jonatha Pereira',
      avatar: '/Jonatha-Pereira-SEO.png'
    },
    publishedAt: '2025-01-15',
    updatedAt: '2025-10-26',
    categorySlug: 'bitcoin',
    tags: ['bitcoin', 'guia', 'iniciantes'],
    seo: {
      metaTitle: 'Bitcoin: Guia Completo para Iniciantes em 2025',
      metaDescription: 'Aprenda tudo sobre Bitcoin: história, funcionamento, mineração e investimento seguro.',
      keywords: ['bitcoin', 'criptomoeda', 'guia iniciantes', 'investimento cripto']
    }
  },
  {
    id: '3',
    title: 'Como Proteger Suas Criptomoedas: Guia Completo de Segurança',
    slug: 'como-proteger-criptomoedas-guia-completo-seguranca',
    excerpt: 'Aprenda as melhores práticas para proteger suas criptomoedas: carteiras hardware, autenticação 2FA, backup de seeds e estratégias de segurança avançadas.',
    contentPath: 'como-proteger-criptomoedas-guia-completo-seguranca.md',
    coverImage: {
      src: '/images/digital-wallet-security.jpg',
      alt: 'Segurança de carteira digital com elementos de proteção blockchain',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-15',
    updatedAt: '2025-01-15',
    categorySlug: 'seguranca',
    tags: ['segurança', 'carteiras', 'hardware wallet', '2fa', 'backup', 'seed phrase', 'proteção'],
    seo: {
      metaTitle: 'Como Proteger Suas Criptomoedas: Guia Completo de Segurança | A Cifra',
      metaDescription: 'Aprenda as melhores práticas para proteger criptomoedas: carteiras hardware, 2FA, backup de seeds e estratégias de segurança avançadas.',
      keywords: ['segurança criptomoedas', 'como proteger bitcoin', 'carteira hardware', 'seed phrase', '2fa', 'backup cripto']
    }
  },
  {
    id: '5',
    title: 'Como Analisar Criptomoedas: Guia Completo para Investidores',
    slug: 'como-analisar-criptomoedas-guia-completo-investidores',
    excerpt: 'Aprenda as técnicas essenciais para analisar criptomoedas: análise técnica, fundamentalista e on-chain. Ferramentas e estratégias para tomar decisões informadas.',
    contentPath: 'como-analisar-criptomoedas-guia-completo-investidores.md',
    coverImage: {
      src: '/images/crypto-trading-setup.jpg',
      alt: 'Setup profissional para análise de criptomoedas com múltiplos monitores',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-20',
    updatedAt: '2025-01-20',
    categorySlug: 'educacao',
    tags: ['análise', 'criptomoedas', 'investimento', 'análise técnica', 'análise fundamentalista', 'on-chain', 'ferramentas'],
    seo: {
      metaTitle: 'Como Analisar Criptomoedas: Guia Completo para Investidores | A Cifra',
      metaDescription: 'Aprenda as técnicas essenciais para analisar criptomoedas: análise técnica, fundamentalista e on-chain. Ferramentas e estratégias para decisões informadas.',
      keywords: ['como analisar criptomoedas', 'análise técnica cripto', 'análise fundamentalista', 'on-chain analysis', 'investir criptomoedas']
    }
  },
  {
    id: '6',
    title: 'O Renascimento do Bitcoin: Por que a Criptomoeda mais Popular está Preparada para um Novo Ciclo de Crescimento',
    slug: 'renascimento-bitcoin-novo-ciclo-crescimento-2025',
    excerpt: 'Após um período de consolidação, o Bitcoin mostra sinais de estar preparado para um novo ciclo de crescimento. Analisamos os fatores que impulsionam essa tendência.',
    contentPath: 'renascimento-bitcoin-novo-ciclo-crescimento-2025.md',
    coverImage: {
      src: '/images/bitcoin-global-network.jpg',
      alt: 'Bitcoin conectado globalmente - representando o renascimento e adoção mundial',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-25',
    updatedAt: '2025-01-25',
    categorySlug: 'bitcoin',
    tags: ['bitcoin', 'análise técnica', 'ETF', 'investimento institucional', 'ciclo de crescimento', 'análise fundamentalista'],
    seo: {
      metaTitle: 'O Renascimento do Bitcoin: Novo Ciclo de Crescimento em 2025 | A Cifra',
      metaDescription: 'Análise completa sobre por que o Bitcoin está preparado para um novo ciclo de crescimento. ETFs, adoção institucional e fatores técnicos.',
      keywords: ['bitcoin 2025', 'ciclo bitcoin', 'ETF bitcoin', 'investimento institucional', 'análise bitcoin', 'previsão bitcoin', 'crescimento bitcoin']
    }
  },
  {
    id: '7',
    title: 'DeFi: O Futuro da Finança Descentralizada e como Investir com Segurança',
    slug: 'defi-futuro-financa-descentralizada-investir-seguranca',
    excerpt: 'A DeFi está revolucionando a finança tradicional. Descubra como investir com segurança neste ecossistema em crescimento e quais são as principais oportunidades.',
    contentPath: 'defi-futuro-financa-descentralizada-investir-seguranca.md',
    coverImage: {
      src: '/images/defi-revolution.jpg',
      alt: 'Tablet mostrando interface DeFi com gráficos e criptomoedas',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-26',
    updatedAt: '2025-01-26',
    categorySlug: 'defi',
    tags: ['defi', 'finanças descentralizadas', 'investimento seguro', 'yield farming', 'protocolos defi', 'gestão de risco'],
    seo: {
      metaTitle: 'DeFi: Como Investir com Segurança em Finanças Descentralizadas | A Cifra',
      metaDescription: 'Guia completo sobre DeFi: principais protocolos, estratégias de investimento seguro, riscos e melhores práticas para investir em finanças descentralizadas.',
      keywords: ['defi', 'finanças descentralizadas', 'investir defi', 'protocolos defi', 'yield farming', 'uniswap', 'aave', 'compound', 'segurança defi']
    }
  },
  {
    id: '8',
    title: 'NFTs: O que São e como Estão Mudando a Forma como Compramos e Vendemos Arte e Colecionáveis',
    slug: 'nfts-revolucionando-arte-colecionaveis-mercado-digital',
    excerpt: 'Os NFTs estão revolucionando o mercado de arte e colecionáveis digitais. Descubra como funcionam, principais mercados e o impacto na indústria criativa.',
    contentPath: 'nfts-revolucionando-arte-colecionaveis-mercado-digital.md',
    coverImage: {
      src: '/images/crypto-trading-desk.jpg',
      alt: 'Smartphone exibindo NFT de arte digital com fundo artístico colorido',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-27',
    updatedAt: '2025-01-27',
    categorySlug: 'nfts',
    tags: ['nfts', 'arte digital', 'colecionáveis', 'blockchain', 'opensea', 'mercado nft', 'investimento nft'],
    seo: {
      metaTitle: 'NFTs: Como Estão Revolucionando Arte e Colecionáveis Digitais | A Cifra',
      metaDescription: 'Guia completo sobre NFTs: o que são, como funcionam, principais mercados, como criar e vender, e o impacto na indústria da arte e colecionáveis.',
      keywords: ['nfts', 'arte digital', 'colecionáveis nft', 'opensea', 'blockchain arte', 'como criar nft', 'investir nft', 'mercado nft']
    }
  },
  {
    id: '9',
    title: 'Revolucionando a Indústria de Jogos: O Poder da GameFi e como Investir com Segurança',
    slug: 'gamefi-revolucionando-industria-jogos-investir-seguranca',
    excerpt: 'A GameFi está transformando a indústria de jogos, combinando gaming com DeFi e blockchain. Descubra como funciona e como investir com segurança nesta revolução.',
    contentPath: 'gamefi-revolucionando-industria-jogos-investir-seguranca.md',
    coverImage: {
      src: '/images/gamefi-revolucao-jogos.webp',
      alt: 'Gamer jogando com elementos de criptomoedas e GameFi ao redor',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-28',
    updatedAt: '2025-01-28',
    categorySlug: 'defi',
    tags: ['gamefi', 'play to earn', 'blockchain gaming', 'nft games', 'defi gaming', 'axie infinity', 'metaverso'],
    seo: {
      metaTitle: 'GameFi: Revolução dos Jogos Blockchain e Como Investir com Segurança | A Cifra',
      metaDescription: 'Descubra como a GameFi está revolucionando os jogos com blockchain e DeFi. Guia completo sobre play-to-earn, principais jogos e estratégias de investimento.',
      keywords: ['gamefi', 'play to earn', 'blockchain games', 'nft gaming', 'axie infinity', 'defi games', 'investir gamefi', 'jogos criptomoedas']
    }
  },
  {
    id: '10',
    title: 'Desvendando o Poder da Blockchain: Uma Tecnologia Revolucionária que Está Mudando o Mundo',
    slug: 'blockchain-tecnologia-revolucionaria-mudando-mundo',
    excerpt: 'A blockchain é uma tecnologia revolucionária que está transformando indústrias inteiras. Descubra como funciona, suas aplicações e o impacto no futuro.',
    contentPath: 'blockchain-tecnologia-revolucionaria-mudando-mundo.md',
    coverImage: {
      src: '/images/blockchain-technology.jpg',
      alt: 'Representação visual da tecnologia blockchain com blocos conectados',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-29',
    updatedAt: '2025-01-29',
    categorySlug: 'educacao',
    tags: ['blockchain', 'tecnologia', 'criptografia', 'descentralização', 'bitcoin', 'ethereum', 'contratos inteligentes'],
    seo: {
      metaTitle: 'Blockchain: Tecnologia Revolucionária que Está Mudando o Mundo | A Cifra',
      metaDescription: 'Guia completo sobre blockchain: como funciona, aplicações práticas, vantagens, desafios e o futuro desta tecnologia revolucionária.',
      keywords: ['blockchain', 'tecnologia blockchain', 'como funciona blockchain', 'aplicações blockchain', 'bitcoin blockchain', 'ethereum', 'descentralização']
    }
  },
  {
    id: '11',
    title: 'Pools de Liquidez: O Coração da Finança Descentralizada (DeFi)',
    slug: 'pools-liquidez-coracao-financa-descentralizada-defi',
    excerpt: 'As pools de liquidez são fundamentais para o DeFi, permitindo negociações eficientes e recompensas para fornecedores. Descubra como funcionam e como participar.',
    contentPath: 'pools-liquidez-coracao-financa-descentralizada-defi.md',
    coverImage: {
      src: '/images/pools-liquidez-defi.webp',
      alt: 'Representação visual de pools de liquidez DeFi com gráficos e moedas',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-30',
    updatedAt: '2025-01-30',
    categorySlug: 'defi',
    tags: ['pools de liquidez', 'defi', 'amm', 'uniswap', 'yield farming', 'perda impermanente', 'fornecedor liquidez'],
    seo: {
      metaTitle: 'Pools de Liquidez: Guia Completo do Coração do DeFi | A Cifra',
      metaDescription: 'Guia completo sobre pools de liquidez: como funcionam, vantagens, riscos como perda impermanente, estratégias e como participar no DeFi.',
      keywords: ['pools de liquidez', 'defi', 'amm', 'uniswap', 'perda impermanente', 'yield farming', 'fornecedor liquidez', 'sushiswap', 'curve']
    }
  },
  {
    id: '12',
    title: 'Centralização vs Descentralização: O Dilema da Distribuição de Poder',
    slug: 'centralizacao-vs-descentralizacao-dilema-distribuicao-poder',
    excerpt: 'Explore as diferenças fundamentais entre sistemas centralizados e descentralizados, seus impactos na sociedade e como a blockchain está redefinindo o poder.',
    contentPath: 'centralizacao-vs-descentralizacao-dilema-distribuicao-poder.md',
    coverImage: {
      src: '/images/blockchain-technology.jpg',
      alt: 'Representação visual de redes centralizadas vs descentralizadas',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-31',
    updatedAt: '2025-01-31',
    categorySlug: 'educacao',
    tags: ['centralização', 'descentralização', 'blockchain', 'governança', 'poder', 'web3', 'dao', 'bitcoin'],
    seo: {
      metaTitle: 'Centralização vs Descentralização: O Dilema do Poder na Era Digital | A Cifra',
      metaDescription: 'Análise completa sobre centralização vs descentralização: diferenças, vantagens, desvantagens e como a blockchain está redefinindo a distribuição de poder.',
      keywords: ['centralização', 'descentralização', 'distribuição poder', 'blockchain', 'governança', 'web3', 'dao', 'bitcoin', 'defi']
    }
  },
  {
    id: '13',
    title: 'Solana em Ascensão: Como a Aprovação do ETF Spot Pode Mudar o Jogo',
    slug: 'solana-ascensao-etf-spot-mudar-jogo-300-dolares',
    excerpt: 'A aprovação do ETF Spot de Solana pode ser o catalisador para uma nova alta. Análise completa do potencial de crescimento para $300 e fatores fundamentais.',
    contentPath: 'solana-ascensao-etf-spot-mudar-jogo-300-dolares.md',
    coverImage: {
      src: '/images/solana-etf-ascensao.webp',
      alt: 'Solana em ascensão com gráfico de crescimento e logo SOL',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-01-31',
    updatedAt: '2025-01-31',
    categorySlug: 'altcoins',
    tags: ['solana', 'etf spot', 'análise técnica', 'sol 300 dólares', 'blockchain alta performance', 'proof of history', 'investimento'],
    seo: {
      metaTitle: 'Solana ETF Spot: Análise Completa do Potencial para $300 | A Cifra',
      metaDescription: 'Análise completa do impacto do ETF Spot de Solana: fundamentos técnicos, análise de preço, catalisadores e potencial de crescimento para $300.',
      keywords: ['solana', 'etf spot solana', 'sol 300 dólares', 'análise solana', 'proof of history', 'blockchain solana', 'investir solana', 'previsão sol']
    }
  },
  {
    id: '14',
    title: 'Criptomoedas em 2026: Maturidade, Adoção Institucional e o Fim da Euforia Especulativa',
    slug: 'criptomoedas-2026-maturidade-adoacao-institucional-fim-euforia-especulativa',
    excerpt: 'O cenário para o mercado de criptomoedas em 2026 aponta para uma nova era de maturidade, adoção institucional e avanços tecnológicos concretos. Análise profunda das tendências que moldarão o futuro.',
    contentPath: 'criptomoedas-2026-maturidade-adoacao-institucional-fim-euforia-especulativa.md',
    coverImage: {
      src: '/images/crypto-futuristic-scene.jpg',
      alt: 'Análise do mercado de criptomoedas em 2026 - Tendências e previsões',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-10-27',
    updatedAt: '2025-10-27',
    categorySlug: 'analises',
    tags: ['mercado cripto', '2026', 'adoção institucional', 'Bitcoin', 'Layer 2', 'regulação', 'IA blockchain', 'tendências', 'investimento', 'maturidade'],
    seo: {
      metaTitle: 'Criptomoedas em 2026: Maturidade e Adoção Institucional | A Cifra',
      metaDescription: 'Análise completa das tendências que moldarão o mercado cripto em 2026. Bitcoin, Layer 2, regulação e a convergência com inteligência artificial.',
      keywords: ['criptomoedas 2026', 'mercado cripto', 'adoção institucional', 'Bitcoin previsão', 'Layer 2', 'regulação cripto', 'IA blockchain']
    }
  },
  {
    id: '15',
    title: 'Perspectivas Otimistas para o Mercado Cripto no Final de 2025',
    slug: 'perspectivas-otimistas-mercado-cripto-final-2025',
    excerpt: 'Um olhar técnico sobre a consolidação institucional, avanços tecnológicos e as tendências que podem definir o fechamento do ciclo cripto em 2025.',
    contentPath: 'perspectivas-otimistas-mercado-cripto-final-2025.md',
    coverImage: {
      src: '/images/crypto-market-analysis.jpg',
      alt: 'Perspectivas otimistas para o mercado cripto no final de 2025 - Análise técnica e tendências',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-10-27',
    updatedAt: '2025-10-27',
    categorySlug: 'analises',
    tags: ['perspectivas 2025', 'mercado cripto', 'Bitcoin', 'Ethereum', 'DeFi', 'adoção institucional', 'ETFs', 'Layer 2', 'RWA', 'IA blockchain'],
    seo: {
      metaTitle: 'Perspectivas Cripto 2025: Otimismo e Consolidação Institucional | A Cifra',
      metaDescription: 'Análise completa das perspectivas otimistas para o mercado cripto no final de 2025. Bitcoin, Ethereum, DeFi e tendências que definirão o fechamento do ciclo.',
      keywords: ['perspectivas cripto 2025', 'mercado cripto final 2025', 'Bitcoin previsão', 'Ethereum análise', 'DeFi tendências', 'adoção institucional']
    }
  },
  {
    id: '16',
    title: 'Exchanges de Criptomoedas: Guia Completo para Iniciantes',
    slug: 'exchanges-criptomoedas-guia-completo',
    excerpt: 'Entenda o que são exchanges, como funcionam CEX e DEX, e aprenda a escolher a melhor plataforma para investir em criptomoedas com segurança.',
    contentPath: 'exchanges-criptomoedas-guia-completo.md',
    coverImage: {
      src: '/images/crypto-exchange.jpg',
      alt: 'Exchanges de criptomoedas - Guia completo para iniciantes sobre como escolher e usar plataformas de trading',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-10-27',
    updatedAt: '2025-10-27',
    categorySlug: 'tutoriais',
    tags: ['exchanges', 'CEX', 'DEX', 'trading', 'segurança', 'Bitcoin', 'Ethereum', 'investimento', 'carteiras', 'KYC'],
    seo: {
      metaTitle: 'Exchanges de Criptomoedas: Guia Completo 2025 | A Cifra',
      metaDescription: 'Guia completo sobre exchanges de criptomoedas. Aprenda a escolher entre CEX e DEX, dicas de segurança e como começar a investir em Bitcoin e outras criptos.',
      keywords: ['exchanges criptomoedas', 'CEX vs DEX', 'como comprar Bitcoin', 'exchange Brasil', 'segurança cripto', 'trading iniciante']
    }
  },
  {
    id: '17',
    title: 'Tendências Cripto Outubro 2025: O Que Está Movendo o Mercado',
    slug: 'tendencias-cripto-outubro-2025',
    excerpt: 'Análise completa das principais tendências do mercado cripto em outubro 2025: ETFs, regulamentação, DeFi 2.0 e as oportunidades que estão moldando o futuro das criptomoedas.',
    contentPath: 'tendencias-cripto-outubro-2025.md',
    coverImage: {
      src: '/images/altcoins-2025.jpg',
      alt: 'Tendências do mercado cripto outubro 2025 - Análise completa de Bitcoin, Ethereum e DeFi',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-10-27',
    updatedAt: '2025-10-27',
    categorySlug: 'analises',
    tags: ['tendências', 'ETFs', 'regulamentação', 'DeFi 2.0', 'GameFi', 'AI', 'outubro 2025', 'análise de mercado'],
    seo: {
      metaTitle: 'Tendências Cripto Outubro 2025: Análise Completa | A Cifra',
      metaDescription: 'Análise das principais tendências do mercado cripto em outubro 2025: ETFs, regulamentação, DeFi 2.0, GameFi e oportunidades estratégicas para investidores.',
      keywords: ['tendências cripto outubro 2025', 'ETFs criptomoedas', 'regulamentação cripto', 'DeFi 2.0', 'GameFi', 'AI blockchain', 'análise mercado cripto']
    }
  },
  {
    id: '19',
    title: 'Memecoins: O Fenômeno Cultural que Revolucionou o Mercado Cripto',
    slug: 'memecoins-fenomeno-cultural-mercado-cripto',
    excerpt: 'Entenda o que são memecoins, como surgiram, por que se tornaram populares e como investir com segurança neste setor volátil mas fascinante do mercado cripto.',
    contentPath: 'memecoins-fenomeno-cultural-mercado-cripto.md',
    coverImage: {
      src: '/images/memecoins-phenomenon.jpg',
      alt: 'Memecoins - Dogecoin, Shiba Inu e outras criptomoedas meme',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-10-30',
    updatedAt: '2025-10-30',
    categorySlug: 'memecoin',
    tags: ['memecoins', 'dogecoin', 'shiba inu', 'pepe', 'investimento', 'risco', 'comunidade', 'volatilidade'],
    seo: {
      metaTitle: 'Memecoins: Guia Completo sobre Dogecoin, Shiba Inu e Investimento | A Cifra',
      metaDescription: 'Guia completo sobre memecoins: o que são, como investir com segurança, principais projetos como Dogecoin e Shiba Inu, riscos e oportunidades.',
      keywords: ['memecoins', 'dogecoin', 'shiba inu', 'pepe coin', 'como investir memecoins', 'criptomoedas meme', 'investimento risco']
    }
  },
  {
    id: '20',
    title: 'MetaMask: Guia Completo da Carteira Cripto Mais Popular do Mundo',
    slug: 'metamask-guia-completo-carteira-cripto',
    excerpt: 'Aprenda tudo sobre MetaMask: como instalar, configurar, usar com segurança e aproveitar todos os recursos desta carteira essencial para DeFi e Web3.',
    contentPath: 'metamask-guia-completo-carteira-cripto.md',
    coverImage: {
      src: '/images/metamask-wallet.jpg',
      alt: 'MetaMask - Carteira de criptomoedas e gateway para Web3',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira', avatar: '/Jonatha-Pereira-SEO.png' },
    publishedAt: '2025-10-30',
    updatedAt: '2025-10-30',
    categorySlug: 'tutoriais',
    tags: ['metamask', 'carteira cripto', 'web3', 'defi', 'ethereum', 'segurança', 'dapps', 'blockchain'],
    seo: {
      metaTitle: 'MetaMask: Guia Completo da Carteira Cripto Mais Popular | A Cifra',
      metaDescription: 'Guia completo sobre MetaMask: como instalar, configurar, usar com segurança e aproveitar todos os recursos desta carteira essencial para DeFi e Web3.',
      keywords: ['metamask', 'carteira cripto', 'como usar metamask', 'web3', 'defi', 'ethereum wallet', 'segurança cripto']
    }
  },
  // Artigos from artigos/ folder
  {
    id: 'altcoins-2025',
    title: 'Altcoins Promissoras para 2025: Análise Fundamentalista',
    slug: 'altcoins-promissoras-2025-analise-fundamentalista',
    excerpt: 'Descubra as altcoins com maior potencial para 2025, analisando fundamentos, tecnologia e adoção real.',
    contentPath: 'altcoins-promissoras-2025-analise-fundamentalista.md',
    coverImage: {
      src: '/images/altcoins-2025.jpg',
      alt: 'Gráfico com principais altcoins e suas redes',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-01-05',
    updatedAt: '2025-10-26',
    categorySlug: 'altcoins',
    tags: ['altcoins', 'solana', 'polygon', 'chainlink', 'avalanche', 'análise fundamentalista'],
    seo: {
      metaTitle: 'Altcoins Promissoras 2025: Análise Fundamentalista Completa',
      metaDescription: 'Análise detalhada das altcoins com maior potencial para 2025: Solana, Polygon, Chainlink, Avalanche e mais.',
      keywords: ['altcoins', 'criptomoedas 2025', 'solana', 'polygon', 'análise fundamentalista']
    }
  },
  {
    id: 'analise-cripto-2025',
    title: 'Como Analisar Criptomoedas: Indicadores Fundamentais e Técnicos',
    slug: 'analisar-criptomoedas-indicadores-fundamentais-tecnicos',
    excerpt: 'Guia completo para análise de criptomoedas: indicadores fundamentais (tecnologia, equipe, adoção) e técnicos (preço, volume, padrões) para tomar decisões de investimento informadas.',
    contentPath: 'analisar-criptomoedas-indicadores-fundamentais-tecnicos.md',
    coverImage: {
      src: '/images/crypto-analysis-charts.jpg',
      alt: 'Gráfico com múltiplos indicadores de análise de criptomoedas',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-10-26',
    updatedAt: '2025-10-26',
    categorySlug: 'analises',
    tags: ['análise', 'indicadores', 'fundamentalista', 'técnico', 'investimento', 'trading', 'avaliação', 'métricas'],
    seo: {
      metaTitle: 'Como Analisar Criptomoedas: Indicadores Fundamentais e Técnicos | A Cifra',
      metaDescription: 'Guia completo de análise de criptomoedas: indicadores fundamentais e técnicos, métricas essenciais e frameworks para avaliação de projetos crypto.',
      keywords: ['análise criptomoedas', 'indicadores crypto', 'análise fundamentalista', 'análise técnica', 'investir crypto', 'avaliação projetos']
    }
  },
  {
    id: 'defi-tradicional',
    title: 'DeFi: Revolucionando as Finanças Tradicionais',
    slug: 'defi-revolucionando-financas-tradicionais',
    excerpt: 'Descubra o universo das Finanças Descentralizadas (DeFi) e como elas estão redefinindo empréstimos, investimentos e serviços financeiros globais.',
    contentPath: 'defi-revolucionando-financas-tradicionais.md',
    coverImage: {
      src: '/images/defi-revolution.jpg',
      alt: 'Ilustração de DeFi conectando pessoas ao redor do mundo',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-01-10',
    updatedAt: '2025-10-26',
    categorySlug: 'defi',
    tags: ['defi', 'finanças descentralizadas', 'ethereum', 'yield farming', 'contratos inteligentes'],
    seo: {
      metaTitle: 'DeFi: Como as Finanças Descentralizadas Revolucionam o Sistema Financeiro',
      metaDescription: 'Entenda como o DeFi está transformando empréstimos, investimentos e serviços financeiros por meio da tecnologia blockchain.',
      keywords: ['defi', 'finanças descentralizadas', 'ethereum', 'blockchain', 'contratos inteligentes']
    }
  },
  {
    id: 'ethereum-2025',
    title: 'Ethereum 2.0: O Futuro da Segunda Maior Criptomoeda',
    slug: 'ethereum-2-0-futuro-segunda-maior-criptomoeda',
    excerpt: 'Entenda como a Ethereum 2.0 está revolucionando a rede com Proof of Stake, shardings e melhorias de escalabilidade que prometem transformar o ecossistema DeFi e dApps.',
    contentPath: 'ethereum-2-0-futuro-segunda-maior-criptomoeda.md',
    coverImage: {
      src: '/images/etherum-2.0.jpg',
      alt: 'Ilustração do Ethereum 2.0 com beacon chain e shards',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-10-26',
    updatedAt: '2025-10-26',
    categorySlug: 'ethereum',
    tags: ['ethereum', 'ethereum 2.0', 'proof of stake', 'sharding', 'escalabilidade', 'defi', 'dapps'],
    seo: {
      metaTitle: 'Ethereum 2.0: O Futuro da Segunda Maior Criptomoeda | A Cifra',
      metaDescription: 'Guia completo sobre Ethereum 2.0: Proof of Stake, sharding, staking e como as atualizações estão transformando o ecossistema DeFi e dApps.',
      keywords: ['ethereum 2.0', 'proof of stake', 'sharding', 'staking ethereum', 'escalabilidade ethereum', 'the merge', 'dapps']
    }
  },
  {
    id: 'layer-2-ethereum',
    title: 'O Que São Layer 2 e Por Que São Essenciais para o Ethereum',
    slug: 'layer-2-essencial-ethereum-escalabilidade',
    excerpt: 'Entenda como as soluções Layer 2 estão revolucionando o Ethereum com transações mais rápidas, baratas e escaláveis. Guia completo sobre rollups, sidechains e o futuro da escalabilidade.',
    contentPath: 'layer-2-essencial-ethereum-escalabilidade.md',
    coverImage: {
      src: '/images/Layer2.jpg',
      alt: 'Diagrama mostrando Ethereum Layer 1 com múltiplas soluções Layer 2 conectadas',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-10-26',
    updatedAt: '2025-10-26',
    categorySlug: 'ethereum',
    tags: ['layer 2', 'ethereum', 'escalabilidade', 'rollups', 'optimism', 'arbitrum', 'zk-sync', 'polygon'],
    seo: {
      metaTitle: 'Layer 2 Ethereum: Guia Completo de Escalabilidade | A Cifra',
      metaDescription: 'Guia completo sobre Layer 2 Ethereum: rollups, sidechains, como funcionam, principais projetos e por que são essenciais para o futuro do Ethereum.',
      keywords: ['layer 2 ethereum', 'escalabilidade ethereum', 'rollups', 'optimism', 'arbitrum', 'zk-sync', 'polygon', 'sidechains']
    }
  },
  {
    id: 'proteger-crypto',
    title: 'Como Proteger Suas Criptomoedas: Guia de Segurança Completo',
    slug: 'proteger-criptomoedas-guia-seguranca-completo',
    excerpt: 'Aprenda as melhores práticas de segurança para proteger suas criptomoedas contra hacks, golpes e perdas. Guia completo com carteiras hardware, backups e proteção digital.',
    contentPath: 'proteger-criptomoedas-guia-seguranca-completo.md',
    coverImage: {
      src: '/images/digital-wallet-security.jpg',
      alt: 'Cadeado digital protegendo criptomoedas com ícones de segurança',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-10-26',
    updatedAt: '2025-10-26',
    categorySlug: 'seguranca',
    tags: ['segurança', 'carteiras', 'hardware wallet', 'backup', 'phishing', 'golpes', 'proteção', 'cold storage'],
    seo: {
      metaTitle: 'Como Proteger Suas Criptomoedas: Guia de Segurança Completo | A Cifra',
      metaDescription: 'Guia completo de segurança para criptomoedas: carteiras hardware, cold storage, backups, proteção contra phishing e melhores práticas.',
      keywords: ['segurança criptomoedas', 'proteger crypto', 'hardware wallet', 'cold storage', 'backup carteira', 'phishing crypto', 'golpes cripto']
    }
  },
  {
    id: 'staking-recompensas',
    title: 'Staking de Criptomoedas: Passo a Passo para Ganhar Recompensas',
    slug: 'staking-criptomoedas-passo-passo-recompensas',
    excerpt: 'Guia completo de staking de criptomoedas: como funciona, quais moedas staking, plataformas recomendadas, riscos e estratégias para maximizar rendimentos passivos.',
    contentPath: 'staking-criptomoedas-passo-passo-recompensas.md',
    coverImage: {
      src: '/images/staking-recompensas.jpg',
      alt: 'Ilustração de staking com moedas gerando recompensas passivas',
      width: 1200,
      height: 630
    },
    author: { name: 'Jonatha Pereira' },
    publishedAt: '2025-10-26',
    updatedAt: '2025-10-26',
    categorySlug: 'defi',
    tags: ['staking', 'proof of stake', 'recompensas', 'renda passiva', 'ethereum', 'solana', 'cardano', 'polkadot'],
    seo: {
      metaTitle: 'Staking de Criptomoedas: Passo a Passo para Ganhar Recompensas | A Cifra',
      metaDescription: 'Guia completo de staking: como funciona, melhores moedas, plataformas, riscos e estratégias para ganhar renda passiva com criptomoedas.',
      keywords: ['staking criptomoedas', 'proof of stake', 'renda passiva crypto', 'staking ethereum', 'staking solana', 'recompensas staking']
    }
  }
]

/**
 * Convert articlesConfig to Article type for use throughout the application
 * Note: content is loaded from markdown files, not from config
 */
export function convertConfigToArticles(configs: typeof articlesConfig): Article[] {
  return configs.map(config => ({
    id: config.id,
    title: config.title,
    slug: config.slug,
    excerpt: config.excerpt,
    content: '', // Content is loaded from markdown files
    coverImage: config.coverImage,
    author: config.author,
    publishedAt: new Date(config.publishedAt),
    updatedAt: config.updatedAt ? new Date(config.updatedAt) : new Date(config.publishedAt),
    category: getCategoryBySlug(config.categorySlug),
    tags: config.tags,
    seo: config.seo
  }))
}

/**
 * Get article config by slug
 */
export function getArticleConfigBySlug(slug: string) {
  return articlesConfig.find(article => article.slug === slug)
}

/**
 * Get articles by category slug
 */
export function getArticlesByCategory(categorySlug: string) {
  return articlesConfig.filter(article => article.categorySlug === categorySlug)
}

/**
 * Get all articles sorted by date (newest first)
 */
export function getAllArticlesConfig() {
  return articlesConfig.slice().sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
