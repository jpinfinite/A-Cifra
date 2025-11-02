# 🤖 Automações de Email Marketing - Brevo

## 📋 Índice

1. [Email de Boas-vindas](#email-de-boas-vindas)
2. [Sequência de Onboarding](#sequência-de-onboarding)
3. [Email de Reengajamento](#email-de-reengajamento)
4. [Email de Aniversário](#email-de-aniversário)
5. [Como Configurar no Brevo](#como-configurar-no-brevo)

---

## 1. Email de Boas-vindas

### Quando enviar
**Imediatamente** após inscrição

### Objetivo
- Agradecer pela inscrição
- Apresentar o site
- Estabelecer expectativas
- Engajar desde o início

### Template

**Assunto:** 👋 Bem-vindo à A Cifra! Sua jornada crypto começa aqui

**Conteúdo:**

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f4;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%); padding: 50px 40px; text-align: center;">
    <h1 style="color: #D4AF37; margin: 0; font-size: 36px;">A Cifra</h1>
    <p style="color: white; margin: 15px 0 0 0; font-size: 16px;">Seu guia completo sobre criptomoedas</p>
  </div>
  
  <!-- Conteúdo -->
  <div style="background: white; padding: 50px 40px;">
    
    <h2 style="color: #0A1628; margin: 0 0 20px 0;">
      Olá! 👋
    </h2>
    
    <p style="color: #666; line-height: 1.8; font-size: 16px; margin: 0 0 20px 0;">
      <strong>Obrigado por se inscrever na Newsletter A Cifra!</strong> 🎉
    </p>
    
    <p style="color: #666; line-height: 1.8; font-size: 16px; margin: 0 0 30px 0;">
      Você agora faz parte de uma comunidade de investidores e entusiastas 
      que recebem conteúdo de qualidade sobre o mundo das criptomoedas.
    </p>
    
    <!-- O que você vai receber -->
    <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 25px; margin: 30px 0;">
      <h3 style="color: #0A1628; margin: 0 0 15px 0;">
        📬 O que você vai receber:
      </h3>
      <ul style="color: #666; line-height: 2; margin: 0; padding-left: 20px;">
        <li><strong>Análises semanais</strong> do mercado crypto</li>
        <li><strong>Notícias importantes</strong> em primeira mão</li>
        <li><strong>Guias práticos</strong> e tutoriais</li>
        <li><strong>Dicas de segurança</strong> essenciais</li>
        <li><strong>Conteúdo exclusivo</strong> para assinantes</li>
      </ul>
    </div>
    
    <!-- Artigos para começar -->
    <h3 style="color: #0A1628; margin: 40px 0 20px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
      🚀 Comece por aqui:
    </h3>
    
    <!-- Artigo 1 -->
    <div style="margin: 20px 0;">
      <h4 style="color: #0A1628; margin: 0 0 8px 0;">
        <a href="https://a-cifra.pages.dev/artigo/bitcoin-guia-completo-iniciantes-2025" 
           style="color: #0A1628; text-decoration: none;">
          📚 Bitcoin: Guia Completo para Iniciantes
        </a>
      </h4>
      <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
        Perfeito para quem está começando no mundo crypto
      </p>
    </div>
    
    <!-- Artigo 2 -->
    <div style="margin: 20px 0;">
      <h4 style="color: #0A1628; margin: 0 0 8px 0;">
        <a href="https://a-cifra.pages.dev/artigo/como-proteger-criptomoedas-guia-completo-seguranca" 
           style="color: #0A1628; text-decoration: none;">
          🔒 Como Proteger suas Criptomoedas
        </a>
      </h4>
      <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
        Segurança em primeiro lugar: proteja seus investimentos
      </p>
    </div>
    
    <!-- Artigo 3 -->
    <div style="margin: 20px 0;">
      <h4 style="color: #0A1628; margin: 0 0 8px 0;">
        <a href="https://a-cifra.pages.dev/artigo/o-que-e-blockchain-guia-iniciantes" 
           style="color: #0A1628; text-decoration: none;">
          💡 O que é Blockchain?
        </a>
      </h4>
      <p style="color: #666; line-height: 1.6; margin: 0; font-size: 14px;">
        Entenda a tecnologia que revolucionou as finanças
      </p>
    </div>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://a-cifra.pages.dev/artigos" 
         style="display: inline-block; background: #D4AF37; color: #0A1628; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Explorar Todos os Artigos
      </a>
    </div>
    
    <!-- Próxima newsletter -->
    <div style="background: #fff8e1; padding: 25px; border-radius: 8px; margin: 30px 0;">
      <p style="color: #666; line-height: 1.8; margin: 0; text-align: center;">
        📅 <strong>Próxima newsletter:</strong> Toda terça-feira às 10h<br>
        Fique de olho na sua caixa de entrada!
      </p>
    </div>
    
    <!-- Despedida -->
    <p style="color: #666; line-height: 1.8; margin: 30px 0 0 0;">
      Se tiver alguma dúvida ou sugestão, é só responder este email. 
      Adoramos ouvir nossos leitores!
    </p>
    
    <p style="color: #666; line-height: 1.8; margin: 20px 0 0 0;">
      Bem-vindo à comunidade! 🚀
    </p>
    
    <p style="color: #0A1628; font-weight: bold; margin: 10px 0 0 0;">
      Equipe A Cifra
    </p>
    
  </div>
  
  <!-- Footer -->
  <div style="background: #f8f9fa; padding: 30px; text-align: center;">
    <p style="color: #999; font-size: 13px; margin: 0;">
      <a href="https://a-cifra.pages.dev" style="color: #D4AF37; text-decoration: none;">
        Visitar site
      </a>
      |
      <a href="{{ unsubscribe }}" style="color: #D4AF37; text-decoration: none;">
        Cancelar inscrição
      </a>
    </p>
  </div>
  
</body>
</html>
```

---

## 2. Sequência de Onboarding

### Email 2: Educação (3 dias após inscrição)

**Assunto:** 📚 Os 5 conceitos essenciais que todo investidor crypto precisa saber

**Conteúdo:**

```html
<div style="padding: 40px; background: white;">
  <h2 style="color: #0A1628;">Olá novamente! 👋</h2>
  
  <p style="color: #666; line-height: 1.8;">
    Já se passaram alguns dias desde que você se juntou à nossa comunidade. 
    Esperamos que esteja aproveitando o conteúdo!
  </p>
  
  <p style="color: #666; line-height: 1.8;">
    Hoje, queremos compartilhar os <strong>5 conceitos essenciais</strong> 
    que todo investidor crypto precisa dominar:
  </p>
  
  <!-- Conceito 1 -->
  <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 25px 0;">
    <h3 style="color: #0A1628; margin: 0 0 10px 0;">
      1️⃣ Blockchain
    </h3>
    <p style="color: #666; line-height: 1.6; margin: 0;">
      A tecnologia fundamental por trás de todas as criptomoedas.
    </p>
    <a href="https://a-cifra.pages.dev/artigo/o-que-e-blockchain-guia-iniciantes" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">
      Entender Blockchain →
    </a>
  </div>
  
  <!-- Conceito 2 -->
  <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 25px 0;">
    <h3 style="color: #0A1628; margin: 0 0 10px 0;">
      2️⃣ Carteiras Digitais
    </h3>
    <p style="color: #666; line-height: 1.6; margin: 0;">
      Como armazenar suas criptomoedas com segurança.
    </p>
    <a href="https://a-cifra.pages.dev/artigo/carteiras-digitais-tipos-e-seguranca" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">
      Aprender sobre Wallets →
    </a>
  </div>
  
  <!-- Conceito 3 -->
  <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 25px 0;">
    <h3 style="color: #0A1628; margin: 0 0 10px 0;">
      3️⃣ DeFi (Finanças Descentralizadas)
    </h3>
    <p style="color: #666; line-height: 1.6; margin: 0;">
      O futuro das finanças sem intermediários.
    </p>
    <a href="https://a-cifra.pages.dev/artigo/defi-revolucionando-financas-tradicionais" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">
      Descobrir DeFi →
    </a>
  </div>
  
  <!-- Conceito 4 -->
  <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 25px 0;">
    <h3 style="color: #0A1628; margin: 0 0 10px 0;">
      4️⃣ Análise de Mercado
    </h3>
    <p style="color: #666; line-height: 1.6; margin: 0;">
      Como avaliar projetos antes de investir.
    </p>
    <a href="https://a-cifra.pages.dev/artigo/analise-fundamentalista-avaliar-projetos-cripto" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">
      Aprender a Analisar →
    </a>
  </div>
  
  <!-- Conceito 5 -->
  <div style="border-left: 4px solid #D4AF37; padding-left: 20px; margin: 25px 0;">
    <h3 style="color: #0A1628; margin: 0 0 10px 0;">
      5️⃣ Segurança
    </h3>
    <p style="color: #666; line-height: 1.6; margin: 0;">
      Proteja seus investimentos contra ameaças.
    </p>
    <a href="https://a-cifra.pages.dev/artigo/como-proteger-criptomoedas-guia-completo-seguranca" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">
      Garantir Segurança →
    </a>
  </div>
  
  <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
    <p style="color: #666; margin: 0 0 20px 0;">
      💡 <strong>Dica:</strong> Salve este email para consultar sempre que precisar!
    </p>
    <a href="https://a-cifra.pages.dev/categoria/educacao" 
       style="display: inline-block; background: #D4AF37; color: #0A1628; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Ver Mais Conteúdo Educacional
    </a>
  </div>
  
  <p style="color: #666; line-height: 1.8; margin: 30px 0 0 0;">
    Continue aprendendo! 📚
  </p>
  
  <p style="color: #0A1628; font-weight: bold;">
    Equipe A Cifra
  </p>
</div>
```

---

### Email 3: Engajamento (7 dias após inscrição)

**Assunto:** 🎯 Qual é o seu objetivo com criptomoedas?

**Conteúdo:**

```html
<div style="padding: 40px; background: white;">
  <h2 style="color: #0A1628;">Olá! 👋</h2>
  
  <p style="color: #666; line-height: 1.8;">
    Você está conosco há uma semana e queremos conhecer você melhor!
  </p>
  
  <p style="color: #666; line-height: 1.8;">
    <strong>Qual é o seu principal objetivo com criptomoedas?</strong>
  </p>
  
  <!-- Opções -->
  <div style="margin: 30px 0;">
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
      <h3 style="color: #0A1628; margin: 0 0 10px 0;">
        💰 Investimento de Longo Prazo
      </h3>
      <p style="color: #666; margin: 0 0 15px 0;">
        Construir patrimônio ao longo dos anos
      </p>
      <a href="https://a-cifra.pages.dev/categoria/analises" 
         style="color: #D4AF37; text-decoration: none; font-weight: bold;">
        Ver Análises de Investimento →
      </a>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
      <h3 style="color: #0A1628; margin: 0 0 10px 0;">
        📈 Trading Ativo
      </h3>
      <p style="color: #666; margin: 0 0 15px 0;">
        Aproveitar movimentos de curto prazo
      </p>
      <a href="https://a-cifra.pages.dev/artigo/analise-tecnica-indicadores-essenciais-cripto" 
         style="color: #D4AF37; text-decoration: none; font-weight: bold;">
        Aprender Análise Técnica →
      </a>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
      <h3 style="color: #0A1628; margin: 0 0 10px 0;">
        🎓 Aprendizado
      </h3>
      <p style="color: #666; margin: 0 0 15px 0;">
        Entender a tecnologia e o mercado
      </p>
      <a href="https://a-cifra.pages.dev/categoria/educacao" 
         style="color: #D4AF37; text-decoration: none; font-weight: bold;">
        Explorar Conteúdo Educacional →
      </a>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
      <h3 style="color: #0A1628; margin: 0 0 10px 0;">
        🔒 Segurança
      </h3>
      <p style="color: #666; margin: 0 0 15px 0;">
        Proteger meus investimentos
      </p>
      <a href="https://a-cifra.pages.dev/categoria/seguranca" 
         style="color: #D4AF37; text-decoration: none; font-weight: bold;">
        Ver Guias de Segurança →
      </a>
    </div>
    
  </div>
  
  <div style="background: #fff8e1; border-left: 4px solid #D4AF37; padding: 20px; margin: 30px 0;">
    <p style="color: #666; line-height: 1.8; margin: 0;">
      💬 <strong>Responda este email</strong> contando seus objetivos! 
      Adoramos conversar com nossa comunidade e podemos te ajudar 
      com conteúdo personalizado.
    </p>
  </div>
  
  <p style="color: #666; line-height: 1.8; margin: 30px 0 0 0;">
    Estamos aqui para ajudar! 🚀
  </p>
  
  <p style="color: #0A1628; font-weight: bold;">
    Equipe A Cifra
  </p>
</div>
```

---

## 3. Email de Reengajamento

### Para quem não abre emails há 30 dias

**Assunto:** 😢 Sentimos sua falta! Aqui está o que você perdeu

**Conteúdo:**

```html
<div style="padding: 40px; background: white;">
  <h2 style="color: #0A1628;">Olá! 👋</h2>
  
  <p style="color: #666; line-height: 1.8; font-size: 18px;">
    <strong>Sentimos sua falta!</strong>
  </p>
  
  <p style="color: #666; line-height: 1.8;">
    Notamos que você não tem aberto nossos emails recentemente. 
    Tudo bem? Queremos ter certeza de que estamos enviando conteúdo 
    que realmente interessa a você.
  </p>
  
  <!-- Artigos mais populares -->
  <h3 style="color: #0A1628; margin: 30px 0 20px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
    🔥 Veja o que você perdeu:
  </h3>
  
  <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #0A1628; margin: 0 0 10px 0;">
      📈 Bitcoin Atinge Novo Recorde
    </h4>
    <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0;">
      Análise completa do movimento e o que esperar
    </p>
    <a href="https://a-cifra.pages.dev/artigos" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold;">
      Ler agora →
    </a>
  </div>
  
  <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #0A1628; margin: 0 0 10px 0;">
      💡 Guia Completo de DeFi
    </h4>
    <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0;">
      Tudo que você precisa saber sobre finanças descentralizadas
    </p>
    <a href="https://a-cifra.pages.dev/artigos" 
       style="color: #D4AF37; text-decoration: none; font-weight: bold;">
      Ler agora →
    </a>
  </div>
  
  <!-- Pergunta -->
  <div style="background: #fff8e1; padding: 30px; border-radius: 8px; margin: 40px 0; text-align: center;">
    <h3 style="color: #0A1628; margin: 0 0 15px 0;">
      Ainda quer receber nossos emails?
    </h3>
    <p style="color: #666; line-height: 1.8; margin: 0 0 25px 0;">
      Se sim, clique no botão abaixo para continuar recebendo conteúdo exclusivo.<br>
      Se não, sem problemas! Você pode cancelar sua inscrição a qualquer momento.
    </p>
    <a href="https://a-cifra.pages.dev" 
       style="display: inline-block; background: #D4AF37; color: #0A1628; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px 10px 0;">
      Sim, quero continuar!
    </a>
    <a href="{{ unsubscribe }}" 
       style="display: inline-block; background: #f8f9fa; color: #666; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px 10px 0;">
      Não, cancelar inscrição
    </a>
  </div>
  
  <p style="color: #666; line-height: 1.8; margin: 30px 0 0 0;">
    Esperamos ver você de volta! 💙
  </p>
  
  <p style="color: #0A1628; font-weight: bold;">
    Equipe A Cifra
  </p>
</div>
```

---

## 4. Email de Aniversário

### No aniversário de 1 ano de inscrição

**Assunto:** 🎉 1 ano juntos! Obrigado por fazer parte da nossa comunidade

**Conteúdo:**

```html
<div style="padding: 40px; background: white; text-align: center;">
  <div style="font-size: 60px; margin: 0 0 20px 0;">🎉</div>
  
  <h2 style="color: #0A1628; margin: 0 0 20px 0;">
    Feliz Aniversário de 1 Ano!
  </h2>
  
  <p style="color: #666; line-height: 1.8; font-size: 18px; margin: 0 0 30px 0;">
    Há exatamente <strong>1 ano</strong> você se juntou à comunidade A Cifra!
  </p>
  
  <div style="background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%); padding: 40px; border-radius: 12px; margin: 30px 0;">
    <p style="color: white; line-height: 1.8; margin: 0 0 20px 0;">
      Neste período, você recebeu:
    </p>
    <div style="color: #D4AF37; font-size: 48px; font-weight: bold; margin: 20px 0;">
      52
    </div>
    <p style="color: white; margin: 0;">
      newsletters com conteúdo exclusivo
    </p>
  </div>
  
  <p style="color: #666; line-height: 1.8; margin: 30px 0;">
    <strong>Obrigado por fazer parte desta jornada!</strong><br>
    Sua confiança e engajamento nos motivam a continuar criando 
    o melhor conteúdo sobre criptomoedas.
  </p>
  
  <!-- Gift -->
  <div style="background: #fff8e1; padding: 30px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #0A1628; margin: 0 0 15px 0;">
      🎁 Presente Especial
    </h3>
    <p style="color: #666; line-height: 1.8; margin: 0 0 20px 0;">
      Como agradecimento, preparamos um guia exclusivo para você:
    </p>
    <a href="https://a-cifra.pages.dev/artigos" 
       style="display: inline-block; background: #D4AF37; color: #0A1628; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">
      Baixar Guia Exclusivo
    </a>
  </div>
  
  <p style="color: #666; line-height: 1.8; margin: 30px 0 0 0;">
    Aqui está para muitos mais anos juntos! 🚀
  </p>
  
  <p style="color: #0A1628; font-weight: bold;">
    Com carinho,<br>
    Equipe A Cifra
  </p>
</div>
```

---

## 5. Como Configurar no Brevo

### Passo a Passo

#### 1. Acessar Automações

1. Login em: https://app.brevo.com
2. Clique em **Automation** no menu lateral
3. Clique em **Create an automation**

#### 2. Escolher Trigger (Gatilho)

**Para Email de Boas-vindas:**
- Trigger: "Contact added to a list"
- Selecione sua lista: "Newsletter A Cifra"

**Para Onboarding (Email 2):**
- Trigger: "Contact added to a list"
- Adicione delay: "Wait 3 days"

**Para Reengajamento:**
- Trigger: "Contact hasn't opened in X days"
- Configure: 30 dias

**Para Aniversário:**
- Trigger: "Anniversary date"
- Campo: Data de inscrição
- Período: 1 ano

#### 3. Criar Email

1. Clique em **Add an action** → **Send an email**
2. Cole o HTML do template acima
3. Personalize:
   - Assunto
   - Links dos artigos
   - Textos
4. Teste o email

#### 4. Ativar Automação

1. Revise o fluxo
2. Clique em **Activate**
3. Monitore os resultados

---

## 📊 Métricas para Acompanhar

### Email de Boas-vindas
- **Taxa de abertura**: > 50%
- **Taxa de cliques**: > 10%
- Meta: Engajar desde o início

### Sequência de Onboarding
- **Taxa de abertura**: > 30%
- **Taxa de cliques**: > 5%
- Meta: Educar e reter

### Reengajamento
- **Taxa de abertura**: > 15%
- **Taxa de reativação**: > 5%
- Meta: Recuperar inativos

---

## 💡 Dicas Importantes

### ✅ Fazer:
- Personalizar com nome do contato: `{{ contact.FIRSTNAME }}`
- Testar todos os links
- Enviar teste para você primeiro
- Monitorar métricas semanalmente
- Ajustar baseado em resultados

### ❌ Evitar:
- Enviar muitos emails seguidos
- Usar linguagem muito técnica
- Esquecer call-to-action
- Não testar em mobile
- Ignorar cancelamentos

---

## 🔄 Fluxo Completo Recomendado

```
Dia 0: Inscrição
  ↓
Dia 0: Email de Boas-vindas (imediato)
  ↓
Dia 3: Email Educacional
  ↓
Dia 7: Email de Engajamento
  ↓
Semanal: Newsletter regular
  ↓
Dia 30 (se inativo): Reengajamento
  ↓
1 ano: Email de Aniversário
```

---

**Pronto para criar suas automações! 🤖**
