#!/usr/bin/env node

/**
 * Script de Otimização Final - Blog A Cifra
 * 
 * Executa todas as validações e otimizações finais antes do deploy
 * 
 * Uso: node scripts/final-optimization.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 INICIANDO OTIMIZAÇÃO FINAL - Blog A Cifra\n');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`${colors.blue}${colors.bold}${step}${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Verificar se todos os arquivos essenciais existem
function checkEssentialFiles() {
  logStep('1.', 'Verificando arquivos essenciais...');
  
  const essentialFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/components/layout/Layout.tsx',
    'src/components/ads/AdBanner.tsx',
    'src/components/ads/GoogleAdsense.tsx',
    'src/components/ui/NewsletterForm.tsx',
    'src/app/api/newsletter/route.ts',
    'src/lib/email-service.ts',
    '.env.local',
    'next.config.ts',
    'package.json'
  ];
  
  let allFilesExist = true;
  
  essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logSuccess(`${file}`);
    } else {
      logError(`${file} - ARQUIVO AUSENTE`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// Verificar se InContentAd está implementado nos artigos principais
function checkInContentAds() {
  logStep('2.', 'Verificando InContentAd nos artigos...');
  
  const mainArticles = [
    'src/app/tema/10-a-10/page.tsx',
    'src/app/tema/zero-hype-cem-estudo/page.tsx',
    'src/app/tema/risco-e-voce/page.tsx'
  ];
  
  let adsImplemented = 0;
  
  mainArticles.forEach(article => {
    if (fs.existsSync(article)) {
      const content = fs.readFileSync(article, 'utf8');
      if (content.includes('InContentAd')) {
        logSuccess(`${path.basename(path.dirname(article))} - InContentAd implementado`);
        adsImplemented++;
      } else {
        logWarning(`${path.basename(path.dirname(article))} - InContentAd ausente`);
      }
    }
  });
  
  log(`\n📊 InContentAd implementado em ${adsImplemented}/${mainArticles.length} artigos principais\n`);
  return adsImplemented;
}

// Executar build de teste
function testBuild() {
  logStep('3.', 'Executando build de teste...');
  
  try {
    execSync('npm run build', { stdio: 'pipe' });
    logSuccess('Build executado com sucesso');
    return true;
  } catch (error) {
    logError('Falha no build');
    console.log(error.stdout?.toString());
    console.log(error.stderr?.toString());
    return false;
  }
}

// Executar validação SEO
function validateSEO() {
  logStep('4.', 'Executando validação SEO...');
  
  try {
    const output = execSync('npm run validate-seo', { encoding: 'utf8' });
    if (output.includes('Score SEO: 100%')) {
      logSuccess('SEO Score: 100%');
      return true;
    } else {
      logWarning('SEO Score abaixo de 100%');
      return false;
    }
  } catch (error) {
    logError('Falha na validação SEO');
    return false;
  }
}

// Verificar configurações de ambiente
function checkEnvironmentConfig() {
  logStep('5.', 'Verificando configurações de ambiente...');
  
  if (!fs.existsSync('.env.local')) {
    logError('.env.local não encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_GA_ID',
    'NEXT_PUBLIC_ADSENSE_CLIENT',
    'NEXT_PUBLIC_SITE_URL'
  ];
  
  let configComplete = true;
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      logSuccess(`${varName} configurado`);
    } else {
      logWarning(`${varName} ausente`);
      configComplete = false;
    }
  });
  
  return configComplete;
}

// Verificar otimizações de performance
function checkPerformanceOptimizations() {
  logStep('6.', 'Verificando otimizações de performance...');
  
  const checks = [
    {
      file: 'src/components/ads/GoogleAdsense.tsx',
      pattern: 'lazy loading',
      description: 'Lazy loading nos anúncios'
    },
    {
      file: 'src/components/ui/OptimizedImage.tsx',
      pattern: 'intersection observer',
      description: 'Intersection Observer nas imagens'
    },
    {
      file: 'src/app/layout.tsx',
      pattern: 'strategy="lazyOnload"',
      description: 'AdSense com lazy loading'
    }
  ];
  
  let optimizationsFound = 0;
  
  checks.forEach(check => {
    if (fs.existsSync(check.file)) {
      const content = fs.readFileSync(check.file, 'utf8').toLowerCase();
      if (content.includes(check.pattern.toLowerCase())) {
        logSuccess(check.description);
        optimizationsFound++;
      } else {
        logWarning(`${check.description} - não encontrado`);
      }
    }
  });
  
  return optimizationsFound;
}

// Gerar relatório final
function generateFinalReport(results) {
  logStep('7.', 'Gerando relatório final...');
  
  const report = {
    timestamp: new Date().toISOString(),
    essentialFiles: results.essentialFiles,
    buildSuccess: results.buildSuccess,
    seoScore: results.seoScore,
    inContentAds: results.inContentAds,
    environmentConfig: results.environmentConfig,
    performanceOptimizations: results.performanceOptimizations,
    overallScore: 0
  };
  
  // Calcular score geral
  let totalPoints = 0;
  let maxPoints = 0;
  
  if (results.essentialFiles) totalPoints += 20;
  maxPoints += 20;
  
  if (results.buildSuccess) totalPoints += 25;
  maxPoints += 25;
  
  if (results.seoScore) totalPoints += 20;
  maxPoints += 20;
  
  totalPoints += (results.inContentAds / 3) * 15;
  maxPoints += 15;
  
  if (results.environmentConfig) totalPoints += 10;
  maxPoints += 10;
  
  totalPoints += (results.performanceOptimizations / 3) * 10;
  maxPoints += 10;
  
  report.overallScore = Math.round((totalPoints / maxPoints) * 100);
  
  // Salvar relatório
  fs.writeFileSync('optimization-report.json', JSON.stringify(report, null, 2));
  
  return report;
}

// Executar otimização principal
async function main() {
  const results = {
    essentialFiles: false,
    buildSuccess: false,
    seoScore: false,
    inContentAds: 0,
    environmentConfig: false,
    performanceOptimizations: 0
  };
  
  try {
    // Executar todas as verificações
    results.essentialFiles = checkEssentialFiles();
    console.log('');
    
    results.inContentAds = checkInContentAds();
    
    results.buildSuccess = testBuild();
    console.log('');
    
    results.seoScore = validateSEO();
    console.log('');
    
    results.environmentConfig = checkEnvironmentConfig();
    console.log('');
    
    results.performanceOptimizations = checkPerformanceOptimizations();
    console.log('');
    
    // Gerar relatório final
    const report = generateFinalReport(results);
    
    // Exibir resultado final
    console.log('='.repeat(60));
    log('📊 RELATÓRIO FINAL DE OTIMIZAÇÃO', 'bold');
    console.log('='.repeat(60));
    
    log(`📈 Score Geral: ${report.overallScore}%`, report.overallScore >= 90 ? 'green' : report.overallScore >= 70 ? 'yellow' : 'red');
    
    if (report.overallScore >= 90) {
      logSuccess('EXCELENTE! Site pronto para produção 🚀');
    } else if (report.overallScore >= 70) {
      logWarning('BOM! Algumas melhorias recomendadas');
    } else {
      logError('ATENÇÃO! Correções necessárias antes do deploy');
    }
    
    console.log('\n📋 PRÓXIMOS PASSOS:');
    if (report.overallScore >= 90) {
      console.log('1. ✅ Fazer deploy em produção');
      console.log('2. ✅ Submeter sitemaps (npm run submit-sitemaps)');
      console.log('3. ✅ Monitorar métricas pós-deploy');
    } else {
      console.log('1. 🔧 Corrigir problemas identificados');
      console.log('2. 🔄 Executar script novamente');
      console.log('3. 📊 Atingir score ≥ 90% antes do deploy');
    }
    
    console.log(`\n📄 Relatório salvo em: optimization-report.json`);
    console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}\n`);
    
  } catch (error) {
    logError(`Erro durante otimização: ${error.message}`);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };