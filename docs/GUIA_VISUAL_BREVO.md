# 📸 Guia Visual: Como Configurar Automações no Brevo

## 🎯 Objetivo

Configurar email automático de boas-vindas que é enviado imediatamente quando alguém se inscreve na newsletter.

---

## 📋 Passo a Passo Detalhado

### 1. Acessar Automações

```
1. Login em: https://app.brevo.com
2. Email: cifraaessenciacoin@gmail.com
3. No menu lateral esquerdo, clique em "Automation"
4. Clique no botão azul "Create an automation"
```

---

### 2. Escolher Template

```
Opção 1: "Welcome email" (Recomendado)
- Template pronto para email de boas-vindas
- Já vem com estrutura básica

Opção 2: "Start from scratch"
- Criar do zero
- Mais flexibilidade
```

**Escolha:** Welcome email

---

### 3. Configurar Trigger (Gatilho)

```
Entry point: "Contact added to a list"

Configurações:
├─ List: Selecione "Newsletter A Cifra" (ou o nome da sua lista)
├─ When: "Immediately" (imediatamente)
└─ Apply to: "All contacts" (todos os contatos)
```

**O que isso faz:** Sempre que alguém se inscrever na lista, o email será enviado automaticamente.

---

### 4. Criar o Email

#### 4.1. Clicar em "Send an email"

```
No fluxo visual, você verá:
[Entry point] → [Send an email] → [Exit]

Clique no box "Send an email"
```

#### 4.2. Configurar Email

**Aba "Settings":**
```
├─ Campaign name: "Email de Boas-vindas"
├─ Subject: "👋 Bem-vindo à A Cifra! Sua jornada crypto começa aqui"
├─ Preview text: "Obrigado por se inscrever! Veja o que preparamos para você"
├─ Sender name: "A Cifra"
└─ Sender email: cifraaessenciacoin@gmail.com
```

**Aba "Design":**
```
1. Clique em "Design your email"
2. Escolha "Rich text editor" ou "Drag & drop editor"
3. Cole o HTML do template (arquivo: templates/email-boas-vindas.html)
```

**Como colar o HTML:**
```
1. Se usar "Rich text editor":
   - Clique em "</>" (ícone de código)
   - Cole todo o HTML
   - Clique em "Save"

2. Se usar "Drag & drop editor":
   - Arraste um bloco "HTML"
   - Cole o código
   - Salve
```

#### 4.3. Testar Email

```
1. Clique em "Preview and test"
2. Clique em "Send a test"
3. Digite seu email
4. Verifique:
   ✓ Assunto correto
   ✓ Design responsivo
   ✓ Links funcionando
   ✓ Imagens carregando
```

---

### 5. Ativar Automação

```
1. Clique em "Save and activate" (canto superior direito)
2. Revise o resumo
3. Confirme ativação
4. Status mudará para "Active" (verde)
```

---

## 🔄 Criar Sequência de Onboarding

### Email 2: Educacional (3 dias depois)

#### Estrutura do Fluxo:

```
[Entry point: Contact added to list]
    ↓
[Send email: Boas-vindas] (imediato)
    ↓
[Wait: 3 days]
    ↓
[Send email: Educacional]
    ↓
[Wait: 4 days]
    ↓
[Send email: Engajamento]
    ↓
[Exit]
```

#### Como Adicionar "Wait":

```
1. No fluxo, clique no "+" entre os emails
2. Selecione "Wait"
3. Configure:
   - Duration: "3 days"
   - Time: "10:00 AM"
4. Clique em "Save"
```

#### Como Adicionar Segundo Email:

```
1. Clique no "+" após o "Wait"
2. Selecione "Send an email"
3. Configure igual ao primeiro
4. Use o template educacional
5. Salve
```

---

## 📊 Monitorar Resultados

### Onde Ver Estatísticas:

```
1. Vá em "Automation"
2. Clique na automação criada
3. Aba "Statistics"

Métricas disponíveis:
├─ Emails enviados
├─ Taxa de abertura
├─ Taxa de cliques
├─ Cancelamentos
└─ Erros
```

### Metas de Performance:

```
Email de Boas-vindas:
├─ Taxa de abertura: > 50%
├─ Taxa de cliques: > 10%
└─ Cancelamentos: < 1%

Emails de Onboarding:
├─ Taxa de abertura: > 30%
├─ Taxa de cliques: > 5%
└─ Cancelamentos: < 2%
```

---

## 🎨 Personalização Avançada

### Usar Nome do Contato:

```html
<!-- No HTML, use: -->
Olá, {{ contact.FIRSTNAME | default: "Investidor" }}!

<!-- Resultado: -->
Se tem nome: "Olá, João!"
Se não tem: "Olá, Investidor!"
```

### Usar Data de Inscrição:

```html
{{ contact.CREATED_AT | date: "%d/%m/%Y" }}
```

### Condições (If/Else):

```html
{% if contact.FIRSTNAME %}
  Olá, {{ contact.FIRSTNAME }}!
{% else %}
  Olá!
{% endif %}
```

---

## 🔧 Automações Adicionais Recomendadas

### 1. Email de Reengajamento

**Trigger:** Contact hasn't opened in 30 days

```
Configuração:
├─ Entry point: "Contact hasn't opened"
├─ Period: "30 days"
├─ List: "Newsletter A Cifra"
└─ Send email: Template de reengajamento
```

### 2. Email de Aniversário

**Trigger:** Anniversary date

```
Configuração:
├─ Entry point: "Anniversary date"
├─ Date field: "CREATED_AT" (data de criação)
├─ Period: "1 year"
└─ Send email: Template de aniversário
```

### 3. Email Pós-Clique

**Trigger:** Contact clicked a link

```
Configuração:
├─ Entry point: "Contact clicked"
├─ Campaign: Selecione newsletter específica
├─ Link: URL do artigo
└─ Send email: Conteúdo relacionado
```

---

## ✅ Checklist de Configuração

Antes de ativar qualquer automação:

- [ ] Trigger configurado corretamente
- [ ] Email testado e aprovado
- [ ] Links funcionando
- [ ] Personalização testada
- [ ] Preview em mobile OK
- [ ] Assunto atrativo
- [ ] Sender correto
- [ ] Unsubscribe link presente
- [ ] Timing adequado
- [ ] Lista correta selecionada

---

## 🆘 Problemas Comuns

### "Automação não está enviando"

**Soluções:**
1. Verifique se está "Active" (verde)
2. Confirme que a lista está correta
3. Teste adicionando você mesmo à lista
4. Veja logs em "Statistics"

### "Email vai para spam"

**Soluções:**
1. Configure SPF e DKIM (Settings → Senders)
2. Evite palavras spam ("grátis", "ganhe")
3. Peça para adicionarem aos contatos
4. Use domínio próprio (não @gmail.com)

### "Taxa de abertura baixa"

**Soluções:**
1. Teste diferentes assuntos
2. Melhore preview text
3. Envie em horários diferentes
4. Segmente sua lista
5. Limpe contatos inativos

---

## 📚 Recursos Úteis

### Documentação Brevo:
- **Automações:** https://help.brevo.com/hc/en-us/articles/360000946299
- **Templates:** https://help.brevo.com/hc/en-us/articles/360000991960
- **Personalização:** https://help.brevo.com/hc/en-us/articles/360000991980

### Templates Prontos:
- `templates/email-boas-vindas.html`
- `docs/AUTOMACOES_EMAIL_MARKETING.md`
- `docs/EXEMPLO_PRIMEIRA_NEWSLETTER.md`

---

## 🎯 Próximos Passos

1. ✅ Configurar email de boas-vindas (AGORA)
2. 📅 Criar sequência de onboarding (Esta semana)
3. 📊 Monitorar métricas (Diariamente)
4. 🔄 Criar reengajamento (Próxima semana)
5. 🎉 Configurar aniversário (Quando tiver tempo)

---

**Tudo pronto para criar suas automações! 🚀**

Qualquer dúvida, consulte a documentação ou teste primeiro com sua própria inscrição.
