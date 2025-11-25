const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const articlesDir = path.join(process.cwd(), 'content', 'articles')

function checkArticles() {
  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.md') && f !== '_template.md' && f !== 'README.md')
  
  const missingImages = []
  
  files.forEach(file => {
    const filePath = path.join(articlesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    try {
      const { data } = matter(content)
      
      // Verificar se não tem coverImage ou se está vazio
      if (!data.coverImage || !data.coverImage.src || data.coverImage.src === '') {
        missingImages.push({
          file,
          title: data.title || 'Sem título',
          slug: data.slug || 'sem-slug'
        })
      }
    } catch (error) {
      console.error(`Erro ao processar ${file}:`, error.message)
    }
  })
  
  console.log(`\n📊 Total de artigos: ${files.length}`)
  console.log(`❌ Artigos sem imagem: ${missingImages.length}\n`)
  
  if (missingImages.length > 0) {
    console.log('Artigos sem imagem de capa:\n')
    missingImages.forEach((article, index) => {
      console.log(`${index + 1}. ${article.file}`)
      console.log(`   Título: ${article.title}`)
      console.log(`   Slug: ${article.slug}\n`)
    })
  }
  
  return missingImages
}

checkArticles()
