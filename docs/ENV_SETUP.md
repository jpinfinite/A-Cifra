# 🔐 Guia de Configuração de Variáveis de Ambiente

## 📋 Configuração Rápida

### Opção 1: Configuração Interativa (Recomendado)
```bash
node scripts/setup-env.js
```
Este script irá guiar você passo a passo pela configuração.

### Opção 2: Configuração Manual
1. Copie o arquivo exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite `.env` com suas credenciais

---

## 🔑 Obter Credenciais

### 1. Cloudflare AI (Essencial) ⚡
**Você já tem essas credenciais!**
- API Token: `OjN9HeteBnyPWr41TOfubXQHDjiyVTsPpv7R6cM1`
- Account ID: `bcc4a32437bc8c7a9ec9c37872e2b23e`

### 2. GitHub Token (Para GitHub Actions) 🐙

**Como obter:**
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Classic"
3. Dê um nome: "A Cifra Automation"
4. Selecione permissões:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Clique em "Generate token"
6. **Copie o token** (você não verá novamente!)

**Como configurar no GitHub:**
1. Acesse: https://github.com/jpinfinite/A-Cifra/settings/secrets/actions
2. Clique em "New repository secret"
3. Nome: `GITHUB_TOKEN`
4. Valor: Cole o token gerado
5. Clique em "Add secret"

### 3. Resend (Para Email/Newsletter) 📧

**Como obter:**
1. Cadastre-se em: https://resend.com/signup
2. Confirme seu email
3. Acesse: https://resend.com/api-keys
4. Clique em "Create API Key"
5. Nome: "A Cifra Newsletter"
6. Copie a chave

**Custo:** Plano Free = 100 emails/dia (suficiente para começar)

### 4. Telegram Bot (Para Notificações) 📱

**Como obter:**
1. Abra o Telegram e procure por: `@BotFather`
2. Envie: `/newbot`
3. Siga as instruções (nome e username do bot)
4. **Copie o token** que ele te enviar

**Como obter Chat ID:**
1. Procure seu bot no Telegram e envie `/start`
2. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
3. Procure por `"chat":{"id":12345678}`
4. Esse número é seu `CHAT_ID`

### 5. Discord Webhook (Alternativa ao Telegram) 💬

**Como obter:**
1. Abra as configurações do seu servidor Discord
2. Vá em "Integrações" → "Webhooks"
3. Clique em "Novo Webhook"
4. Nome: "A Cifra Bot"
5. Escolha o canal
6. Copie o Webhook URL

---

## ⚙️ Configurar GitHub Secrets

Para que os GitHub Actions funcionem, você precisa configurar secrets:

1. Acesse: https://github.com/jpinfinite/A-Cifra/settings/secrets/actions

2. Adicione cada secret:

| Nome | Valor | Obrigatório? |
|------|-------|--------------|
| `CLOUDFLARE_API_TOKEN` | Seu token Cloudflare | ✅ Sim |
| `CLOUDFLARE_ACCOUNT_ID` | Seu Account ID | ✅ Sim |
| `GITHUB_TOKEN` | Seu GitHub PAT | ✅ Sim |
| `RESEND_API_KEY` | Sua chave Resend | ⚠️ Opcional |
| `TELEGRAM_BOT_TOKEN` | Token do bot | ⚠️ Opcional |
| `TELEGRAM_CHAT_ID` | ID do chat | ⚠️ Opcional |
| `DISCORD_WEBHOOK_URL` | URL do webhook | ⚠️ Opcional |

---

## 🧪 Testar Configuração

### Teste local (.env):
```bash
# Verificar se .env existe
cat .env

# Testar geração de imagem
node scripts/gerar-com-cloudflare.js
```

### Teste GitHub Actions:
1. Faça um commit qualquer
2. Acesse: https://github.com/jpinfinite/A-Cifra/actions
3. Verifique se os workflows estão rodando

---

## 🔒 Segurança

### ⚠️ NUNCA:
- ❌ Commite o arquivo `.env`
- ❌ Compartilhe seus tokens publicamente
- ❌ Coloque credenciais em código-fonte

### ✅ SEMPRE:
- ✅ Use `.env` para desenvolvimento local
- ✅ Use GitHub Secrets para CI/CD
- ✅ Rotacione tokens periodicamente
- ✅ Use tokens com permissões mínimas necessárias

---

## 📚 Variáveis Explicadas

| Variável | Usado Por | Propósito |
|----------|-----------|-----------|
| `CLOUDFLARE_API_TOKEN` | Geração de imagens | Autenticar na API Cloudflare AI |
| `CLOUDFLARE_ACCOUNT_ID` | Geração de imagens | Identificar sua conta |
| `GITHUB_TOKEN` | GitHub Actions | Criar issues, commits automáticos |
| `RESEND_API_KEY` | Newsletter | Enviar emails em lote |
| `TELEGRAM_BOT_TOKEN` | Notificações | Enviar mensagens no Telegram |
| `TELEGRAM_CHAT_ID` | Notificações | Identificar destinatário |
| `DISCORD_WEBHOOK_URL` | Notificações | Postar no Discord |

---

## ❓ Problemas Comuns

### "CLOUDFLARE_API_TOKEN is not defined"
**Solução:**
1. Verifique se o arquivo `.env` existe
2. Execute `node scripts/setup-env.js`
3. Para GitHub Actions, configure o Secret

### "GitHub Actions não estão rodando"
**Solução:**
1. Verifique se os Secrets estão configurados
2. Ative Actions em: Settings → Actions → General → Allow all actions

### "Telegram não envia mensagens"
**Solução:**
1. Verifique se você enviou `/start` para o bot
2. Confirme que o CHAT_ID está correto
3. Teste o token: `https://api.telegram.org/bot<TOKEN>/getMe`

---

## 📞 Suporte

Se tiver dúvidas, abra uma issue no repositório ou consulte a documentação oficial:
- Cloudflare AI: https://developers.cloudflare.com/ai/
- GitHub Actions: https://docs.github.com/actions
- Resend: https://resend.com/docs
- Telegram Bots: https://core.telegram.org/bots

---

✨ **Pronto!** Com tudo configurado, o sistema de automação estará 100% funcional.
