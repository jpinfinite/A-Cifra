---
id: 'ethereum-gas-limit-60m-upgrade-2025'
title: 'Ethereum Aumenta Gas Limit para 60M - O Que Muda na Rede em 2025'
slug: 'ethereum-gas-limit-60m-upgrade-2025'
excerpt: 'Ethereum eleva gas limit para 60 milhões, expandindo capacidade da rede em 20%. Entenda o impacto nas taxas, velocidade e preparação para o upgrade Fusaka em 2026.'
coverImage:
  src: '/images/ethereum-gas-limit-upgrade-styled.jpg'
  alt: 'Ethereum aumentando gas limit para 60 milhões - upgrade de rede'
  width: 1200
  height: 630
author:
  name: 'Equipe A Cifra'
  avatar: '/avatar.png'
publishedAt: '2025-11-27'
updatedAt: '2025-11-27'
categorySlug: 'ethereum'
tags: ['ethereum', 'gas limit', 'upgrade', 'escalabilidade', 'fusaka']
seo:
  metaTitle: 'Ethereum Gas Limit 60M: Upgrade Aumenta Capacidade 20% | A Cifra'
  metaDescription: 'Ethereaumenta gas limit para 60 milhões, expandindo capacidade em 20%. Vitalik Buterin explica impacto nas taxas e preparação para Fusaka 2026.'
  keywords: ['ethereum gas limit', 'ethereum upgrade 2025', 'gas limit 60m', 'ethereum escalabilidade', 'vitalik buterin']
---

# [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) Aumenta Gas Limit para 60M - O Que Muda na Rede em 2025

**27 de novembro de 2025** - A rede [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) acaba de implementar um upgrade significativo: o **gas limit por bloco aumentou de 50 milhões para 60 milhões**, representando uma **expansão de 20% na capacidade** da rede. Vitalik Buterin, co-fundador do [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026), confirmou a mudança e indicou que mais ajustes virão em 2026.

## O Que É Gas Limit?

**Gas limit** é o **máximo de gas (unidade de computação)** que pode ser usado em um único bloco do [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026).

**Analogia simples:** Pense no gas limit como o tamanho de um ônibus:
- **Gas limit maior** = ônibus maior = mais passageiros (transações) por viagem (bloco)
- **Gas limit menor** = ônibus menor = menos passageiros por viagem

### Como Funciona

Cada transação no [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) consome **gas**:
- **Transferência simples de ETH:** ~21.000 gas
- **Swap na Uniswap:** ~150.000 gas
- **Mint de NFT:** ~80.000 gas
- **Transação complexa [defi](/artigo/defi-yield-farming-protocolos-seguros-2026):** 300.000+ gas

**Com gas limit de 50M:**
- ~2.380 transferências simples por bloco
- ~333 swaps na Uniswap por bloco
- ~625 mints de NFT por bloco

**Com gas limit de 60M (novo):**
- ~2.857 transferências simples por bloco (+20%)
- ~400 swaps na Uniswap por bloco (+20%)
- ~750 mints de NFT por bloco (+20%)

## Por Que Aumentar o Gas Limit?

### 1. Demanda Crescente

A rede [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) está processando **mais transações do que nunca**:

**Estatísticas (novembro 2025):**
- **1,2 milhão de transações/dia** (média)
- **Blocos 95%+ cheios** (congestionamento)
- **Gas price médio:** 15-25 gwei (alto)

**Resultado:** Rede congestionada = taxas altas = usuários migrando para Layer 2s.

### 2. Preparação para Fusaka (2026)

**Fusaka** é o próximo grande upgrade do [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) (previsto para Q2 2026):

**Melhorias esperadas:**
- Aumento adicional de capacidade
- Otimizações de EVM ([ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) Virtual Machine)
- Melhor eficiência de gas
- Suporte aprimorado para Layer 2s

**Vitalik Buterin disse:**
> "Esperamos crescimento contínuo em 2026, mas com ajustes mais inteligentes que expandem capacidade sem criar novos gargalos."

### 3. Competição com Layer 2s

**Layer 2s** (Arbitrum, Optimism, Base) estão crescendo rapidamente:

**Volume de transações (nov/2025):**
- **Arbitrum:** 3M transações/dia
- **Optimism:** 1,5M transações/dia
- **Base:** 2M transações/dia
- **[ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) L1:** 1,2M transações/dia

**Problema:** Layer 2s estão processando **mais transações que a mainnet**.

**Solução:** Aumentar capacidade da L1 para manter relevância e reduzir taxas.

## Impacto nas Taxas de Gas

### Antes do Upgrade (Gas Limit 50M)

**Cenário típico:**
- **Demanda alta:** 55M gas necessário
- **Capacidade:** 50M gas disponível
- **Resultado:** Congestionamento, taxas sobem para 50-100 gwei

**Custo de transação:**
- Transferência ETH: $3-$5
- Swap Uniswap: $15-$30
- Mint NFT: $10-$20

### Depois do Upgrade (Gas Limit 60M)

**Cenário típico:**
- **Demanda alta:** 55M gas necessário
- **Capacidade:** 60M gas disponível
- **Resultado:** Sem congestionamento, taxas caem para 10-20 gwei

**Custo de transação:**
- Transferência ETH: $1-$2 (-50%)
- Swap Uniswap: $8-$15 (-50%)
- Mint NFT: $5-$10 (-50%)

**Economia estimada:** 40-60% nas taxas durante períodos de alta demanda.

## Riscos e Desafios

### 1. Aumento do Tamanho da Blockchain

**Problema:** Blocos maiores = blockchain cresce mais rápido.

**Números:**
- **Antes:** ~50 KB por bloco
- **Depois:** ~60 KB por bloco (+20%)
- **Por ano:** +1,5 TB adicional

**Impacto:** Rodar um nó completo fica mais caro (mais armazenamento necessário).

**Mitigação:**
- Pruning (poda de dados antigos)
- State expiry (expiração de estados não usados)
- Verkle trees (estrutura de dados mais eficiente)

### 2. Centralização de Validadores

**Problema:** Blocos maiores exigem hardware mais potente.

**Requisitos atuais para validar:**
- **CPU:** 4+ cores
- **RAM:** 16 GB
- **Armazenamento:** 2 TB SSD
- **Internet:** 10 Mbps

**Com gas limit 60M:**
- **RAM:** 20-24 GB (recomendado)
- **Armazenamento:** 2,5 TB SSD
- **Internet:** 15 Mbps

**Risco:** Validadores pequenos podem não conseguir acompanhar = centralização.

**Mitigação:** [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) Foundation está trabalhando em otimizações para manter requisitos acessíveis.

### 3. Possíveis Bugs

**Problema:** Mudanças na rede podem introduzir bugs.

**Histórico:**
- Shanghai upgrade (2023): Sem problemas
- Dencun upgrade (2024): Pequenos bugs, corrigidos rapidamente
- Gas limit 60M (2025): Monitoramento ativo

**Mitigação:** Testnet extensivo antes de mainnet, monitoramento 24/7.

## Comparação com Outras Blockchains

### Capacidade de Transações

| Blockchain | TPS (Transações/Segundo) | Gas Limit | Custo Médio |
|------------|--------------------------|-----------|-------------|
| **[ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) (antes)** | 15-20 | 50M | $3-$5 |
| **[ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) (agora)** | 18-24 | 60M | $1,50-$3 |
| **Solana** | 3.000-5.000 | N/A | $0,0001 |
| **BSC** | 50-100 | 140M | $0,10-$0,50 |
| **Polygon** | 50-100 | 30M | $0,01-$0,05 |
| **Arbitrum (L2)** | 4.000+ | N/A | $0,10-$0,50 |

**Conclusão:** [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) ainda é mais lento e caro que alternativas, mas o upgrade ajuda.

## O Que Vitalik Buterin Disse

Em post no X (Twitter), Vitalik comentou:

> "O aumento para 60M é um passo importante, mas não o último. Em 2026, com Fusaka, veremos melhorias mais significativas na eficiência e capacidade. O objetivo é escalar [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) sem comprometer descentralização."

**Pontos-chave:**
1. ✅ Mais aumentos virão (possivelmente 70-80M em 2026)
2. ✅ Foco em "ajustes inteligentes" (não apenas aumentar limite)
3. ✅ Prioridade: Manter descentralização
4. ✅ Layer 2s continuam sendo a solução de longo prazo

## Impacto no Preço do ETH

### Reação Imediata

**Preço do ETH:**
- **Antes do anúncio:** $3.650
- **Após o anúncio:** $3.720 (+1,9%)
- **Atual:** $3.680 (consolidando)

**Interpretação:** Mercado vê upgrade como positivo, mas não revolucionário.

### Impacto de Longo Prazo

**Fatores bullish:**
- ✅ Taxas menores = mais uso da rede
- ✅ Mais uso = mais ETH queimado (EIP-1559)
- ✅ Mais ETH queimado = oferta reduzida = preço sobe

**Cálculo:**

Se uso da rede aumentar 20% (proporcional ao gas limit):
- **ETH queimado/dia atual:** ~1.500 ETH
- **ETH queimado/dia projetado:** ~1.800 ETH (+20%)
- **Por ano:** +109.500 ETH queimado adicional

**Impacto no preço:** Modesto, mas positivo no longo prazo.

## O Que Isso Significa para Você

### Se Você Usa [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026)

**Benefícios:**
- ✅ Taxas 40-60% menores em períodos de alta demanda
- ✅ Transações mais rápidas (menos congestionamento)
- ✅ Melhor experiência em [defi](/artigo/defi-yield-farming-protocolos-seguros-2026) e NFTs

**Ação:** Continue usando [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) normalmente. Aproveite taxas menores.

### Se Você Investe em ETH

**Análise:**
- ✅ Upgrade é positivo para adoção
- ✅ Mais uso = mais valor para a rede
- ✅ Preparação para Fusaka 2026 (upgrade maior)

**Estratégia:**
- HODL se você acredita em [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) de longo prazo
- Considere acumular antes do Fusaka (Q2 2026)

### Se Você Desenvolve em [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026)

**Impacto:**
- ✅ Seus dApps ficam mais baratos de usar
- ✅ Mais usuários podem acessar (barreira de entrada menor)
- ✅ Menos migração para Layer 2s (por enquanto)

**Ação:** Otimize contratos para aproveitar gas limit maior.

## Próximos Passos: Fusaka 2026

### O Que Esperar

**Fusaka** (previsto para Q2 2026) trará:

1. **Verkle Trees:** Estrutura de dados mais eficiente (-30% tamanho da blockchain)
2. **EVM Improvements:** Execução mais rápida de contratos
3. **Gas Limit 70-80M:** Aumento adicional de capacidade
4. **Better L2 Integration:** Melhor suporte para rollups

**Impacto esperado:**
- Taxas 50-70% menores que hoje
- Capacidade 50-80% maior
- Blockchain 30% menor (mais fácil rodar nó)

### Cronograma

- **Q4 2025:** Testes em testnet (Sepolia, Goerli)
- **Q1 2026:** Auditoria de [segurança](/artigo/ciberseguranca-2026-proteger-criptomoedas-golpes)
- **Q2 2026:** Deploy na mainnet

## Perguntas Frequentes

### 1. Minhas taxas vão cair imediatamente?

**Sim, mas depende da demanda.** Em períodos de alta demanda, taxas podem cair 40-60%. Em períodos de baixa demanda, diferença será menor.

### 2. Preciso fazer algo?

**Não.** O upgrade é automático. Usuários e desenvolvedores não precisam fazer nada.

### 3. Meus ETH estão seguros?

**Sim.** O upgrade não afeta saldos ou [segurança](/artigo/ciberseguranca-2026-proteger-criptomoedas-golpes). É apenas uma mudança de parâmetro.

### 4. Layer 2s ainda são necessários?

**Sim.** Mesmo com gas limit 60M, [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) L1 ainda é mais caro que Layer 2s. L2s continuam sendo a solução de longo prazo para escalabilidade.

### 5. Quando vem o próximo aumento?

**Provavelmente em 2026** com o upgrade Fusaka. Vitalik indicou que aumentos continuarão, mas de forma gradual e inteligente.

### 6. Isso afeta [staking](/artigo/staking-ethereum-guia-renda-passiva-2026)?

**Não diretamente.** Validadores precisarão de um pouco mais de hardware (RAM, armazenamento), mas requisitos ainda são acessíveis.

### 7. ETH vai subir por causa disso?

**Modestamente.** Upgrade é positivo, mas não é game-changer. Impacto maior virá com Fusaka em 2026.

### 8. Posso rodar um nó com hardware normal?

**Sim, ainda é possível.** Requisitos aumentaram um pouco, mas um PC decente (16-24 GB RAM, 2,5 TB SSD) ainda funciona.

### 9. Isso resolve o problema de escalabilidade?

**Parcialmente.** Ajuda, mas não resolve completamente. [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) ainda precisa de Layer 2s para escalar para bilhões de usuários.

### 10. Vale a pena investir em ETH agora?

**Depende do seu horizonte.** Se você acredita em [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) de longo prazo (2-5 anos), sim. Se busca ganhos rápidos, talvez não seja o melhor momento.

## Conclusão: Passo na Direção Certa

O aumento do gas limit para 60 milhões é um **upgrade positivo e necessário** para [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026). Embora não seja revolucionário, representa:

- ✅ 20% mais capacidade
- ✅ 40-60% menos taxas em alta demanda
- ✅ Preparação para Fusaka 2026
- ✅ Compromisso com escalabilidade

**[ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026) está evoluindo gradualmente**, priorizando descentralização e [segurança](/artigo/ciberseguranca-2026-proteger-criptomoedas-golpes) sobre velocidade pura. Para investidores e usuários, isso é uma boa notícia.

**Próximo grande marco:** Fusaka em Q2 2026, que deve trazer melhorias ainda mais significativas.

<ExchangeAffiliateLinks variant="compact" />

**Disclaimer:** Este artigo é apenas informativo e não constitui recomendação de investimento. Sempre faça sua própria pesquisa (DYOR) antes de investir em criptomoedas.

---

**Quer investir em [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026)?** Confira as melhores exchanges para comprar ETH com [segurança](/artigo/ciberseguranca-2026-proteger-criptomoedas-golpes).

**Mais sobre [ethereum](/artigo/staking-ethereum-guia-renda-passiva-2026):** Leia nossos artigos sobre [staking de ETH](/categoria/ethereum) e [DeFi](/categoria/defi).

