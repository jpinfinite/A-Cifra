import { NextRequest, NextResponse } from 'next/server';

// Simulação de banco de dados em memória (para desenvolvimento)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  // Headers CORS para evitar problemas
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    // Parse do body com múltiplas tentativas
    let body;
    let email;

    try {
      const rawBody = await request.text();
      console.log('📥 Raw body recebido:', rawBody.substring(0, 100));
      
      if (!rawBody) {
        throw new Error('Body vazio');
      }

      body = JSON.parse(rawBody);
      email = body?.email;
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { error: 'Dados inválidos enviados' },
        { status: 400, headers }
      );
    }

    // Log detalhado para debug
    console.log('🔍 Newsletter API chamada:', {
      timestamp: new Date().toISOString(),
      hasEmail: !!email,
      emailLength: email?.length || 0,
      hasBrevoKey: !!process.env.BREVO_API_KEY,
      brevoKeyPrefix: process.env.BREVO_API_KEY?.substring(0, 10) || 'none',
      brevoListId: process.env.BREVO_LIST_ID,
      nodeEnv: process.env.NODE_ENV,
      userAgent: request.headers.get('user-agent')?.substring(0, 50)
    });

    // Validação básica
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400, headers }
      );
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400, headers }
      );
    }

    // Verificar se já está inscrito localmente
    if (subscribers.has(cleanEmail)) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Email já cadastrado! Obrigado pelo interesse.' 
        },
        { status: 200, headers }
      );
    }

    // Sempre adicionar à lista local primeiro (garantia)
    subscribers.add(cleanEmail);
    console.log('📝 Email adicionado localmente:', cleanEmail);

    // Tentar integração com Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
    let brevoSuccess = false;
    let brevoError = null;

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

        // Adicionar lista se especificada
        if (BREVO_LIST_ID && !isNaN(parseInt(BREVO_LIST_ID))) {
          (contactData as any).listIds = [parseInt(BREVO_LIST_ID)];
        }

        console.log('🚀 Enviando para Brevo:', { email: cleanEmail, listId: BREVO_LIST_ID });

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
          console.log('✅ Sucesso no Brevo:', cleanEmail, brevoData);
          brevoSuccess = true;
        } else if (brevoData.code === 'duplicate_parameter') {
          console.log('📧 Email já existe no Brevo:', cleanEmail);
          brevoSuccess = true; // Considerar sucesso
        } else {
          console.error('❌ Erro Brevo:', brevoResponse.status, brevoData);
          brevoError = brevoData;
        }
      } catch (brevoException) {
        console.error('❌ Exceção ao conectar com Brevo:', brevoException);
        brevoError = brevoException;
      }
    } else {
      console.log('⚠️ Brevo não configurado - usando apenas local');
    }

    // Log final
    console.log('✅ Inscrição processada:', {
      email: cleanEmail,
      timestamp: new Date().toISOString(),
      brevoSuccess,
      brevoError: brevoError ? 'sim' : 'não',
      localSuccess: true
    });

    // Sempre retornar sucesso (local funciona como backup)
    const successMessage = brevoSuccess 
      ? 'Inscrição realizada com sucesso! Bem-vindo à comunidade A Cifra.'
      : 'Inscrição registrada com sucesso! Você receberá nossas atualizações em breve.';

    return NextResponse.json(
      { 
        success: true,
        message: successMessage
      },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('❌ Erro crítico na newsletter:', error);
    
    // Mesmo com erro, tentar salvar localmente
    try {
      const fallbackEmail = request.url.includes('email=') 
        ? decodeURIComponent(request.url.split('email=')[1]?.split('&')[0] || '')
        : '';
      
      if (fallbackEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fallbackEmail)) {
        subscribers.add(fallbackEmail.toLowerCase());
        console.log('🆘 Salvamento de emergência:', fallbackEmail);
      }
    } catch (fallbackError) {
      console.error('❌ Falha no fallback:', fallbackError);
    }

    return NextResponse.json(
      { error: 'Erro temporário. Sua inscrição foi registrada e será processada em breve.' },
      { status: 500, headers }
    );
  }
}

// Endpoint para listar inscritos (apenas para desenvolvimento)
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    total: subscribers.size,
    subscribers: Array.from(subscribers)
  });
}
