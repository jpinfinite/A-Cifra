/**
 * Custom Image Loader para Cloudflare Pages
 * Em static export ('output: export'), não devemos injetar domínio absoluto
 * Cloudflare resolve caminhos relativos à raiz automaticamente
 */

export default function imageLoader({ src }) {
  // URLs externas continuam intactas
  if (src.startsWith('http')) {
    return src
  }

  // Sempre retornar caminho absoluto a partir da raiz
  // Ex: '/images/photo.jpg' é resolvido corretamente pelo browser/host
  return src.startsWith('/') ? src : `/${src}`
}
