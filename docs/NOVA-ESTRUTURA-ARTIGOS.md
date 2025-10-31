# Nova Estrutura de Artigos - Sistema Modular

## 📋 Visão Geral

O sistema de artigos foi reestruturado para ser mais modular, escalável e fácil de manter. Agora os artigos podem ser adicionados como arquivos Markdown individuais, sem precisar editar um arquivo gigante.

## 🎯 Benefícios

### Antes (Sistema Antigo)
- ❌ Arquivo `articles.ts` com 5000+ linhas
- ❌ Difícil de adicionar novos artigos
- ❌ Alto risco de erros ao editar
- ❌ Conflitos de merge no Git
- ❌ Lento para carregar no editor

### Depois (Sistema Novo)
- ✅ Artigos em arquivos Markdown separados
- ✅ Fácil adicionar novos artigos
- ✅ Baixo risco de erros
- ✅ Sem conflitos de merge
- ✅ Rápido e eficiente

## 📁 Estrutura de Arquivos

```
projeto/
├── content/
│   └── articles/
│       ├── _template.md              # Template para novos artigos
│       ├── README.md                 # Documentação
│       ├── memecoins-fenomeno-cultural.md
│       ├── metamask-guia-completo.md
│       └── ... (outros artigos)
├── src/
│   ├── data/
│   │   ├── articles.ts               # Sistema novo (modular)
│   │   └── articles-new.ts           # Backup do novo sistema
│   └── utils/
│       └── articleLoader.ts          # Carregador de artigos
└── scripts/
    └── migrate-to-new-articles.js    # Script de migração
```

## 🚀 Como Usar

### 1. Migrar para o Novo Sistema

```bash
node scripts/migrate-to-new-articles.js
```

Este script:
- Faz backup do arquivo antigo
- Ativa o novo sistema
- Verifica a estrutura de pastas

### 2. Adicionar um Novo Artigo

#### Passo 1: Copiar o Template

```bash
cp content/articles/_template.md content/articles/meu-novo-artigo.md
```

#### Passo 2: Editar o Frontmatter

```yaml
---
id: '21'  # Próximo ID disponível
title: 'Título do Meu Artigo'
slug: 'titulo-do-meu-artigo'
excerpt: 'Breve descrição do artigo'
coverImage:
  src: '/images/minha-imagem.jpg'
  alt: 'Descrição da imagem'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '2025-10-30'
category:
  name: 'Educação'
  slug: 'educacao'
  description: 'Aprenda sobre criptomoedas'
tags:
  - 'tag1'
  - 'tag2'
seo:
  metaTitle: 'Título SEO | A Cifra'
  metaDescription: 'Descrição para SEO'
  keywords:
    - 'palavra-chave 1'
    - 'palavra-chave 2'
---
```

#### Passo 3: Escrever o Conteúdo

Use Markdown padrão após o frontmatter:

```markdown
# Título Principal

Introdução do artigo.

## Seção 1

Conteúdo da seção.

### Subseção

- Item 1
- Item 2
```

#### Passo 4: Salvar e Testar

O artigo será automaticamente carregado. Não precisa reiniciar o servidor!

## 🎨 Componentes Especiais

### Caixa de Dica

```html
<div class="tip-box">
  <p><strong>Dica:</strong> Seu texto aqui.</p>
</div>
```

### Caixa de Alerta

```html
<div class="alert-box">
  <p><strong>Atenção:</strong> Seu texto aqui.</p>
</div>
```

### Caixa de Conclusão

```html
<div class="conclusion-box">
  <p><strong>Conclusão:</strong> Seu texto aqui.</p>
</div>
```

### Imagem com Legenda

```html
<div class="article-image">
  <img src="/images/sua-imagem.jpg" alt="Descrição" />
  <p class="image-caption">Legenda da imagem</p>
</div>
```

## 🔧 Arquitetura Técnica

### articleLoader.ts

Responsável por:
- Ler arquivos Markdown da pasta `content/articles/`
- Processar frontmatter YAML
- Converter para objetos `Article`
- Ordenar por data de publicação

### articles.ts (novo)

Responsável por:
- Combinar artigos de arquivos + em memória
- Fornecer funções de busca e filtro
- Manter compatibilidade com código existente
- Sanitizar conteúdo HTML

## 📊 Fluxo de Dados

```
content/articles/*.md
        ↓
articleLoader.ts (lê e processa)
        ↓
articles.ts (combina e organiza)
        ↓
Componentes React (exibem)
```

## 🔄 Compatibilidade

O novo sistema é **100% compatível** com o código existente:

```typescript
// Todas essas funções continuam funcionando
await getAllArticles()
await getArticleBySlug('slug')
await getArticlesByCategory('educacao')
await getFeaturedArticle()
await getRecentArticles(6)
```

## 🛠️ Manutenção

### Adicionar Artigo em Memória (Fallback)

Se precisar adicionar um artigo diretamente no código:

```typescript
// src/data/articles.ts
const inMemoryArticles: Article[] = [
  {
    id: '99',
    title: 'Artigo de Emergência',
    // ... resto das propriedades
  }
]
```

### Reverter para Sistema Antigo

```bash
cp src/data/articles.ts.backup-migration src/data/articles.ts
```

## 📝 Checklist para Novos Artigos

- [ ] Copiar template
- [ ] Definir ID único
- [ ] Criar slug único
- [ ] Preencher frontmatter completo
- [ ] Escrever conteúdo em Markdown
- [ ] Adicionar imagens em `/public/images/`
- [ ] Testar no navegador
- [ ] Verificar SEO (meta tags)
- [ ] Revisar ortografia
- [ ] Commit no Git

## 🎓 Exemplos

Veja os artigos de exemplo:
- `content/articles/memecoins-fenomeno-cultural.md`
- `content/articles/metamask-guia-completo.md`

## 🐛 Troubleshooting

### Artigo não aparece

1. Verifique o frontmatter YAML
2. Confirme que o arquivo tem extensão `.md`
3. Veja o console para erros
4. Teste o frontmatter em um validador YAML online

### Imagens não carregam

1. Confirme que estão em `/public/images/`
2. Verifique o caminho (deve começar com `/images/`)
3. Teste acessando a URL diretamente

### Erro de compilação

1. Verifique sintaxe do frontmatter
2. Confirme que todas as propriedades obrigatórias estão presentes
3. Veja logs do servidor

## 📚 Recursos

- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Syntax](https://yaml.org/)
- [Gray Matter (frontmatter parser)](https://github.com/jonschlinkert/gray-matter)

## 🎉 Conclusão

O novo sistema torna muito mais fácil e seguro adicionar novos artigos. Agora você pode:

1. Criar um arquivo `.md`
2. Preencher o frontmatter
3. Escrever em Markdown
4. Salvar e pronto!

Sem editar arquivos gigantes, sem riscos de quebrar o código existente.
