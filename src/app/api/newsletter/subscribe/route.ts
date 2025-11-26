import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

// Simulação de banco de dados em memória (para desenvolvimento)
const subscribers = new Set<string>();

interface BrevoContactData {
  email: string;
  updateEnabled: boolean;
  attributes: {
    ORIGEM: string;
    DATA_INSCRICAO: string;
    SITE: string;
  };
  listIds?: number[];
}

interface BrevoErrorResponse {
  code?: string;
  message?: string;
}

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
      logger.newsletter('Raw body recebido:', rawBody.substring(0, 100));
      
      if (!rawBody) {
        throw new Error('Body vazio');
      }

      body = JSON.parse(rawBody);
      email = body?.email;
    } catch (parseError) {
      logger.error('Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { error: 'Dados inválidos enviados' },
        { status: 400, headers }
      );
    }

    // Log detalhado para debug
    logger.newsletter('Newsletter API chamada:', {
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
    logger.newsletter('Email adicionado localmente:', cleanEmail);

    // Tentar integração com Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID_NEWSLETTER || '11'; // Newsletter Gratuita
    let brevoSuccess = false;
    let brevoError: BrevoErrorResponse | Error | null = null;

    if (BREVO_API_KEY && BREVO_API_KEY.startsWith('xkeysib-')) {
      try {
        const contactData: BrevoContactData = {
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
          contactData.listIds = [parseInt(BREVO_LIST_ID)];
        }

        logger.newsletter('Enviando para Brevo:', { email: cleanEmail, listId: BREVO_LIST_ID });

        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify(contactData),
        });

        const brevoData = await brevoResponse.json() as BrevoErrorResponse;

        if (brevoResponse.ok) {
          logger.newsletter('Sucesso no Brevo:', cleanEmail);
          brevoSuccess = true;
        } else if (brevoData.code === 'duplicate_parameter') {
          logger.newsletter('Email já existe no Brevo:', cleanEmail);
          brevoSuccess = true; // Considerar sucesso
        } else {
          logger.error('Erro Brevo:', brevoResponse.status, brevoData);
          brevoError = brevoData;
          
          // Se for erro 503 (serviço indisponível), logar especificamente
          if (brevoResponse.status === 503) {
            logger.warn('API Brevo temporariamente indisponível - email salvo localmente');
          }
        }
      } catch (brevoException) {
        logger.error('Exceção ao conectar com Brevo:', brevoException);
        brevoError = brevoException instanceof Error ? brevoException : new Error('Unknown error');
        
        // Verificar se é erro de rede/timeout
        if (brevoException instanceof Error && brevoException.message.includes('fetch')) {
          logger.warn('Timeout ou erro de rede com Brevo - email salvo localmente');
        }
      }
    } else {
      logger.warn('Brevo não configurado - usando apenas local');
    }

    // Log final
    logger.newsletter('Inscrição processada:', {
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
    logger.error({ force: true }, 'Erro crítico na newsletter:', error);
    
    // Mesmo com erro, tentar salvar localmente
    try {
      const fallbackEmail = request.url.includes('email=') 
        ? decodeURIComponent(request.url.split('email=')[1]?.split('&')[0] || '')
        : '';
      
      if (fallbackEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fallbackEmail)) {
        subscribers.add(fallbackEmail.toLowerCase());
        logger.newsletter('Salvamento de emergência:', fallbackEmail);
      }
    } catch (fallbackError) {
      logger.error({ force: true }, 'Falha no fallback:', fallbackError);
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
