import fs from 'fs'
import path from 'path'

const slug = process.argv[2]

if (!slug) {
  console.error('Usage: ts-node scripts/post-generate.ts <slug>')
  process.exit(1)
}

const imagePath = path.join(process.cwd(), 'public/images/articles', `${slug}.webp`)

if (!fs.existsSync(imagePath)) {
  console.error(`❌ ERRO CRÍTICO: Imagem ausente para o artigo '${slug}'`)
  console.error(`Caminho esperado: ${imagePath}`)
  console.error(`O Agente DEVE gerar a imagem em public/images/articles/${slug}.webp antes de continuar.`)
  throw new Error(`Imagem ausente para ${slug}`)
}

console.log(`✅ Validação OK: Imagem confirmada em ${imagePath}`)
