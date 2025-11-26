# 🛠️ Scripts do A Cifra

Coleção completa de scripts utilitários para automação, validação e otimização do projeto A Cifra.

## 📋 Índice

- [Scripts de Validação](#scripts-de-validação)
- [Scripts de Otimização](#scripts-de-otimização)
- [Scripts de Automação](#scripts-de-automação)
- [Como Usar](#como-usar)

---

## 🔍 Scripts de Validação

### kiroArticleProcessor.js
**Processador avançado de artigos com validação completa**

```bash
node scripts/kiroArticleProcessor.js content/articles/meu-artigo.md
```

**Funcionalidades:**
- ✅ Validação completa de frontmatter
- ✅ Análise SEO profunda (títulos, meta descriptions, keywords)
- ✅ Verificação de estrutura (H1, H2, H3)
- ✅ Contagem de palavras (mínimo 1500)
- ✅ Validação de links internos (3-5 por artigo)
- ✅ Verificação de ExchangeAffiliateLinks
- ✅ Checagem de FAQ e Disclaimer
- ✅ Análise de imagens com alt text
- ✅ Relatório detalhado com sugestões

---

## 🎯 Scripts de Otimização

### auto-seo-checker.js
**Verifica SEO de todos os artigos automaticamente**

```bash
node scripts/auto-seo-checker.js
```

**Funcionalidades:**
- 📊 Análise em massa de todos os artigos
- 📈 Taxa de aprovação geral
- 🚨 Lista de artigos com erros críticos
- ⚠️ Lista de artigos com avisos

---

### suggest-internal-links.js
**Sugere links internos relevantes para artigos**

```bash
node scripts/suggest-internal-links.js content/articles/meu-artigo.md
```

**Funcionalidades:**
- 🔗 Análise de keywords e categorias
- 🎯 Score de relevância
- 📝 Top 10 sugestões de links
- 📋 Markdown pronto para copiar

---

## 🚀 Como Usar

### Workflow Recomendado

#### 1. Ao criar um novo artigo:

```bash
# 1. Validar o artigo
node scripts/kiroArticleProcessor.js content/articles/novo-artigo.md

# 2. Sugerir links internos
node scripts/suggest-internal-links.js content/articles/novo-artigo.md
```

#### 2. Auditoria semanal:

```bash
# Verificar SEO de todos os artigos
node scripts/auto-seo-checker.js
```

---

**Última atualização:** 26 de novembro de 2025
**Mantido por:** Equipe A Cifra
