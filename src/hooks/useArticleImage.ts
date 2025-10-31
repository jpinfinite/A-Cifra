import { useMemo } from 'react'
import { findBestImage } from '@/utils/imageMapper'

interface UseArticleImageOptions {
  category: string
  tags?: string[]
  title?: string
  excludeImages?: string[]
  fallbackImage?: string
}

interface ArticleImageResult {
  src: string
  alt: string
  width: number
  height: number
}

/**
 * Hook para obter a melhor imagem para um artigo
 * Usa o sistema de mapeamento inteligente
 */
export function useArticleImage(options: UseArticleImageOptions): ArticleImageResult {
  const {
    category,
    tags = [],
    title = '',
    excludeImages = [],
    fallbackImage = '/images/cryptocurrency-7214367_1280.jpg'
  } = options

  const image = useMemo(() => {
    // Extrair palavras-chave do título
    const titleKeywords = title
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3) // Filtrar palavras pequenas

    // Combinar tags e palavras-chave do título
    const allKeywords = [...tags, ...titleKeywords]

    // Buscar melhor imagem
    const bestImage = findBestImage(category, allKeywords, excludeImages)

    if (bestImage) {
      return {
        src: bestImage.src,
        alt: bestImage.alt,
        width: 1200,
        height: 630
      }
    }

    // Fallback
    return {
      src: fallbackImage,
      alt: `${title} - A Cifra`,
      width: 1200,
      height: 630
    }
  }, [category, tags, title, excludeImages, fallbackImage])

  return image
}

/**
 * Hook para obter múltiplas imagens para uma lista de artigos
 * Garante que não haja repetições
 */
export function useArticleImages(
  articles: Array<{
    category: string
    tags?: string[]
    title?: string
  }>
): Map<number, ArticleImageResult> {
  return useMemo(() => {
    const imageMap = new Map<number, ArticleImageResult>()
    const usedImages = new Set<string>()

    articles.forEach((article, index) => {
      const keywords = [
        ...(article.tags || []),
        ...(article.title?.toLowerCase().split(' ') || [])
      ]

      const image = findBestImage(
        article.category,
        keywords,
        Array.from(usedImages)
      )

      if (image) {
        imageMap.set(index, {
          src: image.src,
          alt: image.alt,
          width: 1200,
          height: 630
        })
        usedImages.add(image.src)
      }
    })

    return imageMap
  }, [articles])
}
