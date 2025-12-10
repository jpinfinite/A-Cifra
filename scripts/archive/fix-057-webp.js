const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function fix057() {
  const inputPath = path.join('public/images', '057.webp')
  
  console.log('🔧 Corrigindo 057.webp...\n')
  
  // Converter para JPG primeiro
  const jpgPath = path.join('public/images', '057.jpg')
  await sharp(inputPath)
    .jpeg({ quality: 85, progressive: true })
    .toFile(jpgPath)
  
  console.log('✓ Convertido para 057.jpg')
  
  // Agora gerar as versões otimizadas
  const image = sharp(jpgPath)
  const metadata = await image.metadata()
  
  console.log(`📸 057.jpg: ${metadata.width}x${metadata.height}`)
  
  const sizes = [
    {w: 384, s: '-sm'},
    {w: 662, s: '-md'},
    {w: 1024, s: '-lg'},
    {w: 1920, s: '-xl'}
  ]
  
  for (const size of sizes) {
    if (metadata.width < size.w) continue
    
    await image.clone()
      .resize(size.w, null, {withoutEnlargement: true, fit: 'inside'})
      .webp({quality: 85})
      .toFile(path.join('public/images', `057${size.s}.webp`))
    
    await image.clone()
      .resize(size.w, null, {withoutEnlargement: true, fit: 'inside'})
      .avif({quality: 80})
      .toFile(path.join('public/images', `057${size.s}.avif`))
    
    console.log(`   ✓ ${size.w}px gerado`)
  }
  
  console.log('\n✅ 057.webp corrigido!')
}

fix057().catch(console.error)
