import { NextRequest, NextResponse } from 'next/server';

// Simulação de banco de dados em memória (para desenvolvimento)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validação básica
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validação de formato de email mais robusta
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Verificar se já está inscrito
    if (subscribers.has(email.toLowerCase())) {
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

    if (BREVO_API_KEY) {
      try {
        // Primeiro, tentar adicionar contato sem lista específica
        const contactData: any = {
          email: email,
          updateEnabled: true,
          attributes: {
            ORIGEM: 'A Cifra Newsletter',
            DATA_INSCRICAO: new Date().toISOString().split('T')[0]
          }
        };

        // Adicionar lista se especificada
        if (BREVO_LIST_ID) {
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
          console.log('✅ Inscrito no Brevo:', email);
        } else {
          const error = await response.json();
          if (error.code === 'duplicate_parameter') {
            console.log('📧 Email já existe no Brevo:', email);
          } else {
            console.error('❌ Erro Brevo:', error);
            // Se falhar, continua funcionando localmente
          }
        }
      } catch (brevoError) {
        console.error('❌ Erro ao conectar com Brevo:', brevoError);
        // Continua mesmo se Brevo falhar
      }
    }

    // Adicionar à lista local (backup)
    subscribers.add(email.toLowerCase());

    // Log para monitoramento
    console.log('✅ Nova inscrição newsletter:', {
      email: email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Inscrição realizada com sucesso! Bem-vindo à comunidade A Cifra.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente em alguns minutos.' },
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
