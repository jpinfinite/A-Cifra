/**
 * Sistema de Mapeamento Inteligente de Imagens
 * Distribui imagens únicas para artigos e cards sem repetições
 */

export interface ImageMapping {
  src: string
  alt: string
  category?: string
  keywords: string[]
}

/**
 * Catálogo completo de imagens disponíveis
 * Organizado por categoria e palavras-chave
 */
export const imagesCatalog: ImageMapping[] = [
  // Bitcoin
  {
    src: '/images/bitcoin-guide-2025.jpg',
    alt: 'Bitcoin - Guia completo para iniciantes 2025',
    category: 'bitcoin',
    keywords: ['bitcoin', 'btc', 'guia', 'iniciantes', 'investimento']
  },
  {
    src: '/images/bitcoin-coin-stack.jpg',
    alt: 'Pilha de moedas Bitcoin representando acumulação e investimento',
    category: 'bitcoin',
    keywords: ['bitcoin', 'moedas', 'investimento', 'acumulação', 'stack']
  },
  {
    src: '/images/cripto-bitcoin.jpg',
    alt: 'Bitcoin e criptomoedas - Análise de mercado',
    category: 'bitcoin',
    keywords: ['bitcoin', 'cripto', 'mercado', 'análise', 'trading']
  },
  {
    src: '/images/bitcoin-renascimento-optimized.webp',
    alt: 'Renascimento do Bitcoin - Nova era das criptomoedas',
    category: 'bitcoin',
    keywords: ['bitcoin', 'renascimento', 'bull market', 'alta', 'otimismo']
  },
  {
    src: '/images/#bitcoin.jpg',
    alt: 'Bitcoin - Símbolo da revolução financeira digital',
    category: 'bitcoin',
    keywords: ['bitcoin', 'revolução', 'digital', 'descentralização']
  },
  {
    src: '/images/#bitcoin (1).jpg',
    alt: 'Bitcoin - Moeda digital descentralizada',
    category: 'bitcoin',
    keywords: ['bitcoin', 'moeda', 'digital', 'blockchain']
  },

  // Ethereum
  {
    src: '/images/ethereum-blockchain.jpg',
    alt: 'Ethereum blockchain - Smart contracts e DeFi',
    category: 'ethereum',
    keywords: ['ethereum', 'blockchain', 'smart contracts', 'defi', 'eth']
  },
  {
    src: '/images/ethereum-analysis.jpg',
    alt: 'Análise técnica do Ethereum - Gráficos e tendências',
    category: 'ethereum',
    keywords: ['ethereum', 'análise', 'técnica', 'gráfico', 'trading']
  },

  // DeFi
  {
    src: '/images/defi-revolution.jpg',
    alt: 'Revolução DeFi - Finanças descentralizadas transformando o mundo',
    category: 'defi',
    keywords: ['defi', 'finanças', 'descentralizadas', 'revolução', 'blockchain']
  },
  {
    src: '/images/pools-liquidez-defi.webp',
    alt: 'Pools de liquidez DeFi - AMM e yield farming',
    category: 'defi',
    keywords: ['defi', 'liquidez', 'pools', 'amm', 'yield farming']
  },

  // NFTs
  {
    src: '/images/nft-digital-art.jpg',
    alt: 'NFTs e arte digital - Tokens não fungíveis',
    category: 'nfts',
    keywords: ['nft', 'arte digital', 'tokens', 'colecionáveis', 'blockchain']
  },
  {
    src: '/images/nfts-arte-colecionaveis.webp',
    alt: 'NFTs - Arte e colecionáveis digitais',
    category: 'nfts',
    keywords: ['nft', 'arte', 'colecionáveis', 'digital', 'marketplace']
  },
  {
    src: '/images/nfts-use-cases.jpg',
    alt: 'Casos de uso de NFTs além da arte',
    category: 'nfts',
    keywords: ['nft', 'casos de uso', 'utilidade', 'aplicações', 'web3']
  },

  // Altcoins
  {
    src: '/images/altcoins-2025.jpg',
    alt: 'Principais altcoins para investir em 2025',
    category: 'altcoins',
    keywords: ['altcoins', 'investimento', '2025', 'criptomoedas', 'oportunidades']
  },
  {
    src: '/images/solana-etf-ascensao.webp',
    alt: 'Solana em ascensão - ETF e crescimento',
    category: 'altcoins',
    keywords: ['solana', 'sol', 'etf', 'ascensão', 'crescimento']
  },

  // Análises e Trading
  {
    src: '/images/crypto-analysis-charts.jpg',
    alt: 'Análise de mercado cripto - Gráficos e indicadores',
    category: 'analises',
    keywords: ['análise', 'mercado', 'gráficos', 'trading', 'indicadores']
  },
  {
    src: '/images/crypto-trading-desk.jpg',
    alt: 'Mesa de trading de criptomoedas - Análise profissional',
    category: 'analises',
    keywords: ['trading', 'desk', 'profissional', 'análise', 'mercado']
  },
  {
    src: '/images/stock-market-6695482_1280.jpg',
    alt: 'Mercado financeiro e criptomoedas - Análise integrada',
    category: 'analises',
    keywords: ['mercado', 'financeiro', 'análise', 'investimento', 'trading']
  },

  // Segurança e Carteiras
  {
    src: '/images/wallet.png',
    alt: 'Carteira de criptomoedas - Segurança e armazenamento',
    category: 'seguranca',
    keywords: ['carteira', 'wallet', 'segurança', 'armazenamento', 'cripto']
  },
  {
    src: '/images/crypto-wallet.jpg',
    alt: 'Carteira cripto segura - Proteção de ativos digitais',
    category: 'seguranca',
    keywords: ['carteira', 'segurança', 'proteção', 'ativos', 'digital']
  },
  {
    src: '/images/crypto-wallet-security.jpg',
    alt: 'Segurança de carteiras cripto - Melhores práticas',
    category: 'seguranca',
    keywords: ['segurança', 'carteira', 'proteção', 'práticas', 'wallet']
  },
  {
    src: '/images/metamask.jpg',
    alt: 'MetaMask - Carteira Web3 mais popular',
    category: 'seguranca',
    keywords: ['metamask', 'web3', 'carteira', 'ethereum', 'dapp']
  },

  // Exchanges
  {
    src: '/images/crypto-exchange.jpg',
    alt: 'Exchanges de criptomoedas - Plataformas de trading',
    category: 'educacao',
    keywords: ['exchange', 'trading', 'plataforma', 'compra', 'venda']
  },

  // Tecnologia e Blockchain
  {
    src: '/images/blockchain-technology.jpg',
    alt: 'Tecnologia blockchain - Fundamentos e aplicações',
    category: 'educacao',
    keywords: ['blockchain', 'tecnologia', 'fundamentos', 'aplicações', 'descentralização']
  },
  {
    src: '/images/centralizacao-vs-descentralizacao.webp',
    alt: 'Centralização vs Descentralização - Comparativo visual',
    category: 'educacao',
    keywords: ['centralização', 'descentralização', 'comparativo', 'blockchain', 'redes']
  },

  // GameFi
  {
    src: '/images/gamefi-revolucao-jogos.webp',
    alt: 'GameFi - Revolução dos jogos blockchain',
    category: 'nfts',
    keywords: ['gamefi', 'jogos', 'blockchain', 'play to earn', 'nft']
  },

  // Mining
  {
    src: '/images/crypto-mining.jpg',
    alt: 'Mineração de criptomoedas - Hardware e processo',
    category: 'educacao',
    keywords: ['mineração', 'mining', 'hardware', 'pow', 'bitcoin']
  },

  // Staking
  {
    src: '/images/Staking.png',
    alt: 'Staking de criptomoedas - Ganhe recompensas passivas',
    category: 'defi',
    keywords: ['staking', 'recompensas', 'passivo', 'pos', 'yield']
  },

  // Layer 2
  {
    src: '/images/layer2.png',
    alt: 'Soluções Layer 2 - Escalabilidade blockchain',
    category: 'ethereum',
    keywords: ['layer 2', 'escalabilidade', 'rollups', 'ethereum', 'l2']
  },

  // Perspectivas e Tendências
  {
    src: '/images/2026.png',
    alt: 'Perspectivas do mercado cripto para 2026',
    category: 'analises',
    keywords: ['2026', 'perspectivas', 'tendências', 'futuro', 'previsões']
  },
  {
    src: '/images/fimdeano.png',
    alt: 'Análise de fim de ano do mercado cripto',
    category: 'analises',
    keywords: ['fim de ano', 'balanço', 'análise', 'retrospectiva', 'mercado']
  },
  {
    src: '/images/analisar.png',
    alt: 'Como analisar criptomoedas - Guia completo',
    category: 'educacao',
    keywords: ['analisar', 'análise', 'guia', 'indicadores', 'fundamentalista']
  },

  // Análises e Mercado
  {
    src: '/images/stock-market-6695482_1280.jpg',
    alt: 'Análise de mercado financeiro e criptomoedas',
    category: 'analises',
    keywords: ['mercado', 'análise', 'gráficos', 'trading', 'investimento']
  },
  {
    src: '/images/crypto-mercado-geral.jpg',
    alt: 'Mercado de criptomoedas - Visão geral',
    category: 'geral',
    keywords: ['criptomoedas', 'mercado', 'trading', 'investimento']
  },
  {
    src: '/images/criptomoedas-geral.jpg',
    alt: 'Criptomoedas diversas - Mercado digital',
    category: 'geral',
    keywords: ['criptomoedas', 'bitcoin', 'ethereum', 'altcoins', 'mercado']
  },
  {
    src: '/images/digital-currencies-global.jpg',
    alt: 'Moedas digitais globais - Futuro das finanças',
    category: 'geral',
    keywords: ['moedas digitais', 'global', 'futuro', 'finanças', 'blockchain']
  },

  // Educação e Tutoriais
  {
    src: '/images/transformacao-digital.jpg',
    alt: 'Transformação digital e blockchain',
    category: 'educacao',
    keywords: ['transformação', 'digital', 'blockchain', 'tecnologia', 'inovação']
  },
  {
    src: '/images/what-is-blockchain-and-why-it-matters-in.jpg',
    alt: 'O que é blockchain e por que importa',
    category: 'educacao',
    keywords: ['blockchain', 'educação', 'tecnologia', 'descentralização']
  },

  // Genéricas de alta qualidade
  {
    src: '/images/pinterest-bitcoin-gold.jpg',
    alt: 'Bitcoin dourado - Símbolo de valor digital',
    category: 'bitcoin',
    keywords: ['bitcoin', 'ouro', 'valor', 'digital', 'investimento']
  },
  {
    src: '/images/pinterest-crypto-coins.jpg',
    alt: 'Moedas de criptomoedas variadas',
    category: 'geral',
    keywords: ['moedas', 'criptomoedas', 'diversificação', 'portfólio', 'investimento']
  },

  // Novas imagens premium adicionadas
  {
    src: '/images/crypto-futuristic-scene.jpg',
    alt: 'Cena futurística com Bitcoin, Ethereum e criptomoedas',
    category: 'geral',
    keywords: ['futurístico', 'bitcoin', 'ethereum', 'tecnologia', 'inovação']
  },
  {
    src: '/images/bitcoin-digital-circle.jpg',
    alt: 'Bitcoin em círculo digital azul tecnológico',
    category: 'bitcoin',
    keywords: ['bitcoin', 'digital', 'círculo', 'tecnológico', 'azul']
  },
  {
    src: '/images/crypto-education-scene.jpg',
    alt: 'Educação em criptomoedas - Cena futurística de aprendizado',
    category: 'educacao',
    keywords: ['educação', 'aprendizado', 'cripto', 'futurístico', 'ensino']
  },
  {
    src: '/images/bitcoin-wallet-network.jpg',
    alt: 'Carteira Bitcoin com rede de conexões',
    category: 'seguranca',
    keywords: ['carteira', 'bitcoin', 'rede', 'conexões', 'segurança']
  },
  {
    src: '/images/digital-wallet-security.jpg',
    alt: 'Carteira digital segura com blockchain',
    category: 'seguranca',
    keywords: ['carteira', 'digital', 'segurança', 'blockchain', 'proteção']
  },
  {
    src: '/images/crypto-coins-collection.jpg',
    alt: 'Coleção diversa de moedas de criptomoedas',
    category: 'altcoins',
    keywords: ['moedas', 'coleção', 'diversas', 'altcoins', 'criptomoedas']
  },
  {
    src: '/images/ethereum-layer2-concept.jpg',
    alt: 'Conceito Ethereum Layer 2 com elementos técnicos',
    category: 'ethereum',
    keywords: ['ethereum', 'layer 2', 'conceito', 'técnico', 'escalabilidade']
  },
  {
    src: '/images/crypto-market-analysis.jpg',
    alt: 'Análise de mercado cripto - Touro vs Urso',
    category: 'analises',
    keywords: ['análise', 'mercado', 'touro', 'urso', 'trading']
  },
  {
    src: '/images/crypto-trading-setup.jpg',
    alt: 'Setup profissional de trading de criptomoedas',
    category: 'analises',
    keywords: ['trading', 'setup', 'profissional', 'monitores', 'análise']
  },
  {
    src: '/images/bitcoin-global-network.jpg',
    alt: 'Bitcoin conectado globalmente com rede mundial',
    category: 'bitcoin',
    keywords: ['bitcoin', 'global', 'rede', 'mundial', 'conexões']
  },

  // Mais imagens disponíveis
  {
    src: '/images/close-up-bitcoin-concept.jpg',
    alt: 'Close-up conceito Bitcoin',
    category: 'bitcoin',
    keywords: ['bitcoin', 'close-up', 'conceito', 'moeda', 'digital']
  },
  {
    src: '/images/cryptocurrency-concept-with-bitcoin.jpg',
    alt: 'Conceito de criptomoedas com Bitcoin',
    category: 'bitcoin',
    keywords: ['bitcoin', 'conceito', 'criptomoedas', 'digital', 'tecnologia']
  },
  {
    src: '/images/cryptocurrency-concept-with-smartphone-close-up.jpg',
    alt: 'Conceito de criptomoedas com smartphone',
    category: 'geral',
    keywords: ['smartphone', 'criptomoedas', 'mobile', 'tecnologia', 'digital']
  },
  {
    src: '/images/futuristic-digital-user-interface.jpg',
    alt: 'Interface digital futurística',
    category: 'geral',
    keywords: ['futurístico', 'digital', 'interface', 'tecnologia', 'inovação']
  },
  {
    src: '/images/this-striking-image-visually-represents-a.jpg',
    alt: 'Representação visual impressionante de tecnologia',
    category: 'geral',
    keywords: ['visual', 'tecnologia', 'impressionante', 'digital', 'inovação']
  },
  {
    src: '/images/trading-criptomoedas.jpg',
    alt: 'Trading de criptomoedas',
    category: 'analises',
    keywords: ['trading', 'criptomoedas', 'análise', 'mercado', 'investimento']
  },
  {
    src: '/images/renda-passiva-estrategia-investimento.jpg',
    alt: 'Estratégias de renda passiva e investimento',
    category: 'educacao',
    keywords: ['renda passiva', 'estratégia', 'investimento', 'finanças', 'educação']
  },
  {
    src: '/images/mercado-criptomoedas.jpg',
    alt: 'Mercado de criptomoedas',
    category: 'analises',
    keywords: ['mercado', 'criptomoedas', 'análise', 'trading', 'investimento']
  }
]

/**
 * Rastreia imagens já utilizadas para evitar repetições
 */
const usedImages = new Set<string>()

/**
 * Encontra a melhor imagem para um artigo baseado em categoria e palavras-chave
 * @param category - Categoria do artigo
 * @param keywords - Palavras-chave do artigo
 * @param excludeImages - Imagens a serem excluídas
 * @returns Mapeamento da imagem selecionada
 */
export function findBestImage(
  category: string,
  keywords: string[] = [],
  excludeImages: string[] = []
): ImageMapping | null {
  const categorySlug = category.toLowerCase()
  const searchKeywords = keywords.map(k => k.toLowerCase())

  // Filtrar imagens disponíveis (não usadas e não excluídas)
  const availableImages = imagesCatalog.filter(
    img => !usedImages.has(img.src) && !excludeImages.includes(img.src)
  )

  if (availableImages.length === 0) {
    // Se todas foram usadas, resetar e usar qualquer uma
    usedImages.clear()
    return imagesCatalog.find(img => !excludeImages.includes(img.src)) || null
  }

  // 1. Tentar match exato de categoria
  let matches = availableImages.filter(img => img.category === categorySlug)

  // 2. Se não encontrou, tentar match por palavras-chave
  if (matches.length === 0 && searchKeywords.length > 0) {
    matches = availableImages.filter(img =>
      img.keywords.some(keyword => 
        searchKeywords.some(sk => keyword.includes(sk) || sk.includes(keyword))
      )
    )
  }

  // 3. Se ainda não encontrou, usar imagens genéricas
  if (matches.length === 0) {
    matches = availableImages.filter(img => img.category === 'geral')
  }

  // 4. Se ainda não encontrou, usar qualquer disponível
  if (matches.length === 0) {
    matches = availableImages
  }

  // Selecionar aleatoriamente entre os matches
  const selectedImage = matches[Math.floor(Math.random() * matches.length)]
  
  if (selectedImage) {
    usedImages.add(selectedImage.src)
  }

  return selectedImage
}

/**
 * Reseta o rastreamento de imagens usadas
 */
export function resetUsedImages() {
  usedImages.clear()
}

/**
 * Marca uma imagem como usada manualmente
 */
export function markImageAsUsed(src: string) {
  usedImages.add(src)
}

/**
 * Obtém estatísticas de uso de imagens
 */
export function getImageStats() {
  return {
    total: imagesCatalog.length,
    used: usedImages.size,
    available: imagesCatalog.length - usedImages.size,
    usedImages: Array.from(usedImages)
  }
}

/**
 * Distribui imagens para uma lista de artigos
 * Garante que cada artigo tenha uma imagem única
 */
export function distributeImagesForArticles(
  articles: Array<{
    category: { slug: string }
    tags?: string[]
    title?: string
  }>
): Map<number, ImageMapping> {
  resetUsedImages()
  const imageMap = new Map<number, ImageMapping>()

  articles.forEach((article, index) => {
    const keywords = [
      ...(article.tags || []),
      ...(article.title?.toLowerCase().split(' ') || [])
    ]

    const image = findBestImage(article.category.slug, keywords)
    if (image) {
      imageMap.set(index, image)
    }
  })

  return imageMap
}
