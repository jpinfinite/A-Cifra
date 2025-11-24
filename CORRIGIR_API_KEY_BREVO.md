# 🔧 Corrigir API Key do Brevo

## ❌ Problema Identificado
A API Key atual está retornando erro 401 (não autorizada).

**API Key atual:** `xsmtpsib-81e5e14dae3f866387c18e4c1d2fd7522b624f07e401d1d3c9662e9b3b0b4d05-kOfdRyrfYBvlqJ5R`

## 🔍 Possíveis Causas

### 1. Chave SMTP vs API Key
- ❌ **SMTP Key:** Começa com `xsmtpsib-` (para envio de emails)
- ✅ **API Key:** Começa com `xkeysib-` (para API REST)

**Você está usando uma chave SMTP, mas precisamos da API Key!**

### 2. Como Obter a API Key Correta

**Passo a Passo:**

1. **Acesse:** https://app.brevo.com
2. **Login:** cifraaessenciacoin@gmail.com
3. **Vá em:** Configurações → Chaves de API
4. **Procure por:** Seção "API Keys" (não SMTP)
5. **Crie nova chave:**
   - Nome: "A Cifra Newsletter API"
   - Tipo: **API Key** (não SMTP)
6. **Copie a chave** que começa com `xkeysib-`

### 3. Diferenças entre as Chaves

| Tipo | Prefixo | Uso | Exemplo |
|------|---------|-----|---------|
| **SMTP** | `xsmtpsib-` | Envio direto de emails | ❌ Não serve para API |
| **API Key** | `xkeysib-` | API REST (nosso caso) | ✅ Correto para newsletter |

## 🛠️ Correção Imediata

### Opção 1: Obter API Key Correta
1. Siga os passos acima
2. Substitua no `.env.local`:
```env
BREVO_API_KEY=xkeysib-sua_nova_chave_aqui
```

### Opção 2: Usar Sistema Local (Temporário)
Se quiser testar imediatamente, remova as variáveis do Brevo:
```env
# BREVO_API_KEY=
# BREVO_LIST_ID=
```

O sistema continuará funcionando localmente até você configurar o Brevo.

## 🧪 Teste Após Correção

Execute o teste novamente:
```bash
node scripts/test-brevo-simple.js
```

**Resultado esperado:**
```
✅ API Key válida!
Email da conta: cifraaessenciacoin@gmail.com
Plano: free
```

## 📋 Próximos Passos

1. ✅ Obter API Key correta (xkeysib-)
2. ✅ Atualizar .env.local
3. ✅ Testar conexão
4. ✅ Criar lista de newsletter
5. ✅ Testar inscrição completa

## 💡 Dica Importante

**SMTP vs API:**
- **SMTP:** Para enviar emails diretamente (como Gmail)
- **API:** Para gerenciar contatos, listas, automações

Para newsletter, precisamos da **API Key** para:
- Adicionar contatos às listas
- Gerenciar inscrições
- Criar automações
- Acessar estatísticas

---

**Status:** ⏳ Aguardando API Key correta (xkeysib-)  
**Ação:** Obter chave API (não SMTP) no Brevo