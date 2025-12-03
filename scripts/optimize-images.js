constequire('sharp')
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '../public/images')
const MAX_WIDTH = 1200
const QUALITY = 80

async function optimizeImage(inputPath, filename) {
  try {
    const ext = path.extname(filename).toLowerCase()

    // Pular se já for WebP ou AVIF
    if (ext === '.webp' || ext === '.avif') {
      console.log(`⏭️  Pulando: ${filename} (já otimizado)`)
      return
    }

    // Verificar se é imagem
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return
    }

    const outputWebP = inputPath.replace(ext, '.webp')
    const stats = fs.statSync(inputPath)
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2)

    // Otimizar para WebP
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(outputWebP)

    const newStats = fs.statSync(outputWebP)
    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2)
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1)

    console.log(`✅ ${filename}`)
    console.log(`   ${sizeMB}MB → ${newSizeMB}MB (-${reduction}%)`)

  } catch (error) {
    console.error(`❌ Erro ao otimizar ${filename}:`, error.message)
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Processar subdiretórios recursivamente
      await processDirectory(fullPath)
    } else {
      await optimizeImage(fullPath, file)
    }
  }
}

async function main() {
  console.log('🖼️  Otimizando imagens...\n')
  console.log(`📁 Diretório: ${IMAGES_DIR}`)
  console.log(`📐 Largura máxima: ${MAX_WIDTH}px`)
  console.log(`🎨 Qualidade: ${QUALITY}%\n`)

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Diretório de imagens não encontrado!')
    process.exit(1)
  }

  await processDirectory(IMAGES_DIR)

  console.log('\n✨ Otimização concluída!')
}

main()
