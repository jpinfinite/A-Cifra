#!/usr/bin/env node

/**
 * Script de Teste de Performance do Site
 *
 * Testa velocidade e performance usando múltiplas ferramentas
 *
 * Uso:
 *   node scripts/test-performance.js
 */

const https = require('https');

// Configuração
const SITE_URL = process.env.SITE_URL || 'https://acifra.com.br';

console.log('🚀 Iniciando testes de performance...\n');
console.log(`📍 Site: ${SITE_URL}\n`);

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Teste básico de tempo de resposta
 */
function testResponseTime() {
  return new Promise((resolve) => {
    console.log(`${colors.cyan}⏱️  Testando tempo de resposta...${colors.reset}`);

    const startTime = Date.now();

    https.get(SITE_URL, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let status = colors.green + '✅ Excelente';
      if (responseTime > 500) status = colors.yellow + '⚠️  Bom';
      if (responseTime > 1000) status = colors.red + '❌ Lento';

      console.log(`   Tempo de resposta: ${responseTime}ms ${status}${colors.reset}`);
      console.log(`   Status HTTP: ${res.statusCode}`);
      console.log('');

      resolve({ responseTime, statusCode: res.statusCode });
    }).on('error', (err) => {
      console.error(`   ${colors.red}❌ Erro: ${err.message}${colors.reset}\n`);
      resolve({ error: err.message });
    });
  });
}

/**
 * Exibe links para ferramentas de teste
 */
function showTestingTools() {
  console.log(`${colors.blue}🔧 Ferramentas de Teste Recomendadas:${colors.reset}\n`);

  const tools = [
    {
      name: 'Google PageSpeed Insights',
      url: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`,
      description: 'Core Web Vitals e Performance Score'
    },
    {
      name: 'GTmetrix',
      url: `https://gtmetrix.com/?url=${encodeURIComponent(SITE_URL)}`,
      description: 'Análise detalhada com waterfall'
    },
    {
      name: 'WebPageTest',
      url: `https://www.webpagetest.org/?url=${encodeURIComponent(SITE_URL)}`,
      description: 'Teste avançado com filmstrip'
    },
    {
      name: 'Pingdom',
      url: `https://tools.pingdom.com/#${encodeURIComponent(SITE_URL)}`,
      description: 'Performance grade e análise'
    }
  ];

  tools.forEach((tool, index) => {
    console.log(`${colors.cyan}${index + 1}. ${tool.name}${colors.reset}`);
    console.log(`   ${tool.description}`);
    console.log(`   ${colors.blue}${tool.url}${colors.reset}\n`);
  });
}

/**
 * Exibe checklist de otimização
 */
function showOptimizationChecklist() {
  console.log(`${colors.blue}📋 Checklist de Otimização:${colors.reset}\n`);

  const checklist = [
    '✓ Imagens otimizadas (WebP, tamanho adequado)',
    '✓ Minificação de CSS e JavaScript',
    '✓ Compressão Gzip/Brotli habilitada',
    '✓ Cache de navegador configurado',
    '✓ CDN para assets estáticos',
    '✓ Lazy loading de imagens',
    '✓ Preload de recursos críticos',
    '✓ Remoção de JavaScript não utilizado',
    '✓ Font display: swap para fontes',
    '✓ Redução de redirects'
  ];

  checklist.forEach(item => {
    console.log(`   ${item}`);
  });
  console.log('');
}

/**
 * Exibe metas de performance
 */
function showPerformanceGoals() {
  console.log(`${colors.blue}🎯 Metas de Performance (Core Web Vitals):${colors.reset}\n`);

  console.log(`   ${colors.green}LCP (Largest Contentful Paint):${colors.reset}`);
  console.log(`      ✅ Bom: < 2.5s`);
  console.log(`      ⚠️  Precisa melhorar: 2.5-4s`);
  console.log(`      ❌ Ruim: > 4s\n`);

  console.log(`   ${colors.green}FID (First Input Delay):${colors.reset}`);
  console.log(`      ✅ Bom: < 100ms`);
  console.log(`      ⚠️  Precisa melhorar: 100-300ms`);
  console.log(`      ❌ Ruim: > 300ms\n`);

  console.log(`   ${colors.green}CLS (Cumulative Layout Shift):${colors.reset}`);
  console.log(`      ✅ Bom: < 0.1`);
  console.log(`      ⚠️  Precisa melhorar: 0.1-0.25`);
  console.log(`      ❌ Ruim: > 0.25\n`);
}

/**
 * Executa todos os testes
 */
async function runTests() {
  // Teste de tempo de resposta
  await testResponseTime();

  // Exibe ferramentas
  showTestingTools();

  // Exibe checklist
  showOptimizationChecklist();

  // Exibe metas
  showPerformanceGoals();

  console.log(`${colors.green}✅ Testes concluídos!${colors.reset}`);
  console.log(`\n${colors.cyan}💡 Dica: Execute os testes nas ferramentas acima para análise completa.${colors.reset}\n`);
}

// Executar
runTests().catch(console.error);
