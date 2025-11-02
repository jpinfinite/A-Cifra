import { NextRequest, NextResponse } from 'next/server';

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

    // Integração com Brevo (Sendinblue)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error('Brevo credentials not configured');
      return NextResponse.json(
        { error: 'Serviço de newsletter não configurado' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo error:', error);
      
      // Se o contato já existe, considerar como sucesso
      if (error.code === 'duplicate_parameter') {
        return NextResponse.json(
          { 
            success: true,
            message: 'Email já cadastrado!' 
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erro ao processar inscrição' },
        { status: 500 }
      );
    }

    // EXEMPLO COM MAILCHIMP (descomente e configure):
    /*
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // ex: us1

    const response = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Mailchimp error:', error);
      return NextResponse.json(
        { error: 'Erro ao processar inscrição' },
        { status: 500 }
      );
    }
    */

    console.log('✅ Nova inscrição:', email);

    return NextResponse.json(
      { 
        success: true,
        message: 'Inscrição realizada com sucesso!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
