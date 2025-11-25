# 🚀 Implementação Rápida - AdSense Otimizado

## ✅ Passo 1: Criar Novos Slots no AdSense

1. Acesse: https://www.google.com/adsense
2. Vá em **Anúncios** → **Por unidade**
3. Crie 3 novos slots:

### Slot 1: In-Article
- **Nome:** A Cifra - In-Article
- **Tipo:** In-article
- **Tamanho:** Responsivo
- **Copie o data-ad-slot:** `XXXXXXXX`

### Slot 2: Multiplex
- **Nome:** A Cifra - Multiplex
- **Tipo:** Multiplex
- **Tamanho:** Responsivo
- **Copie o data-ad-slot:** `YYYYYYYY`

### Slot 3: Display Responsivo
- **Nome:** A Cifra - Display
- **Tipo:** Display
- **Tamanho:** Responsivo
- **Copie o data-ad-slot:** `ZZZZZZZZ`

---

## ✅ Passo 2: Atualizar Componentes

### 2.1 Atualizar AdSenseInArticle.tsx
```typescript
// Linha 14: Substituir
slot = 'XXXXXXXX', // COLE O SLOT IN-ARTICLE AQUI
```

### 2.2 Atualizar AdSenseMultiplex.tsx
```typescript
// Linha 14: Substituir
slot = 'YYYYYYYY', // COLE O SLOT MULTIPLEX AQUI
```

---

## ✅ Passo 3: Adicionar Anúncios nos Artigos

### 3.1 Adicionar no ArticleContent.tsx

Abra: `src/components/content/ArticleContent.tsx`

**Adicione os imports:**
```typescript
import { AdSenseInArticle, AdSenseMultiplex } from '@/components/ads'
```

**Adicione no JSX (exemplo):**
```typescript
<div className="article-content">
  {/* Conteúdo do artigo */}
  <ReactMarkdown>{content}</ReactMarkdown>
  
  {/* Anúncio In-Article (meio do artigo) */}
  <AdSenseInArticle />
  
  {/* Mais conteúdo */}
  
  {/* Anúncio Multiplex (final do artigo) */}
  <AdSenseMultiplex />
</div>
```

---

## ✅ Passo 4: Ativar Auto Ads (RECOMENDADO)

### 4.1 No Google AdSense
1. Vá em **Anúncios** → **Visão geral**
2. Ative **Auto ads**
3. Marque:
   - ✅ Anúncios âncora
   - ✅ Anúncios vinheta
   - ✅ Anúncios in-page

### 4.2 Adicionar Script no Layout

Abra: `src/app/layout.tsx`

**Adicione no <head>:**
```typescript
<Script
  id="adsense-auto"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-1151448515464841",
        enable_page_level_ads: true,
        overlays: {bottom: true}
      });
    `
  }}
/>
```

---

## ✅ Passo 5: Testar

1. **Build local:**
   ```bash
   npm run build
   npm run start
   ```

2. **Verificar:**
   - Abra um artigo
   - Verifique se os anúncios aparecem
   - Teste em mobile e desktop

3. **Publicar:**
   ```bash
   git add .
   git commit -m "feat: adicionar anúncios AdSense otimizados"
   git push origin main
   ```

---

## 📊 Monitoramento (Primeiros 7 Dias)

### Dia 1-2
- Verificar se anúncios estão aparecendo
- Checar console do navegador (erros)
- Validar no AdSense (pode demorar 24h)

### Dia 3-5
- Analisar RPM
- Verificar impressões
- Ajustar posições se necessário

### Dia 6-7
- Comparar com semana anterior
- Identificar artigos com melhor performance
- Otimizar artigos de baixo desempenho

---

## 🎯 Metas Realistas

### Semana 1
- **Impressões:** 500-1.000
- **RPM:** US$ 2-4
- **Ganhos:** US$ 1-4

### Semana 2
- **Impressões:** 1.000-2.000
- **RPM:** US$ 3-5
- **Ganhos:** US$ 3-10

### Semana 3-4
- **Impressões:** 2.000-5.000
- **RPM:** US$ 4-6
- **Ganhos:** US$ 8-30

---

## ⚠️ Troubleshooting

### Anúncios não aparecem?
1. Verificar se o site está aprovado no AdSense
2. Aguardar 24-48h após implementação
3. Limpar cache do navegador
4. Verificar console do navegador (F12)

### RPM muito baixo?
1. Aumentar tráfego (SEO, redes sociais)
2. Focar em países Tier 1 (EUA, UK, CA)
3. Melhorar qualidade do conteúdo
4. Aumentar tempo na página

### Poucas impressões?
1. Adicionar mais anúncios (máximo 3 por página)
2. Ativar Auto Ads
3. Verificar se anúncios estão visíveis
4. Melhorar posicionamento

---

## 📞 Suporte

- **AdSense Help:** https://support.google.com/adsense
- **Comunidade:** https://support.google.com/adsense/community
- **Políticas:** https://support.google.com/adsense/answer/48182

---

**Tempo estimado de implementação:** 30-60 minutos  
**Resultado esperado:** Aumento de 300-500% nas impressões em 7 dias
