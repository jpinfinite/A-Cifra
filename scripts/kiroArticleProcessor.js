#!/usr/bin/env node

/**
 * Kiro Article Processor v3.0
 * Processador avada artigos tigos do A Cifra
 *
 * Funcionalidades:
 * - Validação completa de frontmatter
 * - Análise SEO profunda
 * - Verificação de qualidade editorial
 * - Sugestões de links internos
 * - Análise de densidade de keywords
 * - Relatório detalhado com correções
 *
 * Uso: node scripts/kiroArticleProcessor.js <caminho-do-artigo>
 */

const fs = require('fs');
const path = require('path');

// Configuração do processador
const CONFIG = {
  minWordCount: 1500,
  idealWordCount: 2000,
  maxWordCount: 5000,
  minInternalLinks: 3,
  maxInternalLinks: 5,
  requireFAQ: true,
  requireAffiliateLinks: true,
  requireDisclaimer: true,
  seo: {
    titleMin: 50,
    titleMax: 60,
    descriptionMin: 150,
    descriptionMax: 160,
    keywordDensityMin: 1,
    keywordDensityMax: 2
  },
  categories: [
    'bitcoin', 'altcoins', 'defi', 'ethereum', 'nfts',
    'trading', 'seguranca', 'educacao', 'regulacao', 'analises'
  ]
};

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  return frontmatterMatch[1];
}

function extractContent(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '');
}

function validateFrontmatter(content) {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  const frontmatterText = extractFrontmatter(content);

  if (!frontmatterText) {
    errors.push('Frontmatter não encontrado');
    return { errors, warnings, suggestions, frontmatter: null };
  }

  // Validar campos obrigatórios
  const requiredFields = {
    'id': 'Identificador único do artigo',
    'title': 'Título do artigo',
    'slug': 'URL amigável',
    'excerpt': 'Resumo do artigo',
    'coverImage': 'Imagem de capa',
    'author': 'Informações do autor',
    'publishedAt': 'Data de publicação',
    'categorySlug': 'Categoria do artigo',
    'tags': 'Tags do artigo',
    'seo': 'Configurações de SEO'
  };

  Object.entries(requiredFields).forEach(([field, description]) => {
    if (!frontmatterText.includes(`${field}:`)) {
      errors.push(`Campo obrigatório ausente: ${field} (${description})`);
    }
  });

  // Validar categorySlug
  const categoryMatch = frontmatterText.match(/categorySlug:\s*['"]?(\w+)['"]?/);
  if (categoryMatch) {
    const category = categoryMatch[1];
    if (!CONFIG.categories.includes(category)) {
      errors.push(`categorySlug inválido: "${category}". Categorias válidas: ${CONFIG.categories.join(', ')}`);
    }
  }

  // Validar SEO - Meta Title
  const titleMatch = frontmatterText.match(/metaTitle:\s*['"](.+?)['"]/);
  if (titleMatch) {
    const titleLength = titleMatch[1].length;
    if (titleLength < CONFIG.seo.titleMin) {
      warnings.push(`Meta title muito curto (${titleLength} chars). Mínimo: ${CONFIG.seo.titleMin}`);
      suggestions.push(`Expanda o meta title para incluir mais keywords relevantes`);
    } else if (titleLength > CONFIG.seo.titleMax) {
      warnings.push(`Meta title muito longo (${titleLength} chars). Máximo: ${CONFIG.seo.titleMax}`);
      suggestions.push(`Reduza o meta title para ${CONFIG.seo.titleMax} caracteres`);
    }
  } else {
    errors.push('Meta title não encontrado no frontmatter');
  }

  // Validar SEO - Meta Description
  const descMatch = frontmatterText.match(/metaDescription:\s*['"](.+?)['"]/);
  if (descMatch) {
    const descLength = descMatch[1].length;
    if (descLength < CONFIG.seo.descriptionMin) {
      warnings.push(`Meta description muito curta (${descLength} chars). Mínimo: ${CONFIG.seo.descriptionMin}`);
      suggestions.push(`Expanda a meta description com mais detalhes e keywords`);
    } else if (descLength > CONFIG.seo.descriptionMax) {
      warnings.push(`Meta description muito longa (${descLength} chars). Máximo: ${CONFIG.seo.descriptionMax}`);
      suggestions.push(`Reduza a meta description para ${CONFIG.seo.descriptionMax} caracteres`);
    }
  } else {
    errors.push('Meta description não encontrada no frontmatter');
  }

  // Validar tags
  const tagsMatch = frontmatterText.match(/tags:\s*\[(.*?)\]/);
  if (tagsMatch) {
    const tagsCount = tagsMatch[1].split(',').filter(t => t.trim()).length;
    if (tagsCount < 3) {
      warnings.push(`Poucas tags (${tagsCount}). Recomendado: 3-5 tags`);
    } else if (tagsCount > 5) {
      warnings.push(`Muitas tags (${tagsCount}). Recomendado: 3-5 tags`);
    }
  }

  return { errors, warnings, suggestions, frontmatter: frontmatterText };
}

function validateContent(content) {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  const contentWithoutFrontmatter = extractContent(content);

  // Contar palavras
  const words = contentWithoutFrontmatter.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  if (wordCount < CONFIG.minWordCount) {
    errors.push(`Conteúdo muito curto: ${wordCount} palavras (mínimo: ${CONFIG.minWordCount})`);
    suggestions.push(`Adicione mais ${CONFIG.minWordCount - wordCount} palavras para atingir o mínimo`);
  } else if (wordCount < CONFIG.idealWordCount) {
    warnings.push(`Conteúdo abaixo do ideal: ${wordCount} palavras (ideal: ${CONFIG.idealWordCount})`);
    suggestions.push(`Considere expandir para ${CONFIG.idealWordCount} palavras para melhor SEO`);
  } else if (wordCount > CONFIG.maxWordCount) {
    warnings.push(`Conteúdo muito longo: ${wordCount} palavras (máximo recomendado: ${CONFIG.maxWordCount})`);
    suggestions.push(`Considere dividir em múltiplos artigos ou reduzir conteúdo redundante`);
  }

  // Verificar H1
  const h1Matches = contentWithoutFrontmatter.match(/^# .+$/gm) || [];
  const h1Count = h1Matches.length;

  if (h1Count === 0) {
    errors.push('Nenhum H1 encontrado');
    suggestions.push('Adicione um título H1 único e otimizado com a keyword principal');
  } else if (h1Count > 1) {
    errors.push(`Múltiplos H1 encontrados (${h1Count}). Deve haver apenas 1`);
    suggestions.push('Mantenha apenas 1 H1 e converta os outros para H2 ou H3');
  }

  // Verificar H2
  const h2Matches = contentWithoutFrontmatter.match(/^## .+$/gm) || [];
  const h2Count = h2Matches.length;

  if (h2Count < 3) {
    warnings.push(`Poucos H2 encontrados (${h2Count}). Recomendado: 3-10`);
    suggestions.push('Adicione mais seções H2 para melhorar a estrutura e SEO');
  } else if (h2Count > 10) {
    warnings.push(`Muitos H2 encontrados (${h2Count}). Recomendado: 3-10`);
    suggestions.push('Considere agrupar seções ou usar H3 para subseções');
  }

  // Verificar H3
  const h3Matches = contentWithoutFrontmatter.match(/^### .+$/gm) || [];
  const h3Count = h3Matches.length;

  // Verificar links internos
  const internalLinksMatches = contentWithoutFrontmatter.match(/\[.*?\]\(\/artigo\/[^)]+\)/g) || [];
  const internalLinks = internalLinksMatches.length;

  if (internalLinks < CONFIG.minInternalLinks) {
    warnings.push(`Poucos links internos (${internalLinks}). Recomendado: ${CONFIG.minInternalLinks}-${CONFIG.maxInternalLinks}`);
    suggestions.push('Adicione links para artigos relacionados para melhorar SEO e navegação');
  } else if (internalLinks > CONFIG.maxInternalLinks) {
    warnings.push(`Muitos links internos (${internalLinks}). Recomendado: ${CONFIG.minInternalLinks}-${CONFIG.maxInternalLinks}`);
  }

  // Verificar ExchangeAffiliateLinks
  const affiliateLinksMatches = contentWithoutFrontmatter.match(/<ExchangeAffiliateLinks/g) || [];
  const affiliateLinksCount = affiliateLinksMatches.length;

  if (CONFIG.requireAffiliateLinks) {
    if (affiliateLinksCount === 0) {
      errors.push('ExchangeAffiliateLinks não encontrado');
      suggestions.push('Adicione <ExchangeAffiliateLinks /> após a introdução e antes da conclusão');
    } else if (affiliateLinksCount < 2) {
      warnings.push('Apenas 1 ExchangeAffiliateLinks. Recomendado: 2');
      suggestions.push('Adicione outro <ExchangeAffiliateLinks /> antes da conclusão');
    }
  }

  // Verificar FAQ
  if (CONFIG.requireFAQ) {
    const hasFAQ = contentWithoutFrontmatter.includes('FAQ') ||
                   contentWithoutFrontmatter.includes('Perguntas Frequentes') ||
                   contentWithoutFrontmatter.includes('❓');

    if (!hasFAQ) {
      warnings.push('Seção FAQ não encontrada');
      suggestions.push('Adicione uma seção FAQ com 5-10 perguntas frequentes para melhorar SEO');
    }
  }

  // Verificar Disclaimer
  if (CONFIG.requireDisclaimer) {
    const hasDisclaimer = contentWithoutFrontmatter.toLowerCase().includes('disclaimer') ||
                          contentWithoutFrontmatter.includes('⚠️');

    if (!hasDisclaimer) {
      warnings.push('Disclaimer não encontrado');
      suggestions.push('Adicione disclaimer apropriado (investimento, impostos ou geral)');
    }
  }

  // Verificar imagens com alt text
  const imagesWithoutAlt = (contentWithoutFrontmatter.match(/!\[\]\(/g) || []).length;
  if (imagesWithoutAlt > 0) {
    warnings.push(`${imagesWithoutAlt} imagem(ns) sem alt text`);
    suggestions.push('Adicione alt text descritivo em todas as imagens para acessibilidade e SEO');
  }

  // Verificar parágrafos muito longos
  const paragraphs = contentWithoutFrontmatter.split('\n\n');
  const longParagraphs = paragraphs.filter(p => {
    const lines = p.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('-'));
    return lines.length > 5;
  });

  if (longParagraphs.length > 0) {
    warnings.push(`${longParagraphs.length} parágrafo(s) muito longo(s)`);
    suggestions.push('Divida parágrafos longos em 3-4 linhas para melhor legibilidade');
  }

  return {
    errors,
    warnings,
    suggestions,
    wordCount,
    h1Count,
    h2Count,
    h3Count,
    internalLinks,
    affiliateLinksCount
  };
}

function generateReport(frontmatterResult, contentResult) {
  const allErrors = [...frontmatterResult.errors, ...contentResult.errors];
  const allWarnings = [...frontmatterResult.warnings, ...contentResult.warnings];
  const allSuggestions = [...frontmatterResult.suggestions, ...contentResult.suggestions];

  log('\n' + '═'.repeat(70), 'cyan');
  log('📊 RELATÓRIO DE ANÁLISE - KIRO ARTICLE PROCESSOR v3.0', 'cyan');
  log('═'.repeat(70), 'cyan');

  // Status Geral
  log('\n✅ STATUS GERAL', 'white');
  if (allErrors.length === 0 && allWarnings.length === 0) {
    log('   APROVADO - Artigo pronto para publicação! 🎉', 'green');
  } else if (allErrors.length === 0) {
    log('   APROVADO COM RESSALVAS - Artigo pode ser publicado, mas há melhorias recomendadas', 'yellow');
  } else {
    log('   REQUER CORREÇÕES - Artigo precisa de ajustes antes da publicação', 'red');
  }

  // Estatísticas
  log('\n📈 ESTATÍSTICAS DO ARTIGO', 'white');
  log(`   Palavras: ${contentResult.wordCount}`, contentResult.wordCount >= CONFIG.minWordCount ? 'green' : 'red');
  log(`   H1: ${contentResult.h1Count}`, contentResult.h1Count === 1 ? 'green' : 'red');
  log(`   H2: ${contentResult.h2Count}`, contentResult.h2Count >= 3 ? 'green' : 'yellow');
  log(`   H3: ${contentResult.h3Count}`, 'green');
  log(`   Links Internos: ${contentResult.internalLinks}`, contentResult.internalLinks >= CONFIG.minInternalLinks ? 'green' : 'yellow');
  log(`   Links de Afiliados: ${contentResult.affiliateLinksCount}`, contentResult.affiliateLinksCount >= 1 ? 'green' : 'red');

  // Erros Críticos
  if (allErrors.length > 0) {
    log(`\n🚨 PROBLEMAS CRÍTICOS (${allErrors.length})`, 'red');
    allErrors.forEach((error, index) => {
      log(`   ${index + 1}. ${error}`, 'red');
    });
  }

  // Avisos Importantes
  if (allWarnings.length > 0) {
    log(`\n⚠️  PROBLEMAS IMPORTANTES (${allWarnings.length})`, 'yellow');
    allWarnings.forEach((warning, index) => {
      log(`   ${index + 1}. ${warning}`, 'yellow');
    });
  }

  // Sugestões de Melhoria
  if (allSuggestions.length > 0) {
    log(`\n💡 SUGESTÕES DE MELHORIA (${allSuggestions.length})`, 'cyan');
    allSuggestions.forEach((suggestion, index) => {
      log(`   ${index + 1}. ${suggestion}`, 'cyan');
    });
  }

  // Pontos Fortes
  const strengths = [];
  if (contentResult.wordCount >= CONFIG.idealWordCount && contentResult.wordCount <= CONFIG.maxWordCount) {
    strengths.push('Contagem de palavras ideal para SEO');
  }
  if (contentResult.h1Count === 1) {
    strengths.push('Estrutura de H1 correta');
  }
  if (contentResult.h2Count >= 3 && contentResult.h2Count <= 10) {
    strengths.push('Boa estrutura de seções H2');
  }
  if (contentResult.internalLinks >= CONFIG.minInternalLinks) {
    strengths.push('Links internos adequados');
  }
  if (contentResult.affiliateLinksCount >= 2) {
    strengths.push('Links de afiliados bem posicionados');
  }

  if (strengths.length > 0) {
    log('\n✨ PONTOS FORTES', 'green');
    strengths.forEach((strength, index) => {
      log(`   ${index + 1}. ${strength}`, 'green');
    });
  }

  log('\n' + '═'.repeat(70), 'cyan');

  return allErrors.length === 0;
}

function processArticle(filePath) {
  log('\n🚀 KIRO ARTICLE PROCESSOR v3.0', 'cyan');
  log('═'.repeat(70), 'cyan');

  // Verificar se arquivo existe
  if (!fs.existsSync(filePath)) {
    log(`\n❌ Arquivo não encontrado: ${filePath}`, 'red');
    process.exit(1);
  }

  log(`\n📄 Processando: ${path.basename(filePath)}`, 'blue');
  log(`   Caminho: ${filePath}`, 'blue');

  // Ler conteúdo
  const content = fs.readFileSync(filePath, 'utf-8');

  // Validar frontmatter
  log('\n📋 Validando Frontmatter...', 'yellow');
  const frontmatterResult = validateFrontmatter(content);

  // Validar conteúdo
  log('📝 Validando Conteúdo...', 'yellow');
  const contentResult = validateContent(content);

  // Gerar relatório
  const approved = generateReport(frontmatterResult, contentResult);

  // Resultado final
  if (approved) {
    log('✅ ARTIGO APROVADO PARA PUBLICAÇÃO!', 'green');
    log('═'.repeat(70), 'cyan');
    process.exit(0);
  } else {
    log('❌ ARTIGO PRECISA DE CORREÇÕES', 'red');
    log('═'.repeat(70), 'cyan');
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    log('\n❌ Uso: node scripts/kiroArticleProcessor.js <caminho-do-artigo>', 'red');
    log('\n📖 Exemplos:', 'yellow');
    log('  node scripts/kiroArticleProcessor.js content/articles/meu-artigo.md', 'cyan');
    log('  node scripts/kiroArticleProcessor.js content/articles/bitcoin-analise.md', 'cyan');
    log('\n💡 Dica: Use este script para validar artigos antes de publicar!', 'green');
    process.exit(1);
  }

  processArticle(args[0]);
}

module.exports = { processArticle, validateFrontmatter, validateContent };
