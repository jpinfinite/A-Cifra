/**
 * Script de Teste da Newsletter
 * 
 * Testa a API de inscrição localmente
 */

const testEmail = 'teste@exemplo.com';
const apiUrl = 'http://localhost:3002/api/newsletter/subscribe';

console.log('🧪 Testando API de Newsletter...\n');
console.log(`📧 Email de teste: ${testEmail}`);
console.log(`🔗 URL da API: ${apiUrl}\n`);

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: testEmail }),
})
  .then(response => {
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    return response.json();
  })
  .then(data => {
    console.log('\n✅ Resposta da API:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n🎉 SUCESSO! A API está funcionando corretamente!');
      console.log('\n📋 Próximos passos:');
      console.log('1. Verifique no Brevo se o email foi adicionado');
      console.log('2. Acesse: https://app.brevo.com');
      console.log('3. Vá em Contacts → Lists');
      console.log('4. Procure por:', testEmail);
    } else {
      console.log('\n⚠️ A API retornou, mas houve um problema');
      console.log('Verifique as configurações do Brevo');
    }
  })
  .catch(error => {
    console.error('\n❌ ERRO ao testar API:');
    console.error(error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o servidor está rodando (npm run dev)');
    console.log('2. Confirme que está na porta correta (3002)');
    console.log('3. Verifique o arquivo .env.local');
    console.log('4. Veja os logs do servidor');
  });
