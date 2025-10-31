# Guia de Validação de Metadados Sociais

## Visão Geral

Este guia fornece instruções detalhadas para validar e testar as tags de compartilhamento social (Open Graph e Twitter Cards) dos artigos do blog A Cifra.

## Ferramentas de Validação Oficiais

### 1. Facebook Sharing Debugger

**URL**: https://developers.facebook.com/tools/debug/

#### Como Usar

1. Acesse o Facebook Sharing Debugger
2. Cole a URL completa do artigo (ex: `https://acifra.com/tema/risco-e-voce`)
3. Clique em "Debug" ou pressione Enter
4. Analise os resultados

#### O Que Verificar

- ✅ **og:title**: Título do artigo aparece corretamente
- ✅ **og:description**: Descrição está completa (máx 155 caracteres)
- ✅ **og:image**: Imagem de destaque (1200x630px) é exibida
- ✅ **og:url**: URL canônica está correta
- ✅ **og:type**: Deve ser "article"
- ✅ **og:locale**: Deve ser "pt_BR"
- ✅ **og:site_name**: Deve ser "A Cifra"

#### Problemas Comuns

**Problema**: Imagem antiga ou incorreta aparece
- **Solução**: Clique em "Scrape Again" para forçar atualização do cache

**Problema**: Imagem não aparece
- **Solução**: Verifique se o arquivo existe em `/public/` e se o caminho está correto

**Problema**: Descrição truncada
- **Solução**: Reduza a descrição para máximo 155 caracteres

### 2. Twitter Card Validator

**URL**: https://cards-dev.twitter.com/validator

#### Como Usar

1. Acesse o Twitter Card Validator
2. Cole a URL completa do artigo
3. Clique em "Preview card"
4. Analise o preview

#### O Que Verificar

- ✅ **twitter:card**: Deve ser "summary_large_image"
- ✅ **twitter:site**: Deve ser "@cifras_coins"
- ✅ **twitter:creator**: Deve ser "@cifras_coins"
- ✅ **twitter:title**: Título do artigo
- ✅ **twitter:description**: Descrição do artigo
- ✅ **twitter:image**: Imagem de destaque

#### Tipos de Cards

- **summary_large_image**: Imagem grande (1200x630px) - **RECOMENDADO**
- **summary**: Imagem pequena (120x120px) - Não usar

### 3. LinkedIn Post Inspector

**URL**: https://www.linkedin.com/post-inspector/

#### Como Usar

1. Acesse o LinkedIn Post Inspector
2. Cole a URL completa do artigo
3. Clique em "Inspect"
4. Analise os resultados

#### O Que Verificar

- ✅ Título aparece corretamente
- ✅ Descrição está completa
- ✅ Imagem de destaque é exibida
- ✅ Preview está atraente e profissional

#### Nota Importante

O LinkedIn usa as tags Open Graph, então se o Facebook Debugger estiver OK, o LinkedIn também deve funcionar.

### 4. WhatsApp Preview

**Como Testar**

1. Abra o WhatsApp (mobile ou web)
2. Envie a URL do artigo para si mesmo ou para um contato
3. Verifique o preview que aparece

#### O Que Verificar

- ✅ Imagem de destaque aparece
- ✅ Título está legível
- ✅ Descrição está presente
- ✅ Preview é atraente

#### Nota

O WhatsApp também usa Open Graph, então o comportamento deve ser similar ao Facebook.

## Checklist de Validação Completa

### Para Cada Artigo Novo ou Atualizado

#### Pré-Publicação

- [ ] Título tem entre 10-60 caracteres
- [ ] Descrição tem entre 120-155 caracteres
- [ ] Imagem de destaque existe em `/public/`
- [ ] Imagem tem dimensões exatas de 1200x630px
- [ ] Imagem tem tamanho < 5MB (idealmente < 1MB)
- [ ] Slug está correto e corresponde à URL
- [ ] Data de publicação está no formato ISO 8601
- [ ] Categoria está definida
- [ ] Tags relevantes estão incluídas (se aplicável)
- [ ] Tempo de leitura está estimado

#### Pós-Publicação

- [ ] Artigo está acessível na URL correta
- [ ] Facebook Sharing Debugger mostra preview correto
- [ ] Twitter Card Validator mostra card correto
- [ ] LinkedIn Post Inspector mostra preview correto
- [ ] WhatsApp mostra preview correto (testar em dispositivo móvel)

#### Validação Técnica

- [ ] Todas as URLs são absolutas (incluem https://acifra.com)
- [ ] Meta tags Open Graph estão presentes no HTML
- [ ] Meta tags Twitter Cards estão presentes no HTML
- [ ] Structured Data (JSON-LD) está válido
- [ ] Não há erros no console do navegador
- [ ] Não há avisos de validação no terminal

## Validação Automática (Desenvolvimento)

### Console do Navegador

Durante o desenvolvimento, a função `validateSocialMetadata` gera avisos e erros no console:

```javascript
// Avisos (warnings)
⚠️ Avisos de metadados sociais: [
  "Título muito longo (65 caracteres). Recomendado: máx 60 caracteres."
]

// Erros (errors)
❌ Erros de metadados sociais: [
  "Descrição excede 155 caracteres (180). Será truncada pelas redes sociais."
]
```

### Terminal (Build Time)

Durante o build do Next.js, você verá logs de metadados gerados:

```bash
📊 Metadados gerados para: O Risco é Você, Não o Bitcoin
```

## Testando Localmente

### 1. Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000/tema/[slug-do-artigo]`

### 2. Inspecionar HTML

1. Abra o DevTools (F12)
2. Vá para a aba "Elements" ou "Inspector"
3. Procure por `<head>`
4. Verifique as meta tags:

```html
<!-- Open Graph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://acifra.com/..." />
<meta property="og:url" content="https://acifra.com/tema/..." />
<meta property="og:type" content="article" />
<meta property="og:locale" content="pt_BR" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@cifras_coins" />
<meta name="twitter:creator" content="@cifras_coins" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://acifra.com/..." />
```

### 3. Validar JSON-LD

1. Procure por `<script type="application/ld+json">`
2. Copie o conteúdo JSON
3. Cole em: https://validator.schema.org/
4. Verifique se não há erros

## Problemas Comuns e Soluções

### Problema 1: Imagem Não Aparece

**Sintomas**:
- Facebook/Twitter não mostram imagem
- Ou mostram imagem padrão do site

**Causas Possíveis**:
1. Arquivo de imagem não existe em `/public/`
2. Caminho da imagem está incorreto
3. Imagem tem dimensões incorretas
4. Cache das redes sociais

**Soluções**:
1. Verificar se arquivo existe: `ls public/[nome-da-imagem].png`
2. Verificar caminho no código: deve começar com `/`
3. Verificar dimensões: deve ser exatamente 1200x630px
4. Limpar cache: usar "Scrape Again" no Facebook Debugger

### Problema 2: Descrição Truncada

**Sintomas**:
- Descrição aparece cortada com "..."
- Texto incompleto nas redes sociais

**Causas Possíveis**:
1. Descrição excede 155 caracteres
2. Caracteres especiais contam como múltiplos

**Soluções**:
1. Reduzir descrição para máximo 155 caracteres
2. Remover caracteres especiais desnecessários
3. Usar função de truncamento automático (já implementada)

### Problema 3: Título Muito Longo

**Sintomas**:
- Título aparece cortado
- Layout quebrado no preview

**Causas Possíveis**:
1. Título excede 60 caracteres (recomendado)
2. Título muito descritivo

**Soluções**:
1. Encurtar título para 40-60 caracteres
2. Mover detalhes para a descrição
3. Usar título mais direto e impactante

### Problema 4: Cache Antigo

**Sintomas**:
- Alterações não aparecem nas redes sociais
- Imagem ou texto antigo ainda é exibido

**Causas Possíveis**:
1. Cache do Facebook/Twitter/LinkedIn
2. CDN cache
3. Browser cache

**Soluções**:
1. Facebook: Usar "Scrape Again" no Debugger
2. Twitter: Aguardar alguns minutos e testar novamente
3. LinkedIn: Usar Post Inspector para forçar atualização
4. Browser: Limpar cache ou usar modo anônimo

### Problema 5: URLs Relativas

**Sintomas**:
- Imagens não carregam em redes sociais
- Links quebrados

**Causas Possíveis**:
1. URLs de imagens são relativas (ex: `/imagem.png`)
2. Falta domínio completo

**Soluções**:
1. Sempre usar URLs absolutas: `https://acifra.com/imagem.png`
2. A função `generateArticleMetadata` já faz isso automaticamente

## Testes de Acessibilidade

### Contraste de Cores

Use ferramentas para verificar contraste:
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- Mínimo: 4.5:1 para texto normal
- Mínimo: 3:1 para texto grande

### Texto Alternativo

Sempre inclua texto alternativo descritivo:

```typescript
images: [
  {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: 'Descrição detalhada da imagem', // ← Importante!
  }
]
```

## Monitoramento Contínuo

### Checklist Mensal

- [ ] Testar 3-5 artigos aleatórios em todas as plataformas
- [ ] Verificar se imagens ainda carregam corretamente
- [ ] Confirmar que metadados estão atualizados
- [ ] Revisar descrições para otimização SEO

### Após Mudanças no Site

- [ ] Testar todos os artigos principais
- [ ] Verificar se mudanças no layout afetaram metadados
- [ ] Confirmar que URLs canônicas ainda estão corretas

## Recursos Adicionais

### Documentação Oficial

- **Open Graph Protocol**: https://ogp.me/
- **Twitter Cards**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **Schema.org Article**: https://schema.org/Article

### Ferramentas Úteis

- **Meta Tags**: https://metatags.io/ - Gerador e preview de meta tags
- **Open Graph Check**: https://www.opengraph.xyz/ - Validador alternativo
- **Social Share Preview**: https://socialsharepreview.com/ - Preview em múltiplas plataformas

## Exemplo de Fluxo de Validação

### 1. Criar/Atualizar Artigo

```typescript
export const metadata = generateArticleMetadata({
  title: 'Título do Artigo',
  description: 'Descrição otimizada com 120-155 caracteres.',
  slug: 'titulo-do-artigo',
  image: '/titulo-do-artigo.png',
  author: 'Jonatha Pereira',
  publishedDate: '2025-10-21T10:00:00.000Z',
  category: 'Categoria',
  tags: ['tag1', 'tag2'],
  readingTime: '10 min'
});
```

### 2. Verificar Console (Desenvolvimento)

```bash
npm run dev
# Abrir http://localhost:3000/tema/titulo-do-artigo
# Verificar console do navegador para avisos/erros
```

### 3. Inspecionar HTML

- Abrir DevTools
- Verificar `<head>` para meta tags
- Confirmar URLs absolutas

### 4. Testar em Produção

```bash
npm run build
npm run start
# Ou fazer deploy e testar na URL de produção
```

### 5. Validar em Ferramentas Oficiais

1. Facebook Sharing Debugger
2. Twitter Card Validator
3. LinkedIn Post Inspector
4. WhatsApp (mobile)

### 6. Documentar Resultados

- [ ] Todas as plataformas OK
- [ ] Imagem carrega corretamente
- [ ] Texto está legível
- [ ] Preview é atraente

---

**Última atualização**: 21 de outubro de 2025  
**Mantido por**: Equipe A Cifra
