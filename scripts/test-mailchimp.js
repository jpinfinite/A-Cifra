#!/usr/bin/env node

/**
 * Script de Teste do Mailchimp - Blog A Cifra
 * 
 * Testa a integração completa com Mailchimp
 * 
 * Uso: node scripts/test-mailchimp.js
 */

const https = require('https');
require('dotenv').config({ path: '.env.local' });

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

// Verificar configurações do Mailchimp
function checkMailchimpConfig() {
  logStep('1.', 'Verificando configurações do Mailchimp...');
  
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  
  let configValid = true;
  
  if (apiKey) {
    logSuccess(`API Key configurada (${apiKey.substring(0, 8)}...)`);
    
    // Verificar formato da API key
    if (apiKey.includes('-')) {
      const extractedPrefix = apiKey.split('-')[1];
      logSuccess(`Server prefix extraído da API key: ${extractedPrefix}`);
      
      if (serverPrefix && serverPrefix !== extractedPrefix) {
        logWarning(`Server prefix manual (${serverPrefix}) difere do extraído (${extractedPrefix})`);
      }
    } else {
      logError('API Key em formato inválido (deve conter hífen)');
      configValid = false;
    }
  } else {
    logError('MAILCHIMP_API_KEY não configurada');
    configValid = false;
  }
  
  if (audienceId) {
    logSuccess(`Audience ID configurado: ${audienceId}`);
  } else {
    logError('MAILCHIMP_AUDIENCE_ID não configurado');
    configValid = false;
  }
  
  if (serverPrefix) {
    logSuccess(`Server prefix configurado: ${serverPrefix}`);
  } else {
    logWarning('MAILCHIMP_SERVER_PREFIX não configurado (usando padrão da API key)');
  }
  
  return configValid;
}

// Testar conexão com API do Mailchimp
async function testMailchimpConnection() {
  logStep('2.', 'Testando conexão com API do Mailchimp...');
  
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || apiKey.split('-')[1];
  
  return new Promise((resolve) => {
    const options = {
      hostname: `${serverPrefix}.api.mailchimp.com`,
      port: 443,
      path: '/3.0/ping',
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          logSuccess('Conexão com Mailchimp estabelecida');
          resolve(true);
        } else {
          logError(`Erro na conexão: ${res.statusCode} - ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      logError(`Erro de rede: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      logError('Timeout na conexão com Mailchimp');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Testar informações da audiência
async function testAudienceInfo() {
  logStep('3.', 'Verificando informações da audiência...');
  
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || apiKey.split('-')[1];
  
  return new Promise((resolve) => {
    const options = {
      hostname: `${serverPrefix}.api.mailchimp.com`,
      port: 443,
      path: `/3.0/lists/${audienceId}`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          const audienceData = JSON.parse(data);
          logSuccess(`Audiência encontrada: ${audienceData.name}`);
          logSuccess(`Total de membros: ${audienceData.stats.member_count}`);
          logSuccess(`Taxa de abertura média: ${audienceData.stats.open_rate}%`);
          resolve(true);
        } else {
          logError(`Erro ao buscar audiência: ${res.statusCode} - ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      logError(`Erro de rede: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      logError('Timeout ao buscar informações da audiência');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Testar inscrição via API local
async function testLocalNewsletterAPI() {
  logStep('4.', 'Testando API local de newsletter...');
  
  const testEmail = `teste+${Date.now()}@exemplo.com`;
  
  try {
    const response = await fetch('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        firstName: 'Teste Mailchimp'
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      logSuccess('API local funcionando corretamente');
      logSuccess(`Email de teste: ${testEmail}`);
      return true;
    } else {
      logError(`Erro na API local: ${result.message}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao testar API local: ${error.message}`);
    logWarning('Certifique-se de que o servidor está rodando (npm run dev)');
    return false;
  }
}

// Função principal
async function main() {
  console.log('🚀 TESTE COMPLETO DO MAILCHIMP - Blog A Cifra\n');
  
  const results = {
    config: false,
    connection: false,
    audience: false,
    localAPI: false
  };
  
  try {
    // Executar todos os testes
    results.config = checkMailchimpConfig();
    console.log('');
    
    if (results.config) {
      results.connection = await testMailchimpConnection();
      console.log('');
      
      if (results.connection) {
        results.audience = await testAudienceInfo();
        console.log('');
      }
    }
    
    results.localAPI = await testLocalNewsletterAPI();
    console.log('');
    
    // Relatório final
    console.log('='.repeat(60));
    log('📊 RELATÓRIO DE TESTE DO MAILCHIMP', 'bold');
    console.log('='.repeat(60));
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    
    log(`📈 Testes Aprovados: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
    
    console.log('\n📋 DETALHES:');
    console.log(`${results.config ? '✅' : '❌'} Configuração do Mailchimp`);
    console.log(`${results.connection ? '✅' : '❌'} Conexão com API`);
    console.log(`${results.audience ? '✅' : '❌'} Informações da Audiência`);
    console.log(`${results.localAPI ? '✅' : '❌'} API Local de Newsletter`);
    
    if (passedTests === totalTests) {
      logSuccess('\n🎉 MAILCHIMP CONFIGURADO E FUNCIONANDO PERFEITAMENTE!');
      console.log('\n📋 PRÓXIMOS PASSOS:');
      console.log('1. ✅ Configurar email de boas-vindas no Mailchimp');
      console.log('2. ✅ Ativar double opt-in (recomendado)');
      console.log('3. ✅ Criar primeira campanha de newsletter');
      console.log('4. ✅ Monitorar métricas de engajamento');
    } else {
      logError('\n⚠️  ALGUNS TESTES FALHARAM');
      console.log('\n📋 AÇÕES NECESSÁRIAS:');
      
      if (!results.config) {
        console.log('1. 🔧 Configurar variáveis de ambiente no .env.local');
        console.log('   - MAILCHIMP_API_KEY');
        console.log('   - MAILCHIMP_AUDIENCE_ID');
        console.log('   - MAILCHIMP_SERVER_PREFIX');
      }
      
      if (!results.connection) {
        console.log('2. 🔧 Verificar API key e server prefix');
      }
      
      if (!results.audience) {
        console.log('3. 🔧 Verificar Audience ID no Mailchimp');
      }
      
      if (!results.localAPI) {
        console.log('4. 🔧 Iniciar servidor local (npm run dev)');
      }
    }
    
    console.log(`\n📄 Guia completo: CONFIGURACAO_MAILCHIMP.md`);
    console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}\n`);
    
  } catch (error) {
    logError(`Erro durante os testes: ${error.message}`);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };