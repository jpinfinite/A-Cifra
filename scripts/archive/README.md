# 🤖 Sistema de Automação - A Cifra

Este diretório contém scripts de automação para geração e otimização de conteúdo.

## 📋 Scripts Disponíveis

### 1. Monitor de Tendências
```bash
node scripts/monitor-tendencias.js
```
**O que faz:**
- Pesquisa tópicos em alta no mercado cripto
- Analisa artigos existentes
- Sugere novos artigos baseados em gaps de conteúdo
- Gera relatório em `data/trending-report.json`

**Quando usar:** Diariamente ou quando precisar de ideias de conteúdo

---

### 2. Gerador de Artigos em Lote
```bash
node scripts/gerar-artigos-batch.js
```
**O que faz:**
- Lê sugestões do monitor de tendências
- Gera múltiplos artigos automaticamente (estrutura base)
- Cria imagens de capa
- Salva relatório em `data/batch-report.json`

**Quando usar:** Após executar o monitor de tendências

---

### 3. Otimizador de SEO
```bash
node scripts/otimizar-seo-batch.js
```
**O que faz:**
- Analisa todos os artigos existentes
- Adiciona links internos automaticamente
- Identifica problemas de SEO
- Gera relatório em `data/seo-optimization-report.json`

**Quando usar:** Semanalmente ou após adicionar vários artigos novos

---

### 4. Gerador de Newsletter
```bash
node scripts/gerar-newsletter.js
```
**O que faz:**
- Compila artigos da última semana
- Gera HTML de newsletter pronto para envio
- Salva em `newsletters/newsletter-YYYY-MM-DD.html`

**Quando usar:** Toda sexta-feira para envio semanal

---

## ⚙️ GitHub Actions (Automatização CI/CD)

### Auto Publish
- **Quando roda:** Todo dia às 8h AM
- **O que faz:** Publica artigos agendados automaticamente
- **Arquivo:** `.github/workflows/auto-publish.yml`

### Trends Monitor
- **Quando roda:** Todo dia às 8h AM
- **O que faz:** Executa monitor de tendências e cria issue com sugestões
- **Arquivo:** `.github/workflows/trends-monitor.yml`

### SEO Optimization
- **Quando roda:** Toda segunda-feira às 9h AM
- **O que faz:** Otimiza SEO de todos os artigos e commita mudanças
- **Arquivo:** `.github/workflows/seo-optimization.yml`

---

## 🚀 Fluxo de Trabalho Recomendado

### Diário (Automático via GitHub Actions):
1. **8h AM** - Monitor de tendências roda e cria issue com sugestões
2. **Você revisa** as sugestões na issue

### Quando quiser gerar conteúdo:
```bash
# 1 Verificar tendências
node scripts/monitor-tendencias.js

# 2. Gerar artigos em lote
node scripts/gerar-artigos-batch.js

# 3. Revisar e editar os artigos gerados

# 4. Otimizar SEO
node scripts/otimizar-seo-batch.js

# 5. Deploy
git add .
git commit -m "feat: Adiciona novos artigos"
git push
```

### Semanal:
```bash
# Sexta-feira: Gerar newsletter
node scripts/gerar-newsletter.js

# Newsletter será salva em newsletters/
# Enviar via Resend, SendGrid, etc.
```

---

## 📊 Estrutura de Dados

### `data/trending-report.json`
Relatório do monitor de tendências com sugestões de artigos.

### `data/batch-report.json`
Relatório de artigos gerados em lote.

### `data/seo-optimization-report.json`
Relatório detalhado de otimizações de SEO realizadas.

### `newsletters/`
Diretório com newsletters geradas em HTML.

---

## 🔧 Configuração

### Variáveis de Ambiente (opcional)
```env
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx
GITHUB_TOKEN=xxx # Para GitHub Actions
```

### Dependências
Todas as dependências já estão no `package.json`. Execute:
```bash
npm install
```

---

## 💡 Dicas

1. **Execute o monitor diariamente** para manter lista de sugestões atualizada
2. **Revise artigos gerados** antes de publicar - eles são estruturas base
3. **Otimize SEO regularmente** para melhorar ranqueamento
4. **Gere newsletter toda semana** para engajamento com audiência

---

## 📞 Suporte

Qualquer dúvida sobre os scripts, consulte o código-fonte ou abra uma issue no repositório.
