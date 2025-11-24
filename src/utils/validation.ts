import { ValidationResult, ArticleValidation, Article } from '@/types'

export function validateFrontmatter(frontmatter: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Campos obrigatórios
  if (!frontmatter.id) errors.push('Campo "id" é obrigatório')
  if (!frontmatter.title) errors.push('Campo "title" é obrigatório')
  if (!frontmatter.slug) errors.push('Campo "slug" é obrigatório')
  if (!frontmatter.excerpt) errors.push('Campo "excerpt" é obrigatório')
  if (!frontmatter.publishedAt) errors.push('Campo "publishedAt" é obrigatório')
  if (!frontmatter.categorySlug) errors.push('Campo "categorySlug" é obrigatório')

  // Validações de formato
  if (frontmatter.excerpt && frontmatter.excerpt.length > 160) {
    warnings.push('Excerpt deve ter no máximo 160 caracteres')
  }

  if (frontmatter.slug && !/^[a-z0-9-]+$/.test(frontmatter.slug)) {
    errors.push('Slug deve conter apenas letras minúsculas, números e hífens')
  }

  if (frontmatter.publishedAt && isNaN(Date.parse(frontmatter.publishedAt))) {
    errors.push('Data de publicação inválida')
  }

  // Validações de SEO
  if (!frontmatter.seo) {
    warnings.push('Dados de SEO não encontrados')
  } else {
    if (!frontmatter.seo.metaTitle) warnings.push('Meta title não definido')
    if (!frontmatter.seo.metaDescription) warnings.push('Meta description não definida')
    if (!frontmatter.seo.keywords || frontmatter.seo.keywords.length === 0) {
      warnings.push('Keywords não definidas')
    }
  }

  // Validações de imagem
  if (!frontmatter.coverImage) {
    errors.push('Imagem de capa é obrigatória')
  } else {
    if (!frontmatter.coverImage.src) errors.push('URL da imagem de capa é obrigatória')
    if (!frontmatter.coverImage.alt) warnings.push('Alt text da imagem não definido')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateContent(content: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Verificar tamanho mínimo
  if (content.length < 800) {
    warnings.push('Conteúdo muito curto (menos de 800 caracteres)')
  }

  // Verificar estrutura de headings
  const h1Count = (content.match(/^# /gm) || []).length
  if (h1Count === 0) {
    errors.push('Artigo deve ter pelo menos um H1')
  } else if (h1Count > 1) {
    warnings.push('Artigo tem múltiplos H1s')
  }

  const h2Count = (content.match(/^## /gm) || []).length
  if (h2Count < 2) {
    warnings.push('Artigo deve ter pelo menos 2 seções H2')
  }

  // Verificar links de afiliados
  if (!content.includes('<ExchangeAffiliateLinks')) {
    warnings.push('Links de afiliados não encontrados')
  }

  // Verificar links internos
  const internalLinks = (content.match(/\[.*\]\(\/artigo\//g) || []).length
  if (internalLinks < 3) {
    warnings.push('Poucos links internos (recomendado: 3-5)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateSEO(article: Article): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!article.seo) {
    errors.push('Dados de SEO não encontrados')
    return { valid: false, errors, warnings }
  }

  // Validar meta title
  if (!article.seo.metaTitle) {
    errors.push('Meta title é obrigatório')
  } else {
    if (article.seo.metaTitle.length > 60) {
      warnings.push('Meta title muito longo (máximo 60 caracteres)')
    }
    if (!article.seo.metaTitle.includes('A Cifra')) {
      warnings.push('Meta title deve incluir "A Cifra"')
    }
  }

  // Validar meta description
  if (!article.seo.metaDescription) {
    errors.push('Meta description é obrigatória')
  } else {
    if (article.seo.metaDescription.length > 160) {
      warnings.push('Meta description muito longa (máximo 160 caracteres)')
    }
    if (article.seo.metaDescription.length < 120) {
      warnings.push('Meta description muito curta (mínimo 120 caracteres)')
    }
  }

  // Validar keywords
  if (!article.seo.keywords || article.seo.keywords.length === 0) {
    warnings.push('Keywords não definidas')
  } else if (article.seo.keywords.length > 10) {
    warnings.push('Muitas keywords (máximo 10)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateMonetization(article: Article): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!article.monetization) {
    warnings.push('Configuração de monetização não encontrada')
    return { valid: true, errors, warnings }
  }

  // Validar prioridade
  const validPriorities = ['high', 'medium', 'low']
  if (!validPriorities.includes(article.monetization.priority)) {
    errors.push('Prioridade de monetização inválida')
  }

  // Validar exchanges
  const validExchanges = ['bitget', 'binance', 'coinbase']
  const invalidExchanges = article.monetization.affiliateLinks.filter(
    exchange => !validExchanges.includes(exchange)
  )
  
  if (invalidExchanges.length > 0) {
    errors.push(`Exchanges inválidas: ${invalidExchanges.join(', ')}`)
  }

  if (article.monetization.affiliateLinks.length === 0) {
    warnings.push('Nenhuma exchange configurada para afiliados')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateArticle(article: Article, content: string): ArticleValidation {
  return {
    frontmatter: validateFrontmatter(article),
    content: validateContent(content),
    seo: validateSEO(article),
    monetization: validateMonetization(article)
  }
}

export function generateSEOTags(article: Article) {
  const baseUrl = 'https://a-cifra.com.br'
  
  return {
    title: article.seo?.metaTitle || `${article.title} | A Cifra`,
    description: article.seo?.metaDescription || article.excerpt,
    keywords: article.seo?.keywords?.join(', ') || article.tags.join(', '),
    canonical: `${baseUrl}/artigo/${article.slug}`,
    openGraph: {
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt,
      url: `${baseUrl}/artigo/${article.slug}`,
      type: 'article',
      images: [
        {
          url: `${baseUrl}${article.coverImage.src}`,
          width: article.coverImage.width,
          height: article.coverImage.height,
          alt: article.coverImage.alt
        }
      ],
      article: {
        publishedTime: article.publishedAt.toISOString(),
        modifiedTime: article.updatedAt?.toISOString(),
        authors: [article.author.name],
        tags: article.tags
      }
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.excerpt,
      images: [`${baseUrl}${article.coverImage.src}`]
    }
  }
}