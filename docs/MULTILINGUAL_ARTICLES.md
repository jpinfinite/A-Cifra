# Artigos Multilíngues - Guia de Uso

## Visão Geral

O blog A Cifra agora suporta artigos em múltiplos idiomas. Você pode criar versões traduzidas dos seus artigos e o sistema automaticamente carregará a versão correta baseada no idioma selecionado pelo usuário.

## Como Funciona

### Estrutura de Arquivos

Os artigos multilíngues seguem uma convenção de nomenclatura simples:

```
content/articles/
├── meu-artigo.md           # Versão em português (padrão)
├── meu-artigo.en.md        # Versão em inglês
├── outro-artigo.md         # Versão em português
└── outro-artigo.en.md      # Versão em inglês
```

### Convenção de Nomenclatura

- **Português (padrão):** `nome-do-artigo.md`
- **Inglês:** `nome-do-artigo.en.md`
- **Outros idiomas:** `nome-do-artigo.[codigo-idioma].md`

## Criando um Artigo Multilíngue

### 1. Criar a Versão em Português

Crie o arquivo normalmente:

```markdown
---
id: '22'
title: "Título em Português"
slug: "titulo-em-portugues"
excerpt: "Descrição em português..."
coverImage:
  src: '/images/articles/imagem.jpg'
  alt: 'Descrição da imagem'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '2025-11-06'
updatedAt: '2025-11-06'
category: 'altcoins'
tags:
  - 'Tag1'
  - 'Tag2'
featured: true
---

## Conteúdo em Português

Seu conteúdo aqui...
```

### 2. Criar a Versão em Inglês

Crie um arquivo com o mesmo nome + `.en.md`:

```markdown
---
id: '22'
title: "Title in English"
slug: "title-in-english"
excerpt: "Description in English..."
coverImage:
  src: '/images/articles/imagem.jpg'
  alt: 'Image description'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '2025-11-06'
updatedAt: '2025-11-06'
category: 'altcoins'
tags:
  - 'Tag1'
  - 'Tag2'
featured: true
---

## Content in English

Your content here...
```

## Pontos Importantes

### 1. Mesmo ID

Ambas as versões devem ter o **mesmo `id`** para serem reconhecidas como traduções do mesmo artigo.

### 2. Slugs Diferentes

Cada versão deve ter seu próprio `slug` único:
- PT: `zcash-dash-moedas-privacidade-disparam`
- EN: `zcash-dash-privacy-coins-surge`

### 3. Mesma Imagem

Você pode usar a mesma imagem para ambas as versões, apenas traduzindo o `alt`:
```yaml
coverImage:
  src: '/images/articles/zcash.png'  # Mesma imagem
  alt: 'Zcash e Dash - Moedas de Privacidade'  # PT
  alt: 'Zcash and Dash - Privacy Coins'        # EN
```

### 4. Traduzir Todo o Conteúdo

Certifique-se de traduzir:
- ✅ Título
- ✅ Excerpt
- ✅ Todo o conteúdo markdown
- ✅ Tags (opcional, mas recomendado)
- ✅ Alt text das imagens

## Funções Disponíveis

### Carregar Artigo com Idioma

```typescript
import { loadArticleBySlugWithLocale } from '@/utils/articleLoader'

// Carrega versão em inglês
const article = loadArticleBySlugWithLocale('meu-artigo', 'en')

// Carrega versão em português (padrão)
const article = loadArticleBySlugWithLocale('meu-artigo', 'pt')
```

### Carregar Todos os Artigos de um Idioma

```typescript
import { loadAllArticlesFromFilesWithLocale } from '@/utils/articleLoader'

// Carrega todos os artigos em inglês
const articlesEN = loadAllArticlesFromFilesWithLocale('en')

// Carrega todos os artigos em português
const articlesPT = loadAllArticlesFromFilesWithLocale('pt')
```

## Exemplo Completo

### Arquivo: `zcash-dash-moedas-privacidade-disparam.md`

```markdown
---
id: '22'
title: "O Comeback das Moedas Secretas: Zcash e Dash Disparam no Mercado"
slug: "zcash-dash-moedas-privacidade-disparam"
excerpt: "Capitalização de mercado das moedas de privacidade dispara 80%..."
# ... resto do frontmatter
---

## Contexto: O Boom das Moedas de Privacidade

Conteúdo em português...
```

### Arquivo: `zcash-dash-moedas-privacidade-disparam.en.md`

```markdown
---
id: '22'
title: "The Comeback of Secret Coins: Zcash and Dash Surge in the Market"
slug: "zcash-dash-privacy-coins-surge"
excerpt: "Privacy coin market cap surges 80%..."
# ... resto do frontmatter
---

## Context: The Privacy Coin Boom

Content in English...
```

## Boas Práticas

1. **Sempre crie a versão em português primeiro** - É o idioma padrão
2. **Mantenha a estrutura consistente** - Use os mesmos headings e seções
3. **Traduza naturalmente** - Não use tradução literal, adapte para o idioma
4. **Revise a tradução** - Certifique-se de que faz sentido no idioma alvo
5. **Teste ambas as versões** - Verifique se ambos os artigos aparecem corretamente

## Limitações Atuais

- O sistema ainda não detecta automaticamente o idioma do usuário para artigos
- URLs não são localizadas (ex: `/en/article/...`)
- A navegação entre idiomas do mesmo artigo precisa ser implementada

## Próximos Passos

- [ ] Implementar detecção automática de idioma
- [ ] Adicionar botão para trocar entre idiomas do mesmo artigo
- [ ] Implementar URLs localizadas
- [ ] Adicionar mais idiomas (ES, FR, etc)
- [ ] Criar sistema de gerenciamento de traduções

## Suporte

Se tiver dúvidas sobre como criar artigos multilíngues, consulte:
- [Guia de i18n](./I18N_GUIDE.md)
- [Template de artigo](../content/articles/_template.md)
