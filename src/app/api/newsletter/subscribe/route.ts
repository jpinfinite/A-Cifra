import { NextRequest, NextResponse } from 'next/server';

// Simulação de banco de dados em memória (para desenvolvimento)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    // Parse do body com tratamento de erro
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { error: 'Dados inválidos enviados' },
        { status: 400 }
      );
    }

    const { email } = body;

    // Log para debug (sem expor dados sensíveis)
    console.log('🔍 Newsletter API chamada:', {
      timestamp: new Date().toISOString(),
      hasEmail: !!email,
      hasBrevoKey: !!process.env.BREVO_API_KEY,
      brevoListId: process.env.BREVO_LIST_ID,
      nodeEnv: process.env.NODE_ENV
    });

    // Validação básica
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Validação de formato de email mais robusta
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verificar se já está inscrito (simulação local)
    if (subscribers.has(cleanEmail)) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Email já cadastrado! Obrigado pelo interesse.' 
        },
        { status: 200 }
      );
    }

    // Tentar integração com Brevo (se configurado)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
    let brevoSuccess = false;

    if (BREVO_API_KEY && BREVO_API_KEY.startsWith('xkeysib-')) {
      try {
        const contactData: any = {
          email: cleanEmail,
          updateEnabled: true,
          attributes: {
            ORIGEM: 'A Cifra Newsletter',
            DATA_INSCRICAO: new Date().toISOString().split('T')[0]
          }
        };

        // Adicionar lista se especificada
        if (BREVO_LIST_ID && !isNaN(parseInt(BREVO_LIST_ID))) {
          contactData.listIds = [parseInt(BREVO_LIST_ID)];
        }

        const response = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify(contactData),
        });

        if (response.ok) {
          console.log('✅ Inscrito no Brevo:', cleanEmail);
          brevoSuccess = true;
        } else {
          const errorData = await response.json();
          if (errorData.code === 'duplicate_parameter') {
            console.log('📧 Email já existe no Brevo:', cleanEmail);
            brevoSuccess = true; // Considerar sucesso se já existe
          } else {
            console.error('❌ Erro Brevo:', errorData);
          }
        }
      } catch (brevoError) {
        console.error('❌ Erro ao conectar com Brevo:', brevoError);
      }
    } else {
      console.log('⚠️ Brevo não configurado ou chave inválida');
    }

    // Adicionar à lista local (sempre funciona como backup)
    subscribers.add(cleanEmail);

    // Log para monitoramento
    console.log('✅ Nova inscrição newsletter:', {
      email: cleanEmail,
      timestamp: new Date().toISOString(),
      brevoSuccess,
      userAgent: request.headers.get('user-agent')?.substring(0, 100),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // Resposta de sucesso
    const successMessage = brevoSuccess 
      ? 'Inscrição realizada com sucesso! Bem-vindo à comunidade A Cifra.'
      : 'Inscrição registrada! Configuraremos o envio em breve.';

    return NextResponse.json(
      { 
        success: true,
        message: successMessage
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    
    // Resposta de erro mais específica
    const errorMessage = error instanceof Error 
      ? `Erro interno: ${error.message}` 
      : 'Erro interno do servidor. Tente novamente em alguns minutos.';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
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
