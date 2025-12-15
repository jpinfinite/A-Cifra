export default function imageLoader({ src }: { src: string }) {
  // URLs externas continuam intactas
  if (src.startsWith('http')) {
    return src
  }

  // Sempre retornar caminho absoluto a partir da raiz
  return src.startsWith('/') ? src : `/${src}`
}
