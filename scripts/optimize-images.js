/**
 * Script de Otimização de Imagens
 * Converte imagens para WebP/AVIF e redimensiona para múltiplos tamanhos
 */

const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')

// Configurações
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const QUALITY = {
  webp: 85,
  avif: 80,
  jpeg: 85
}

// Tamanhos responsivos para gerar
const SIZES = [
  { width: 384, suffix: '-sm' },
  { width: 662, suffix: '-md' },
  { width: 1024, suffix: '-lg' },
  { width: 1920, suffix: '-xl' }
]

// Estatísticas
const stats = {
  processed: 0,
  errors: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  files: []
}

/**
 * Otimiza uma imagem individual
 */
async function optimizeImage(filePath, fileName) {
  try {
    const fileStats = await fs.stat(filePath)
    const originalSize = fileStats.size
    stats.totalOriginalSize += originalSize

    console.log(`\n📸 Processando: ${fileName}`)
    console.log(`   Tamanho original: ${(originalSize / 1024).toFixed(2)} KB`)

    const image = sharp(filePath)
    const metadata = await image.metadata()
    
    const fileInfo = {
      name: fileName,
      originalSize,
      optimizedSizes: {},
      formats: []
    }

    // Gerar versões em diferentes tamanhos e formatos
    for (const size of SIZES) {
      // Pular se a imagem original for menor que o tamanho alvo
      if (metadata.width && metadata.width < size.width) continue

      const baseName = path.parse(fileName).name
      const outputDir = path.dirname(filePath)

      // WebP
      const webpPath = path.join(outputDir, `${baseName}${size.suffix}.webp`)
      await image
        .clone()
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath)
      
      const webpStats = await fs.stat(webpPath)
      fileInfo.optimizedSizes[`webp${size.suffix}`] = webpStats.size
      stats.totalOptimizedSize += webpStats.size

      // AVIF (melhor compressão)
      const avifPath = path.join(outputDir, `${baseName}${size.suffix}.avif`)
      await image
        .clone()
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .avif({ quality: QUALITY.avif })
        .toFile(avifPath)
      
      const avifStats = await fs.stat(avifPath)
      fileInfo.optimizedSizes[`avif${size.suffix}`] = avifStats.size
      stats.totalOptimizedSize += avifStats.size

      console.log(`   ✓ ${size.width}px: WebP ${(webpStats.size / 1024).toFixed(2)} KB | AVIF ${(avifStats.size / 1024).toFixed(2)} KB`)
    }

    // Otimizar o original também (JPEG/PNG)
    const ext = path.extname(fileName).toLowerCase()
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(filePath + '.tmp')
      
      await fs.rename(filePath + '.tmp', filePath)
      const newStats = await fs.stat(filePath)
      console.log(`   ✓ Original otimizado: ${(newStats.size / 1024).toFixed(2)} KB (economia: ${((originalSize - newStats.size) / 1024).toFixed(2)} KB)`)
    }

    stats.processed++
    stats.files.push(fileInfo)
    
  } catch (error) {
    console.error(`   ❌ Erro ao processar ${fileName}:`, error.message)
    stats.errors++
  }
}

/**
 * Processa todas as imagens no diretório
 */
async function processDirectory(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Processar subdiretórios recursivamente
        await processDirectory(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        
        // Processar apenas imagens e pular versões já otimizadas
        if (['.jpg', '.jpeg', '.png'].includes(ext) && 
            !entry.name.includes('-sm.') && 
            !entry.name.includes('-md.') && 
            !entry.name.includes('-lg.') && 
            !entry.name.includes('-xl.')) {
          await optimizeImage(fullPath, entry.name)
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao processar diretório ${dir}:`, error.message)
  }
}

/**
 * Gera relatório de otimização
 */
function generateReport() {
  console.log('\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO DE OTIMIZAÇÃO DE IMAGENS')
  console.log('='.repeat(60))
  console.log(`\n✅ Imagens processadas: ${stats.processed}`)
  console.log(`❌ Erros: ${stats.errors}`)
  console.log(`\n📦 Tamanho original total: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`📦 Tamanho otimizado total: ${(stats.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`)
  
  const savings = stats.totalOriginalSize - stats.totalOptimizedSize
  const savingsPercent = (savings / stats.totalOriginalSize * 100).toFixed(2)
  
  console.log(`\n💰 Economia total: ${(savings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`)
  console.log('\n' + '='.repeat(60))

  // Salvar relatório detalhado
  const reportPath = path.join(process.cwd(), 'optimization-report.json')
  fs.writeFile(reportPath, JSON.stringify(stats, null, 2))
    .then(() => console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`))
    .catch(err => console.error('Erro ao salvar relatório:', err))
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando otimização de imagens...\n')
  console.log(`📁 Diretório: ${IMAGES_DIR}\n`)

  const startTime = Date.now()

  await processDirectory(IMAGES_DIR)

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  generateReport()
  console.log(`\n⏱️  Tempo total: ${duration}s\n`)
}

// Executar
main().catch(console.error)
