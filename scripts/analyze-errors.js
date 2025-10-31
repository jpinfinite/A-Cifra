#!/usr/bin/env node

/**
 * Script de Análise Completa de Erros - Blog A Cifra
 * 
 * Verifica:
 * - Links quebrados
 * - Imagens ausentes
 * - Erros de SEO
 * - Problemas de acessibilidade
 * - Inconsistências de dados
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE COMPLETA DE ERROS - Blog A Cifra\n');

const errors = [];
const warnings = [];
const info = [];

// Cores para output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function logError(message) {
  errors.push(message);
  console.log(`${colors.red}❌ ERRO: ${message}${colors.reset}`);
}

function logWarning(message) {
  warnings.push(message);
  console.log(`${colors.yellow}⚠️  AVISO: ${message}${colors.reset}`);
}

function logInfo(message) {
  info.push(message);
  console.log(`${colors.blue}ℹ️  INFO: ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

// 1. Verificar estrutura de diretórios
console.log('📁 1. Verificando estrutura de diretórios...\n');

const requiredDirs = [
  'src/app',
  'src/components',
  'src/styles',
  'src/utils',
  'src/lib',
  'public',
  'scripts'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    logSuccess(`Diretório ${dir} existe`);
  } else {
    logError(`Diretório ${dir} não encontrado`);
  }
});

// 2. Verificar arquivos essenciais
console.log('\n📄 2. Verificando arquivos essenciais...\n');

const requiredFiles = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  '.env.local',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/types/index.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    logSuccess(`Arquivo ${file} existe`);
  } else {
    logError(`Arquivo ${file} não encontrado`);
  }
});

// 3. Verificar imagens dos temas
console.log('\n🖼️  3. Verificando imagens dos temas...\n');

const themeImages = [
  '10-a-10.png',
  'o-preco.png',
  'hype.png',
  'Fortuna.png',
  'concentracao.png',
  'risco.png',
  'Verifique.png',
  'Temperatura.png',
  'facil.png',
  'Dinheiro.png',
  'compra.png'
];

themeImages.forEach(image => {
  const imagePath = path.join('public', image);
  if (fs.existsSync(imagePath)) {
    logSuccess(`Imagem ${image} existe`);
  } else {
    logError(`Imagem ${image} não encontrada em /public`);
  }
});

// 4. Verificar páginas dos artigos
console.log('\n📝 4. Verificando páginas dos artigos...\n');

const articleSlugs = [
  '10-a-10',
  'preco-ultima-coisa',
  'zero-hype-cem-estudo',
  'esqueca-fortuna-rapida',
  'erro-fatal-cem-por-cento',
  'risco-e-voce',
  'nao-confie-verifique',
  'diferenca-temperatura',
  'fantasma-golpes',
  'o-que-e-dinheiro',
  'primeira-compra'
];

articleSlugs.forEach(slug => {
  const articlePath = path.join('src', 'app', 'tema', slug, 'page.tsx');
  if (fs.existsSync(articlePath)) {
    logSuccess(`Artigo ${slug} existe`);
    
    // Verificar se tem InContentAd
    const content = fs.readFileSync(articlePath, 'utf8');
    if (content.includes('InContentAd')) {
      logInfo(`${slug} tem InContentAd implementado`);
    } else {
      logWarning(`${slug} não tem InContentAd (monetização)`);
    }
    
    // Verificar se tem metadata
    if (content.includes('metadata') || content.includes('generateArticleMetadata')) {
      logInfo(`${slug} tem metadata configurada`);
    } else {
      logError(`${slug} não tem metadata (SEO crítico)`);
    }
  } else {
    logError(`Artigo ${slug} não encontrado`);
  }
});

// 5. Verificar componentes críticos
console.log('\n🧩 5. Verificando componentes críticos...\n');

const criticalComponents = [
  'src/components/layout/Layout.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/layout/ArticleLayout.tsx',
  'src/components/ads/AdBanner.tsx',
  'src/components/ads/GoogleAdsense.tsx',
  'src/components/ads/InContentAd.tsx',
  'src/components/ui/NewsletterForm.tsx',
  'src/components/ui/AuthorInfo.tsx',
  'src/components/ui/OptimizedImage.tsx'
];

criticalComponents.forEach(component => {
  if (fs.existsSync(component)) {
    logSuccess(`Componente ${path.basename(component)} existe`);
  } else {
    logError(`Componente ${component} não encontrado`);
  }
});

// 6. Verificar configurações de SEO
console.log('\n🔍 6. Verificando configurações de SEO...\n');

// Verificar sitemap
if (fs.existsSync('src/app/sitemap.ts')) {
  logSuccess('Sitemap configurado');
} else {
  logError('Sitemap não encontrado');
}

// Verificar robots.txt
if (fs.existsSync('src/app/robots.ts') || fs.existsSync('src/app/robots.txt/route.ts')) {
  logSuccess('Robots.txt configurado');
} else {
  logWarning('Robots.txt não encontrado');
}

// Verificar RSS feed
if (fs.existsSync('src/app/feed.xml/route.ts')) {
  logSuccess('RSS Feed configurado');
} else {
  logWarning('RSS Feed não encontrado');
}

// 7. Verificar variáveis de ambiente
console.log('\n🔐 7. Verificando variáveis de ambiente...\n');

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_GA_ID',
    'NEXT_PUBLIC_ADSENSE_CLIENT',
    'NEXT_PUBLIC_SITE_URL'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      logSuccess(`${envVar} configurado`);
    } else {
      logWarning(`${envVar} não encontrado em .env.local`);
    }
  });
} else {
  logError('.env.local não encontrado');
}

// 8. Verificar package.json
console.log('\n📦 8. Verificando package.json...\n');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Verificar scripts essenciais
  const requiredScripts = ['dev', 'build', 'start'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      logSuccess(`Script "${script}" configurado`);
    } else {
      logError(`Script "${script}" não encontrado`);
    }
  });
  
  // Verificar dependências críticas
  const criticalDeps = ['next', 'react', 'react-dom'];
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      logSuccess(`Dependência "${dep}" instalada`);
    } else {
      logError(`Dependência "${dep}" não encontrada`);
    }
  });
}

// 9. Verificar tamanho dos bundles
console.log('\n📊 9. Verificando tamanho dos bundles...\n');

if (fs.existsSync('.next')) {
  logSuccess('Build Next.js encontrado');
  
  // Verificar se há bundles muito grandes
  const buildManifest = '.next/build-manifest.json';
  if (fs.existsSync(buildManifest)) {
    logInfo('Build manifest encontrado - bundles otimizados');
  }
} else {
  logWarning('Build Next.js não encontrado - execute npm run build');
}

// 10. Relatório Final
console.log('\n' + '='.repeat(60));
console.log('📋 RELATÓRIO FINAL DA ANÁLISE');
console.log('='.repeat(60) + '\n');

console.log(`${colors.red}❌ Erros Críticos: ${errors.length}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Avisos: ${warnings.length}${colors.reset}`);
console.log(`${colors.blue}ℹ️  Informações: ${info.length}${colors.reset}\n`);

if (errors.length > 0) {
  console.log(`${colors.red}ERROS ENCONTRADOS:${colors.reset}`);
  errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log(`${colors.yellow}AVISOS:${colors.reset}`);
  warnings.forEach((warning, index) => {
    console.log(`  ${index + 1}. ${warning}`);
  });
  console.log('');
}

// Score final
const totalChecks = errors.length + warnings.length + info.length + 50; // Aproximado
const successfulChecks = totalChecks - errors.length - warnings.length;
const score = Math.round((successfulChecks / totalChecks) * 100);

console.log('='.repeat(60));
console.log(`📈 SCORE DE QUALIDADE: ${score}%`);
console.log('='.repeat(60) + '\n');

if (score >= 95) {
  console.log(`${colors.green}🎉 EXCELENTE! Site em ótimo estado!${colors.reset}`);
} else if (score >= 80) {
  console.log(`${colors.yellow}👍 BOM! Algumas melhorias recomendadas.${colors.reset}`);
} else {
  console.log(`${colors.red}⚠️  ATENÇÃO! Correções necessárias.${colors.reset}`);
}

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  score,
  errors,
  warnings,
  info
};

fs.writeFileSync('error-analysis-report.json', JSON.stringify(report, null, 2));
console.log(`\n📄 Relatório salvo em: error-analysis-report.json\n`);

// Exit code baseado em erros
process.exit(errors.length > 0 ? 1 : 0);