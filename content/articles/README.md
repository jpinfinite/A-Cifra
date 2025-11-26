---
id: readme-articles
title: Documentação - Como Adicionar Artigos
slug: documentacao-artigos
excerpt: Guia completo sobre como adicionar e formatar novos artigos no blog A Cifra
coverImage:
  src: /images/cifra-principal.png
  alt: Documentação A Cifra
  width: 1200
  height: 630
author:
  name: Jonatha Pereira
  avatar: /Jonatha-Pereira-SEO.png
publishedAt: '2025-11-20'
updatedAt: '2025-11-20'
category: documentacao
tags:
  - documentação
  - guia
  - tutorial
featured: false
seo:
  metaTitle: Como Adicionar Artigos - Documentação | A Cifra
  metaDescription: Guia completo sobre como adicionar e formatar novos artigos no blog A Cifra
  keywords: 'documentação, artigos, markdown, frontmatter'
categorySlug: tutoriais
---

# Como Adicionar Novos Artigos

Este diretório contém artigos em formato Markdown que são automaticamente carregados pelo sistema.

## Estrutura de um Artigo

Cada artigo deve ser um arquivo `.md` com frontmatter YAML no início. Use o arquivo `_template.md` como base.

### Frontmatter Obrigatório

```yaml
---
id: '21'  # ID único do artigo
title: 'Título do Artigo'
slug: 'slug-do-artigo'  # URL amigável
excerpt: 'Breve descrição'
coverImage:
  src: '/images/cover.jpg'
  alt: 'Descrição da imagem'
  width: 1200
  height: 630
author:
  name: 'Jonatha Pereira'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '2025-10-30'  # Data de publicação
category:
  name: 'Educação'
  slug: 'educacao'
  description: 'Descrição da categoria'
tags:
  - 'tag1'
  - 'tag2'
seo:
  metaTitle: 'Título SEO | A Cifra'
  metaDescription: 'Descrição SEO'
  keywords:
    - 'palavra-chave 1'
    - 'palavra-chave 2'
---
```text### Conteúdo do Artigo

Após o frontmatter, escreva o conteúdo em Markdown:
```markdown
# Título Principal

Introdução com **negrito** e *itálico*.

## Seção 1

Conteúdo da seção.

### Subseção

- Lista item 1
- Lista item 2

## Seção 2

Mais conteúdo.
```text## Componentes Especiais

Você pode usar divs com classes especiais para destacar conteúdo:

### Caixa de Dica
```html
<div class="tip-box">
  <p><strong>Dica:</strong> Seu texto aqui.</p>
</div>
```text### Caixa de Alerta
```html
<div class="alert-box">
  <p><strong>Atenção:</strong> Seu texto aqui.</p>
</div>
```text### Caixa de Conclusão
```html
<div class="conclusion-box">
  <p><strong>Conclusão:</strong> Seu texto aqui.</p>
</div>
```text### Imagem com Legenda
```html
<div class="article-image">
  <img src="/images/sua-imagem.jpg" alt="Descrição" />
  <p class="image-caption">Legenda da imagem</p>
</div>
```

## Categorias Disponíveis

- **educacao** - Educação
- **analises** - Análises
- **bitcoin** - Bitcoin
- **ethereum** - Ethereum
- **altcoins** - Altcoins
- **defi** - DeFi
- **nfts** - NFTs
- **seguranca** - Segurança
- **regulacao** - Regulação
- **tecnologia** - Tecnologia

## Passo a Passo para Adicionar um Artigo

1. **Copie o template:**
   ```bash
   cp _template.md novo-artigo.md
   ```

2. **Edite o frontmatter:**
   - Defina um ID único
   - Crie um slug único
   - Preencha todos os campos obrigatórios

3. **Escreva o conteúdo:**
   - Use Markdown padrão
   - Adicione componentes especiais quando necessário
   - Inclua imagens na pasta `/public/images/`

4. **Salve o arquivo:**
   - O sistema carregará automaticamente o novo artigo
   - Não precisa reiniciar o servidor

5. **Verifique:**
   - Acesse o site e veja se o artigo aparece
   - Teste todos os links e imagens

## Dicas de SEO

- Use títulos descritivos e keywords relevantes
- Escreva meta descriptions atraentes (150-160 caracteres)
- Inclua alt text em todas as imagens
- Use headings (H2, H3) para estruturar o conteúdo
- Adicione links internos para outros artigos

## Exemplos

Veja os artigos existentes como referência:
- `memecoins-fenomeno-cultural.md`
- `metamask-guia-completo.md`

## Troubleshooting

### Artigo não aparece no site

- Verifique se o frontmatter está correto
- Confirme que o arquivo tem extensão `.md`
- Verifique se não há erros de sintaxe YAML

### Imagens não carregam

- Confirme que as imagens estão em `/public/images/`
- Verifique o caminho no código (deve começar com `/images/`)
- Teste se a imagem existe no servidor

### Formatação quebrada

- Verifique se fechou todas as tags HTML
- Confirme que o Markdown está correto
- Teste em um visualizador Markdown online
