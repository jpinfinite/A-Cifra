#!/usr/bin/env node

/**
 * Script de Verificação de Anúncios
 * Verifica se os anúncios estão configurados corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração de anúncios...\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Verificar .env.local
console.log('1️⃣ Verificando .env.local...');
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('   ❌ Arquivo .env.local não encontrado!');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Verificar se tem os slots configurados
  const requiredVars = [
    'NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_1',
    'NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_2',
    'NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_3',
    'NEXT_PUBLIC_AD_SLOT_SIDEBAR',
    'NEXT_PUBLIC_AD_SLOT_HEADER'
  ];

  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      console.log(`   ❌ Variável ${varName} não encontrada`);
      hasErrors = true;
    } else if (envContent.includes(`${varName}=SUBSTITUA_PELO_ID_REAL`)) {
      console.log(`   ⚠️  ${varName} ainda não foi configurado (usando placeholder)`);
      hasWarnings = true;
    } else {
      console.log(`   ✅ ${varName} configurado`);
    }
  });
}

// 2. Verificar componentes de ads
console.log('\n2️⃣ Verificando componentes de anúncios...');
const adsPath = path.join(process.cwd(), 'src', 'components', 'ads');

const requiredComponents = [
  'InArticleAd.tsx',
  'SidebarAd.tsx',
  'index.ts'
];

requiredComponents.forEach(component => {
  const componentPath = path.join(adsPath, component);
  if (fs.existsSync(componentPath)) {
    console.log(`   ✅ ${component} existe`);
  } else {
    console.log(`   ❌ ${component} não encontrado`);
    hasErrors = true;
  }
});

// 3. Verificar página de artigo
console.log('\n3️⃣ Verificando página de artigo...');
const articlePagePath = path.join(process.cwd(), 'src', 'app', 'artigo', '[slug]', 'page.tsx');

if (!fs.existsSync(articlePagePath)) {
  console.log('   ❌ Página de artigo não encontrada!');
  hasErrors = true;
} else {
  const articleContent = fs.readFileSync(articlePagePath, 'utf-8');
  
  // Verificar imports
  if (articleContent.includes("import { InArticleAd, SidebarAd } from '@/components/ads'")) {
    console.log('   ✅ Imports de anúncios corretos');
  } else if (articleContent.includes('// import { InArticleAd, SidebarAd }')) {
    console.log('   ❌ Imports de anúncios estão comentados!');
    hasErrors = true;
  } else {
    console.log('   ❌ Imports de anúncios não encontrados!');
    hasErrors = true;
  }

  // Verificar uso dos componentes
  const inArticleCount = (articleContent.match(/<InArticleAd/g) || []).length;
  const sidebarCount = (articleContent.match(/<SidebarAd/g) || []).length;

  console.log(`   ℹ️  ${inArticleCount} anúncios In-Article encontrados`);
  console.log(`   ℹ️  ${sidebarCount} anúncios Sidebar encontrados`);

  if (inArticleCount === 0 && sidebarCount === 0) {
    console.log('   ⚠️  Nenhum componente de anúncio está sendo usado!');
    hasWarnings = true;
  }
}

// 4. Verificar layout.tsx (AdSense script)
console.log('\n4️⃣ Verificando script do AdSense no layout...');
const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');

if (!fs.existsSync(layoutPath)) {
  console.log('   ❌ Layout não encontrado!');
  hasErrors = true;
} else {
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  
  if (layoutContent.includes('pagead2.googlesyndication.com')) {
    console.log('   ✅ Script do AdSense encontrado');
  } else {
    console.log('   ❌ Script do AdSense não encontrado!');
    hasErrors = true;
  }

  if (layoutContent.includes('ca-pub-1151448515464841')) {
    console.log('   ✅ Publisher ID configurado');
  } else {
    console.log('   ⚠️  Publisher ID não encontrado');
    hasWarnings = true;
  }
}

// Resumo final
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO DA VERIFICAÇÃO\n');

if (hasErrors) {
  console.log('❌ Foram encontrados ERROS que precisam ser corrigidos!');
  console.log('   Revise os itens marcados com ❌ acima.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuração básica OK, mas há AVISOS:');
  console.log('   - Você precisa criar os slots no Google AdSense');
  console.log('   - Atualize o .env.local com os IDs reais');
  console.log('   - Consulte: INSTRUCOES_ADSENSE_SLOTS.md\n');
  process.exit(0);
} else {
  console.log('✅ Tudo configurado corretamente!');
  console.log('   Os anúncios devem aparecer após o deploy.\n');
  process.exit(0);
}
