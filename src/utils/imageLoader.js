/**
 * Custom Image Loader para Cloudflare Pages
 * Garante que as imagens sejam carregadas corretamente
 */

export default function imageLoader({ src }) {
  // Se for uma URL absoluta, retorna como está
  if (src.startsWith('http')) {
    return src
  }

  // Para imagens locais, garante que começam com /
  const imageSrc = src.startsWith('/') ? src : `/${src}`
  
  // Em produção (Cloudflare Pages), usa o domínio correto
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://a-cifra.com.br'
    return `${baseUrl}${imageSrc}`
  }
  
  // Em desenvolvimento, usa o caminho relativo
  return imageSrc
}