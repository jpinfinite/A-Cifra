# 📧 Script de Newsletter

## Como Usar

### 1. Instalar Dependência

```bash
npm install sib-api-v3-sdk
```

### 2. Configurar Credenciais

Certifique-se de ter no `.env.local`:

```env
BREVO_API_KEY=sua-chave-aqui
BREVO_LIST_ID=1
```

### 3. Personalizar Conteúdo

Edite `scripts/send-newsletter.js`:

- **Linha 17**: Assunto do email
- **Linhas 30-200**: Conteúdo HTML
- Substitua os links e textos pelos seus artigos

### 4. Executar

```bash
npm run newsletter
```

Ou diretamente:

```bash
node scripts/send-newsletter.js
```

## O que o Script Faz

1. ✅ Conecta com a API do Brevo
2. ✅ Cria uma campanha de email
3. ✅ Usa template HTML responsivo
4. ✅ Envia para sua lista de contatos
5. ✅ Retorna ID da campanha

## Personalização

### Alterar Assunto

```javascript
emailCampaign.subject = "🚀 Seu Novo Assunto Aqui";
```

### Alterar Remetente

```javascript
emailCampaign.sender = {
  name: "Seu Nome",
  email: "seu-email@dominio.com"
};
```

### Agendar Envio

Descomente e configure:

```javascript
emailCampaign.scheduledAt = '2025-11-10 10:00:00';
```

### Adicionar Artigos

Copie e cole este bloco no HTML:

```html
<div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 0 0 25px 0;">
  <h4 style="color: #0A1628; margin: 0 0 10px 0; font-size: 18px;">
    <a href="SEU_LINK" style="color: #0A1628; text-decoration: none;">
      🔥 Título do Seu Artigo
    </a>
  </h4>
  <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
    Resumo do artigo aqui...
  </p>
  <a href="SEU_LINK" 
     style="display: inline-block; margin-top: 10px; color: #D4AF37; text-decoration: none; font-weight: bold; font-size: 14px;">
    Ler mais →
  </a>
</div>
```

## Testar Antes de Enviar

### Opção 1: Enviar para Você Mesmo

Crie uma lista de teste no Brevo com apenas seu email.

### Opção 2: Modo Preview

No painel do Brevo, você pode visualizar antes de enviar.

### Opção 3: Teste de Spam

Use: https://www.mail-tester.com/

## Troubleshooting

### Erro: "API key not found"

Verifique se o `.env.local` existe e tem a chave correta.

### Erro: "List not found"

Confirme o ID da lista no painel do Brevo.

### Erro: "Invalid sender"

Verifique se o email do remetente está verificado no Brevo.

## Próximos Passos

1. ✅ Teste o script
2. 📝 Personalize o template
3. 📅 Agende envios regulares
4. 📊 Monitore métricas no Brevo
5. 🔄 Crie automações

## Dicas

- Envie sempre no mesmo dia/horário
- Teste diferentes assuntos
- Mantenha conteúdo relevante
- Monitore taxa de abertura
- Limpe lista de inativos mensalmente
