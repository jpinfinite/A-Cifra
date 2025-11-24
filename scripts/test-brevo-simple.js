// Teste simples da API Key do Brevo
const BREVO_API_KEY = 'xsmtpsib-81e5e14dae3f866387c18e4c1d2fd7522b624f07e401d1d3c9662e9b3b0b4d05-kOfdRyrfYBvlqJ5R';

async function testBrevo() {
  console.log('🧪 Testando Brevo API Key...\n');

  try {
    // Testar informações da conta
    const response = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key válida!');
      console.log('Email da conta:', data.email);
      console.log('Plano:', data.plan?.[0]?.type || 'N/A');
      
      // Testar criação de lista
      console.log('\n📋 Criando lista de newsletter...');
      
      const listResponse = await fetch('https://api.brevo.com/v3/contacts/lists', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Newsletter A Cifra',
          folderId: 1
        }),
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        console.log('✅ Lista criada!');
        console.log('ID da lista:', listData.id);
        console.log('\n🔧 Atualize seu .env.local:');
        console.log(`BREVO_LIST_ID=${listData.id}`);
      } else {
        const listError = await listResponse.json();
        console.log('⚠️ Erro ao criar lista:', listError.message);
      }
      
    } else {
      const error = await response.text();
      console.log('❌ API Key inválida');
      console.log('Erro:', error);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testBrevo();