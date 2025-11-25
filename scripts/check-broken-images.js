const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const articlesDir = path.join(process.cwd(), 'content', 'articles')
const imagesDir = path.join(process.cwd(), 'public', 'images')

function checkBrokenImages() {
  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md') && f !== '_template.md' && f !== 'README.md')
  
  const brokenImages = []
  
  files.forEach(file => {
    const filePath = path.join(articlesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    try {
      const { data } = matter(content)
      
      if (data.coverImage && data.coverImage.src) {
        const imagePath = data.coverImage.src.replace('/images/', '')
        const fullImagePath = path.join(imagesDir, imagePath)
        
        // Verificar se a imagem existe
        if (!fs.existsSync(fullImagePath)) {
          brokenImages.push({
            file,
            title: data.title || 'Sem título',
            slug: data.slug || 'sem-slug',
            imagePath: data.coverImage.src
          })
        }
      }
    } catch (error) {
      console.error(`Erro ao processar ${file}:`, error.message)
    }
  })
  
  console.log(`\n📊 Total de artigos: ${files.length}`)
  console.log(`❌ Artigos com imagens quebradas: ${brokenImages.length}\n`)
  
  if (brokenImages.length > 0) {
    console.log('Artigos com imagens que não existem:\n')
    brokenImages.forEach((article, index) => {
      console.log(`${index + 1}. ${article.file}`)
      console.log(`   Título: ${article.title}`)
      console.log(`   Imagem: ${article.imagePath}`)
      console.log(`   Slug: ${article.slug}\n`)
    })
  } else {
    console.log('✅ Todas as imagens dos artigos existem!')
  }
  
  return brokenImages
}

checkBrokenImages()
