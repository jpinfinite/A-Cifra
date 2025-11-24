#!/usr/bin/env node

/**
 * Script para testar a integração com Brevo (Sendinblue)
 * 
 * Como usar:
 * 1. Configure BREVO_API_KEY e BREVO_LIST_ID no .env.local
 * 2. Execute: node scripts/test-newsletter-brevo.js
 */

require('dotenv').config({ path: '.env.local' });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

async function testBrevoConnection() {
  console.log('🧪 Testando conexão com Brevo...\n');

  // Verificar variáveis de ambiente
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY não configurada no .env.local');
    return;
  }

  if (!BREVO_LIST_ID) {
    console.error('❌ BREVO_LIST_ID não configurada no .env.local');
    return;
  }

  console.log('✅ Variáveis de ambiente configuradas');
  console.log(`📋 Lista ID: ${BREVO_LIST_ID}`);
  console.log(`🔑 API Key: ${BREVO_API_KEY.substring(0, 20)}...`);

  try {
    // Testar conexão com API
    console.log('\n🔍 Testando conexão com API...');
    
    const response = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });

    if (!response.ok) {
      console.error('❌ Erro na conexão:', response.status, response.statusText);
      return;
    }

    const account = await response.json();
    console.log('✅ Conexão bem-sucedida!');
    console.log(`👤 Conta: ${account.email}`);
    console.log(`📊 Plano: ${account.plan[0]?.type || 'N/A'}`);

    // Testar lista
    console.log('\n📋 Verificando lista...');
    
    const listResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}`, {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });

    if (!listResponse.ok) {
      console.error('❌ Lista não encontrada:', listResponse.status);
      console.log('💡 Crie uma lista no Brevo e use o ID correto');
      return;
    }

    const list = await listResponse.json();
    console.log('✅ Lista encontrada!');
    console.log(`📝 Nome: ${list.name}`);
    console.log(`👥 Contatos: ${list.totalSubscribers || 0}`);

    // Testar adição de contato (email de teste)
    console.log('\n📧 Testando adição de contato...');
    
    const testEmail = `test+${Date.now()}@a-cifra.com.br`;
    
    const addResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true,
        attributes: {
          NOME: 'Teste A Cifra',
          ORIGEM: 'Script de Teste'
        }
      }),
    });

    if (addResponse.ok) {
      console.log('✅ Contato adicionado com sucesso!');
      console.log(`📧 Email de teste: ${testEmail}`);
    } else {
      const error = await addResponse.json();
      console.log('⚠️ Erro ao adicionar contato:', error.message);
    }

    console.log('\n🎉 Teste concluído! Integração funcionando.');
    console.log('\n📋 Próximos passos:');
    console.log('1. Teste a newsletter no site: https://a-cifra.com.br');
    console.log('2. Verifique se os contatos aparecem no Brevo');
    console.log('3. Configure templates de email de boas-vindas');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

async function testNewsletterAPI() {
  console.log('\n🧪 Testando API local da newsletter...\n');

  try {
    const testEmail = `test+${Date.now()}@exemplo.com`;
    
    const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ API local funcionando!');
      console.log(`📧 Email testado: ${testEmail}`);
      console.log(`💬 Resposta: ${data.message}`);
    } else {
      console.log('❌ Erro na API local:', data.error);
    }

  } catch (error) {
    console.log('⚠️ API local não disponível (normal se não estiver rodando)');
    console.log('💡 Execute "npm run dev" para testar localmente');
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 A Cifra - Teste de Newsletter\n');
  
  await testBrevoConnection();
  await testNewsletterAPI();
  
  console.log('\n✨ Testes finalizados!');
}

runTests().catch(console.error);