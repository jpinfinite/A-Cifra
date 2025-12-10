/**
 * Script de Teste - Resend Email
 * Testa se a configuração do Resend está funcionando
 * Execute: node scripts/test-resend.js
 */

require('dotenv').config();

async function testResend() {
  console.log('\n📧 Testando configuração do Resend...\n');
  console.log('═'.repeat(50));

  // Verificar se API key está configurada
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('\n❌ ERRO: RESEND_API_KEY não encontrada no .env\n');
    console.log('📋 Configure primeiro:');
    console.log('   1. Acesse: https://resend.com/api-keys');
    console.log('   2. Crie uma nova API Key');
    console.log('   3. Adicione no arquivo .env:');
    console.log('      RESEND_API_KEY=re_sua_chave_aqui\n');
    return;
  }

  if (!apiKey.startsWith('re_')) {
    console.log('\n⚠️  AVISO: API Key parece inválida (deve começar com "re_")\n');
    console.log(`   Atual: ${apiKey.substring(0, 10)}...`);
    console.log('   Esperado: re_xxxxx...\n');
  }

  console.log(`\n✅ API Key encontrada: ${apiKey.substring(0, 10)}...`);
  console.log('\n🔄 Tentando enviar email de teste...\n');

  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);

    // Email de teste
    const data = await resend.emails.send({
      from: 'A Cifra <newsletter@a-cifra.com.br>',
      to: ['seu-email@exemplo.com'], // ALTERE PARA SEU EMAIL!
      subject: '✅ Teste - Configuração Resend Funcionando!',
      html: `
        <h1>🎉 Sucesso!</h1>
        <p>A configuração do Resend está funcionando perfeitamente!</p>
        <p>Agora você pode enviar newsletters automaticamente.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Enviado via A Cifra - Sistema de Automação
        </p>
      `
    });

    console.log('✅ Email enviado com sucesso!');
    console.log(`   ID: ${data.id}`);
    console.log('\n📬 Verifique sua caixa de entrada!\n');

  } catch (error) {
    console.log('\n❌ Erro ao enviar email:\n');

    if (error.message.includes('401')) {
      console.log('   🔑 API Key inválida ou expirada');
      console.log('   Solução: Gere uma nova chave em https://resend.com/api-keys\n');
    } else if (error.message.includes('domain')) {
      console.log('   🌐 Domínio não verificado');
      console.log('   Solução: Verifique seu domínio em https://resend.com/domains');
      console.log('   OU use o domínio de teste: onboarding@resend.dev\n');
    } else {
      console.log(`   ${error.message}\n`);
    }
  }

  console.log('═'.repeat(50));
}

testResend().catch(console.error);
