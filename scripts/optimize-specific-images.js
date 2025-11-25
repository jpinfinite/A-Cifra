const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function optimizeImage(fileName) {
  const inputPath = path.join('public/images', fileName)
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
    
    await image.clone()
      .resize(size.w, null, {withoutEnlargement: true, fit: 'inside'})
      .webp({quality: 85})
      .toFile(path.join('public/images', `${baseName}${size.s}.webp`))
    
    await image.clone()
      .resize(size.w, null, {withoutEnlargement: true, fit: 'inside'})
      .avif({quality: 80})
      .toFile(path.join('public/images', `${baseName}${size.s}.avif`))
    
    console.log(`   ✓ ${size.w}px gerado`)
  }
  
  await image.jpeg({quality: 85, progressive: true}).toFile(inputPath + '.tmp')
  fs.renameSync(inputPath + '.tmp', inputPath)
  
  const newSize = fs.statSync(inputPath).size
  const saved = originalSize - newSize
  console.log(`   ✓ Original otimizado: ${(newSize / 1024).toFixed(2)} KB (economia: ${(saved / 1024).toFixed(2)} KB)`)
}

async function main() {
  console.log('🚀 Otimizando imagens 222.jpg e 223.jpg...\n')
  
  await optimizeImage('222.jpg')
  await optimizeImage('223.jpg')
  
  console.log('\n✅ Otimização concluída!')
}

main().catch(console.error)
