/**
 * Script para converter imagens grandes para WebP
 * Requer: npm install sharp
 *
 * Uso: node scripts/convert-to-webp.js
 */

const fs = require('fs')
const path = require('path')

// Verifica se sharp está instalado
let sharp
try {
  sharp = require('sharp')
} catch (e) {
  console.log('❌ Sharp não está instalado!')
  console.log('📦 Instale com: npm install sharp')
  process.exit(1)
}

const imagesDir = path.join(__dirname, '..', 'public', 'images')
const maxSizeKB = 200
const maxSizeBytes = maxSizeKB * 1024

console.log('🔄 Conversor de Imagens para WebP\n')
console.log('📁 Diretório:', imagesDir)
console.log('📏 Tamanho máximo:', maxSizeKB, 'KB\n')

let converted = 0
let skipped = 0
let errors = 0

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function convertImage(filePath) {
  const stats = fs.statSync(filePath)
  const fileName = path.basename(filePath)
  const fileNameWithoutExt = path.parse(fileName).name
  const outputPath = path.join(path.dirname(filePath), `${fileNameWithoutExt}.webp`)

  // Pula se já existe versão WebP
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Pulando ${fileName} (WebP já existe)`)
    skipped++
    return
  }

  try {
    console.log(`🔄 Convertendo ${fileName}...`)
    console.log(`   Tamanho original: ${formatBytes(stats.size)}`)

    // Converte para WebP com qualidade 80
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath)

    const newStats = fs.statSync(outputPath)
    const reduction = Math.round((1 - newStats.size / stats.size) * 100)

    console.log(`   ✅ Convertido: ${formatBytes(newStats.size)} (${reduction}% menor)`)
    console.log(`   📁 Salvo em: ${outputPath}\n`)

    converted++
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}\n`)
    errors++
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      await processDirectory(filePath)
    } else if (file.match(/\.(jpg|jpeg|png)$/i) && stats.size > maxSizeBytes) {
      await convertImage(filePath)
    }
  }
}

async function main() {
  console.log('🔍 Procurando imagens grandes...\n')
  await processDirectory(imagesDir)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 RELATÓRIO FINAL\n')
  console.log(`✅ Convertidas: ${converted}`)
  console.log(`⏭️  Puladas: ${skipped}`)
  console.log(`❌ Erros: ${errors}\n`)

  if (converted > 0) {
    console.log('🎉 Conversão completa!')
    console.log('📝 Próximo passo: Atualizar referências nos artigos de .jpg/.png para .webp')
  } else {
    console.log('ℹ️  Nenhuma imagem precisou ser convertida')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(console.error)
