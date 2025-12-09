# 🔑 CONFIGURAÇÃO DA API DO TWITTER (X)

## 📋 Passo a Passo Completo

### 1️⃣ Criar Conta de Desenvolvedor

1. Acesse: https://developer.twitter.com/en/portal/dashboard
2. Faça login com sua conta do Twitter (@acifra_btc)
3. Clique em "Sign up for Free Account"
4. Preencha o formulário:
   - **Nome:** A Cifra Bot
   - **País:** Brasil
   - **Uso:** Automação de postagem de artigos
5. Aceite os termos e confirme seu email

### 2️⃣ Criar um App

1. No Dashboard, clique em "Create App" ou "Create Project"
2. Preencha:
   - **App name:** acifra-bot (ou qualquer nome único)
   - **Description:** Bot para postar artigos automaticamente
   - **Website:** https://a-cifra.com.br
3. Clique em "Create"

### 3️⃣ Gerar Credenciais

Após criar o app, você verá as credenciais:

1. **API Key** (Consumer Key)
2. **API Secret** (Consumer Secret)
3. **Bearer Token**

**⚠️ IMPORTANTE:** Salve essas credenciais em um lugar seguro!

### 4️⃣ Gerar Access Tokens

1. Na página do seu App, vá em "Keys and Tokens"
2. Role até "Access Token and Secret"
3. Clique em "Generate"
4. Salve:
   - **Access Token**
   - **Access Token Secret**

### 5️⃣ Configurar Permissões

1. Vá em "Settings" do seu App
2. Em "App permissions", selecione **"Read and Write"**
3. Salve as alterações

### 6️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Twitter API Credentials
TWITTER_API_KEY=sua_api_key_aqui
TWITTER_API_SECRET=sua_api_secret_aqui
TWITTER_ACCESS_TOKEN=seu_access_token_aqui
TWITTER_ACCESS_TOKEN_SECRET=seu_access_token_secret_aqui
TWITTER_BEARER_TOKEN=seu_bearer_token_aqui
```

**Ou configure diretamente no Windows:**

```powershell
# PowerShell
$env:TWITTER_API_KEY="sua_api_key"
$env:TWITTER_API_SECRET="sua_api_secret"
$env:TWITTER_ACCESS_TOKEN="seu_access_token"
$env:TWITTER_ACCESS_TOKEN_SECRET="seu_access_token_secret"
$env:TWITTER_BEARER_TOKEN="seu_bearer_token"
```

**Ou permanentemente:**

```powershell
# Adicionar ao perfil do PowerShell
notepad $PROFILE

# Adicione estas linhas:
$env:TWITTER_API_KEY="sua_api_key"
$env:TWITTER_API_SECRET="sua_api_secret"
$env:TWITTER_ACCESS_TOKEN="seu_access_token"
$env:TWITTER_ACCESS_TOKEN_SECRET="seu_access_token_secret"
$env:TWITTER_BEARER_TOKEN="seu_bearer_token"
```

## 🚀 Como Usar

### Testar a API

```bash
node scripts/twitter-api.js "Teste de postagem automática! 🚀 #Bitcoin"
```

### Postar Artigo

```bash
node scripts/postar-twitter.js "content/articles/seu-artigo.md"
```

### Automação Completa

O script `automacao-postagem.js` já está configurado para usar a API automaticamente.

## 📊 Limites da API (Free Tier)

- ✅ **1,500 tweets/mês** (gratuito)
- ✅ **50 tweets/dia**
- ✅ Perfeito para o A Cifra (2-5 artigos/dia)

## 🔒 Segurança

**NUNCA compartilhe suas credenciais!**

- ✅ Use variáveis de ambiente
- ✅ Adicione `.env` ao `.gitignore`
- ✅ Não commite credenciais no Git

## ❓ Troubleshooting

### Erro: "Credenciais não configuradas"
**Solução:** Configure as variáveis de ambiente conforme passo 6

### Erro: "403 Forbidden"
**Solução:** Verifique se as permissões do app estão em "Read and Write"

### Erro: "401 Unauthorized"
**Solução:** Verifique se as credenciais estão corretas

### Erro: "429 Too Many Requests"
**Solução:** Você atingiu o limite de tweets. Aguarde ou upgrade para plano pago.

## 🎯 Vantagens da API

✅ **100% Automatizado** - Sem intervenção manual
✅ **Confiável** - Não depende de Puppeteer/Selenium
✅ **Rápido** - Postagem instantânea
✅ **Profissional** - Método oficial do Twitter
✅ **Gratuito** - Até 1,500 tweets/mês
✅ **Sem Captcha** - Sem problemas de bot detection

## 📞 Suporte

Se tiver problemas:
1. Verifique o Dashboard do Twitter Developer
2. Confirme que o app tem permissões corretas
3. Teste com um tweet simples primeiro
4. Verifique os logs de erro

---

**Desenvolvido para A Cifra** 🚀
*Automação profissional de conteúdo cripto*
