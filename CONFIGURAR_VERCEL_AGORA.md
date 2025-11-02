# ⚡ Configurar Vercel - Guia Rápido

## 🎯 Objetivo

Adicionar as variáveis de ambiente no Vercel para que a newsletter funcione em produção.

**Tempo:** 5 minutos

---

## 📋 Informações Necessárias

### API Key (copie exatamente):
```
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
```

### List ID:
```
2
```

---

## 🚀 Passo a Passo

### 1. Acessar Vercel

**URL:** https://vercel.com

1. Faça login
2. Selecione o projeto: **A-Cifra**

---

### 2. Ir para Environment Variables

1. Clique em **Settings** (no menu superior)
2. No menu lateral, clique em **Environment Variables**

---

### 3. Adicionar Primeira Variável

#### BREVO_API_KEY

1. **Clique no botão:** "Add New"

2. **Preencha:**
   ```
   Name: BREVO_API_KEY
   ```

3. **Value (cole exatamente):**
   ```
   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
   ```

4. **Selecione TODOS os ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Clique:** "Save"

---

### 4. Adicionar Segunda Variável

#### BREVO_LIST_ID

1. **Clique no botão:** "Add New" novamente

2. **Preencha:**
   ```
   Name: BREVO_LIST_ID
   ```

3. **Value:**
   ```
   2
   ```

4. **Selecione TODOS os ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Clique:** "Save"

---

### 5. Verificar Variáveis

Você deve ver agora:

```
BREVO_API_KEY
Production, Preview, Development
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

BREVO_LIST_ID
Production, Preview, Development
2
```

---

### 6. Fazer Redeploy

**IMPORTANTE:** As variáveis só funcionam após redeploy!

1. **Clique em:** "Deployments" (no menu superior)

2. **Encontre o último deployment** (primeiro da lista)

3. **Clique nos 3 pontinhos** (⋮) à direita

4. **Clique em:** "Redeploy"

5. **Confirme:** "Redeploy"

6. **Aguarde:** 2-3 minutos até ver "Ready"

---

## ✅ Verificação

### Sinais de Sucesso:

1. **Status do Deploy:** ✅ Ready (verde)
2. **Sem erros** nos logs
3. **Variáveis aparecem** em Settings → Environment Variables

---

## 🧪 Testar em Produção

### Após o deploy estar pronto:

1. **Acesse seu site:**
   ```
   https://a-cifra.pages.dev
   ```
   (ou o domínio do Vercel: https://seu-projeto.vercel.app)

2. **Role até a seção de Newsletter**

3. **Digite um email de teste**

4. **Clique em "Inscrever-se"**

5. **Verifique:**
   - ✅ Mensagem verde: "Inscrição realizada com sucesso!"
   - ✅ Email aparece no Brevo (Contacts → Lists)

---

## ❌ Se Não Funcionar

### Problema: "Erro ao processar inscrição"

**Soluções:**

1. **Verifique as variáveis:**
   - Vá em Settings → Environment Variables
   - Confirme que BREVO_API_KEY está correta
   - Confirme que BREVO_LIST_ID é "2"

2. **Verifique se fez redeploy:**
   - Deployments → Último deve estar "Ready"
   - Se não, faça redeploy novamente

3. **Veja os logs:**
   - Deployments → Clique no deployment
   - Vá em "Functions"
   - Procure por erros

4. **Limpe o cache:**
   - No navegador: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)

---

## 📊 Checklist

- [ ] Acessei Vercel
- [ ] Fui em Settings → Environment Variables
- [ ] Adicionei BREVO_API_KEY
- [ ] Adicionei BREVO_LIST_ID
- [ ] Selecionei todos os ambientes
- [ ] Salvei ambas as variáveis
- [ ] Fiz redeploy
- [ ] Aguardei deploy ficar "Ready"
- [ ] Testei no site em produção
- [ ] Email foi adicionado no Brevo

---

## 🎯 Próximo Passo

Após confirmar que funciona em produção:

**Abra:** PROXIMOS_PASSOS_EXECUTAR.md (seção 5)

**Criar:** Automação de boas-vindas no Brevo

**Tempo:** 15 minutos

---

## 💡 Dica

Se você tem domínio personalizado (a-cifra.pages.dev), teste nele.
Se não, use o domínio do Vercel (seu-projeto.vercel.app).

Ambos devem funcionar após o redeploy!

---

**Boa sorte! Você está quase terminando! 🚀**
