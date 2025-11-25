const fs = require('fs')
const path = require('path')

/**
 * Script para verificar se todas as imagens referenciadas nos artigos existem
 */

const articlesDir = path.join(process.cwd(), 'content/articles')
const imagesDir = path.join(process.cwd(), 'public/images')

function verificarImagens() {
  console.log('🔍 Verificando imagens dos artigos...\n')
  
  // Listar todos os arquivos de artigos
  const articleFiles = fs.readdirSync(articlesDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'))
  
  let imagensQuebradas = []
  let imagensOk = []
  
  articleFiles.forEach(file => {
    const filePath = path.join(articlesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Extrair frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!frontmatterMatch) {
      console.log(`⚠️  Frontmatter não encontrado em: ${file}`)
      return
    }
    
    const frontmatter = frontmatterMatch[1]
    
    // Procurar por coverImage src (mais flexível)
    const srcMatch = frontmatter.match(/src:\s*['"]([^'"]+)['"]/) || 
                     frontmatter.match(/coverImage:\s*['"]([^'"]+)['"]/)
    if (!srcMatch) {
      console.log(`⚠️  Imagem não encontrada no frontmatter de: ${file}`)
      return
    }
    
    const imagePath = srcMatch[1]
    const imageFile = imagePath.replace('/images/', '')
    const fullImagePath = path.join(imagesDir, imageFile)
    
    if (fs.existsSync(fullImagePath)) {
      imagensOk.push({
        artigo: file,
        imagem: imagePath,
        tamanho: fs.statSync(fullImagePath).size
      })
    } else {
      imagensQuebradas.push({
        artigo: file,
        imagem: imagePath,
        caminho: fullImagePath
      })
    }
  })
  
  // Relatório
  console.log(`✅ Imagens OK: ${imagensOk.length}`)
  console.log(`❌ Imagens quebradas: ${imagensQuebradas.length}\n`)
  
  if (imagensQuebradas.length > 0) {
    console.log('🚨 IMAGENS QUEBRADAS:')
    imagensQuebradas.forEach(item => {
      console.log(`   ${item.artigo} → ${item.imagem}`)
    })
    console.log('')
  }
  
  // Verificar imagem específica 221.jpg
  const imagem221 = path.join(imagesDir, '221.jpg')
  if (fs.existsSync(imagem221)) {
    const stats = fs.statSync(imagem221)
    console.log(`✅ Imagem 221.jpg encontrada:`)
    console.log(`   Tamanho: ${(stats.size / 1024).toFixed(2)} KB`)
    console.log(`   Modificada: ${stats.mtime}`)
  } else {
    console.log(`❌ Imagem 221.jpg NÃO encontrada!`)
  }
  
  return {
    ok: imagensOk.length,
    quebradas: imagensQuebradas.length,
    detalhes: imagensQuebradas
  }
}

// Executar verificação
if (require.main === module) {
  verificarImagens()
}

module.exports = { verificarImagens }