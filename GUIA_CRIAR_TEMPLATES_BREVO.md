# 📧 Guia: Como Criar Templates no Brevo

**Data:** 25 de novembro de 2025  
**Tempo estimado:** 15-20 minutos

---

## 🎯 Templates Criados

1. ✅ **Email de Boas-Vindas** - `templates/email-boas-vindas.html`
2. ✅ **Newsletter Semanal** - `templates/email-newsletter-semanal.html`

---

## 📋 Passo a Passo no Brevo

### 1️⃣ Criar Template de Boas-Vindas

#### Passo 1: Acessar Templates
1. Acesse: https://app.brevo.com
2. No menu lateral, clique em **"Campaigns"** → **"Templates"**
3. Clique no botão **"Create a new template"**

#### Passo 2: Escolher Editor
1. Selecione **"Drag & Drop Editor"** ou **"Rich Text Editor"**
2. Ou escolha **"Paste HTML"** para usar nosso código pronto

#### Passo 3: Configurar Template

**Nome do Template:** `Boas-Vindas A Cifra`

**Assunto:** `🎉 Bem-vindo à A Cifra! Sua jornada cripto começa agora`

**Preheader:** `Obrigado por se juntar à nossa comunidade. Veja por onde começar!`

#### Passo 4: Colar o HTML
1. Se escolheu "Paste HTML", copie todo o conteúdo de `templates/email-boas-vindas.html`
2. Cole no editor
3. Clique em **"Save"**

#### Passo 5: Personalizar (Opcional)
- Substitua os links dos artigos pelos seus artigos reais
- Atualize os links das redes sociais
- Adicione imagens dos ícones sociais (ou use emojis)

#### Passo 6: Testar
1. Clique em **"Preview"** para ver como ficou
2. Clique em **"Send a test"** 
3. Digite seu email e envie um teste
4. Verifique se tudo está correto

---

### 2️⃣ Criar Template de Newsletter Semanal

#### Repita os mesmos passos acima, mas com:

**Nome do Template:** `Newsletter Semanal A Cifra`

**Assunto:** `📊 Resumo Cripto da Semana | A Cifra`

**Preheader:** `Bitcoin, Ethereum, notícias e as melhores oportunidades da semana`

**HTML:** Use o arquivo `templates/email-newsletter-semanal.html`

---

## 🤖 Configurar Automação de Boas-Vindas

### Passo 1: Criar Automação
1. No Brevo, vá em **"Automation"** → **"Create an automation"**
2. Escolha **"Welcome email"** ou **"Custom automation"**

### Passo 2: Configurar Trigger
1. **Trigger:** "Contact added to list"
2. **Lista:** Selecione "Newsletter Gratuita" (#11)
3. **Delay:** 0 minutos (enviar imediatamente)

### Passo 3: Adicionar Email
1. Clique em **"Add an email"**
2. Selecione o template **"Boas-Vindas A Cifra"**
3. Configure:
   - **From name:** A Cifra
   - **From email:** newsletter@a-cifra.com.br (ou seu email)
   - **Reply to:** contato@a-cifra.com.br

### Passo 4: Ativar
1. Revise o fluxo
2. Clique em **"Activate"**
3. Pronto! Agora todo novo inscrito recebe o email automaticamente

---

## 📅 Configurar Envio Semanal da Newsletter

### Opção 1: Envio Manual (Recomendado no início)

1. Vá em **"Campaigns"** → **"Email campaigns"**
2. Clique em **"Create a campaign"**
3. Escolha **"Regular campaign"**
4. Selecione o template **"Newsletter Semanal A Cifra"**
5. Configure:
   - **Recipients:** Lista "Newsletter Gratuita" (#11)
   - **Subject:** Personalize com a data atual
   - **Schedule:** Escolha dia e hora (ex: Segunda 8h)
6. Clique em **"Schedule"**

### Opção 2: Automação Semanal (Avançado)

1. Vá em **"Automation"**
2. Crie nova automação
3. **Trigger:** "Date-based" → "Recurring"
4. Configure:
   - **Frequency:** Weekly
   - **Day:** Monday
   - **Time:** 08:00 AM
5. Adicione o email da newsletter semanal
6. Ative a automação

---

## 🎨 Dicas de Personalização

### Variáveis do Brevo que você pode usar:

```
{{ contact.EMAIL }}           - Email do contato
{{ contact.FIRSTNAME }}       - Primeiro nome
{{ contact.LASTNAME }}        - Sobrenome
{{ contact.ORIGEM }}          - Origem da inscrição
{{ contact.DATA_INSCRICAO }}  - Data de inscrição
{{ unsubscribe }}             - Link de descadastro
```

### Exemplo de uso:
```html
<p>Olá, {{ contact.FIRSTNAME | default: "amigo" }}!</p>
```

---

## 📊 Métricas para Acompanhar

Após enviar os emails, acompanhe no Brevo:

### Email de Boas-Vindas
- **Taxa de abertura:** Meta >40%
- **Taxa de cliques:** Meta >10%
- **Taxa de descadastro:** Meta <1%

### Newsletter Semanal
- **Taxa de abertura:** Meta >25%
- **Taxa de cliques:** Meta >5%
- **Taxa de descadastro:** Meta <2%

---

## ✅ Checklist de Configuração

### Templates
- [ ] Template de Boas-Vindas criado
- [ ] Template de Newsletter Semanal criado
- [ ] Ambos testados e funcionando
- [ ] Links verificados
- [ ] Imagens carregando

### Automações
- [ ] Automação de Boas-Vindas configurada
- [ ] Automação ativada
- [ ] Email de teste recebido
- [ ] Fluxo validado

### Newsletter Semanal
- [ ] Primeira campanha agendada
- [ ] Lista de destinatários correta
- [ ] Assunto personalizado
- [ ] Preview verificado

---

## 🚀 Próximos Passos

### Semana 1
1. ✅ Criar templates
2. ✅ Configurar automação de boas-vindas
3. [ ] Enviar primeira newsletter semanal
4. [ ] Monitorar métricas

### Semana 2-4
1. [ ] Otimizar assuntos (A/B testing)
2. [ ] Ajustar conteúdo baseado em cliques
3. [ ] Criar segmentações (Bitcoin, DeFi, NFTs)
4. [ ] Adicionar mais automações

### Mês 2+
1. [ ] Criar newsletter premium
2. [ ] Implementar sequência de onboarding (5 emails)
3. [ ] Criar campanhas de reengajamento
4. [ ] Desenvolver lead magnets

---

## 🎯 Ideias de Conteúdo para Newsletters

### Newsletter Semanal (Toda Segunda 8h)
- Resumo das principais notícias
- Preços de BTC, ETH e top altcoins
- Top 3 artigos mais lidos
- Oportunidade da semana (afiliados)
- Dica rápida de segurança

### Emails Especiais
- **Alertas de mercado:** Bitcoin +10% ou -10%
- **Eventos importantes:** Halving, upgrades, ETFs
- **Guias exclusivos:** Ebooks, checklists
- **Promoções:** Cursos, produtos, afiliados

---

## 📧 Configurar Email Remetente

### Importante: Autenticar Domínio

1. No Brevo, vá em **"Settings"** → **"Senders & IP"**
2. Clique em **"Add a sender"**
3. Configure:
   - **Email:** newsletter@a-cifra.com.br
   - **Name:** A Cifra
4. Siga as instruções para autenticar o domínio (SPF, DKIM)
5. Isso melhora a entregabilidade dos emails

---

## 🔧 Troubleshooting

### Emails caindo no spam?
- ✅ Autentique o domínio (SPF, DKIM, DMARC)
- ✅ Evite palavras spam (grátis, ganhe dinheiro, urgente)
- ✅ Mantenha proporção texto/imagem equilibrada
- ✅ Sempre inclua link de descadastro
- ✅ Não compre listas de emails

### Taxa de abertura baixa?
- ✅ Melhore o assunto (use emojis, números, urgência)
- ✅ Teste diferentes horários de envio
- ✅ Personalize com nome do contato
- ✅ Faça A/B testing

### Taxa de cliques baixa?
- ✅ CTAs mais claros e visíveis
- ✅ Conteúdo mais relevante
- ✅ Menos links (foque no principal)
- ✅ Design mais atrativo

---

## 📚 Recursos Úteis

- **Brevo Academy:** https://academy.brevo.com
- **Brevo Help Center:** https://help.brevo.com
- **Email Design Best Practices:** https://www.campaignmonitor.com/resources/
- **Subject Line Tester:** https://www.subjectline.com

---

## 💡 Dicas Finais

1. **Consistência é chave:** Envie sempre no mesmo dia/hora
2. **Qualidade > Quantidade:** Melhor 1 email bom por semana que 5 ruins
3. **Segmente sua lista:** Nem todo mundo quer o mesmo conteúdo
4. **Teste sempre:** A/B testing de assuntos, CTAs, horários
5. **Monitore métricas:** Ajuste baseado em dados, não achismos
6. **Peça feedback:** Pergunte aos assinantes o que querem ver

---

**Criado por:** Agente A Cifra  
**Última atualização:** 25 de novembro de 2025  
**Versão:** 1.0

🎉 **Boa sorte com suas newsletters!**
