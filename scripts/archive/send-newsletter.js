require('dotenv').config({ path: '.env.local' });
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configurar API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

if (!process.env.BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY não encontrada no .env.local');
  process.exit(1);
}

const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

// Configurar campanha
const emailCampaign = new SibApiV3Sdk.CreateEmailCampaign();

const hoje = new Date().toLocaleDateString('pt-BR');
emailCampaign.name = `Newsletter A Cifra - ${hoje}`;
emailCampaign.subject = "🚀 Novidades Crypto da Semana | A Cifra";
emailCampaign.sender = {
  name: "A Cifra",
  email: "cifraaessenciacoin@gmail.com"
};
emailCampaign.type = "classic";

// Conteúdo HTML da newsletter
emailCampaign.htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%); padding: 50px 40px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 36px; font-weight: bold;">A Cifra</h1>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Newsletter Exclusiva</p>
            </td>
          </tr>
          
          <!-- Conteúdo Principal -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="color: #0A1628; margin: 0 0 15px 0; font-size: 28px;">Olá, Investidor! 👋</h2>
              <p style="color: #666; line-height: 1.8; margin: 0 0 30px 0; font-size: 16px;">
                Confira as principais novidades e análises do mercado crypto desta semana:
              </p>
              
              <!-- Artigo Destaque -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; padding: 30px; margin: 0 0 30px 0;">
                <div style="display: inline-block; background-color: #D4AF37; color: #0A1628; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 15px;">
                  DESTAQUE DA SEMANA
                </div>
                <h3 style="color: #0A1628; margin: 0 0 15px 0; font-size: 22px; line-height: 1.4;">
                  <a href="https://a-cifra.pages.dev/artigos" style="color: #0A1628; text-decoration: none;">
                    📈 Bitcoin Atinge Novo Patamar: Análise Completa
                  </a>
                </h3>
                <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 15px;">
                  Entenda os fatores que levaram o Bitcoin a atingir novos recordes e o que esperar para as próximas semanas. Análise técnica e fundamentalista completa.
                </p>
                <a href="https://a-cifra.pages.dev/artigos" 
                   style="display: inline-block; background-color: #D4AF37; color: #0A1628; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                  Ler Artigo Completo →
                </a>
              </div>
              
              <!-- Outros Artigos -->
              <h3 style="color: #0A1628; margin: 0 0 25px 0; font-size: 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                📚 Outros Artigos da Semana
              </h3>
              
              <!-- Artigo 1 -->
              <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 0 0 25px 0;">
                <h4 style="color: #0A1628; margin: 0 0 10px 0; font-size: 18px;">
                  <a href="https://a-cifra.pages.dev/artigos" style="color: #0A1628; text-decoration: none;">
                    💡 DeFi: Guia Completo para Iniciantes
                  </a>
                </h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
                  Aprenda os conceitos fundamentais de finanças descentralizadas e como começar com segurança.
                </p>
                <a href="https://a-cifra.pages.dev/artigos" 
                   style="display: inline-block; margin-top: 10px; color: #D4AF37; text-decoration: none; font-weight: bold; font-size: 14px;">
                  Ler mais →
                </a>
              </div>
              
              <!-- Artigo 2 -->
              <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 0 0 25px 0;">
                <h4 style="color: #0A1628; margin: 0 0 10px 0; font-size: 18px;">
                  <a href="https://a-cifra.pages.dev/artigos" style="color: #0A1628; text-decoration: none;">
                    🔒 5 Dicas Essenciais de Segurança Crypto
                  </a>
                </h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
                  Proteja seus investimentos com estas práticas fundamentais de segurança.
                </p>
                <a href="https://a-cifra.pages.dev/artigos" 
                   style="display: inline-block; margin-top: 10px; color: #D4AF37; text-decoration: none; font-weight: bold; font-size: 14px;">
                  Ler mais →
                </a>
              </div>
              
              <!-- Artigo 3 -->
              <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 0 0 35px 0;">
                <h4 style="color: #0A1628; margin: 0 0 10px 0; font-size: 18px;">
                  <a href="https://a-cifra.pages.dev/artigos" style="color: #0A1628; text-decoration: none;">
                    📊 Análise Técnica: Indicadores Essenciais
                  </a>
                </h4>
                <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
                  Domine os principais indicadores para tomar decisões de trading mais informadas.
                </p>
                <a href="https://a-cifra.pages.dev/artigos" 
                   style="display: inline-block; margin-top: 10px; color: #D4AF37; text-decoration: none; font-weight: bold; font-size: 14px;">
                  Ler mais →
                </a>
              </div>
              
              <!-- CTA Principal -->
              <div style="text-align: center; background-color: #f8f9fa; border-radius: 8px; padding: 35px; margin: 35px 0;">
                <h3 style="color: #0A1628; margin: 0 0 15px 0; font-size: 20px;">
                  Explore Mais Conteúdo
                </h3>
                <p style="color: #666; margin: 0 0 25px 0; font-size: 15px;">
                  Acesse nossa biblioteca completa de artigos sobre criptomoedas
                </p>
                <a href="https://a-cifra.pages.dev/artigos" 
                   style="display: inline-block; background-color: #0A1628; color: #D4AF37; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Ver Todos os Artigos
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #999; font-size: 14px; margin: 0 0 15px 0; line-height: 1.6;">
                Você está recebendo este email porque se inscreveu na newsletter A Cifra.<br>
                Enviamos conteúdo de qualidade sobre criptomoedas diretamente para você.
              </p>
              <p style="color: #999; font-size: 13px; margin: 0;">
                <a href="{{ unsubscribe }}" style="color: #D4AF37; text-decoration: none;">
                  Cancelar inscrição
                </a>
                &nbsp;|&nbsp;
                <a href="https://a-cifra.pages.dev" style="color: #D4AF37; text-decoration: none;">
                  Visitar site
                </a>
              </p>
              <p style="color: #ccc; font-size: 12px; margin: 20px 0 0 0;">
                © ${new Date().getFullYear()} A Cifra. Todos os direitos reservados.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Selecionar destinatários
emailCampaign.recipients = {
  listIds: [parseInt(process.env.BREVO_LIST_ID)]
};

// Opcional: Agendar para envio futuro
// emailCampaign.scheduledAt = '2025-11-10 10:00:00';

console.log('📧 Criando campanha de newsletter...');
console.log('📋 Nome:', emailCampaign.name);
console.log('📝 Assunto:', emailCampaign.subject);

// Enviar campanha
apiInstance.createEmailCampaign(emailCampaign)
  .then(function(data) {
    console.log('\n✅ Newsletter criada com sucesso!');
    console.log('🆔 ID da campanha:', data.id);
    console.log('🔗 Acesse o painel do Brevo para revisar e enviar');
    console.log('📊 https://app.brevo.com/campaign/list');
  })
  .catch(function(error) {
    console.error('\n❌ Erro ao criar newsletter:');
    console.error(error.response ? error.response.body : error);
  });
