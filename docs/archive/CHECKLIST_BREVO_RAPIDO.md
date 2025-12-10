# ⚡ Checklist Rápido: Configurar Templates Brevo

**Tempo:** 15 minutos | **Dificuldade:** Fácil

---

## 🎯 Passo a Passo Simplificado

### 1. Criar Template de Boas-Vindas (5 min)

```
✅ Acesse: https://app.brevo.com
✅ Campaigns → Templates → Create new template
✅ Escolha "Paste HTML"
✅ Copie: templates/email-boas-vindas.html
✅ Cole no editor
✅ Nome: "Boas-Vindas A Cifra"
✅ Assunto: "🎉 Bem-vindo à A Cifra!"
✅ Save → Send test → Verificar email
```

### 2. Criar Automação de Boas-Vindas (5 min)

```
✅ Automation → Create automation
✅ Trigger: "Contact added to list"
✅ Lista: "Newsletter Gratuita" (#11)
✅ Delay: 0 minutos
✅ Add email → Selecione template "Boas-Vindas A Cifra"
✅ From: A Cifra <newsletter@a-cifra.com.br>
✅ Activate
```

### 3. Criar Template Newsletter Semanal (5 min)

```
✅ Campaigns → Templates → Create new template
✅ Escolha "Paste HTML"
✅ Copie: templates/email-newsletter-semanal.html
✅ Cole no editor
✅ Nome: "Newsletter Semanal A Cifra"
✅ Assunto: "📊 Resumo Cripto da Semana"
✅ Save
```

### 4. Agendar Primeira Newsletter (Opcional)

```
✅ Campaigns → Email campaigns → Create campaign
✅ Regular campaign
✅ Selecione template "Newsletter Semanal"
✅ Recipients: Lista #11
✅ Schedule: Segunda 8h
✅ Send
```

---

## 🧪 Testar Tudo

```bash
# 1. Teste a API (já fizemos)
✅ node test-brevo.js

# 2. Teste o formulário no site
✅ Acesse: http://localhost:3000
✅ Inscreva-se com seu email
✅ Verifique se recebeu email de boas-vindas

# 3. Verifique no Brevo
✅ https://app.brevo.com/contact/list
✅ Confirme que o contato foi adicionado
```

---

## 📊 URLs Importantes

| Recurso | URL |
|---------|-----|
| **Dashboard Brevo** | https://app.brevo.com |
| **Contatos** | https://app.brevo.com/contact/list |
| **Templates** | https://app.brevo.com/camp/lists/template |
| **Automações** | https://app.brevo.com/automation/list |
| **Campanhas** | https://app.brevo.com/campaign/list |
| **Estatísticas** | https://app.brevo.com/statistics/email |

---

## ✅ Pronto!

Agora você tem:
- ✅ Email de boas-vindas automático
- ✅ Template de newsletter semanal
- ✅ Sistema funcionando end-to-end

**Próximo passo:** Enviar sua primeira newsletter semanal! 🚀
