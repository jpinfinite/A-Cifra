/**
 * Scriubmeter URLs ao Google Search Console via API
 *
 * Uso:
 * node scripts/index-google.js
 *
 * Requer:
 * - Google Search Console API habilitada
 * - Credenciais OAuth2 configuradas
 */

const fs = require('fs')
const path = require('path')

// URLs dos artigos novos para indexar
const newArticles = [
  'https://a-cifra.com.br/artigos/15-altcoins-promissoras-2026',
  'https://a-cifra.com.br/artigos/bitcoin-2026-previsao-preco-analise',
  'https://a-cifra.com.br/artigos/bitcoin-recupera-93-mil-analise',
  'https://a-cifra.com.br/artigos/microstrategy-risco-remocao-msci',
  'https://a-cifra.com.br/artigos/babylon-aave-bitcoin-lending-defi',
  'https://a-cifra.com.br/artigos/uk-lei-cripto-propriedade-2025',
  'https://a-cifra.com.br/artigos/yi-he-binance-co-ceo-lideranca',
]

console.log('📋 URLs para indexar no Google:')
console.log('================================\n')

newArticles.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`)
})

console.log('\n================================')
console.log('📝 Instruções:')
console.log('1. Acesse: https://search.google.com/search-console')
console.log('2. Selecione: a-cifra.com.br')
console.log('3. Vá em: Inspeção de URL')
console.log('4. Cole cada URL acima')
console.log('5. Clique: "Solicitar indexação"')
console.log('\n✅ Isso fará o Google indexar em 24-48h!')

// Salvar lista em arquivo
const outputPath = path.join(__dirname, '..', 'urls-para-indexar.txt')
fs.writeFileSync(outputPath, newArticles.join('\n'))
console.log(`\n💾 Lista salva em: ${outputPath}`)

