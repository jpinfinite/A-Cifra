#!/usr/bin/env node

/**
 * Script de Monitoramento SEO Automático
 * Tarefa 6.2 - Blog A Cifra
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔍 INICIANDO MONITORAMENTO SEO - Blog A Cifra\n');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

let totalChecks = 0;
let passedChecks = 0;
let warnings = 0;

function logCheck(name, passed, details = '', isWarning = false) {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`${colors.green}✅ ${name}${colors.reset}`);
  } else if (isWarning) {
    warnings++;
    console.log(`${colors.yellow}⚠️  ${name}${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ ${name}${colors.reset}`);
  }
  if (details) {
    console.log(`   ${details}\n`);
  }
}

function logSection(title) {
  console.log(`\n${colors.blue}${colors.bold}📊 ${title}${colors.reset}`);
  console.log('─'.repeat(50));
}

// 1. VALIDAÇÃO DE STRUCTURED DATA
logSection('1. STRUCTURED DATA VALIDATION');

const structuredDataFiles = [
  'src/app/layout.tsx',
  'src/components/seo/GoogleFeedOptimizer.tsx'
];

structuredDataFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar Organization Schema
    const hasOrgSchema = content.includes('"@type": "Organization"') || 
                        content.includes('@type": "WebSite"');
    logCheck(`Organization Schema em ${path.basename(file)}`, hasOrgSchema);
    
    // Verificar Person Schema
    const hasPersonSchema = content.includes('"@type": "Person"');
    logCheck(`Person Schema em ${path.basename(file)}`, hasPersonSchema);
    
    // Verificar Article Schema
    const hasArticleSchema = content.includes('"@type": "Article"') ||
                            content.includes('generateArticleStructuredData');
    logCheck(`Article Schema em ${path.basename(file)}`, hasArticleSchema);
    
  } catch (error) {
    logCheck(`Arquivo ${file}`, false, `Erro: ${error.message}`);
  }
});

// 2. VALIDAÇÃO DE META TAGS
logSection('2. META TAGS VALIDATION');

const articleFiles = [
  'src/app/tema/10-a-10/page.tsx',
  'src/app/tema/zero-hype-cem-estudo/page.tsx',
  'src/app/tema/preco-ultima-coisa/page.tsx',
  'src/app/tema/risco-e-voce/page.tsx',
  'src/app/tema/nao-confie-verifique/page.tsx',
  'src/app/tema/esqueca-fortuna-rapida/page.tsx',
  'src/app/tema/erro-fatal-cem-por-cento/page.tsx',
  'src/app/tema/diferenca-temperatura/page.tsx',
  'src/app/tema/fantasma-golpes/page.tsx',
  'src/app/tema/o-que-e-dinheiro/page.tsx',
  'src/app/tema/primeira-compra/page.tsx'
];

let articlesWithMeta = 0;
let articlesWithCanonical = 0;
let articlesWithOG = 0;

articleFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(path.dirname(file));
    
    // Verificar Meta Description
    const hasMetaDescription = content.includes('description:') && 
                              content.includes('export const metadata');
    if (hasMetaDescription) articlesWithMeta++;
    
    // Verificar Canonical URL
    const hasCanonical = content.includes('canonical:') || 
                        content.includes('alternates:');
    if (hasCanonical) articlesWithCanonical++;
    
    // Verificar Open Graph
    const hasOpenGraph = content.includes('openGraph:');
    if (hasOpenGraph) articlesWithOG++;
    
    logCheck(`Meta tags em ${fileName}`, hasMetaDescription && hasCanonical && hasOpenGraph);
    
  } catch (error) {
    logCheck(`Artigo ${path.basename(path.dirname(file))}`, false, `Erro: ${error.message}`);
  }
});

console.log(`\n📊 Resumo Meta Tags:`);
console.log(`   Meta Descriptions: ${articlesWithMeta}/${articleFiles.length}`);
console.log(`   Canonical URLs: ${articlesWithCanonical}/${articleFiles.length}`);
console.log(`   Open Graph: ${articlesWithOG}/${articleFiles.length}`);

// 3. VALIDAÇÃO DE SITEMAPS
logSection('3. SITEMAPS VALIDATION');

const sitemapFiles = [
  'src/app/sitemap.ts',
  'src/app/news-sitemap.xml/route.ts',
  'src/app/feed.xml/route.ts'
];

sitemapFiles.forEach(file => {
  try {
    const exists = fs.existsSync(file);
    const fileName = path.basename(file, '.ts').replace('/route', '');
    
    if (exists) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar se tem conteúdo válido
      const hasValidContent = content.includes('export') && 
                             (content.includes('sitemap') || content.includes('rss') || content.includes('xml'));
      logCheck(`${fileName}`, hasValidContent);
    } else {
      logCheck(`${fileName}`, false, 'Arquivo não encontrado');
    }
    
  } catch (error) {
    logCheck(`Sitemap ${file}`, false, `Erro: ${error.message}`);
  }
});

// 4. VALIDAÇÃO DE PERFORMANCE
logSection('4. PERFORMANCE MONITORING');

try {
  // Verificar Web Vitals Monitor
  const webVitalsPath = 'src/components/performance/WebVitalsMonitor.tsx';
  const webVitalsExists = fs.existsSync(webVitalsPath);
  
  if (webVitalsExists) {
    const content = fs.readFileSync(webVitalsPath, 'utf8');
    const hasWebVitalsAPI = content.includes('web-vitals') || 
                           content.includes('getCLS') || 
                           content.includes('getLCP');
    logCheck('Web Vitals Monitor', hasWebVitalsAPI);
  } else {
    logCheck('Web Vitals Monitor', false, 'Arquivo não encontrado');
  }
  
  // Verificar Connection Optimizer
  const connectionPath = 'src/components/performance/ConnectionOptimizer.tsx';
  const connectionExists = fs.existsSync(connectionPath);
  logCheck('Connection Optimizer', connectionExists);
  
} catch (error) {
  logCheck('Performance Monitoring', false, `Erro: ${error.message}`);
}

// 5. VALIDAÇÃO DE COMPLIANCE
logSection('5. COMPLIANCE VALIDATION');

const compliancePages = [
  'src/app/politica-privacidade/page.tsx',
  'src/app/termos-uso/page.tsx',
  'src/app/disclaimer/page.tsx'
];

compliancePages.forEach(file => {
  try {
    const exists = fs.existsSync(file);
    const pageName = path.basename(path.dirname(file));
    logCheck(`Página ${pageName}`, exists);
    
    if (exists) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar se tem metadata
      const hasMetadata = content.includes('export const metadata');
      logCheck(`Metadata em ${pageName}`, hasMetadata);
    }
    
  } catch (error) {
    logCheck(`Compliance ${file}`, false, `Erro: ${error.message}`);
  }
});

// 6. KEYWORDS MONITORING
logSection('6. KEYWORDS MONITORING');

const keywordTargets = [
  { keyword: 'bitcoin', files: ['10-a-10', 'risco-e-voce', 'o-que-e-dinheiro'] },
  { keyword: 'criptomoedas', files: ['fantasma-golpes', 'primeira-compra'] },
  { keyword: 'DYOR', files: ['zero-hype-cem-estudo', 'nao-confie-verifique'] },
  { keyword: 'investimento', files: ['preco-ultima-coisa', 'erro-fatal-cem-por-cento'] },
  { keyword: 'custódia', files: ['diferenca-temperatura', 'nao-confie-verifique'] }
];

keywordTargets.forEach(target => {
  let keywordFound = 0;
  
  target.files.forEach(fileName => {
    try {
      const filePath = `src/app/tema/${fileName}/page.tsx`;
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.toLowerCase().includes(target.keyword.toLowerCase())) {
          keywordFound++;
        }
      }
    } catch (error) {
      // Ignorar erros de arquivo não encontrado
    }
  });
  
  const coverage = Math.round((keywordFound / target.files.length) * 100);
  logCheck(`Keyword "${target.keyword}" coverage`, coverage >= 50, `${coverage}% (${keywordFound}/${target.files.length} arquivos)`);
});

// 7. GOOGLE SEARCH CONSOLE INTEGRATION CHECK
logSection('7. GOOGLE SEARCH CONSOLE');

try {
  const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
  
  // Verificar Google Site Verification
  const hasGoogleVerification = layoutContent.includes('google-site-verification');
  logCheck('Google Site Verification', hasGoogleVerification);
  
  // Verificar Google AdSense Account
  const hasAdSenseAccount = layoutContent.includes('google-adsense-account');
  logCheck('Google AdSense Account', hasAdSenseAccount);
  
  // Verificar robots meta
  const hasRobotsMeta = layoutContent.includes('robots:') || 
                       layoutContent.includes('googleBot:');
  logCheck('Robots Meta Configuration', hasRobotsMeta);
  
} catch (error) {
  logCheck('Google Search Console Integration', false, `Erro: ${error.message}`);
}

// 8. ALERTAS E RECOMENDAÇÕES
logSection('8. ALERTAS E RECOMENDAÇÕES');

// Verificar se há problemas críticos
const criticalIssues = totalChecks - passedChecks - warnings;
if (criticalIssues > 0) {
  console.log(`${colors.red}🚨 ${criticalIssues} problemas críticos encontrados${colors.reset}`);
}

if (warnings > 0) {
  console.log(`${colors.yellow}⚠️  ${warnings} avisos que precisam de atenção${colors.reset}`);
}

// Recomendações baseadas nos resultados
const recommendations = [];

if (articlesWithMeta < articleFiles.length) {
  recommendations.push('Adicionar meta descriptions nos artigos restantes');
}

if (articlesWithCanonical < articleFiles.length) {
  recommendations.push('Implementar canonical URLs em todos os artigos');
}

if (criticalIssues > 0) {
  recommendations.push('Corrigir problemas críticos antes da submissão AdSense');
}

if (recommendations.length > 0) {
  console.log(`\n${colors.yellow}📋 RECOMENDAÇÕES:${colors.reset}`);
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
}

// RESULTADO FINAL
console.log('\n' + '='.repeat(60));
console.log(`${colors.bold}📊 RESULTADO FINAL DO MONITORAMENTO SEO${colors.reset}`);
console.log('='.repeat(60));

const successRate = Math.round((passedChecks / totalChecks) * 100);
const statusColor = successRate >= 90 ? colors.green : 
                   successRate >= 70 ? colors.yellow : colors.red;

console.log(`${statusColor}${colors.bold}✅ Checks Aprovados: ${passedChecks}/${totalChecks} (${successRate}%)${colors.reset}`);
console.log(`${colors.yellow}⚠️  Avisos: ${warnings}${colors.reset}`);
console.log(`${colors.red}❌ Problemas Críticos: ${criticalIssues}${colors.reset}`);

if (successRate >= 90) {
  console.log(`${colors.green}${colors.bold}🎉 EXCELENTE! SEO otimizado e pronto para indexação!${colors.reset}`);
} else if (successRate >= 70) {
  console.log(`${colors.yellow}${colors.bold}⚠️  BOM! Algumas melhorias recomendadas.${colors.reset}`);
} else {
  console.log(`${colors.red}${colors.bold}❌ ATENÇÃO! Correções necessárias antes da produção.${colors.reset}`);
}

// Próximos passos
console.log('\n📋 PRÓXIMOS PASSOS MONITORAMENTO:');
console.log('1. 🔄 Executar este script semanalmente');
console.log('2. 📊 Monitorar Google Search Console');
console.log('3. 🎯 Acompanhar posições de keywords');
console.log('4. 📈 Validar Rich Results periodicamente');
console.log('5. 🚨 Configurar alertas para problemas críticos');

console.log(`\n${colors.blue}📞 Suporte: cifraaessenciacoin@gmail.com${colors.reset}`);
console.log(`${colors.blue}📚 Documentação: OTIMIZACOES_IMPLEMENTADAS.md${colors.reset}\n`);

// Salvar relatório em arquivo
const reportData = {
  timestamp: new Date().toISOString(),
  totalChecks,
  passedChecks,
  warnings,
  criticalIssues,
  successRate,
  articlesWithMeta,
  articlesWithCanonical,
  articlesWithOG,
  recommendations
};

try {
  fs.writeFileSync('seo-monitoring-report.json', JSON.stringify(reportData, null, 2));
  console.log(`${colors.green}📄 Relatório salvo em: seo-monitoring-report.json${colors.reset}\n`);
} catch (error) {
  console.log(`${colors.red}❌ Erro ao salvar relatório: ${error.message}${colors.reset}\n`);
}