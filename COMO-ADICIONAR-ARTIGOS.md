# 📝 Como Adicionar Novos Artigos - Guia Rápido

## 🚀 Início Rápido (3 passos)

### 1. Copiar Template
```bash
cp content/articles/_template.md content/articles/meu-novo-artigo.md
```

### 2. Editar Arquivo
Abra `content/articles/meu-novo-artigo.md` e preencha:

```yaml
---
id: '21'  # Próximo ID disponível
title: 'Título do Artigo'
slug: 'titulo-do-artigo'
excerpt: 'Breve descrição'
# ... resto do frontmatter
---

# Conteúdo do Artigo

Escreva aqui em Markdown...
```

### 3. Salvar
Pronto! O artigo aparece automaticamente no site.

## 📋 Frontmatter Essencial

```yaml
---
id: '21'                    # ID único
title: 'Título'             # Título do artigo
slug: 'titulo-artigo'       # URL amigável
excerpt: 'Descrição breve'  # Para cards
coverImage:
  src: '/images/cover.jpg'  # Imagem de capa
  alt: 'Descrição'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '2025-10-30'   # Data de publicação
category:
  name: 'Educação'          # Nome da categoria
  slug: 'educacao'          # Slug da categoria
  description: 'Descrição'
tags:                       # Tags do artigo
  - 'tag1'
  - 'tag2'
seo:
  metaTitle: 'Título SEO | A Cifra'
  metaDescription: 'Descrição para Google'
  keywords:
    - 'palavra-chave 1'
    - 'palavra-chave 2'
---
```

## 🎨 Componentes Úteis

### Caixa de Dica
```html
<div class="tip-box">
  <p><strong>Dica:</strong> Seu texto.</p>
</div>
```

### Caixa de Alerta
```html
<div class="alert-box">
  <p><strong>Atenção:</strong> Seu texto.</p>
</div>
```

### Imagem com Legenda
```html
<div class="article-image">
  <img src="/images/imagem.jpg" alt="Descrição" />
  <p class="image-caption">Legenda</p>
</div>
```

## 📂 Categorias Disponíveis

- `educacao` - Educação
- `analises` - Análises
- `bitcoin` - Bitcoin
- `ethereum` - Ethereum
- `altcoins` - Altcoins
- `defi` - DeFi
- `nfts` - NFTs
- `seguranca` - Segurança

## ✅ Checklist

- [ ] Copiar template
- [ ] Definir ID único (próximo: 21)
- [ ] Criar slug único
- [ ] Preencher frontmatter
- [ ] Escrever conteúdo
- [ ] Adicionar imagens em `/public/images/`
- [ ] Testar no navegador
- [ ] Commit no Git

## 📚 Documentação Completa

- **Template:** `content/articles/_template.md`
- **README:** `content/articles/README.md`
- **Guia Completo:** `docs/NOVA-ESTRUTURA-ARTIGOS.md`
- **Exemplos:** 
  - `content/articles/memecoins-fenomeno-cultural.md`
  - `content/articles/metamask-guia-completo.md`

## 🔧 Migrar para Novo Sistema

Se ainda não migrou:

```bash
node scripts/migrate-to-new-articles.js
```

## 💡 Dicas

1. **IDs únicos:** Use números sequenciais (19, 20, 21...)
2. **Slugs únicos:** Use kebab-case (meu-artigo-legal)
3. **Imagens:** Sempre em `/public/images/`
4. **SEO:** Preencha meta title, description e keywords
5. **Teste:** Sempre verifique no navegador antes de commitar

## 🐛 Problemas Comuns

### Artigo não aparece
- Verifique o frontmatter YAML
- Confirme extensão `.md`
- Veja console para erros

### Imagens não carregam
- Confirme que estão em `/public/images/`
- Verifique o caminho (começa com `/images/`)

## 🎉 Pronto!

Agora você pode adicionar artigos facilmente sem editar arquivos gigantes!
