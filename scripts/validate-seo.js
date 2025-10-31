#!/usr/bin/env node

/**
 * Script de Validação SEO para Blog A Cifra
 * Verifica structured data, meta tags, sitemaps e otimizações
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando Validação SEO - Blog A Cifra\n');

// 1. Verificar Structured Data
console.log('📊 1. STRUCTURED DATA');
const layoutFile = fs.readFileSync('src/app/layout.tsx', 'utf8');
const hasOrganizationSchema = layoutFile.includes('"@type": "Organization"');
const hasPersonSchema = layoutFile.includes('"@type": "Person"');
const hasWebsiteSchema = layoutFile.includes('"@type": "WebSite"');

console.log(`   ✅ Organization Schema: ${hasOrganizationSchema ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Person Schema: ${hasPersonSchema ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Website Schema: ${hasWebsiteSchema ? 'OK' : 'MISSING'}`);

// 2. Verificar Meta Tags
console.log('\n🏷️  2. META TAGS');
const hasMetaDescription = layoutFile.includes('description:');
const hasOpenGraph = layoutFile.includes('openGraph:');
const hasTwitterCard = layoutFile.includes('twitter:');
const hasCanonical = layoutFile.includes('canonical:');

console.log(`   ✅ Meta Description: ${hasMetaDescription ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Open Graph: ${hasOpenGraph ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Twitter Cards: ${hasTwitterCard ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Canonical URLs: ${hasCanonical ? 'OK' : 'MISSING'}`);

// 3. Verificar Sitemaps
console.log('\n🗺️  3. SITEMAPS');
const hasSitemap = fs.existsSync('src/app/sitemap.ts');
const hasNewsSitemap = fs.existsSync('src/app/news-sitemap.xml/route.ts');
const hasRSSFeed = fs.existsSync('src/app/feed.xml/route.ts');

console.log(`   ✅ Sitemap Principal: ${hasSitemap ? 'OK' : 'MISSING'}`);
console.log(`   ✅ News Sitemap: ${hasNewsSitemap ? 'OK' : 'MISSING'}`);
console.log(`   ✅ RSS Feed: ${hasRSSFeed ? 'OK' : 'MISSING'}`);

// 4. Verificar Artigos com Meta Descriptions
console.log('\n📝 4. ARTIGOS OTIMIZADOS');
const articlesDir = 'src/app/tema';
const articles = fs.readdirSync(articlesDir);
let optimizedArticles = 0;

articles.forEach(article => {
  const articlePath = path.join(articlesDir, article, 'page.tsx');
  if (fs.existsSync(articlePath)) {
    const content = fs.readFileSync(articlePath, 'utf8');
    const hasMetadata = content.includes('export const metadata') || content.includes('description:');
    if (hasMetadata) {
      optimizedArticles++;
      console.log(`   ✅ ${article}: META TAGS OK`);
    } else {
      console.log(`   ⚠️  ${article}: META TAGS MISSING`);
    }
  }
});

console.log(`\n   📊 Total: ${optimizedArticles}/${articles.length} artigos otimizados`);

// 5. Verificar Core Web Vitals Setup
console.log('\n⚡ 5. PERFORMANCE');
const hasWebVitals = fs.existsSync('src/components/performance/WebVitalsMonitor.tsx');
const hasOptimizedImage = fs.existsSync('src/components/ui/OptimizedImage.tsx');
const hasConnectionOptimizer = fs.existsSync('src/components/performance/ConnectionOptimizer.tsx');

console.log(`   ✅ Web Vitals Monitor: ${hasWebVitals ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Optimized Images: ${hasOptimizedImage ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Connection Optimizer: ${hasConnectionOptimizer ? 'OK' : 'MISSING'}`);

// 6. Verificar AdSense Setup
console.log('\n💰 6. MONETIZAÇÃO');
const hasAdBanner = fs.existsSync('src/components/ads/AdBanner.tsx');
const hasGoogleAdsense = fs.existsSync('src/components/ads/GoogleAdsense.tsx');
const hasAuthorInfo = fs.existsSync('src/components/ui/AuthorInfo.tsx');
const hasNewsletter = fs.existsSync('src/components/ui/NewsletterForm.tsx');

console.log(`   ✅ Ad Banner: ${hasAdBanner ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Google AdSense: ${hasGoogleAdsense ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Author Info (E-A-T): ${hasAuthorInfo ? 'OK' : 'MISSING'}`);
console.log(`   ✅ Newsletter Form: ${hasNewsletter ? 'OK' : 'MISSING'}`);

// 7. Score Final
console.log('\n🎯 SCORE FINAL');
const totalChecks = 15;
const passedChecks = [
  hasOrganizationSchema, hasPersonSchema, hasWebsiteSchema,
  hasMetaDescription, hasOpenGraph, hasTwitterCard, hasCanonical,
  hasSitemap, hasNewsSitemap, hasRSSFeed,
  hasWebVitals, hasOptimizedImage, hasConnectionOptimizer,
  hasAdBanner, hasGoogleAdsense, hasAuthorInfo, hasNewsletter
].filter(Boolean).length;

const score = Math.round((passedChecks / 17) * 100);
console.log(`   📊 Score SEO: ${score}%`);
console.log(`   📈 Artigos Otimizados: ${Math.round((optimizedArticles / articles.length) * 100)}%`);

if (score >= 90) {
  console.log('\n🎉 EXCELENTE! Blog pronto para Google Feed e AdSense');
} else if (score >= 75) {
  console.log('\n✅ BOM! Algumas otimizações ainda podem ser feitas');
} else {
  console.log('\n⚠️  ATENÇÃO! Várias otimizações são necessárias');
}

console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('   1. Testar com Google Rich Results Test');
console.log('   2. Validar Core Web Vitals com Lighthouse');
console.log('   3. Submeter sitemaps no Google Search Console');
console.log('   4. Aplicar para Google AdSense (se ainda não aprovado)');

console.log('\n✨ Validação concluída!\n');