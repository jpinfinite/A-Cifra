# 📊 Google Analytics - Guia Completo A Cifra

## ✅ Status Atual

**Google Analytics 4 está ATIVO!**
- **ID:** G-JDX167JXHF
- **Estratégia:** lazyOnload (otimizado para performance)
- **Eventos personalizados:** Configurados

---

## 🎯 O Que Está Sendo Rastreado

### 1. Eventos Automáticos (GA4)
- ✅ **page_view** - Visualizações de página
- ✅ **scroll** - Profundidade de rolagem (25%, 50%, 75%, 100%)
- ✅ **click** - Cliques em links externos
- ✅ **session_start** - Início de sessão
- ✅ **first_visit** - Primeira visita do usuário

### 2. Eventos Personalizados (Implementados)
- ✅ **article_view** - Visualização de artigo
  - article_title
  - article_slug
  - article_category
  
- ✅ **newsletter_subscribe** - Inscrição na newsletter
  - method
  - email_domain
  
- ✅ **external_link_click** - Clique em link externo
  - link_url
  - link_text
  - link_domain
  
- ✅ **share_article** - Compartilhamento
  - platform (twitter, facebook, linkedin, whatsapp, telegram)
  - article_title
  
- ✅ **search** - Busca no site
  - search_term
  - results_count
  
- ✅ **ad_click** - Clique em anúncio
  - ad_position
  - ad_type

### 3. Métricas de Engajamento
- ✅ **reading_time** - Tempo de leitura
- ✅ **scroll_depth** - Profundidade de scroll
- ✅ **engagement_level** - Nível de engajamento (low/medium/high)

---

## 📈 Como Acessar o Google Analytics

### 1. Acesse o Dashboard
1. Vá para: https://analytics.google.com
2. Faça login com sua conta Google
3. Selecione a propriedade **A Cifra** (G-JDX167JXHF)

### 2. Principais Relatórios

#### 📊 Visão Geral (Home)
- Usuários em tempo real
- Usuários últimos 30 dias
- Visualizações de página
- Taxa de engajamento
- Principais páginas

#### 📄 Relatórios > Engajamento > Páginas e telas
**O que ver:**
- Páginas mais visitadas
- Tempo médio na página
- Taxa de rejeição por página
- Visualizações únicas

**Como usar:**
- Identifique artigos mais populares
- Veja quais artigos retêm usuários
- Encontre páginas com alta taxa de rejeição

#### 👥 Relatórios > Aquisição > Visão geral
**O que ver:**
- De onde vêm os visitantes
- Organic Search (Google)
- Direct (digitaram URL)
- Social (redes sociais)
- Referral (outros sites)

**Como usar:**
- Veja qual canal traz mais tráfego
- Identifique oportunidades de crescimento
- Acompanhe ROI de campanhas

#### 🌍 Relatórios > Dados demográficos
**O que ver:**
- Países dos visitantes
- Cidades
- Idiomas
- Dispositivos (mobile/desktop)

**Como usar:**
- Entenda seu público
- Otimize para dispositivos mais usados
- Crie conteúdo para regiões específicas

#### ⚡ Relatórios > Eventos
**O que ver:**
- Todos os eventos personalizados
- article_view
- newsletter_subscribe
- share_article
- etc.

**Como usar:**
- Veja quais artigos são mais compartilhados
- Acompanhe inscrições na newsletter
- Identifique comportamentos dos usuários

---

## 🎯 Métricas Mais Importantes para Você

### 1. **Usuários** (Users)
**O que é:** Número de visitantes únicos
**Meta:** Crescimento constante mês a mês
**Bom:** +20% ao mês nos primeiros 6 meses

### 2. **Visualizações de Página** (Page Views)
**O que é:** Total de páginas vistas
**Meta:** 2-3 páginas por usuário
**Bom:** Usuários leem múltiplos artigos

### 3. **Taxa de Engajamento** (Engagement Rate)
**O que é:** % de sessões engajadas (>10s ou 2+ páginas)
**Meta:** >60%
**Bom:** Usuários estão realmente lendo

### 4. **Tempo Médio de Engajamento** (Avg Engagement Time)
**O que é:** Tempo médio que usuários passam no site
**Meta:** >2 minutos
**Bom:** Usuários leem artigos completos

### 5. **Taxa de Rejeição** (Bounce Rate)
**O que é:** % de usuários que saem sem interagir
**Meta:** <60%
**Bom:** Usuários exploram o site

### 6. **Páginas por Sessão** (Pages per Session)
**O que é:** Quantas páginas usuário visita
**Meta:** >2 páginas
**Bom:** Usuários navegam entre artigos

---

## 📊 Relatórios Personalizados Recomendados

### 1. Relatório de Artigos Mais Populares

**Como criar:**
1. Vá em **Explorar** > **Criar exploração**
2. Escolha **Exploração de forma livre**
3. Configure:
   - **Dimensões:** Título da página
   - **Métricas:** Visualizações, Tempo médio de engajamento
   - **Filtro:** page_path contém "/artigo/"
4. Salve como "Top Artigos"

**O que analisar:**
- Quais artigos trazem mais tráfego
- Quais retêm usuários por mais tempo
- Padrões de tópicos populares

### 2. Relatório de Conversão de Newsletter

**Como criar:**
1. **Explorar** > **Criar exploração**
2. Configure:
   - **Dimensões:** Origem/Mídia
   - **Métricas:** newsletter_subscribe (evento)
   - **Segmento:** Usuários que se inscreveram
3. Salve como "Conversão Newsletter"

**O que analisar:**
- Quais fontes de tráfego convertem mais
- Taxa de conversão por canal
- Otimizar CTAs em páginas com baixa conversão

### 3. Relatório de Compartilhamentos

**Como criar:**
1. **Explorar** > **Criar exploração**
2. Configure:
   - **Dimensões:** article_title, platform
   - **Métricas:** share_article (evento)
3. Salve como "Artigos Mais Compartilhados"

**O que analisar:**
- Quais artigos são mais virais
- Qual plataforma gera mais shares
- Criar mais conteúdo similar

---

## 🔔 Alertas Personalizados

### Configure Alertas para:

#### 1. Pico de Tráfego
**Quando:** Usuários diários > 2x da média
**Ação:** Investigar o que causou (artigo viral, menção, etc.)

#### 2. Queda de Tráfego
**Quando:** Usuários diários < 50% da média
**Ação:** Verificar se site está no ar, problemas técnicos

#### 3. Alta Taxa de Rejeição
**Quando:** Taxa de rejeição > 80% em página específica
**Ação:** Revisar conteúdo, melhorar UX

#### 4. Conversão de Newsletter
**Quando:** Inscrições > 10 por dia
**Ação:** Identificar o que funcionou, replicar

---

## 📱 Google Analytics App

### Instale o App Mobile
- **iOS:** https://apps.apple.com/app/google-analytics/id881599038
- **Android:** https://play.google.com/store/apps/details?id=com.google.android.apps.giant

### Vantagens:
- ✅ Acompanhe métricas em tempo real
- ✅ Receba notificações de alertas
- ✅ Veja relatórios no celular
- ✅ Compartilhe insights com equipe

---

## 🎯 Metas e Conversões

### Configure Metas no GA4:

#### 1. Inscrição na Newsletter
- **Evento:** newsletter_subscribe
- **Valor:** R$ 5 (valor estimado de um lead)

#### 2. Leitura Completa de Artigo
- **Evento:** scroll_depth = 100
- **Valor:** R$ 0,50 (engajamento)

#### 3. Compartilhamento
- **Evento:** share_article
- **Valor:** R$ 2 (viralização)

#### 4. Clique em Afiliado
- **Evento:** external_link_click
- **Filtro:** link_domain contém "binance" ou "mercadobitcoin"
- **Valor:** R$ 10 (potencial conversão)

---

## 📊 Dashboard Semanal (O Que Acompanhar)

### Segunda-feira (Revisão Semanal)
- [ ] Usuários totais da semana
- [ ] Crescimento vs semana anterior (%)
- [ ] Top 5 artigos mais visitados
- [ ] Taxa de engajamento média
- [ ] Inscrições na newsletter

### Quarta-feira (Meio da Semana)
- [ ] Usuários em tempo real
- [ ] Fontes de tráfego (organic, social, direct)
- [ ] Artigos publicados esta semana (performance)

### Sexta-feira (Planejamento)
- [ ] Análise de tendências
- [ ] Identificar oportunidades
- [ ] Planejar conteúdo para próxima semana

---

## 🚀 Otimizações Baseadas em Dados

### Se Taxa de Rejeição Alta (>70%)
**Possíveis causas:**
- Conteúdo não corresponde ao título
- Página carrega lento
- Falta de links internos
- Design ruim no mobile

**Ações:**
- Adicione links para artigos relacionados
- Melhore introdução do artigo
- Otimize imagens
- Teste em mobile

### Se Tempo de Engajamento Baixo (<1min)
**Possíveis causas:**
- Conteúdo superficial
- Formatação ruim
- Falta de subtítulos
- Parágrafos muito longos

**Ações:**
- Adicione mais subtítulos (H2, H3)
- Use listas e bullet points
- Adicione imagens/gráficos
- Quebre parágrafos longos

### Se Poucas Páginas por Sessão (<1.5)
**Possíveis causas:**
- Falta de links internos
- Navegação confusa
- Artigos relacionados não aparecem

**Ações:**
- Adicione seção "Leia também"
- Links contextuais no texto
- Melhore menu de navegação
- Adicione breadcrumbs

---

## 🔍 Análise de Palavras-Chave (Search Console + Analytics)

### Integre Search Console com Analytics
1. Vá em **Admin** > **Vínculos do Search Console**
2. Clique em **Vincular**
3. Selecione propriedade do Search Console
4. Confirme vinculação

### Benefícios:
- ✅ Veja quais palavras-chave trazem tráfego
- ✅ Identifique oportunidades de SEO
- ✅ Otimize artigos para palavras com alto CTR
- ✅ Crie conteúdo para palavras com impressões mas baixo CTR

---

## 📈 Benchmarks e Metas

### Mês 1-2 (Início)
- **Usuários/dia:** 200-500
- **Taxa de engajamento:** >50%
- **Páginas/sessão:** >1.5
- **Tempo médio:** >1min 30s

### Mês 3-4 (Crescimento)
- **Usuários/dia:** 500-1.500
- **Taxa de engajamento:** >60%
- **Páginas/sessão:** >2
- **Tempo médio:** >2min

### Mês 5-6 (Consolidação)
- **Usuários/dia:** 1.500-3.000
- **Taxa de engajamento:** >65%
- **Páginas/sessão:** >2.5
- **Tempo médio:** >2min 30s

### Ano 1 (Maturidade)
- **Usuários/dia:** 5.000-10.000
- **Taxa de engajamento:** >70%
- **Páginas/sessão:** >3
- **Tempo médio:** >3min

---

## 🛠️ Ferramentas Complementares

### 1. Google Search Console
**Para:** SEO e palavras-chave
**Link:** https://search.google.com/search-console

### 2. Google Tag Manager (Opcional)
**Para:** Gerenciar tags sem código
**Link:** https://tagmanager.google.com

### 3. Looker Studio (Data Studio)
**Para:** Dashboards personalizados
**Link:** https://lookerstudio.google.com

### 4. Hotjar (Pago)
**Para:** Heatmaps e gravações de sessão
**Link:** https://www.hotjar.com

---

## 📋 Checklist Semanal de Analytics

### Toda Segunda-feira:
- [ ] Revisar usuários da semana anterior
- [ ] Identificar top 5 artigos
- [ ] Verificar fontes de tráfego
- [ ] Analisar taxa de engajamento
- [ ] Revisar conversões (newsletter)

### Toda Quarta-feira:
- [ ] Verificar usuários em tempo real
- [ ] Acompanhar performance de artigos novos
- [ ] Verificar alertas

### Toda Sexta-feira:
- [ ] Análise de tendências
- [ ] Planejar conteúdo baseado em dados
- [ ] Identificar oportunidades de otimização

---

## 🎓 Recursos para Aprender Mais

### Cursos Gratuitos:
1. **Google Analytics Academy**
   - https://analytics.google.com/analytics/academy/
   - Certificação gratuita

2. **Google Skillshop**
   - https://skillshop.withgoogle.com/
   - Cursos oficiais do Google

### Documentação:
- **GA4 Help Center:** https://support.google.com/analytics
- **GA4 Developer Guide:** https://developers.google.com/analytics

### Comunidades:
- **Reddit:** r/GoogleAnalytics
- **Stack Overflow:** Tag [google-analytics]

---

## 🚨 Troubleshooting

### Dados não aparecem?
1. Verifique se GA está instalado (view source, procure "gtag")
2. Aguarde 24-48h para dados aparecerem
3. Use modo de depuração: https://analytics.google.com/analytics/web/debugview

### Eventos personalizados não funcionam?
1. Abra Console do navegador (F12)
2. Digite: `window.gtag('event', 'test_event', {test: 'value'})`
3. Verifique em Tempo Real > Eventos

### Tráfego parece baixo?
1. Verifique filtros aplicados
2. Compare com Search Console
3. Verifique se não há bloqueadores de anúncios

---

## 💡 Dicas Finais

1. **Não fique obcecado por números** - Foque em tendências, não em flutuações diárias
2. **Use dados para decisões** - Crie mais do que funciona, menos do que não funciona
3. **Teste e aprenda** - Experimente diferentes formatos e veja o que ressoa
4. **Seja paciente** - Crescimento orgânico leva tempo (3-6 meses)
5. **Combine com outras métricas** - Analytics + Search Console + Receita = visão completa

---

## 📞 Próximos Passos

1. **Hoje:** Acesse o Analytics e familiarize-se com o dashboard
2. **Esta semana:** Configure alertas personalizados
3. **Este mês:** Crie relatórios personalizados
4. **Próximo mês:** Integre com Search Console

**Lembre-se:** Analytics é uma ferramenta, não um fim. Use os dados para criar conteúdo melhor e crescer seu site! 🚀

---

**Última atualização:** Novembro 2025
**ID do Analytics:** G-JDX167JXHF
