/**
 * Script para atualizar imagens dos artigos automaticamente
 * Distribui imagens únicas sem repetições
 */

import { imagesCatalog, findBestImage, resetUsedImages } from '../src/utils/imageMapper'

interface ArticleUpdate {
  id: string
  title: string
  slug: string
  category: string
  tags: string[]
  currentImage?: string
  suggestedImage?: {
    src: string
    alt: string
  }
}

/**
 * Mapeamento manual de artigos para imagens específicas
 * Usado quando queremos garantir uma imagem específica para um artigo
 */
const manualImageMapping: Record<string, string> = {
  'metamask-guia-completo-carteira-cripto': '/images/wallet.png',
  'bitcoin-guia-completo-iniciantes-2025': '/images/bitcoin-guide-2025.jpg',
  'defi-guia-completo-iniciantes': '/images/defi-revolution.jpg',
  'ethereum-analise-tecnica': '/images/ethereum-analysis.jpg',
  'nfts-guia-completo': '/images/nft-digital-art.jpg',
  'altcoins-promissoras-2025': '/images/altcoins-2025.jpg',
  'solana-caminho-300-dolares': '/images/solana-etf-ascensao.webp',
  'centralizacao-vs-descentralizacao': '/images/centralizacao-vs-descentralizacao.webp',
  'pools-liquidez-defi': '/images/pools-liquidez-defi.webp',
  'blockchain-tecnologia-revolucionaria': '/images/blockchain-technology.jpg',
  'gamefi-revolucao-jogos': '/images/gamefi-revolucao-jogos.webp',
  'nfts-arte-colecionaveis': '/images/nfts-arte-colecionaveis.webp',
  'bitcoin-renascimento': '/images/bitcoin-renascimento-optimized.webp',
  'tendencias-cripto-outubro-2025': '/images/crypto-analysis-charts.jpg',
  'exchanges-criptomoedas-guia': '/images/crypto-exchange.jpg',
  'perspectivas-otimistas-2025': '/images/fimdeano.png',
  'mercado-robusto-2026': '/images/2026.png',
  'analisar-criptomoedas': '/images/analisar.png'
}

/**
 * Lista de artigos do sistema (simulação - em produção viria do banco de dados)
 */
const articles: ArticleUpdate[] = [
  {
    id: '1',
    title: 'Bitcoin: Guia Completo para Iniciantes 2025',
    slug: 'bitcoin-guia-completo-iniciantes-2025',
    category: 'bitcoin',
    tags: ['bitcoin', 'guia', 'iniciantes', 'investimento', 'btc']
  },
  {
    id: '2',
    title: 'DeFi: Guia Completo para Iniciantes',
    slug: 'defi-guia-completo-iniciantes',
    category: 'defi',
    tags: ['defi', 'finanças descentralizadas', 'yield farming', 'liquidity pools']
  },
  {
    id: '3',
    title: 'Ethereum: Análise Técnica Completa',
    slug: 'ethereum-analise-tecnica',
    category: 'ethereum',
    tags: ['ethereum', 'eth', 'análise técnica', 'trading']
  },
  {
    id: '4',
    title: 'NFTs: Guia Completo sobre Tokens Não Fungíveis',
    slug: 'nfts-guia-completo',
    category: 'nfts',
    tags: ['nft', 'tokens', 'arte digital', 'colecionáveis']
  },
  {
    id: '5',
    title: 'Altcoins Promissoras para 2025',
    slug: 'altcoins-promissoras-2025',
    category: 'altcoins',
    tags: ['altcoins', '2025', 'investimento', 'oportunidades']
  },
  {
    id: '6',
    title: 'Solana: O Caminho para $300',
    slug: 'solana-caminho-300-dolares',
    category: 'altcoins',
    tags: ['solana', 'sol', 'previsão', 'análise']
  },
  {
    id: '7',
    title: 'Centralização vs Descentralização',
    slug: 'centralizacao-vs-descentralizacao',
    category: 'educacao',
    tags: ['centralização', 'descentralização', 'blockchain', 'conceitos']
  },
  {
    id: '8',
    title: 'Pools de Liquidez DeFi: Guia Completo',
    slug: 'pools-liquidez-defi',
    category: 'defi',
    tags: ['pools', 'liquidez', 'amm', 'yield farming']
  },
  {
    id: '9',
    title: 'Blockchain: A Tecnologia Revolucionária',
    slug: 'blockchain-tecnologia-revolucionaria',
    category: 'educacao',
    tags: ['blockchain', 'tecnologia', 'fundamentos', 'inovação']
  },
  {
    id: '10',
    title: 'GameFi: A Revolução dos Jogos Blockchain',
    slug: 'gamefi-revolucao-jogos',
    category: 'nfts',
    tags: ['gamefi', 'jogos', 'play to earn', 'blockchain']
  },
  {
    id: '11',
    title: 'MetaMask: Guia Completo da Carteira Cripto',
    slug: 'metamask-guia-completo-carteira-cripto',
    category: 'tutoriais',
    tags: ['metamask', 'carteira', 'web3', 'ethereum', 'segurança']
  },
  {
    id: '12',
    title: 'Tendências Cripto Outubro 2025',
    slug: 'tendencias-cripto-outubro-2025',
    category: 'analises',
    tags: ['tendências', 'mercado', 'análise', '2025', 'cripto']
  },
  {
    id: '13',
    title: 'Exchanges de Criptomoedas: Guia Completo',
    slug: 'exchanges-criptomoedas-guia',
    category: 'educacao',
    tags: ['exchanges', 'trading', 'compra', 'venda', 'plataformas']
  },
  {
    id: '14',
    title: 'Perspectivas Otimistas para 2025',
    slug: 'perspectivas-otimistas-2025',
    category: 'analises',
    tags: ['perspectivas', '2025', 'otimismo', 'bull market']
  },
  {
    id: '15',
    title: 'Mercado Robusto em 2026',
    slug: 'mercado-robusto-2026',
    category: 'analises',
    tags: ['2026', 'mercado', 'previsões', 'análise']
  },
  {
    id: '16',
    title: 'Como Analisar Criptomoedas',
    slug: 'analisar-criptomoedas',
    category: 'educacao',
    tags: ['análise', 'indicadores', 'fundamentalista', 'técnica']
  },
  {
    id: '17',
    title: 'Segurança em Carteiras Cripto',
    slug: 'seguranca-carteiras-cripto',
    category: 'seguranca',
    tags: ['segurança', 'carteiras', 'proteção', 'wallet']
  },
  {
    id: '18',
    title: 'Trading de Criptomoedas: Guia Profissional',
    slug: 'trading-criptomoedas-profissional',
    category: 'analises',
    tags: ['trading', 'profissional', 'estratégias', 'análise']
  }
]

/**
 * Gera sugestões de imagens para todos os artigos
 */
function generateImageSuggestions(): ArticleUpdate[] {
  resetUsedImages()
  
  return articles.map(article => {
    // Verificar se há mapeamento manual
    const manualImage = manualImageMapping[article.slug]
    
    if (manualImage) {
      const imageData = imagesCatalog.find(img => img.src === manualImage)
      return {
        ...article,
        suggestedImage: imageData ? {
          src: imageData.src,
          alt: imageData.alt
        } : undefined
      }
    }

    // Caso contrário, usar o sistema automático
    const image = findBestImage(article.category, article.tags)
    
    return {
      ...article,
      suggestedImage: image ? {
        src: image.src,
        alt: image.alt
      } : undefined
    }
  })
}

/**
 * Gera código TypeScript para atualizar articles.ts
 */
function generateArticleUpdates(): string {
  const suggestions = generateImageSuggestions()
  
  let output = '// Atualizações de imagens para articles.ts\n\n'
  output += '// Copie e cole as coverImage correspondentes em cada artigo\n\n'
  
  suggestions.forEach(article => {
    if (article.suggestedImage) {
      output += `// ${article.title}\n`
      output += `coverImage: {\n`
      output += `  src: '${article.suggestedImage.src}',\n`
      output += `  alt: '${article.suggestedImage.alt}',\n`
      output += `  width: 1200,\n`
      output += `  height: 630\n`
      output += `},\n\n`
    }
  })
  
  return output
}

/**
 * Gera relatório de distribuição de imagens
 */
function generateReport(): string {
  const suggestions = generateImageSuggestions()
  
  let report = '═══════════════════════════════════════════════════════════\n'
  report += '  RELATÓRIO DE DISTRIBUIÇÃO DE IMAGENS - A CIFRA\n'
  report += '═══════════════════════════════════════════════════════════\n\n'
  
  report += `Total de Artigos: ${articles.length}\n`
  report += `Total de Imagens Disponíveis: ${imagesCatalog.length}\n`
  report += `Imagens Únicas Utilizadas: ${new Set(suggestions.map(s => s.suggestedImage?.src)).size}\n\n`
  
  report += '───────────────────────────────────────────────────────────\n'
  report += 'DISTRIBUIÇÃO POR ARTIGO:\n'
  report += '───────────────────────────────────────────────────────────\n\n'
  
  suggestions.forEach((article, index) => {
    report += `${index + 1}. ${article.title}\n`
    report += `   Categoria: ${article.category}\n`
    report += `   Slug: ${article.slug}\n`
    if (article.suggestedImage) {
      report += `   ✅ Imagem: ${article.suggestedImage.src}\n`
      report += `   Alt: ${article.suggestedImage.alt}\n`
    } else {
      report += `   ❌ Nenhuma imagem sugerida\n`
    }
    report += '\n'
  })
  
  report += '───────────────────────────────────────────────────────────\n'
  report += 'DISTRIBUIÇÃO POR CATEGORIA:\n'
  report += '───────────────────────────────────────────────────────────\n\n'
  
  const byCategory = suggestions.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = []
    }
    acc[article.category].push(article)
    return acc
  }, {} as Record<string, ArticleUpdate[]>)
  
  Object.entries(byCategory).forEach(([category, arts]) => {
    report += `${category.toUpperCase()}: ${arts.length} artigos\n`
    arts.forEach(art => {
      report += `  • ${art.title}\n`
      if (art.suggestedImage) {
        report += `    → ${art.suggestedImage.src}\n`
      }
    })
    report += '\n'
  })
  
  report += '═══════════════════════════════════════════════════════════\n'
  
  return report
}

// Executar e exibir resultados
console.log(generateReport())
console.log('\n\n')
console.log(generateArticleUpdates())
