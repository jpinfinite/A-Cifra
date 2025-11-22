/**
 * Utilitários de validação para evitar erros comuns
 */

/**
 * Valida se uma categoria existe e retorna o slug correto ou fallback
 */
export function validateCategorySlug(slug: string | undefined | null): string {
  if (!slug || slug === 'undefined' || slug.trim() === '') {
    return 'bitcoin' // categoria padrão como fallback
  }
  return slug
}

/**
 * Gera URL de categoria com validação
 */
export function getCategoryUrl(slug: string | undefined | null): string {
  const validSlug = validateCategorySlug(slug)
  return `/categoria/${validSlug}`
}

/**
 * Valida se um artigo tem categoria válida
 */
export function hasValidCategory(article: { category?: string | null }): boolean {
  return Boolean(article.category && article.category !== 'undefined' && article.category.trim() !== '')
}

/**
 * Sanitiza slug removendo caracteres inválidos
 */
export function sanitizeSlug(slug: string | undefined | null): string {
  if (!slug) return ''
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Valida URL antes de navegar
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false
  
  try {
    // Verifica se é uma URL relativa válida
    if (url.startsWith('/')) {
      return !url.includes('undefined') && url.length > 1
    }
    
    // Verifica se é uma URL absoluta válida
    new URL(url)
    return true
  } catch {
    return false
  }
}
