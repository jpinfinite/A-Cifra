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
 * Atualizado com imagens reais de Dezembro 2025
 */
export const imagesCatalog: ImageMapping[] = [
  // Bitcoin
  {
    src: '/images/bitcoin/2025-12/bitcoin-200k-institucional.webp',
    alt: 'Bitcoin em alta adoção institucional',
    category: 'bitcoin',
    keywords: ['bitcoin', 'institucional', '200k', 'investimento', 'banco']
  },
  {
    src: '/images/bitcoin/2025-12/bitcoin-halving-2028.webp',
    alt: 'Bitcoin Halving e Ciclos de Mercado',
    category: 'bitcoin',
    keywords: ['bitcoin', 'halving', '2028', 'ciclo', 'mineração']
  },
  {
    src: '/images/bitcoin/2025-12/bitcoin-layer-2-stacks-ordinals.webp',
    alt: 'Bitcoin Layer 2 Stacks e Ordinals',
    category: 'bitcoin',
    keywords: ['bitcoin', 'layer 2', 'stacks', 'ordinals', 'defi']
  },
  {
    src: '/images/bitcoin/2025-12/bitcoin-previsao-2026-analise.webp',
    alt: 'Análise de Previsão Bitcoin 2026',
    category: 'bitcoin',
    keywords: ['bitcoin', 'previsão', '2026', 'análise', 'preço']
  },
  {
    src: '/images/bitcoin/2025-12/bitcoin-queda-ciclos.webp',
    alt: 'Análise de Ciclos de Queda do Bitcoin',
    category: 'bitcoin',
    keywords: ['bitcoin', 'queda', 'ciclo', 'urso', 'correção']
  },
  {
    src: '/images/bitcoin/2025-12/lightning-network-2026.webp',
    alt: 'Lightning Network e Pagamentos Bitcoin',
    category: 'bitcoin',
    keywords: ['bitcoin', 'lightning', 'pagamentos', 'escalabilidade']
  },
  {
    src: '/images/bitcoin/2025-12/etfs-de-bitcoin-spot-options.webp',
    alt: 'ETFs de Bitcoin e Opções',
    category: 'bitcoin',
    keywords: ['bitcoin', 'etf', 'opções', 'mercado financeiro']
  },

  // Ethereum
  {
    src: '/images/ethereum/2025-12/ethereum-danksharding.webp',
    alt: 'Ethereum Danksharding e Escalabilidade',
    category: 'ethereum',
    keywords: ['ethereum', 'danksharding', 'sharding', 'escalabilidade']
  },
  {
    src: '/images/ethereum/2025-12/ethereum-staking-lquido.webp',
    alt: 'Ethereum Staking Líquido',
    category: 'ethereum',
    keywords: ['ethereum', 'staking', 'líquido', 'lido', 'rocket pool']
  },
  {
    src: '/images/ethereum/2025-12/restaking-ethereum-2026.webp',
    alt: 'Restaking Ethereum e EigenLayer',
    category: 'ethereum',
    keywords: ['ethereum', 'restaking', 'eigenlayer', 'rendimento']
  },
  {
    src: '/images/ethereum/2025-12/zk-rollups-privacy.webp',
    alt: 'ZK-Rollups e Privacidade Ethereum',
    category: 'ethereum',
    keywords: ['ethereum', 'zk-rollup', 'privacidade', 'layer 2']
  },

  // DeFi
  {
    src: '/images/defi/2025-12/defi-20-real-yield.webp',
    alt: 'DeFi 2.0 e Real Yield',
    category: 'defi',
    keywords: ['defi', 'real yield', 'rendimento', 'sustentabilidade']
  },
  {
    src: '/images/defi/2025-12/dex-vs-cex-2026.webp',
    alt: 'DEX vs CEX: Comparativo 2026',
    category: 'defi',
    keywords: ['dex', 'cex', 'exchange', 'descentralizada']
  },
  {
    src: '/images/defi/2025-12/rwa-depin-convergence.webp',
    alt: 'Convergência RWA e DePIN',
    category: 'defi',
    keywords: ['rwa', 'depin', 'ativos reais', 'infraestrutura']
  },
  {
    src: '/images/defi/2025-12/tokenizao-ttulos-pblicos.webp',
    alt: 'Tokenização de Títulos Públicos',
    category: 'defi',
    keywords: ['tokenização', 'títulos', 'governo', 'rwa']
  },
  {
    src: '/images/defi/2025-12/yield-farming-seguro.webp',
    alt: 'Yield Farming Seguro',
    category: 'defi',
    keywords: ['yield farming', 'segurança', 'farming', 'renda passiva']
  },
  {
    src: '/images/defi/2025-12/stablecoins-algortmicas-seguras.webp',
    alt: 'Stablecoins Algorítmicas Seguras',
    category: 'defi',
    keywords: ['stablecoins', 'algorítmica', 'dolar', 'peg']
  },

  // Altcoins
  {
    src: '/images/altcoins/2025-12/arbitrum-vs-optimism-2026.webp',
    alt: 'Arbitrum vs Optimism Batalha L2',
    category: 'altcoins',
    keywords: ['arbitrum', 'optimism', 'layer 2', 'rollup', 'batalha']
  },
  {
    src: '/images/altcoins/2025-12/base-chain-coinbase.webp',
    alt: 'Base Chain da Coinbase',
    category: 'altcoins',
    keywords: ['base', 'coinbase', 'layer 2', 'ethereum']
  },
  {
    src: '/images/altcoins/2025-12/cripto-ia-2026.webp',
    alt: 'Criptomoedas e Inteligência Artificial',
    category: 'altcoins',
    keywords: ['ia', 'artificial', 'inteligência', 'ai', 'crypto']
  },
  {
    src: '/images/altcoins/2025-12/render-network-gpu.webp',
    alt: 'Render Network e GPU Computing',
    category: 'altcoins',
    keywords: ['render', 'rndr', 'gpu', 'computação', 'ia']
  },
  {
    src: '/images/altcoins/2025-12/solana-2026-previsao.webp',
    alt: 'Previsão Solana 2026',
    category: 'altcoins',
    keywords: ['solana', 'sol', 'previsão', '2026', 'alta']
  },
  {
    src: '/images/altcoins/2025-12/solana-firedancer.webp',
    alt: 'Solana Firedancer Upgrade',
    category: 'altcoins',
    keywords: ['solana', 'firedancer', 'upgrade', 'performance']
  },
  {
    src: '/images/altcoins/2025-12/fetchai-e-ocean-protocol.webp',
    alt: 'Fetch.ai e Ocean Protocol',
    category: 'altcoins',
    keywords: ['fetch.ai', 'ocean', 'ia', 'dados', 'protocolo']
  },

  // Análises
  {
    src: '/images/analises/2025-12/agentes-de-ia-em-crypto-guia-completo-2026.webp',
    alt: 'Agentes de IA em Cripto',
    category: 'analises',
    keywords: ['ia', 'agentes', 'bot', 'automação', 'trading']
  },
  {
    src: '/images/analises/2025-12/solana-vs-ethereum-2026-guerra-das-l1s-guia-completo-2026.webp',
    alt: 'Solana vs Ethereum Guerra das L1s',
    category: 'analises',
    keywords: ['solana', 'ethereum', 'guerra', 'layer 1', 'comparativo']
  },

  // Educação
  {
    src: '/images/educacao/2025-12/como-comprar-criptomoedas-tutorial-passo-a-passo-para-iniciantes.webp',
    alt: 'Como Comprar Criptomoedas Tutorial',
    category: 'educacao',
    keywords: ['comprar', 'tutorial', 'iniciante', 'passo a passo']
  },
  {
    src: '/images/educacao/2025-12/impostos-cripto-guia.webp',
    alt: 'Guia de Impostos Cripto',
    category: 'educacao',
    keywords: ['impostos', 'receita', 'declaração', 'taxas', 'guia']
  },
  {
    src: '/images/educacao/2025-12/web3-banking-carto-cripto-2026.webp',
    alt: 'Web3 Banking e Cartões Cripto',
    category: 'educacao',
    keywords: ['web3', 'banco', 'cartão', 'pagamentos', 'visa', 'mastercard']
  },
  {
    src: '/images/educacao/2025-12/herana-de-criptomoedas.webp',
    alt: 'Herança de Criptomoedas e Planejamento',
    category: 'educacao',
    keywords: ['herança', 'sucessão', 'planejamento', 'futuro']
  },
  {
    src: '/images/educacao/2025-12/carteira-multisig-tutorial.webp',
    alt: 'Tutorial Carteira Multisig',
    category: 'educacao',
    keywords: ['multisig', 'carteira', 'segurança', 'tutorial']
  },

  // Segurança
  {
    src: '/images/seguranca/2025-12/hardware-wallets-2026.webp',
    alt: 'Hardware Wallets 2026',
    category: 'seguranca',
    keywords: ['hardware wallet', 'ledger', 'trezor', 'segurança', 'cold wallet']
  },
  {
    src: '/images/seguranca/2025-12/ledger-trezor-review.webp',
    alt: 'Review Ledger vs Trezor',
    category: 'seguranca',
    keywords: ['ledger', 'trezor', 'review', 'comparativo', 'segurança']
  },
  {
    src: '/images/seguranca/2025-12/ciberseguranca-crypto.webp',
    alt: 'Cibersegurança em Cripto',
    category: 'seguranca',
    keywords: ['cibersegurança', 'hacker', 'proteção', 'dados']
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

  // Filtrar imagens disponíveis (não usadas e não excluídas) e que realmente existem no catálogo
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

  // 3. Se ainda não encontrou, usar imagens genéricas ou de outras categorias
  if (matches.length === 0) {
    matches = availableImages.filter(img => img.category === 'geral' || img.category === 'altcoins')
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
