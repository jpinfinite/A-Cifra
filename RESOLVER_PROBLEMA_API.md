# 🔧 Resolver Problema da API do Brevo

## ❌ Problema Atual

A API está retornando erro: **"Key not found" - unauthorized**

Isso significa que a API Key do Brevo não está sendo aceita.

---

## 🔍 Possíveis Causas

1. API Key expirada ou inválida
2. API Key com permissões insuficientes
3. Lista ID incorreta
4. Conta Brevo com problema

---

## ✅ Solução Passo a Passo

### 1. Verificar/Gerar Nova API Key no Brevo

1. **Acesse o Brevo:**
   ```
   https://app.brevo.com
   Login: cifraaessenciacoin@gmail.com
   ```

2. **Vá em Settings (Configurações):**
   - Clique no ícone de engrenagem (canto superior direito)
   - Ou acesse: https://app.brevo.com/settings/keys/api

3. **Gerar Nova API Key:**
   - Clique em "Generate a new API key"
   - Nome: "A Cifra Newsletter API"
   - Clique em "Generate"
   - **COPIE A CHAVE IMEDIATAMENTE** (ela só aparece uma vez!)

4. **Permissões Necessárias:**
   - Certifique-se de que a chave tem permissão para:
     - ✅ Contacts (Contatos)
     - ✅ Lists (Listas)
     - ✅ Campaigns (Campanhas)

---

### 2. Verificar ID da Lista

1. **No Brevo, vá em:**
   ```
   Contacts → Lists
   ```

2. **Clique na sua lista** (Newsletter A Cifra)

3. **Na URL, você verá algo como:**
   ```
   https://app.brevo.com/contact/list/id/X
   ```
   O número X é o seu List ID

4. **Anote o List ID**

---

### 3. Atualizar .env.local

1. **Abra o arquivo `.env.local`** na raiz do projeto

2. **Substitua com a NOVA API Key e List ID correto:**
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://acifra.com
   NEXT_PUBLIC_SITE_NAME="A Cifra"

   # Newsletter - Brevo (Sendinblue)
   BREVO_API_KEY=SUA_NOVA_API_KEY_AQUI
   BREVO_LIST_ID=SEU_LIST_ID_AQUI
   ```

3. **Salve o arquivo**

---

### 4. Reiniciar Servidor

1. **Pare o servidor:**
   - No terminal, pressione `Ctrl+C`

2. **Inicie novamente:**
   ```bash
   npm run dev
   ```

3. **Aguarde até ver:**
   ```
   ✓ Ready in X.Xs
   ```

---

### 5. Testar Novamente

1. **Execute o teste:**
   ```bash
   node scripts/test-newsletter.js
   ```

2. **Resultado esperado:**
   ```
   🎉 SUCESSO! A API está funcionando corretamente!
   ```

---

## 🧪 Teste Manual (Alternativa)

Se o script não funcionar, teste manualmente:

### Opção 1: Pelo Navegador

1. **Abra:** http://localhost:3002

2. **Role até a seção de Newsletter**

3. **Digite um email e clique em "Inscrever-se"**

4. **Verifique:**
   - Mensagem de sucesso aparece?
   - Email foi adicionado no Brevo?

### Opção 2: Pelo Postman/Insomnia

1. **Método:** POST

2. **URL:** http://localhost:3002/api/newsletter/subscribe

3. **Body (JSON):**
   ```json
   {
     "email": "teste@exemplo.com"
   }
   ```

4. **Enviar**

5. **Resposta esperada:**
   ```json
   {
     "success": true,
     "message": "Inscrição realizada com sucesso!"
   }
   ```

---

## 📋 Checklist de Verificação

- [ ] Nova API Key gerada no Brevo
- [ ] API Key copiada corretamente (sem espaços)
- [ ] List ID verificado e correto
- [ ] .env.local atualizado
- [ ] Servidor reiniciado
- [ ] Teste executado com sucesso

---

## 🔄 Se Ainda Não Funcionar

### Verificar Conta Brevo

1. **Acesse:** https://app.brevo.com

2. **Verifique:**
   - Conta está ativa?
   - Não há avisos ou alertas?
   - Plano gratuito ainda tem créditos?

### Verificar Logs Detalhados

1. **No terminal do servidor, procure por:**
   ```
   Brevo error: { ... }
   ```

2. **Anote a mensagem de erro completa**

3. **Possíveis erros:**
   - `unauthorized` → API Key inválida
   - `list_not_found` → List ID incorreto
   - `invalid_parameter` → Email inválido
   - `duplicate_parameter` → Email já existe (isso é OK!)

---

## 💡 Dica: Testar API Key Diretamente

Você pode testar a API Key diretamente no Brevo:

1. **Acesse:** https://developers.brevo.com/reference/getaccount

2. **Clique em "Try it"**

3. **Cole sua API Key**

4. **Clique em "Send"**

5. **Se retornar seus dados da conta = API Key válida ✅**

---

## 📞 Suporte Brevo

Se nada funcionar:

**Email:** support@brevo.com
**Chat:** Disponível no painel do Brevo
**Docs:** https://developers.brevo.com/

---

## ✅ Após Resolver

Quando tudo estiver funcionando:

1. **Atualize o Vercel** com as novas credenciais:
   - Settings → Environment Variables
   - Atualize BREVO_API_KEY
   - Atualize BREVO_LIST_ID (se mudou)
   - Redeploy

2. **Teste em produção**

3. **Configure automações no Brevo**

4. **Comece a coletar inscritos! 🚀**

---

**Siga este guia passo a passo e o problema será resolvido!**
