# 🎯 Como Obter Slot IDs do AdSense

## 📋 Passo a Passo

### 1. Acessar o Painel do AdSense
1. Vá para: https://www.google.com/adsense
2. Faça login com sua conta

### 2. Criar Unidades de Anúncio

#### Para Anúncios In-Article (Dentro dos Artigos):
1. Clique em **"Anúncios"** no menu lateral
2. Clique em **"Por unidade de anúncio"**
3. Clique em **"Nova unidade de anúncio"**
4. Escolha **"In-article"**
5. Configure:
   - **Nome**: "Artigo - Meio do Conteúdo"
   - **Tamanho**: Responsivo
6. Clique em **"Criar"**
7. **Copie o código** e procure por: `data-ad-slot="XXXXXXXXXX"`
8. Esse número é seu **Slot ID**

#### Para Anúncios Sidebar (Barra Lateral):
1. Clique em **"Nova unidade de anúncio"**
2. Escolha **"Display"**
3. Configure:
   - **Nome**: "Sidebar - Direita"
   - **Tamanho**: Vertical (300x600) ou Responsivo
4. Clique em **"Criar"**
5. **Copie o Slot ID**

#### Para Anúncios Display (Gerais):
1. Clique em **"Nova unidade de anúncio"**
2. Escolha **"Display"**
3. Configure:
   - **Nome**: "Header - Topo" ou "Footer - Rodapé"
   - **Tamanho**: Horizontal (728x90) ou Responsivo
4. Clique em **"Criar"**
5. **Copie o Slot ID**

### 3. Usar os Slot IDs no Código

#### Exemplo de código do AdSense:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1151448515464841"
     data-ad-slot="1234567890"  <!-- ESTE É O SLOT ID -->
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

#### Como usar no seu site:

**Anúncio In-Article:**
```tsx
<InArticleAd slot="1234567890" />
```

**Anúncio Sidebar:**
```tsx
<SidebarAd slot="0987654321" sticky={true} />
```

**Anúncio Display:**
```tsx
<DisplayAd slot="1122334455" format="auto" />
```

## 📊 Unidades Recomendadas para Criar

### 1. **In-Article - Início** (Após introdução)
- Nome: "Artigo - Início"
- Tipo: In-article
- Slot ID: Copie e use no primeiro `<InArticleAd />`

### 2. **In-Article - Meio** (40% do conteúdo)
- Nome: "Artigo - Meio"
- Tipo: In-article
- Slot ID: Copie e use no segundo `<InArticleAd />`

### 3. **In-Article - Final** (Antes dos relacionados)
- Nome: "Artigo - Final"
- Tipo: In-article
- Slot ID: Copie e use no terceiro `<InArticleAd />`

### 4. **Sidebar - Principal**
- Nome: "Sidebar - Direita"
- Tipo: Display (Vertical)
- Slot ID: Copie e use no `<SidebarAd />`

### 5. **Display - Header** (Opcional)
- Nome: "Header - Topo"
- Tipo: Display (Horizontal)
- Slot ID: Copie e use no header

## 🎯 Onde Adicionar os Slot IDs

### Arquivo: `src/app/artigo/[slug]/page.tsx`

Substitua os números de exemplo pelos seus Slot IDs reais:

```tsx
{/* Ad antes do conteúdo */}
<InArticleAd slot="SEU_SLOT_ID_1" />

{/* Ad no meio do artigo */}
<InArticleAd slot="SEU_SLOT_ID_2" />

{/* Ad antes dos artigos relacionados */}
<InArticleAd slot="SEU_SLOT_ID_3" />

{/* Sidebar Ad */}
<SidebarAd slot="SEU_SLOT_ID_4" sticky={true} />
```

## ⚠️ Importante

### Opção 1: Usar Anúncios Automáticos (Recomendado para Início)
- **Não precisa de Slot IDs**
- Google coloca anúncios automaticamente
- Você já tem isso configurado! ✅

### Opção 2: Usar Anúncios Manuais (Para Controle Total)
- **Precisa criar unidades e obter Slot IDs**
- Você controla exatamente onde aparecem
- Pode combinar com anúncios automáticos

### Opção 3: Híbrido (Melhor dos Dois Mundos)
- **Anúncios automáticos + alguns manuais**
- Google preenche espaços vazios
- Você controla posições estratégicas

## 🚀 Recomendação

**Para começar:**
1. ✅ Mantenha apenas os **anúncios automáticos** (já configurado)
2. ✅ Aguarde 1-2 semanas para ver performance
3. ✅ Depois, adicione anúncios manuais se quiser mais controle

**Após 1 mês:**
1. Analise quais páginas têm melhor CTR
2. Crie unidades manuais para essas páginas
3. Compare performance automático vs manual

## 📈 Monitoramento

Acesse o painel do AdSense para ver:
- Quais unidades têm melhor performance
- CTR de cada posição
- Receita por unidade
- Impressões e cliques

## 🔗 Links Úteis

- [Criar Unidades de Anúncio](https://support.google.com/adsense/answer/9274025)
- [Tipos de Anúncios](https://support.google.com/adsense/answer/9274019)
- [Otimizar Posicionamento](https://support.google.com/adsense/answer/9183549)

---

**Dica:** Comece simples com anúncios automáticos. Adicione anúncios manuais apenas quando tiver dados suficientes para tomar decisões informadas! 📊
