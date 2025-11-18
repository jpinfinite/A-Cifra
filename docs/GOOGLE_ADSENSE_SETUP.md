# Guia de Implementação do Google AdSense

## ✅ Status: APROVADO

Parabéns! Seu site foi aprovado pelo Google AdSense. Agora você pode começar a monetizar seu conteúdo.

## 📋 Informações da Conta

- **Publisher ID:** ca-pub-1151448515464841
- **Status:** Pronto ✅
- **Otimização automática:** ATIVADO ✅
- **Anúncios automáticos:** ATIVADO ✅

## 🎯 Tipos de Anúncios Implementados

### 1. AdSense Display (Banner Responsivo)
**Uso:** Sidebar, topo da página, entre seções

```tsx
import { AdSenseDisplay } from '@/components/ads'

<AdSenseDisplay adSlot="SEU_AD_SLOT_ID" />
```

**Onde usar:**
- Sidebar do blog
- Topo da página inicial
- Entre categorias
- Rodapé

### 2. AdSense In-Article (Dentro do Artigo)
**Uso:** Dentro do conteúdo do artigo

```tsx
import { AdSenseInArticle } from '@/components/ads'

<AdSenseInArticle adSlot="SEU_AD_SLOT_ID" />
```

**Onde usar:**
- Após 2-3 parágrafos do artigo
- No meio do conteúdo
- Antes da conclusão

### 3. AdSense Multiplex (Anúncios Relacionados)
**Uso:** Grid de conteúdo relacionado

```tsx
import { AdSenseMultiplex } from '@/components/ads'

<AdSenseMultiplex adSlot="SEU_AD_SLOT_ID" />
```

**Onde usar:**
- Final do artigo
- Seção "Leia também"
- Página de categorias

## 🚀 Como Criar Unidades de Anúncio

### Passo 1: Acessar o AdSense
1. Acesse [Google AdSense](https://www.google.com/adsense/)
2. Faça login com sua conta
3. Vá em **Anúncios** → **Por unidade de anúncio**

### Passo 2: Criar Unidade Display
1. Clique em **+ Nova unidade de anúncio**
2. Selecione **Anúncio gráfico**
3. Configure:
   - Nome: "A Cifra - Display Sidebar"
   - Tipo: Responsivo
   - Tamanho: Automático
4. Clique em **Criar**
5. Copie o **data-ad-slot** (ex: 1234567890)

### Passo 3: Criar Unidade In-Article
1. Clique em **+ Nova unidade de anúncio**
2. Selecione **In-article**
3. Configure:
   - Nome: "A Cifra - In-Article"
4. Clique em **Criar**
5. Copie o **data-ad-slot**

### Passo 4: Criar Unidade Multiplex
1. Clique em **+ Nova unidade de anúncio**
2. Selecione **Multiplex**
3. Configure:
   - Nome: "A Cifra - Multiplex Relacionados"
4. Clique em **Criar**
5. Copie o **data-ad-slot**

## 📝 Configurar os Ad Slots

Após criar as unidades, você precisa configurar os IDs no código:

### Opção 1: Variáveis de Ambiente (Recomendado)

Adicione no `.env.local`:

```env
# Google AdSense Ad Slots
NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT=0987654321
NEXT_PUBLIC_ADSENSE_MULTIPLEX_SLOT=1122334455
```

E use assim:

```tsx
<AdSenseDisplay adSlot={process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT!} />
```

### Opção 2: Arquivo de Configuração

Crie `src/config/adsense.ts`:

```typescript
export const adSenseConfig = {
  publisherId: 'ca-pub-1151448515464841',
  slots: {
    display: '1234567890',
    inArticle: '0987654321',
    multiplex: '1122334455'
  }
}
```

## 🎨 Onde Adicionar os Anúncios

### 1. Artigos Individuais

Edite `src/components/content/ArticleLayout.tsx`:

```tsx
import { AdSenseInArticle, AdSenseMultiplex } from '@/components/ads'

// Dentro do ArticleLayout, após o conteúdo:
<ArticleContent content={article.content} />

{/* Anúncio In-Article */}
<AdSenseInArticle adSlot="SEU_SLOT_IN_ARTICLE" />

{/* Mais conteúdo... */}

{/* Anúncio Multiplex no final */}
<AdSenseMultiplex adSlot="SEU_SLOT_MULTIPLEX" />
```

### 2. Página Inicial

Edite `src/components/HomePageClient.tsx`:

```tsx
import { AdSenseDisplay } from '@/components/ads'

// Entre seções:
<ArticleGrid articles={recentArticles} />

{/* Anúncio Display */}
<AdSenseDisplay adSlot="SEU_SLOT_DISPLAY" />

<NewsletterForm />
```

### 3. Sidebar (Se houver)

```tsx
<aside className="sidebar">
  <AdSenseDisplay adSlot="SEU_SLOT_DISPLAY" />
</aside>
```

## ⚙️ Otimizações Importantes

### 1. Lazy Loading
Os anúncios já são carregados de forma assíncrona, mas você pode melhorar:

```tsx
'use client'
import dynamic from 'next/dynamic'

const AdSenseDisplay = dynamic(
  () => import('@/components/ads').then(mod => mod.AdSenseDisplay),
  { ssr: false }
)
```

### 2. Espaçamento Adequado
Mantenha espaço suficiente entre anúncios:
- Mínimo 250px de altura para cada anúncio
- Pelo menos 1 viewport de distância entre anúncios

### 3. Não Exagere
Recomendações:
- Máximo 3 anúncios por página de artigo
- 1 anúncio a cada 500-700 palavras
- Não coloque anúncios no primeiro parágrafo

## 📊 Monitoramento

### Verificar Desempenho
1. Acesse o [AdSense Dashboard](https://www.google.com/adsense/)
2. Vá em **Relatórios**
3. Monitore:
   - RPM (Receita por mil impressões)
   - CTR (Taxa de cliques)
   - Impressões
   - Receita estimada

### Otimização Automática
O AdSense já está configurado com:
- ✅ Otimização automática de anúncios
- ✅ Anúncios automáticos ativados
- ✅ Formato responsivo

## 🚨 Políticas Importantes

### O Que NÃO Fazer:
- ❌ Clicar nos próprios anúncios
- ❌ Pedir para outros clicarem
- ❌ Colocar anúncios em páginas sem conteúdo
- ❌ Modificar o código dos anúncios
- ❌ Colocar mais de 3 anúncios por página

### O Que Fazer:
- ✅ Criar conteúdo de qualidade
- ✅ Aumentar o tráfego orgânico
- ✅ Melhorar a experiência do usuário
- ✅ Testar diferentes posições
- ✅ Monitorar o desempenho

## 🎯 Metas de Monetização

### Curto Prazo (1-3 meses)
- Implementar anúncios em todas as páginas
- Testar diferentes posições
- Alcançar 1000 visualizações/dia

### Médio Prazo (3-6 meses)
- Otimizar CTR para 1-2%
- Aumentar RPM para $5-10
- Criar mais conteúdo de qualidade

### Longo Prazo (6-12 meses)
- Alcançar 10.000 visualizações/dia
- RPM de $10-20
- Receita mensal de $500-1000

## 📞 Suporte

Se tiver problemas:
1. Verifique o [Centro de Ajuda do AdSense](https://support.google.com/adsense/)
2. Acesse o [Fórum da Comunidade](https://support.google.com/adsense/community)
3. Entre em contato com o suporte do AdSense

## 🔄 Próximos Passos

1. ✅ Criar unidades de anúncio no AdSense
2. ✅ Copiar os Ad Slot IDs
3. ✅ Configurar no código
4. ✅ Fazer deploy
5. ✅ Monitorar desempenho
6. ✅ Otimizar posições

---

**Última atualização:** 06/11/2025
**Status:** Implementação em andamento
