#!/usr/bin/env node

/**
 * Script para submeter sitemaps ao Google Search Console
 * 
 * Uso:
 * node scripts/submit-sitemaps.js
 * 
 * Nota: Este script faz ping para o Google informando sobre atualizações
 * nos sitemaps. O Google Search Console deve estar configurado separadamente.
 */

const https = require('https');
const { URL } = require('url');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://acifra.com';

// Verificar se estamos em desenvolvimento
const isDev = process.env.NODE_ENV === 'development';
const LOCAL_URL = 'http://localhost:3000';

const sitemaps = [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/news-sitemap.xml`,
  `${SITE_URL}/feed.xml`
];

async function pingGoogle(sitemapUrl) {
  return new Promise((resolve, reject) => {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    console.log(`📡 Enviando ping para: ${sitemapUrl}`);
    
    const request = https.get(pingUrl, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          console.log(`✅ Sucesso: ${sitemapUrl}`);
          resolve({ url: sitemapUrl, success: true });
        } else {
          console.log(`❌ Erro ${response.statusCode}: ${sitemapUrl}`);
          resolve({ url: sitemapUrl, success: false, status: response.statusCode });
        }
      });
    });
    
    request.on('error', (error) => {
      console.log(`❌ Erro de rede: ${sitemapUrl} - ${error.message}`);
      resolve({ url: sitemapUrl, success: false, error: error.message });
    });
    
    request.setTimeout(10000, () => {
      console.log(`⏰ Timeout: ${sitemapUrl}`);
      request.destroy();
      resolve({ url: sitemapUrl, success: false, error: 'timeout' });
    });
  });
}

async function pingBing(sitemapUrl) {
  return new Promise((resolve, reject) => {
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    console.log(`📡 Enviando ping para Bing: ${sitemapUrl}`);
    
    const request = https.get(pingUrl, (response) => {
      if (response.statusCode === 200) {
        console.log(`✅ Bing - Sucesso: ${sitemapUrl}`);
        resolve({ url: sitemapUrl, success: true });
      } else {
        console.log(`❌ Bing - Erro ${response.statusCode}: ${sitemapUrl}`);
        resolve({ url: sitemapUrl, success: false, status: response.statusCode });
      }
    });
    
    request.on('error', (error) => {
      console.log(`❌ Bing - Erro: ${sitemapUrl} - ${error.message}`);
      resolve({ url: sitemapUrl, success: false, error: error.message });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({ url: sitemapUrl, success: false, error: 'timeout' });
    });
  });
}

async function main() {
  console.log('🚀 Iniciando submissão de sitemaps...\n');
  
  if (isDev) {
    console.log('⚠️  Modo desenvolvimento detectado');
    console.log('📍 Para testar em produção, use: NODE_ENV=production npm run submit-sitemaps');
    console.log(`📍 Site de produção: ${SITE_URL}`);
    console.log(`📍 Testando localmente: ${LOCAL_URL}\n`);
    return;
  }
  
  console.log(`📍 Site: ${SITE_URL}\n`);
  
  const results = [];
  
  // Submeter para Google
  console.log('📊 Submetendo para Google Search Console:');
  for (const sitemap of sitemaps) {
    const result = await pingGoogle(sitemap);
    results.push({ ...result, engine: 'google' });
    
    // Aguardar um pouco entre requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Submetendo para Bing Webmaster Tools:');
  for (const sitemap of sitemaps) {
    const result = await pingBing(sitemap);
    results.push({ ...result, engine: 'bing' });
    
    // Aguardar um pouco entre requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Relatório final
  console.log('\n📋 Relatório Final:');
  console.log('==================');
  
  const googleResults = results.filter(r => r.engine === 'google');
  const bingResults = results.filter(r => r.engine === 'bing');
  
  console.log(`\n🔍 Google (${googleResults.filter(r => r.success).length}/${googleResults.length} sucessos):`);
  googleResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} ${result.url}`);
  });
  
  console.log(`\n🔍 Bing (${bingResults.filter(r => r.success).length}/${bingResults.length} sucessos):`);
  bingResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} ${result.url}`);
  });
  
  const totalSuccess = results.filter(r => r.success).length;
  const totalRequests = results.length;
  
  console.log(`\n🎯 Total: ${totalSuccess}/${totalRequests} submissões bem-sucedidas`);
  
  if (totalSuccess === totalRequests) {
    console.log('\n🎉 Todos os sitemaps foram submetidos com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Verificar Google Search Console em 24-48h');
    console.log('   2. Monitorar indexação dos artigos');
    console.log('   3. Verificar se não há erros de crawling');
  } else {
    console.log('\n⚠️  Algumas submissões falharam. Verifique os logs acima.');
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { pingGoogle, pingBing };