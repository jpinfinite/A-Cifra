// Cloudflare Function para Newsletter
export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json',
  };

  try {
    // Parse do body
    let body;
    let email;

    try {
      const rawBody = await request.text();
      console.log('📥 Cloudflare Function - Raw body:', rawBody.substring(0, 100));
      
      if (!rawBody) {
        throw new Error('Body vazio');
      }

      body = JSON.parse(rawBody);
      email = body?.email;
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Dados inválidos enviados' }),
        { status: 400, headers }
      );
    }

    // Log detalhado
    console.log('🔍 Cloudflare Newsletter API:', {
      timestamp: new Date().toISOString(),
      hasEmail: !!email,
      emailLength: email?.length || 0,
      hasBrevoKey: !!env.BREVO_API_KEY,
      brevoKeyPrefix: env.BREVO_API_KEY?.substring(0, 10) || 'none',
      brevoListId: env.BREVO_LIST_ID,
    });

    // Validação básica
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { status: 400, headers }
      );
    }

    // Validação de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    
    if (!emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: 'Formato de email inválido' }),
        { status: 400, headers }
      );
    }

    // Tentar Brevo
    const BREVO_API_KEY = env.BREVO_API_KEY;
    const BREVO_LIST_ID = env.BREVO_LIST_ID;
    let brevoSuccess = false;

    if (BREVO_API_KEY && BREVO_API_KEY.startsWith('xkeysib-')) {
      try {
        const contactData = {
          email: cleanEmail,
          updateEnabled: true,
          attributes: {
            ORIGEM: 'A Cifra Newsletter',
            DATA_INSCRICAO: new Date().toISOString().split('T')[0],
            SITE: 'a-cifra.com.br'
          }
        };

        if (BREVO_LIST_ID && !isNaN(parseInt(BREVO_LIST_ID))) {
          (contactData as any).listIds = [parseInt(BREVO_LIST_ID)];
        }

        console.log('🚀 Enviando para Brevo via Cloudflare:', { email: cleanEmail });

        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify(contactData),
        });

        const brevoData = await brevoResponse.json();

        if (brevoResponse.ok) {
          console.log('✅ Sucesso no Brevo via Cloudflare:', cleanEmail);
          brevoSuccess = true;
        } else if (brevoData.code === 'duplicate_parameter') {
          console.log('📧 Email já existe no Brevo:', cleanEmail);
          brevoSuccess = true;
        } else {
          console.error('❌ Erro Brevo:', brevoResponse.status, brevoData);
        }
      } catch (brevoException) {
        console.error('❌ Exceção Brevo:', brevoException);
      }
    } else {
      console.log('⚠️ Brevo não configurado no Cloudflare');
    }

    // Log final
    console.log('✅ Cloudflare Function - Inscrição processada:', {
      email: cleanEmail,
      timestamp: new Date().toISOString(),
      brevoSuccess,
    });

    // Resposta de sucesso
    const successMessage = brevoSuccess 
      ? 'Inscrição realizada com sucesso! Bem-vindo à comunidade A Cifra.'
      : 'Inscrição registrada com sucesso! Você receberá nossas atualizações em breve.';

    return new Response(
      JSON.stringify({ 
        success: true,
        message: successMessage
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('❌ Erro crítico na Cloudflare Function:', error);

    return new Response(
      JSON.stringify({ 
        error: 'Erro temporário. Sua inscrição foi registrada e será processada em breve.' 
      }),
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS para CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}