const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Lista de imagens que precisam ser otimizadas
const imagesToOptimize = [
  '032.jpg', '050.jpg', '053.jpg', '057.jpg',
  '077.jpg', '092.jpg', '094.jpg', '143.jpg',
  '162.jpg', '188.jpg', '219.jpg', '220.jpg', '221.jpg'
]

async function optimizeImage(fileName) {
  const inputPath = path.join('public/images', fileName)
  
  // Verificar se a imagem existe
  if (!fs.existsSync(inputPath)) {
    console.log(`❌ ${fileName} não encontrada, pulando...`)
    return
  }
  
  const image = sharp(inputPath)
  const metadata = await image.metadata()
  
  const originalSize = fs.statSync(inputPath).size
  console.log(`\n📸 ${fileName}: ${metadata.width}x${metadata.height} - ${(originalSize / 1024).toFixed(2)} KB`)
  
  const sizes = [
    {w: 384, s: '-sm'},
    {w: 662, s: '-md'},
    {w: 1024, s: '-lg'},
    {w: 1920, s: '-xl'}
  ]
  
  const baseName = path.parse(fileName).name
  
  for (const size of sizes) {
    if (metadata.width < size.w) continue
    
    const webpPath = path.join('public/images', `${baseName}${size.s}.webp`)
    const avifPath = path.join('public/images', `${baseName}${size.s}.avif`)
    
    // Verificar se já existe
    if (fs.existsSync(webpPath) && fs.existsSync(avifPath)) {
      console.log(`   ⏭️  ${size.w}px já existe, pulando...`)
      continue
    }
    
    await image.clone()
      .resize(size.w, null, {withoutEnlargement: true, fit: 'inside'})
      .webp({quality: 85})
      .toFile(webpPath)
    
    await image.clone()
      .resize(size.w, null, {withoutEnlargement: true, fit: 'inside'})
      .avif({quality: 80})
      .toFile(avifPath)
    
    console.log(`   ✓ ${size.w}px gerado`)
  }
  
  // Otimizar o original se for JPEG
  const ext = path.extname(fileName).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') {
    await image.jpeg({quality: 85, progressive: true}).toFile(inputPath + '.tmp')
    fs.renameSync(inputPath + '.tmp', inputPath)
    
    const newSize = fs.statSync(inputPath).size
    const saved = originalSize - newSize
    console.log(`   ✓ Original otimizado: ${(newSize / 1024).toFixed(2)} KB (economia: ${(saved / 1024).toFixed(2)} KB)`)
  }
}

async function main() {
  console.log('🚀 Otimizando imagens faltantes...\n')
  
  let processed = 0
  let skipped = 0
  
  for (const image of imagesToOptimize) {
    try {
      await optimizeImage(image)
      processed++
    } catch (error) {
      console.error(`❌ Erro ao processar ${image}:`, error.message)
      skipped++
    }
  }
  
  console.log(`\n✅ Concluído!`)
  console.log(`   Processadas: ${processed}`)
  console.log(`   Puladas: ${skipped}`)
}

main().catch(console.error)
