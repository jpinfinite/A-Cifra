# 📨 Como Enviar Newsletter - Guia Completo

## Método 1: Interface Web do Brevo (Mais Fácil)

### Passo a Passo

1. **Acesse o Brevo**
   - Login em: https://app.brevo.com
   - Use: cifraaessenciacoin@gmail.com

2. **Criar Campanha**
   - Clique em **Campaigns** no menu
   - Clique em **Create a campaign**
   - Escolha **Email campaign**

3. **Configurar Campanha**
   - **Nome**: "Newsletter A Cifra - [Data]"
   - **Assunto**: Ex: "🚀 Novidades Crypto da Semana"
   - **Remetente**: 
     - Nome: A Cifra
     - Email: cifraaessenciacoin@gmail.com

4. **Criar Conteúdo**
   - Escolha um template ou crie do zero
   - Use o editor visual (drag & drop)
   - Adicione:
     - Logo do site
     - Resumo dos artigos da semana
     - Links para artigos completos
     - Call-to-action

5. **Selecionar Destinatários**
   - Escolha a lista "Newsletter A Cifra"
   - Ou segmente por interesse

6. **Agendar ou Enviar**
   - **Enviar agora**: Clique em "Send now"
   - **Agendar**: Escolha data e hora
   - Recomendado: Terça ou Quinta, 10h-14h

---

## Método 2: Via API (Automação)

### Script Node.js para Enviar Newsletter

Crie `scripts/send-newsletter.js`:

```javascript
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configurar API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

// Configurar campanha
const emailCampaign = new SibApiV3Sdk.CreateEmailCampaign();

emailCampaign.name = "Newsletter A Cifra - " + new Date().toLocaleDateString('pt-BR');
emailCampaign.subject = "🚀 Novidades Crypto da Semana | A Cifra";
emailCampaign.sender = {
  name: "A Cifra",
  email: "cifraaessenciacoin@gmail.com"
};
emailCampaign.type = "classic";

// Conteúdo HTML
emailCampaign.htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%); padding: 40px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 32px;">A Cifra</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0;">Newsletter Exclusiva</p>
            </td>
          </tr>
          
          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #0A1628; margin: 0 0 20px 0;">Olá, Investidor!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Confira as principais novidades do mercado crypto desta semana:
              </p>
              
              <!-- Artigo 1 -->
              <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 30px 0;">
                <h3 style="color: #0A1628; margin: 0 0 10px 0;">
                  <a href="https://a-cifra.pages.dev/artigo/seu-artigo" style="color: #0A1628; text-decoration: none;">
                    📈 Título do Artigo Principal
                  </a>
                </h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  Breve resumo do artigo que desperta curiosidade...
                </p>
                <a href="https://a-cifra.pages.dev/artigo/seu-artigo" 
                   style="display: inline-block; margin-top: 15px; color: #D4AF37; text-decoration: none; font-weight: bold;">
                  Ler mais →
                </a>
              </div>
              
              <!-- Artigo 2 -->
              <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 30px 0;">
                <h3 style="color: #0A1628; margin: 0 0 10px 0;">
                  <a href="https://a-cifra.pages.dev/artigo/outro-artigo" style="color: #0A1628; text-decoration: none;">
                    💡 Outro Artigo Interessante
                  </a>
                </h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  Mais um resumo interessante...
                </p>
                <a href="https://a-cifra.pages.dev/artigo/outro-artigo" 
                   style="display: inline-block; margin-top: 15px; color: #D4AF37; text-decoration: none; font-weight: bold;">
                  Ler mais →
                </a>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://a-cifra.pages.dev/artigos" 
                   style="display: inline-block; background-color: #D4AF37; color: #0A1628; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Ver Todos os Artigos
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 30px; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                Você está recebendo este email porque se inscreveu na newsletter A Cifra
              </p>
              <p style="color: #999; font-size: 14px; margin: 0;">
                <a href="{{ unsubscribe }}" style="color: #D4AF37; text-decoration: none;">
                  Cancelar inscrição
                </a>
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

// Enviar campanha
apiInstance.createEmailCampaign(emailCampaign)
  .then(function(data) {
    console.log('✅ Newsletter enviada com sucesso!');
    console.log('ID da campanha:', data.id);
  })
  .catch(function(error) {
    console.error('❌ Erro ao enviar newsletter:', error);
  });
```

### Como usar o script:

```bash
# Instalar dependência
npm install sib-api-v3-sdk

# Executar
node scripts/send-newsletter.js
```

---

## 📋 Template de Newsletter Semanal

### Estrutura Recomendada

```
📧 Assunto: 🚀 [Tema da Semana] | Newsletter A Cifra

📌 Introdução (2-3 linhas)
   - Cumprimento
   - Contexto da semana

📰 Artigo Principal (destaque)
   - Título chamativo
   - Resumo de 2-3 linhas
   - Link "Ler mais"

📚 Outros Artigos (2-3 artigos)
   - Títulos + resumos curtos
   - Links diretos

💡 Dica da Semana
   - Insight rápido
   - Conselho prático

🔗 Call-to-Action
   - Botão para ver todos os artigos
   - Convite para seguir nas redes sociais

👋 Despedida
   - Assinatura
   - Link para cancelar inscrição
```

---

## 🎨 Templates Prontos no Brevo

### Como usar templates:

1. Vá em **Campaigns** → **Templates**
2. Escolha um template responsivo
3. Personalize com suas cores:
   - Primária: #0A1628 (azul escuro)
   - Secundária: #D4AF37 (dourado)
   - Texto: #666666

4. Salve como template reutilizável

---

## 📅 Calendário de Envio Recomendado

### Frequência Ideal
- **Semanal**: Toda terça ou quinta
- **Quinzenal**: A cada 15 dias
- **Mensal**: Primeira semana do mês

### Melhores Horários
- **10h-11h**: Início do expediente
- **14h-15h**: Após almoço
- **Evitar**: Fins de semana e feriados

---

## 📊 Métricas para Acompanhar

### No Painel do Brevo:

1. **Taxa de Abertura** (Open Rate)
   - Bom: > 20%
   - Ótimo: > 30%

2. **Taxa de Cliques** (Click Rate)
   - Bom: > 2%
   - Ótimo: > 5%

3. **Taxa de Cancelamento**
   - Aceitável: < 0.5%
   - Atenção se: > 1%

---

## ✍️ Dicas de Conteúdo

### Assuntos que Funcionam:
- ✅ "🚀 Bitcoin atinge novo recorde"
- ✅ "💡 5 dicas para proteger suas crypto"
- ✅ "📊 Análise semanal do mercado"
- ✅ "🔥 Altcoins em alta esta semana"

### Evitar:
- ❌ Assuntos genéricos
- ❌ CAPS LOCK excessivo
- ❌ Muitos emojis
- ❌ Promessas irreais

---

## 🔄 Automação (Avançado)

### Email de Boas-vindas Automático

1. No Brevo, vá em **Automation**
2. Crie workflow:
   - Trigger: "Contato adicionado à lista"
   - Ação: Enviar email de boas-vindas
3. Personalize o email:
   - Agradeça pela inscrição
   - Apresente o site
   - Envie link para artigos populares

---

## 📧 Exemplo de Email de Boas-vindas

```
Assunto: 👋 Bem-vindo à Newsletter A Cifra!

Olá!

Obrigado por se inscrever na newsletter A Cifra! 🎉

Você agora faz parte de uma comunidade de investidores e entusiastas 
de criptomoedas que recebem:

✅ Análises semanais do mercado
✅ Notícias mais importantes
✅ Dicas de segurança
✅ Conteúdo exclusivo

Para começar, confira nossos artigos mais populares:

📌 [Link para artigo 1]
📌 [Link para artigo 2]
📌 [Link para artigo 3]

Nos vemos na próxima newsletter!

Abraço,
Equipe A Cifra
```

---

## 🆘 Problemas Comuns

### "Emails vão para spam"
- ✅ Configure SPF e DKIM no Brevo
- ✅ Use domínio próprio (não @gmail.com)
- ✅ Evite palavras como "grátis", "ganhe"
- ✅ Peça para adicionarem seu email aos contatos

### "Taxa de abertura baixa"
- ✅ Teste diferentes assuntos
- ✅ Envie em horários diferentes
- ✅ Segmente sua lista
- ✅ Limpe contatos inativos

### "Muitos cancelamentos"
- ✅ Reduza frequência
- ✅ Melhore qualidade do conteúdo
- ✅ Seja mais específico no assunto
- ✅ Ofereça opção de "menos emails"

---

## 📚 Recursos Úteis

- [Documentação Brevo](https://developers.brevo.com/)
- [Melhores práticas de email marketing](https://www.brevo.com/pt/blog/)
- [Gerador de assuntos](https://www.subjectline.com/)
- [Teste de spam](https://www.mail-tester.com/)

---

## ✅ Checklist Antes de Enviar

- [ ] Assunto atrativo e claro
- [ ] Conteúdo revisado (sem erros)
- [ ] Links testados
- [ ] Preview em mobile e desktop
- [ ] Remetente correto
- [ ] Lista de destinatários correta
- [ ] Link de cancelamento presente
- [ ] Horário adequado agendado
