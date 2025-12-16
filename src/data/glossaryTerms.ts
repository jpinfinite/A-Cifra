
export interface GlossaryTerm {
  term: string
  definition: string
  example?: string
}

export interface GlossaryCategory {
  title: string
  iconName: 'BookOpen' | 'Brain' | 'TrendingUp' | 'Shield' | 'Target' | 'Clock'
  terms: GlossaryTerm[]
}

export const glossaryData: GlossaryCategory[] = [
  {
    "title": "Conceitos Fundamentais",
    "iconName": "BookOpen",
    "terms": [
      {
        "term": "Blockchain",
        "definition": "Livro-razão digital distribuído e imutável que registra transações em uma rede de computadores.",
        "example": "A blockchain do Bitcoin registra todas as transações."
      },
      {
        "term": "Criptomoeda",
        "definition": "Moeda digital ou virtual que usa criptografia para segurança.",
        "example": "Bitcoin e Ethereum são exemplos."
      },
      {
        "term": "Bitcoin (BTC)",
        "definition": "Primeira e maior criptomoeda do mundo, criada em 2009 por Satoshi Nakamoto.",
        "example": "O Bitcoin é considerado ouro digital."
      },
      {
        "term": "Ethereum (ETH)",
        "definition": "Plataforma blockchain para smart contracts e dApps.",
        "example": "A rede Ethereum hospeda a maioria dos NFTs."
      }
    ]
  },
  {
    "title": "Tecnologia e Infraestrutura",
    "iconName": "Brain",
    "terms": [
      {
        "term": "Smart Contract",
        "definition": "Contrato auto-executável com os termos escritos diretamente em código."
      },
      {
        "term": "DeFi (Decentralized Finance)",
        "definition": "Sistema financeiro aberto sem intermediários centrais."
      },
      {
        "term": "NFT (Non-Fungible Token)",
        "definition": "Token único que representa propriedade de um item digital ou físico."
      }
    ]
  },
  {
    "title": "Investimento e Trading",
    "iconName": "TrendingUp",
    "terms": [
      {
        "term": "HODL",
        "definition": "Estratégia de manter ativos a longo prazo independente da volatilidade."
      },
      {
        "term": "DCA (Dollar Cost Averaging)",
        "definition": "Investir uma quantia fixa regularmente para suavizar o preço médio."
      },
      {
        "term": "Market Cap",
        "definition": "baixo mas o FDV é gigantesco, cuidado: haverá muita inflação de tokens (desbloqueios) no futuro."
      }
    ]
  },
  {
    "title": "Segurança e Privacidade",
    "iconName": "Shield",
    "terms": [
      {
        "term": "Wallet",
        "definition": "Ferramenta para armazenar chaves públicas e privadas."
      },
      {
        "term": "Chave Privada",
        "definition": "Senha secreta que dá acesso aos seus fundos."
      },
      {
        "term": "Cold Wallet",
        "definition": "(geralmente uma Hardware Wallet) é um dispositivo físico que armazena suas chaves privadas **offline**. Ela nunca se conecta diretamente à internet para assinar transações; o processo acontece dentro do dispositivo."
      },
      {
        "term": "Hot Wallet",
        "definition": "é qualquer carteira de criptomoedas que está conectada à internet. Geralmente são aplicativos de celular, extensões de navegador ou programas de computador."
      }
    ]
  },
  {
    "title": "Conceitos Avançados",
    "iconName": "Target",
    "terms": [
      {
        "term": "Halving",
        "definition": "Evento que corta a emissão de novos Bitcoins pela metade a cada 4 anos."
      },
      {
        "term": "Staking",
        "definition": "Travar criptomoedas para validar transações e receber recompensas."
      }
    ]
  }
]
