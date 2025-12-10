#!/usr/bin/env node

/**
 * Kiro Article Processor v3.1
 * Processador avançado de artigos do A Cifra
 * Refatorado para usar gray-matter
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuração do processador
const CONFIG = {
  minWordCount: 1200,
  idealWordCount: 2000,
  maxWordCount: 5000,
  minInternalLinks: 3,
  maxInternalLinks: 5,
  requireFAQ: true,
  requireAffiliateLinks: true,
  requireDisclaimer: true,
  seo: {
    titleMin: 50,
    titleMax: 65,
    descriptionMin: 120,
    descriptionMax: 170,
    keywordDensityMin: 0.5,
    keywordDensityMax: 2.5
  },
  categories: [
    'bitcoin', 'altcoins', 'defi', 'ethereum', 'nfts',
    'trading', 'seguranca', 'educacao', 'regulacao', 'analises'
  ]
};

function validateFrontmatter(content) {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  let parsed;
  try {
      parsed = matter(content);
  } catch (e) {
      errors.push('Frontmatter inválido ou não encontrado');
      return { errors, warnings, suggestions, frontmatter: null };
  }

  const data = parsed.data;

  // Validar campos obrigatórios
  if (!data.image && !data.coverImage) errors.push('Campo obrigatório ausente: image ou coverImage');
  if (!data.date && !data.publishedAt) errors.push('Campo obrigatório ausente: date ou publishedAt');
  if (!data.title) errors.push('Campo obrigatório ausente: title');

  // Validar category
  const category = data.categorySlug || data.category;
  if (!category) {
      errors.push('Campo obrigatório ausente: category ou categorySlug');
  } else {
    const catLower = category.toLowerCase().replace(/\s+/g, '-');
    if (!CONFIG.categories.includes(catLower) && !CONFIG.categories.includes(category)) {
       // Permissive check
    }
  }

  // Validar SEO - Meta Title
  // Se não tiver metaTitle, mas tiver title, sugerir ou avisar
  if (data.metaTitle) {
    const titleLength = data.metaTitle.length;
    if (titleLength < CONFIG.seo.titleMin) {
      warnings.push(`Meta title muito curto (${titleLength} chars). Mínimo: ${CONFIG.seo.titleMin}`);
    } else if (titleLength > CONFIG.seo.titleMax) {
      warnings.push(`Meta title muito longo (${titleLength} chars). Máximo: ${CONFIG.seo.titleMax}`);
    }
  } else {
    // Audit considers missing metaTitle an error
    errors.push('Meta title não encontrado no frontmatter');
  }

  // Validar SEO - Meta Description
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    if (descLength < CONFIG.seo.descriptionMin) {
      warnings.push(`Meta description muito curta (${descLength} chars). Mínimo: ${CONFIG.seo.descriptionMin}`);
    } else if (descLength > CONFIG.seo.descriptionMax) {
      warnings.push(`Meta description muito longa (${descLength} chars). Máximo: ${CONFIG.seo.descriptionMax}`);
    }
  } else {
    errors.push('Meta description não encontrada no frontmatter');
  }

  return { errors, warnings, suggestions, frontmatter: data };
}

function validateContent(content) {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  const parsed = matter(content);
  const contentBody = parsed.content;

  // Contar palavras
  const words = contentBody.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  if (wordCount < CONFIG.minWordCount) {
    errors.push(`Conteúdo muito curto: ${wordCount} palavras (mínimo: ${CONFIG.minWordCount})`);
  }

  // Verificar H1 no CORPO (O Layout já poe o H1 do titulo)
  const h1Matches = contentBody.match(/^# .+$/gm) || [];
  if (h1Matches.length > 0) {
     // suggestions.push(`Encontrado H1 no corpo. Verifique se não há duplicação com o título do layout.`);
     // Not an error
  }

  // Checking H2
  const h2Matches = contentBody.match(/^## .+$/gm) || [];
  if (h2Matches.length < 3) {
    warnings.push(`Poucos H2 encontrados (${h2Matches.length}). Recomendado: 3-10`);
  }

  // Verificar links internos
  const internalLinks = (contentBody.match(/\[.*?\]\(\/artigo\/[^)]+\)/g) || []).length;
  if (internalLinks < CONFIG.minInternalLinks) {
    warnings.push(`Poucos links internos (${internalLinks}). Recomendado: ${CONFIG.minInternalLinks}-${CONFIG.maxInternalLinks}`);
  }

  // Verificar ExchangeAffiliateLinks
  const affiliateLinksCount = (contentBody.match(/<ExchangeAffiliateLinks/g) || []).length;
  if (CONFIG.requireAffiliateLinks && affiliateLinksCount === 0) {
      warnings.push('ExchangeAffiliateLinks não encontrado');
  }

  return {
    errors,
    warnings,
    suggestions,
    wordCount,
    h1Count: h1Matches.length,
    h2Count: h2Matches.length,
    internalLinks,
    affiliateLinksCount
  };
}

// Dummy export for the checker to use
module.exports = { validateFrontmatter, validateContent };
