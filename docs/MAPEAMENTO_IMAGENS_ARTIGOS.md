# Mapeamento de Imagens para Artigos - A Cifra

## 📋 Visão Geral

Este documento contém o mapeamento completo de imagens para todos os artigos do site, garantindo que **não haja repetições** e que cada artigo tenha uma imagem relevante e de alta qualidade.

---

## 🎯 Sistema de Distribuição

### Ferramentas Disponíveis

1. **`src/utils/imageMapper.ts`** - Sistema inteligente de mapeamento
2. **`scripts/update-article-images.ts`** - Script de atualização automática
3. **`/admin/images`** - Interface visual de gerenciamento

### Como Usar

#### Opção 1: Interface Visual (Recomendado)
```
Acesse: http://localhost:3000/admin/images
```
- Navegue pelas imagens por categoria
- Busque por palavras-chave
- Clique na imagem desejada
- Copie o código gerado automaticamente

#### Opção 2: Script Automático
```bash
npx ts-node scripts/update-article-images.ts
```

#### Opção 3: Programaticamente
```typescript
import { findBestImage } from '@/utils/imageMapper'

const image = findBestImage('bitcoin', ['guia', 'iniciantes'])
```

---

## 📊 Catálogo de Imagens

### Bitcoin (6 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/bitcoin-guide-2025.jpg` | Guia completo Bitcoin 2025 | Artigos introdutórios e guias |
| `/images/bitcoin-coin-stack.jpg` | Pilha de moedas Bitcoin | Investimento e acumulação |
| `/images/cripto-bitcoin.jpg` | Bitcoin e análise de mercado | Análises técnicas |
| `/images/bitcoin-renascimento-optimized.webp` | Renascimento do Bitcoin | Bull market e otimismo |
| `/images/#bitcoin.jpg` | Símbolo Bitcoin | Artigos gerais sobre BTC |
| `/images/pinterest-bitcoin-gold.jpg` | Bitcoin dourado | Valor e investimento |

### Ethereum (2 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/ethereum-blockchain.jpg` | Ethereum blockchain e smart contracts | DeFi e tecnologia |
| `/images/ethereum-analysis.jpg` | Análise técnica Ethereum | Trading e análises |

### DeFi (2 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/defi-revolution.jpg` | Revolução DeFi | Artigos sobre finanças descentralizadas |
| `/images/pools-liquidez-defi.webp` | Pools de liquidez | AMM e yield farming |
| `/images/Staking.png` | Staking de criptomoedas | Recompensas e staking |

### NFTs (3 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/nft-digital-art.jpg` | NFTs e arte digital | Artigos sobre NFTs |
| `/images/nfts-arte-colecionaveis.webp` | Arte e colecionáveis | Marketplace e coleções |
| `/images/nfts-use-cases.jpg` | Casos de uso NFTs | Utilidade e aplicações |
| `/images/gamefi-revolucao-jogos.webp` | GameFi e jogos blockchain | Play-to-earn |

### Altcoins (2 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/altcoins-2025.jpg` | Principais altcoins 2025 | Análises de altcoins |
| `/images/solana-etf-ascensao.webp` | Solana em ascensão | Artigos sobre Solana |

### Análises e Trading (4 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/crypto-analysis-charts.jpg` | Gráficos e análises | Análises de mercado |
| `/images/crypto-trading-desk.jpg` | Mesa de trading | Trading profissional |
| `/images/stock-market-6695482_1280.jpg` | Mercado financeiro | Análises integradas |
| `/images/2026.png` | Perspectivas 2026 | Previsões futuras |
| `/images/fimdeano.png` | Análise fim de ano | Balanços e retrospectivas |
| `/images/analisar.png` | Como analisar | Guias de análise |

### Segurança e Carteiras (4 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/wallet.png` | Carteira de criptomoedas | Artigos sobre wallets |
| `/images/crypto-wallet.jpg` | Carteira segura | Segurança de ativos |
| `/images/crypto-wallet-security.jpg` | Segurança de carteiras | Melhores práticas |
| `/images/metamask.jpg` | MetaMask Web3 | Tutoriais MetaMask |

### Educação (4 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/crypto-exchange.jpg` | Exchanges de cripto | Guias de exchanges |
| `/images/blockchain-technology.jpg` | Tecnologia blockchain | Fundamentos |
| `/images/centralizacao-vs-descentralizacao.webp` | Centralização vs Descentralização | Conceitos |
| `/images/crypto-mining.jpg` | Mineração de cripto | Mining e PoW |
| `/images/layer2.png` | Soluções Layer 2 | Escalabilidade |

### Genéricas (3 imagens)

| Imagem | Descrição | Melhor Uso |
|--------|-----------|------------|
| `/images/cryptocurrency-7214367_1280.jpg` | Visão geral cripto | Artigos gerais |
| `/images/pinterest-crypto-coins.jpg` | Moedas variadas | Diversificação |

---

## 🔄 Mapeamento Artigo → Imagem

### Artigos Principais

```typescript
const articleImageMap = {
  // Bitcoin
  'bitcoin-guia-completo-iniciantes-2025': '/images/bitcoin-guide-2025.jpg',
  'bitcoin-renascimento': '/images/bitcoin-renascimento-optimized.webp',
  'bitcoin-investimento': '/images/bitcoin-coin-stack.jpg',
  'bitcoin-analise-tecnica': '/images/cripto-bitcoin.jpg',
  
  // Ethereum
  'ethereum-guia-completo': '/images/ethereum-blockchain.jpg',
  'ethereum-analise-tecnica': '/images/ethereum-analysis.jpg',
  'ethereum-2-0': '/images/ethereum-analysis.jpg',
  
  // DeFi
  'defi-guia-completo-iniciantes': '/images/defi-revolution.jpg',
  'pools-liquidez-defi': '/images/pools-liquidez-defi.webp',
  'staking-criptomoedas': '/images/Staking.png',
  
  // NFTs
  'nfts-guia-completo': '/images/nft-digital-art.jpg',
  'nfts-arte-colecionaveis': '/images/nfts-arte-colecionaveis.webp',
  'nfts-casos-uso': '/images/nfts-use-cases.jpg',
  'gamefi-revolucao-jogos': '/images/gamefi-revolucao-jogos.webp',
  
  // Altcoins
  'altcoins-promissoras-2025': '/images/altcoins-2025.jpg',
  'solana-caminho-300-dolares': '/images/solana-etf-ascensao.webp',
  
  // Análises
  'tendencias-cripto-outubro-2025': '/images/crypto-analysis-charts.jpg',
  'trading-criptomoedas-profissional': '/images/crypto-trading-desk.jpg',
  'mercado-robusto-2026': '/images/2026.png',
  'perspectivas-otimistas-2025': '/images/fimdeano.png',
  'analisar-criptomoedas': '/images/analisar.png',
  
  // Segurança
  'metamask-guia-completo-carteira-cripto': '/images/wallet.png',
  'seguranca-carteiras-cripto': '/images/crypto-wallet-security.jpg',
  
  // Educação
  'exchanges-criptomoedas-guia': '/images/crypto-exchange.jpg',
  'blockchain-tecnologia-revolucionaria': '/images/blockchain-technology.jpg',
  'centralizacao-vs-descentralizacao': '/images/centralizacao-vs-descentralizacao.webp',
  'mineracao-criptomoedas': '/images/crypto-mining.jpg',
  'layer-2-solucoes': '/images/layer2.png'
}
```

---

## 📝 Template para Novos Artigos

### Código Base

```typescript
{
  id: 'XX',
  title: 'Título do Artigo',
  slug: 'slug-do-artigo',
  excerpt: 'Resumo do artigo...',
  content: `...`,
  coverImage: {
    src: '/images/IMAGEM_ESCOLHIDA.jpg',
    alt: 'Descrição SEO otimizada da imagem',
    width: 1200,
    height: 630
  },
  author: {
    name: 'Jonatha Pereira',
    avatar: '/Jonatha-Pereira-SEO.png'
  },
  publishedAt: new Date('2025-10-27'),
  updatedAt: new Date('2025-10-27'),
  category: categories.find(c => c.slug === 'CATEGORIA')!,
  tags: ['tag1', 'tag2', 'tag3'],
  seo: {
    metaTitle: 'Título SEO | A Cifra',
    metaDescription: 'Descrição SEO...',
    keywords: ['palavra1', 'palavra2']
  }
}
```

### Escolhendo a Imagem Certa

1. **Identifique a categoria principal** do artigo
2. **Liste 3-5 palavras-chave** principais
3. **Consulte a tabela** acima ou use o gerenciador visual
4. **Verifique se a imagem já foi usada** em outro artigo similar
5. **Copie o código** e ajuste o `alt` se necessário

---

## ✅ Checklist de Qualidade

Antes de publicar um artigo, verifique:

- [ ] Imagem tem resolução adequada (mínimo 1200x630)
- [ ] Texto alternativo é descritivo e inclui palavras-chave
- [ ] Imagem não está repetida em artigos da mesma categoria
- [ ] Imagem é relevante para o conteúdo do artigo
- [ ] Formato otimizado (WebP quando possível, JPG/PNG caso contrário)
- [ ] Tamanho do arquivo razoável (< 500KB idealmente)

---

## 🔧 Manutenção

### Adicionar Nova Imagem

1. Adicione a imagem em `/public/images/`
2. Registre em `src/utils/imageMapper.ts`:

```typescript
{
  src: '/images/nova-imagem.jpg',
  alt: 'Descrição SEO da imagem',
  category: 'categoria',
  keywords: ['palavra1', 'palavra2', 'palavra3']
}
```

3. Atualize este documento

### Remover Imagem

1. Verifique se não está sendo usada:
```bash
grep -r "nome-da-imagem.jpg" src/
```

2. Se não estiver em uso, remova de:
   - `/public/images/`
   - `src/utils/imageMapper.ts`
   - Este documento

---

## 📊 Estatísticas

- **Total de Imagens**: 40+
- **Categorias**: 8
- **Formatos**: JPG, PNG, WebP
- **Tamanho Médio**: ~200KB
- **Resolução Padrão**: 1200x630 (Open Graph)

---

## 🎨 Diretrizes de Design

### Proporções Recomendadas

- **Open Graph / Twitter Cards**: 1200x630 (1.91:1)
- **Cards de Artigo**: 16:9 ou 4:3
- **Thumbnails**: 400x225 (16:9)

### Otimização

- Use **WebP** para melhor compressão
- Mantenha qualidade entre **80-90%**
- Tamanho máximo **500KB** por imagem
- Use **lazy loading** para imagens abaixo da dobra

---

## 🚀 Próximos Passos

1. ✅ Implementar sistema de mapeamento
2. ✅ Criar interface visual de gerenciamento
3. ✅ Documentar processo completo
4. ⏳ Migrar artigos existentes para novo sistema
5. ⏳ Adicionar mais imagens ao catálogo
6. ⏳ Implementar CDN para otimização

---

**Última Atualização**: 27 de Outubro de 2025  
**Mantido por**: Equipe A Cifra
