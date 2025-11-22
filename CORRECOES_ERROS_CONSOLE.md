# 🔧 Correções para Erros do Console

## 📋 Problemas Identificados

### 1. ❌ Erros React #418 & #423 (Hidratação)
**Causa**: Incompatibilidade entre renderização servidor/cliente

### 2. ❌ AdSense - Atributo data-nscript
**Causa**: Next.js Script com estratégia incorreta

### 3. ❌ Erros 404 - /categorias/index.txt e /categoria/undefined
**Causa**: Rotas faltando e navegação com slug undefined

### 4. ❌ CORS - Google News API
**Causa**: Configuração incorreta do Reader Revenue Manager

### 5. ❌ Google Tag Manager 404
**Causa**: ID incorreto ou script não configurado

---

## 🛠️ Soluções

### Solução 1: Corrigir Script do AdSense

O problema está na estratégia do Script. Vamos corrigir:

**Arquivo**: `src/app/layout.tsx`

```tsx
{/* Google AdSense - Anúncios Automáticos */}
<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1151448515464841"
  strategy="lazyOnload"  // ✅ Mudado de afterInteractive para lazyOnload
  crossOrigin="anonymous"
  async
/>
```

### Solução 2: Corrigir Google News Reader Revenue

O erro CORS está relacionado à configuração. Vamos ajustar:

```tsx
{/* Google News - Reader Revenue Manager */}
<Script
  src="https://news.google.com/swg/js/v1/swg-basic.js"
  strategy="lazyOnload"
  onError={(e) => {
    console.warn('Google News script failed to load:', e);
  }}
/>
<Script id="google-news-reader-revenue" strategy="lazyOnload">
  {`
    try {
      (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
        basicSubscriptions.init({
          type: "NewsArticle",
          isPartOfType: ["Product"],
          isPartOfProductId: "CAowy_XdCw:openaccess",
          clientOptions: { 
            theme: "light", 
            lang: "pt-BR" 
          },
        });
      });
    } catch (error) {
      console.warn('Google News initialization failed:', error);
    }
  `}
</Script>
```

### Solução 3: Criar Página de Categorias

**Criar arquivo**: `src/app/categorias/page.tsx`

```tsx
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { categories } from '@/lib/config'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categorias - Explore Tópicos sobre Criptomoedas',
  description: 'Navegue por todas as categorias de conteúdo sobre criptomoedas, blockchain, DeFi, NFTs e muito mais.',
}

export default function CategoriasPage() {
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="text-center mb-12">
          <Heading level={1} className="mb-4">
            Categorias
          </Heading>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
            Explore nosso conteúdo organizado por tópicos
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-brand-primary-blue hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-light-blue rounded-lg flex items-center justify-center group-hover:bg-brand-primary-blue transition-colors">
                  <span className="text-2xl">{category.icon || '📁'}</span>
                </div>
                <div className="flex-1">
                  <Heading level={3} className="mb-2 group-hover:text-brand-primary-blue transition-colors">
                    {category.name}
                  </Heading>
                  <Text size="sm" className="text-gray-600 line-clamp-2">
                    {category.description}
                  </Text>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </MainLayout>
  )
}
```

### Solução 4: Adicionar Validação no Link de Categoria

Para evitar o erro `/categoria/undefined`, adicione validação nos componentes que linkam para categorias:

**Exemplo de correção em componentes**:

```tsx
// Antes
<Link href={`/categoria/${article.category}`}>

// Depois
<Link href={article.category ? `/categoria/${article.category}` : '/categorias'}>
```

### Solução 5: Adicionar Error Boundary

**Criar arquivo**: `src/app/error.tsx` (atualizar se já existe)

```tsx
'use client'

import { useEffect } from 'react'
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para monitoramento
    console.error('Erro capturado:', error)
  }, [error])

  return (
    <MainLayout>
      <Container className="py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <span className="text-6xl">⚠️</span>
          </div>
          <Heading level={2} className="mb-4">
            Algo deu errado!
          </Heading>
          <Text className="text-gray-600 mb-6">
            Desculpe, encontramos um erro inesperado. Por favor, tente novamente.
          </Text>
          <button
            onClick={reset}
            className="px-6 py-3 bg-brand-primary-blue text-white font-semibold rounded-lg hover:bg-brand-medium-blue transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </Container>
    </MainLayout>
  )
}
```

### Solução 6: Suprimir Avisos do AdSense (Temporário)

Adicione no `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... outras configurações
  
  // Suprimir avisos específicos do console
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
```

---

## 🎯 Prioridade de Implementação

1. **Alta**: Corrigir Script do AdSense (Solução 1)
2. **Alta**: Criar página de Categorias (Solução 3)
3. **Média**: Adicionar validação de categoria (Solução 4)
4. **Média**: Corrigir Google News (Solução 2)
5. **Baixa**: Error Boundary (Solução 5)

---

## 📊 Erros que Serão Resolvidos

✅ React Error #418 & #423 (parcialmente)
✅ AdSense data-nscript warning
✅ 404 em /categorias/index.txt
✅ 404 em /categoria/undefined
✅ CORS Google News (parcialmente)
⚠️ Erros 400 do Google Ads (dependem da configuração do AdSense)

---

## 🔍 Próximos Passos

1. Implementar as soluções na ordem de prioridade
2. Testar em ambiente de desenvolvimento
3. Verificar console do navegador
4. Fazer deploy e monitorar erros em produção
5. Ajustar configurações do Google AdSense no painel

---

## 💡 Dicas Adicionais

- **Performance**: Os scripts estão com `strategy="lazyOnload"` para não bloquear a renderização
- **SEO**: A página de categorias melhorará a navegação e indexação
- **UX**: Error boundaries melhoram a experiência do usuário
- **Monitoramento**: Considere adicionar Sentry ou similar para rastrear erros em produção
