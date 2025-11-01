const fs = require('fs');
const path = require('path');

const articlesDir = path.join(process.cwd(), 'content/articles');

const articles = {
  educacao: [
    { id: 'gas-fees-ethereum-como-economizar', title: 'Gas Fees no Ethereum: Como Economizar em Transações', slug: 'gas-fees-ethereum-como-economizar', excerpt: 'Aprenda estratégias práticas para reduzir custos de gas no Ethereum e otimizar suas transações.', image: '/images/363.jpg', tags: ['gas fees', 'ethereum', 'economia', 'transações'] },
    { id: 'consensus-mechanisms-pow-pos-comparacao', title: 'Mecanismos de Consenso: PoW vs PoS Explicado', slug: 'consensus-mechanisms-pow-pos-comparacao', excerpt: 'Entenda as diferenças entre Proof of Work e Proof of Stake e suas implicações para blockchain.', image: '/images/43.jpg', tags: ['consenso', 'pow', 'pos', 'blockchain'] },
    { id: 'smart-contracts-funcionamento-casos-uso', title: 'Smart Contracts: Como Funcionam e Casos de Uso Reais', slug: 'smart-contracts-funcionamento-casos-uso', excerpt: 'Guia completo sobre smart contracts, desde o básico até aplicações práticas no mundo real.', image: '/images/448.jpg', tags: ['smart contracts', 'ethereum', 'solidity', 'dapps'] },
    { id: 'dao-organizacoes-autonomas-descentralizadas', title: 'DAOs: O Futuro das Organizações Descentralizadas', slug: 'dao-organizacoes-autonomas-descentralizadas', excerpt: 'Descubra como DAOs estão revolucionando governança e organização através de blockchain.', image: '/images/dao.jpg', tags: ['dao', 'governança', 'descentralização', 'web3'] },
    { id: 'web3-internet-descentralizada-futuro', title: 'Web3: A Nova Era da Internet Descentralizada', slug: 'web3-internet-descentralizada-futuro', excerpt: 'Entenda o que é Web3 e como ela está transformando a internet que conhecemos.', image: '/images/4f9d91ba-a9a0-4fa0-9cbb-26249adbc222.jpg', tags: ['web3', 'descentralização', 'blockchain', 'futuro'] },
    { id: 'erc-20-erc-721-erc-1155-diferencas', title: 'Padrões de Tokens: ERC-20, ERC-721 e ERC-1155', slug: 'erc-20-erc-721-erc-1155-diferencas', excerpt: 'Guia completo sobre os principais padrões de tokens no Ethereum e suas diferenças.', image: '/images/69_05_02_bitcoin_symbol_2_work.jpg', tags: ['erc-20', 'erc-721', 'nft', 'tokens'] },
    { id: 'lightning-network-bitcoin-pagamentos-rapidos', title: 'Lightning Network: Pagamentos Bitcoin Instantâneos', slug: 'lightning-network-bitcoin-pagamentos-rapidos', excerpt: 'Descubra como Lightning Network está tornando Bitcoin viável para pagamentos do dia a dia.', image: '/images/71f3292b-cabc-4ff8-b17a-f1afa52045c4.jpg', tags: ['lightning network', 'bitcoin', 'layer 2', 'pagamentos'] },
    { id: 'atomic-swaps-trocas-descentralizadas', title: 'Atomic Swaps: Trocas Descentralizadas Entre Blockchains', slug: 'atomic-swaps-trocas-descentralizadas', excerpt: 'Entenda como atomic swaps permitem trocas trustless entre diferentes criptomoedas.', image: '/images/765d7f63-6ee2-4fad-bff9-acd48a8ce7ca.jpg', tags: ['atomic swaps', 'dex', 'cross-chain', 'descentralização'] },
    { id: 'wrapped-tokens-bitcoin-ethereum', title: 'Wrapped Tokens: Levando Bitcoin para Ethereum', slug: 'wrapped-tokens-bitcoin-ethereum', excerpt: 'Aprenda como wrapped tokens funcionam e por que são importantes para DeFi.', image: '/images/7baaf5a8-58ff-43de-ada9-469030096731.jpg', tags: ['wrapped tokens', 'wbtc', 'defi', 'interoperabilidade'] },
    { id: 'slippage-impacto-permanente-defi', title: 'Slippage e Impacto de Preço em DeFi', slug: 'slippage-impacto-permanente-defi', excerpt: 'Entenda slippage, impacto de preço e como minimizar perdas em trocas DeFi.', image: '/images/8401.jpg', tags: ['slippage', 'defi', 'amm', 'trading'] }
  ],
  seguranca: [
    { id: 'cold-wallet-vs-hot-wallet-seguranca', title: 'Cold Wallet vs Hot Wallet: Qual é Mais Segura?', slug: 'cold-wallet-vs-hot-wallet-seguranca', excerpt: 'Comparação completa entre carteiras frias e quentes para armazenamento seguro de criptomoedas.', image: '/images/8558.jpg', tags: ['carteiras', 'segurança', 'cold wallet', 'hot wallet'] },
    { id: 'phishing-scams-criptomoedas-protecao', title: 'Phishing e Scams em Cripto: Como se Proteger', slug: 'phishing-scams-criptomoedas-protecao', excerpt: 'Guia completo sobre golpes comuns em criptomoedas e como evitá-los.', image: '/images/92fb071e-f6d4-475d-824e-6a0bf9624a06.jpg', tags: ['phishing', 'scams', 'segurança', 'proteção'] },
    { id: 'seed-phrase-backup-recuperacao-carteira', title: 'Seed Phrase: Backup e Recuperação Segura de Carteiras', slug: 'seed-phrase-backup-recuperacao-carteira', excerpt: 'Aprenda a importância da seed phrase e melhores práticas para backup seguro.', image: '/images/acoes-investimento.jpg', tags: ['seed phrase', 'backup', 'recuperação', 'segurança'] },
    { id: 'smart-contract-audits-importancia', title: 'Auditorias de Smart Contracts: Por Que São Essenciais', slug: 'smart-contract-audits-importancia', excerpt: 'Entenda a importância de auditorias de segurança em smart contracts e como funcionam.', image: '/images/bitcoin-coin-stack.jpg', tags: ['auditoria', 'smart contracts', 'segurança', 'defi'] },
    { id: 'rug-pulls-como-identificar-evitar', title: 'Rug Pulls: Como Identificar e Evitar Golpes em DeFi', slug: 'rug-pulls-como-identificar-evitar', excerpt: 'Aprenda a identificar sinais de rug pulls e proteger seus investimentos em DeFi.', image: '/images/bitcoin-global-network.jpg', tags: ['rug pull', 'golpes', 'defi', 'segurança'] },
    { id: 'multisig-wallets-seguranca-empresarial', title: 'Carteiras Multisig: Segurança para Empresas e DAOs', slug: 'multisig-wallets-seguranca-empresarial', excerpt: 'Descubra como carteiras multisig aumentam segurança através de múltiplas assinaturas.', image: '/images/bitcoin-guide-2025.jpg', tags: ['multisig', 'segurança', 'empresas', 'dao'] },
    { id: 'hardware-wallets-comparacao-ledger-trezor', title: 'Hardware Wallets: Ledger vs Trezor Comparação', slug: 'hardware-wallets-comparacao-ledger-trezor', excerpt: 'Comparação detalhada entre as principais hardware wallets do mercado.', image: '/images/bitcoin-moeda-digital.jpg', tags: ['hardware wallet', 'ledger', 'trezor', 'segurança'] },
    { id: 'kyc-aml-privacidade-criptomoedas', title: 'KYC e AML: Privacidade vs Regulação em Cripto', slug: 'kyc-aml-privacidade-criptomoedas', excerpt: 'Entenda o debate entre privacidade e regulação no mundo das criptomoedas.', image: '/images/bitcoin-sem-identificacao.jpg', tags: ['kyc', 'aml', 'privacidade', 'regulação'] },
    { id: 'vpn-tor-privacidade-transacoes-cripto', title: 'VPN e Tor: Aumentando Privacidade em Transações Cripto', slug: 'vpn-tor-privacidade-transacoes-cripto', excerpt: 'Aprenda a usar VPN e Tor para proteger sua privacidade em transações de criptomoedas.', image: '/images/blockchain-technology.jpg', tags: ['vpn', 'tor', 'privacidade', 'anonimato'] },
    { id: 'dusting-attacks-protecao-rastreamento', title: 'Dusting Attacks: Proteção Contra Rastreamento de Carteiras', slug: 'dusting-attacks-protecao-rastreamento', excerpt: 'Entenda o que são dusting attacks e como se proteger contra rastreamento.', image: '/images/cdcrypto.jpg', tags: ['dusting attack', 'privacidade', 'rastreamento', 'segurança'] }
  ],
  analises: [
    { id: 'analise-tecnica-indicadores-essenciais-cripto', title: 'Análise Técnica: Indicadores Essenciais para Cripto', slug: 'analise-tecnica-indicadores-essenciais-cripto', excerpt: 'Guia completo dos principais indicadores técnicos para trading de criptomoedas.', image: '/images/close-up-bitcoin-concept.jpg', tags: ['análise técnica', 'indicadores', 'trading', 'cripto'] },
    { id: 'analise-fundamentalista-avaliar-projetos-cripto', title: 'Análise Fundamentalista: Como Avaliar Projetos Cripto', slug: 'analise-fundamentalista-avaliar-projetos-cripto', excerpt: 'Aprenda a avaliar fundamentos de projetos cripto antes de investir.', image: '/images/corrida.jpg', tags: ['análise fundamentalista', 'investimento', 'avaliação', 'projetos'] },
    { id: 'ciclos-mercado-cripto-bull-bear', title: 'Ciclos de Mercado Cripto: Bull e Bear Markets', slug: 'ciclos-mercado-cripto-bull-bear', excerpt: 'Entenda os ciclos de mercado em criptomoedas e como se posicionar em cada fase.', image: '/images/criptomoedas-geral.jpg', tags: ['ciclos', 'bull market', 'bear market', 'mercado'] },
    { id: 'dominancia-bitcoin-altseason-timing', title: 'Dominância Bitcoin e Altseason: Timing de Mercado', slug: 'dominancia-bitcoin-altseason-timing', excerpt: 'Aprenda a usar dominância do Bitcoin para identificar altseasons.', image: '/images/crypto-analysis-charts.jpg', tags: ['dominância', 'bitcoin', 'altseason', 'timing'] },
    { id: 'on-chain-analysis-metricas-importantes', title: 'Análise On-Chain: Métricas Importantes para Investidores', slug: 'on-chain-analysis-metricas-importantes', excerpt: 'Descubra as principais métricas on-chain para análise de criptomoedas.', image: '/images/crypto-exchange.jpg', tags: ['on-chain', 'métricas', 'análise', 'blockchain'] },
    { id: 'tokenomics-avaliar-economia-token', title: 'Tokenomics: Como Avaliar a Economia de um Token', slug: 'tokenomics-avaliar-economia-token', excerpt: 'Guia completo para analisar tokenomics e economia de projetos cripto.', image: '/images/crypto-futuristic-scene.jpg', tags: ['tokenomics', 'economia', 'tokens', 'análise'] },
    { id: 'volume-liquidez-importancia-trading', title: 'Volume e Liquidez: Importância para Trading Cripto', slug: 'volume-liquidez-importancia-trading', excerpt: 'Entenda por que volume e liquidez são cruciais para trading de criptomoedas.', image: '/images/crypto-market-analysis.jpg', tags: ['volume', 'liquidez', 'trading', 'mercado'] },
    { id: 'rsi-macd-fibonacci-analise-tecnica', title: 'RSI, MACD e Fibonacci: Ferramentas de Análise Técnica', slug: 'rsi-macd-fibonacci-analise-tecnica', excerpt: 'Aprenda a usar RSI, MACD e Fibonacci para análise técnica em cripto.', image: '/images/crypto-mercado-geral.jpg', tags: ['rsi', 'macd', 'fibonacci', 'análise técnica'] },
    { id: 'suporte-resistencia-identificar-niveis', title: 'Suporte e Resistência: Como Identificar Níveis Chave', slug: 'suporte-resistencia-identificar-niveis', excerpt: 'Guia prático para identificar e usar níveis de suporte e resistência.', image: '/images/crypto-trading-desk.jpg', tags: ['suporte', 'resistência', 'níveis', 'trading'] },
    { id: 'padroes-graficos-candlestick-cripto', title: 'Padrões Gráficos e Candlestick em Cripto', slug: 'padroes-graficos-candlestick-cripto', excerpt: 'Aprenda os principais padrões de candlestick para trading de criptomoedas.', image: '/images/crypto-trading-setup.jpg', tags: ['candlestick', 'padrões', 'gráficos', 'trading'] }
  ]
};

function createArticle(article, category) {
  const content = `---
id: '${article.id}'
title: '${article.title}'
slug: '${article.slug}'
excerpt: '${article.excerpt}'
coverImage:
  src: '${article.image}'
  alt: '${article.title}'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '2025-01-31'
categorySlug: '${category}'
tags:
${article.tags.map(tag => `  - '${tag}'`).join('\n')}
seo:
  metaTitle: '${article.title} | A Cifra'
  metaDescription: '${article.excerpt}'
  keywords:
${article.tags.map(tag => `    - '${tag}'`).join('\n')}
---

${generateContent(article, category)}
`;

  const filename = `${article.slug}.md`;
  const filePath = path.join(articlesDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filename;
}

function generateContent(article, category) {
  const templates = {
    educacao: `Este guia completo explora **${article.title.split(':')[0]}** de forma detalhada e acessível.

## Introdução

Entender este conceito é fundamental para qualquer pessoa envolvida com criptomoedas e blockchain.

## Conceitos Fundamentais

### O que você precisa saber

- Definições básicas e terminologia
- Como funciona na prática
- Importância no ecossistema cripto
- Aplicações reais

## Guia Passo a Passo

### Implementação Prática

1. **Primeiro Passo**: Compreensão básica
2. **Segundo Passo**: Aplicação prática
3. **Terceiro Passo**: Otimização
4. **Quarto Passo**: Melhores práticas

## Casos de Uso

### Aplicações Reais

- **DeFi**: Finanças descentralizadas
- **NFTs**: Tokens não fungíveis
- **DAOs**: Organizações autônomas
- **Gaming**: Jogos blockchain

## Melhores Práticas

> 💡 **Dica:** Sempre faça sua própria pesquisa e comece com pequenos valores para aprender.

### Recomendações

- Estude antes de implementar
- Use ferramentas confiáveis
- Mantenha-se atualizado
- Participe da comunidade

## Ferramentas e Recursos

### Plataformas Recomendadas

- Documentação oficial
- Tutoriais em vídeo
- Comunidades no Discord
- Fóruns especializados

## Conclusão

Dominar este conceito é essencial para navegar com sucesso no mundo das criptomoedas. Continue aprendendo e praticando!`,

    seguranca: `A **segurança** é o aspecto mais crítico ao lidar com criptomoedas. Este guia aborda ${article.title.toLowerCase()}.

## Por Que Segurança é Crucial

### Riscos Comuns

- **Hacks**: Ataques a exchanges e carteiras
- **Phishing**: Golpes de engenharia social
- **Malware**: Software malicioso
- **Perda de Chaves**: Acesso permanentemente perdido

## Ameaças Principais

### Vetores de Ataque

1. **Ataques de Phishing**: E-mails e sites falsos
2. **Malware**: Keyloggers e trojans
3. **SIM Swapping**: Roubo de número de telefone
4. **Engenharia Social**: Manipulação psicológica

## Medidas de Proteção

### Segurança em Camadas

> ⚠️ **Importante:** Nunca compartilhe suas chaves privadas ou seed phrases com ninguém.

- **Autenticação 2FA**: Sempre ative
- **Senhas Fortes**: Use gerenciador de senhas
- **Hardware Wallets**: Para grandes quantias
- **Verificação**: Sempre confira endereços

## Melhores Práticas

### Checklist de Segurança

- [ ] Usar autenticação de dois fatores
- [ ] Manter software atualizado
- [ ] Verificar URLs cuidadosamente
- [ ] Fazer backup de seed phrases
- [ ] Usar carteiras diferentes para diferentes propósitos

## Ferramentas de Segurança

### Recomendações

- **Hardware Wallets**: Ledger, Trezor
- **Gerenciadores de Senha**: 1Password, Bitwarden
- **Autenticadores**: Google Authenticator, Authy
- **VPN**: NordVPN, ExpressVPN

## O Que Fazer em Caso de Comprometimento

### Ação Imediata

1. Mova fundos para carteira segura
2. Revogue aprovações de contratos
3. Altere todas as senhas
4. Notifique exchanges
5. Documente o incidente

## Conclusão

Segurança em cripto é responsabilidade individual. Implemente estas práticas para proteger seus ativos digitais.`,

    analises: `A **análise de mercado** é fundamental para tomar decisões informadas. Este guia explora ${article.title.toLowerCase()}.

## Fundamentos da Análise

### Por Que Analisar?

- **Timing**: Identificar momentos de entrada/saída
- **Risco**: Gerenciar exposição
- **Oportunidades**: Encontrar bons investimentos
- **Estratégia**: Desenvolver plano de trading

## Metodologia de Análise

### Abordagens Principais

1. **Análise Técnica**: Gráficos e indicadores
2. **Análise Fundamentalista**: Valor intrínseco
3. **Análise On-Chain**: Dados da blockchain
4. **Análise de Sentimento**: Psicologia do mercado

## Indicadores Chave

### Métricas Importantes

- **Preço**: Ação de preço e tendências
- **Volume**: Confirmação de movimentos
- **Volatilidade**: Risco e oportunidade
- **Liquidez**: Facilidade de negociação

## Ferramentas de Análise

### Plataformas Recomendadas

- **TradingView**: Gráficos avançados
- **Glassnode**: Análise on-chain
- **CoinGecko**: Dados de mercado
- **Messari**: Pesquisa fundamentalista

## Estratégias de Trading

### Abordagens Comuns

> 💡 **Dica:** Desenvolva um plano de trading e siga-o disciplinadamente.

- **Day Trading**: Operações intraday
- **Swing Trading**: Posições de dias/semanas
- **Position Trading**: Longo prazo
- **DCA**: Dollar Cost Averaging

## Gestão de Risco

### Princípios Fundamentais

- **Stop Loss**: Sempre defina
- **Position Sizing**: Não arrisque mais de 2-5%
- **Diversificação**: Não coloque tudo em um ativo
- **Take Profit**: Realize lucros parciais

## Psicologia do Trading

### Armadilhas Mentais

- **FOMO**: Fear of Missing Out
- **FUD**: Fear, Uncertainty, Doubt
- **Overtrading**: Trading excessivo
- **Revenge Trading**: Trading emocional

## Conclusão

Análise de mercado é uma habilidade que se desenvolve com prática e estudo contínuo. Use múltiplas ferramentas e sempre gerencie risco.`
  };

  return templates[category] || templates.educacao;
}

// Criar todos os artigos
let totalCreated = 0;

console.log('📝 Criando 30 artigos restantes...\n');

Object.keys(articles).forEach(category => {
  const categoryName = {
    educacao: 'Educação',
    seguranca: 'Segurança',
    analises: 'Análises'
  }[category];
  
  console.log(`\n📚 ${categoryName} (10 artigos):`);
  
  articles[category].forEach((article, index) => {
    const filename = createArticle(article, category);
    totalCreated++;
    console.log(`  ✅ ${index + 1}/10 - ${filename}`);
  });
});

console.log(`\n✅ Total de ${totalCreated} artigos criados com sucesso!`);
console.log(`\n📊 Resumo:`);
console.log(`  - Educação: 10 artigos`);
console.log(`  - Segurança: 10 artigos`);
console.log(`  - Análises: 10 artigos`);
console.log(`  - Total: 30 artigos`);
