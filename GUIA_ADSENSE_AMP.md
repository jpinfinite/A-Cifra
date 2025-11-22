# 📱 Guia de Implementação AdSense + AMP

## ✅ Configuração Atual

### 1. **Anúncios Automáticos Ativados**
- ✅ Anúncios automáticos para AMP
- ✅ Anúncios in-page
- ✅ Anúncios âncora (fixos na borda)

### 2. **Componentes Criados**

#### `<AmpAd />` - Anúncio AMP Responsivo
```tsx
import { AmpAd } from '@/components/ads'

<AmpAd 
  slot="1234567890"  // Seu slot ID
  format="auto"       // auto, rectangle, vertical, horizontal
  responsive={true}
/>
```

#### `<InArticleAd />` - Anúncio dentro do artigo
```tsx
import { InArticleAd } from '@/components/ads'

<InArticleAd />
```

#### `<DisplayAd />` - Anúncio display padrão
```tsx
import { DisplayAd } from '@/components/ads'

<DisplayAd 
  slot="1234567890"
  format="auto"
/>
```

## 🎯 Como Usar nos Artigos

### Exemplo 1: Artigo com anúncios
```tsx
// src/app/artigo/[slug]/page.tsx
import { InArticleAd } from '@/components/ads'

export default function ArticlePage() {
  return (
    <article>
      <h1>Título do Artigo</h1>
      
      {/* Primeiro parágrafo */}
      <p>Conteúdo...</p>
      
      {/* Anúncio no meio do artigo */}
      <InArticleAd />
      
      {/* Resto do conteúdo */}
      <p>Mais conteúdo...</p>
    </article>
  )
}
```

### Exemplo 2: Sidebar com anúncios
```tsx
import { DisplayAd } from '@/components/ads'

<aside className="sidebar">
  <DisplayAd format="vertical" />
</aside>
```

## 📊 Formatos de Anúncio

### 1. **Auto (Recomendado)**
- Adapta-se automaticamente ao espaço
- Melhor para responsividade

### 2. **Rectangle**
- Formato retangular
- Bom para sidebars

### 3. **Vertical**
- Formato vertical
- Ideal para sidebars laterais

### 4. **Horizontal**
- Formato horizontal
- Bom para header/footer

## 🔧 Configuração no AdSense

### Passo 1: Criar Unidades de Anúncio
1. Acesse: https://www.google.com/adsense
2. Vá em **Anúncios** → **Por unidade de anúncio**
3. Clique em **Nova unidade de anúncio**
4. Escolha o tipo:
   - **Display** - Para anúncios gerais
   - **In-article** - Para dentro dos artigos
   - **Multiplex** - Para anúncios relacionados

### Passo 2: Copiar o Slot ID
Após criar, copie o `data-ad-slot="XXXXXXXXXX"` e use nos componentes.

### Passo 3: Ativar Anúncios Automáticos
1. Vá em **Anúncios** → **Por site**
2. Encontre seu site: **a-cifra.com.br**
3. Ative:
   - ✅ Anúncios automáticos para AMP
   - ✅ Anúncios in-page
   - ✅ Anúncios âncora

## 🚀 Próximos Passos

### 1. **Aguardar Aprovação**
- O Google pode levar 1-2 semanas para aprovar
- Continue criando conteúdo de qualidade

### 2. **Testar Anúncios**
- Após aprovação, teste em diferentes dispositivos
- Verifique se os anúncios aparecem corretamente

### 3. **Otimizar Posicionamento**
- Coloque anúncios em locais estratégicos
- Não exagere na quantidade (máximo 3 por página)

### 4. **Monitorar Performance**
- Acesse o painel do AdSense regularmente
- Analise CTR, RPM e receita

## ⚠️ Boas Práticas

### ✅ FAÇA:
- Use anúncios automáticos (já configurado)
- Coloque anúncios em locais naturais
- Mantenha o conteúdo de qualidade
- Respeite as políticas do AdSense

### ❌ NÃO FAÇA:
- Não clique nos próprios anúncios
- Não peça para outros clicarem
- Não coloque muitos anúncios (máx 3 por página)
- Não use conteúdo copiado

## 📈 Expectativas Realistas

### Primeiros 3 meses:
- **Tráfego**: 100-1000 visitantes/dia
- **Receita**: R$ 10-50/mês
- **Foco**: Criar conteúdo e aumentar tráfego

### 6-12 meses:
- **Tráfego**: 1000-5000 visitantes/dia
- **Receita**: R$ 100-500/mês
- **Foco**: SEO e marketing de conteúdo

### 1-2 anos:
- **Tráfego**: 5000+ visitantes/dia
- **Receita**: R$ 500-2000+/mês
- **Foco**: Diversificar receitas

## 🔗 Links Úteis

- [Central de Ajuda AdSense](https://support.google.com/adsense)
- [Políticas do AdSense](https://support.google.com/adsense/answer/48182)
- [Guia AMP](https://amp.dev/documentation/guides-and-tutorials/)
- [Otimização de Anúncios](https://support.google.com/adsense/answer/9183549)

## 📞 Suporte

Se tiver dúvidas:
1. Verifique a Central de Ajuda do AdSense
2. Acesse o Fórum da Comunidade AdSense
3. Entre em contato com o suporte do Google

---

**Última atualização**: 21/11/2024
**Status**: ✅ Configurado e pronto para uso
