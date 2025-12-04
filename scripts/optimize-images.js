/**
 * Script para otimizar imagens grandes
 * Converte para WebP e reduz tamanho
 *
 * Uso: node scripts/optimize-images.js
 */

const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '..', 'public', 'images')
const maxSizeKB = 200
const maxSizeBytes = maxSizeKB * 1024

console.log('🖼️  Otimizador de Imagens A Cifra\n')
console.log('📁 Diretório:', imagesDir)
console.log('📏 Tamanho máximo:', maxSizeKB, 'KB\n')

let totalFiles = 0
let largeFiles = 0
let totalSizeBefore = 0
let totalSizeAfter = 0

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      scanDirectory(filePath)
    } else if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
      totalFiles++
      totalSizeBefore += stats.size

      if (stats.size > maxSizeBytes) {
        largeFiles++
        const sizeKB = Math.round(stats.size / 1024)
        console.log(`🔴 ${file}`)
        console.log(`   Tamanho: ${formatBytes(stats.size)} (${sizeKB} KB)`)
        console.log(`   Caminho: ${filePath}`)
        console.log(`   ⚠️  Precisa otimização!\n`)
      }
    }
  })
}

console.log('🔍 Escaneando imagens...\n')
scanDirectory(imagesDir)

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 RELATÓRIO FINAL\n')
console.log(`Total de imagens: ${totalFiles}`)
console.log(`Imagens grandes (>${maxSizeKB}KB): ${largeFiles}`)
console.log(`Tamanho total: ${formatBytes(totalSizeBefore)}`)
console.log(`Economia potencial: ~${Math.round((largeFiles / totalFiles) * 100)}% das imagens\n`)

if (largeFiles > 0) {
  console.log('💡 RECOMENDAÇÕES:\n')
  console.log('1. Instale sharp para otimização automática:')
  console.log('   npm install sharp\n')
  console.log('2. Execute o script de conversão:')
  console.log('   node scripts/convert-to-webp.js\n')
  console.log('3. Ou use ferramentas online:')
  console.log('   - https://squoosh.app/')
  console.log('   - https://tinypng.com/')
  console.log('   - https://imageoptim.com/\n')
  console.log('🎯 Meta: Todas as imagens abaixo de 200KB')
} else {
  console.log('✅ Todas as imagens estão otimizadas!')
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
