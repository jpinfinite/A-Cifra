Kiro, preciso que você me ajude a implementar as seguintes melhorias no site a-cifra.com.br:

1. ESTRUTURA DE ARQUIVOS E COMPONENTES

Crie/atualize os seguintes componentes e estruturas:

a) Layout padrão para artigos em markdown:
```yaml
---
id: 'artigo-yyyy-mm-dd-001'
title: 'Título Principal do Artigo'
slug: 'titulo-amigavel-para-url'
excerpt: 'Resumo em 160 caracteres com keywords'
coverImage: 
  src: '/images/categoria/YYYY-MM/imagem.webp'
  alt: 'Descrição detalhada'
  width: 1200
  height: 630
author:
  name: 'Nome do Autor' 
  avatar: '/authors/nome.webp'
publishedAt: 'YYYY-MM-DD'
updatedAt: 'YYYY-MM-DD'
categorySlug: 'categoria'
tags: ['tag1', 'tag2', 'tag3']
seo:
  metaTitle: 'Título SEO | A Cifra'
  metaDescription: 'Descrição SEO otimizada'
  keywords: ['keyword1', 'keyword2']
monetization:
  priority: 'high|medium|low'
  affiliateLinks: ['bitget', 'binance']
---