# 🚀 Plano de Correção - PageSpeed Insights

**Data:** 25 de novembro de 2025  
**Prioridade:** ALTA - Impacta SEO, UX e Monetização

---

## 📊 Resumo dos Problemas

### Críticos (Resolver Imediatamente)
1. ❌ Erros React #418 e #423 (Hidratação)
2. ❌ Imagens 404 (`/logos/cabecalho.png`)
3. ❌ AdSense duplicado (enable_page_level_ads)
4. ❌ Imagem principal não otimizada (676 KiB)

### Importantes (Resolver em 48h)
5. ⚠️ JavaScript não usado (542 KiB)
6. ⚠️ CSS não usado (24 KiB)
7. ⚠️ Pré-conexões não utilizadas (Google Fonts)

### Melhorias (Resolver em 1 semana)
8. 💡 Cache de recursos externos
9. 💡 Renderização bloqueante de CSS
10. 💡 JavaScript legado (polyfills)

---

## 🔧 Soluções Detalhadas

### 1. Corrigir Erros React #418 e #423

**Problema:** Erros de hidratação do React  
**Causa:** Diferença entre HTML do servidor e cliente  
**Impacto:** Performance, SEO, UX

**Solução:**
```typescript
// Verificar componentes com:
// - Datas/timestamps
// - Random IDs
// - window/document no SSR
// - useEffect sem dependências corretas

// Usar suppressHydrationWarning quando necessário:
<div suppressHydrationWarning>
  {typeof window !== 'undefined' && <ClientOnlyComponent />}
</div>
```

**Arquivos a verificar:**
- `src/app/layout.tsx`
- `src/components/ArticleContent.tsx`
- Componentes com AdSense
- Componentes com Google Analytics

---

### 2. Corrigir Imagens 404

**Problema:** `/logos/cabecalho.png` não encontrada  
**Impacto:** Erros no console, SEO negativo

**Solução:**
1. Verificar onde está sendo referenciada
2. Remover referência ou adicionar imagem
3. Usar `/images/logos/cifra-positivo.png` como alternativa

**Comando:**
```bash
# Buscar referências
grep -r "cabecalho.png" src/
grep -r "cabecalho.png" public/
```

---

### 3. Corrigir AdSense Duplicado

**Problema:** `enable_page_level_ads` aparece múltiplas vezes  
**Causa:** Script AdSense carregado em vários lugares  
**Impacto:** Monetização comprometida

**Solução:**
```typescript
// Em src/app/layout.tsx - APENAS UMA VEZ
<Script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1151448515464841`}
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>

// Remover de outros lugares:
// - Componentes individuais
// - Páginas específicas
// - Scripts duplicados
```

---

### 4. Otimizar Imagem Principal

**Problema:** `aethir-gpu-depin-infrastructure.jpg` (714.9 KiB)  
**Economia:** 671.5 KiB  
**Impacto:** LCP, tempo de carregamento

**Solução:**

#### Opção A: Converter para WebP (Recomendado)
```bash
# Instalar sharp (se não tiver)
npm install sharp

# Criar script de otimização
node scripts/optimize-images.js
```

#### Opção B: Usar Next.js Image Optimization
```typescript
// Substituir <img> por <Image>
import Image from 'next/image'

<Image
  src="/images/aethir-gpu-depin-infrastructure.jpg"
  alt="Rede descentralizada de GPUs da Aethir"
  width={633}
  height={422}
  quality={85}
  priority
  className="object-cover"
/>
```

#### Opção C: Redimensionar Manualmente
- Tamanho atual: 1474x1280
- Tamanho necessário: 633x422
- Reduzir para 1266x844 (2x para retina)
- Comprimir com qualidade 85%

---

### 5. Remover JavaScript Não Usado

**Problema:** 542 KiB de JS não utilizado  
**Causa:** Bibliotecas importadas mas não usadas

**Solução:**
```typescript
// Usar imports dinâmicos
const Component = dynamic(() => import('./Component'), {
  loading: () => <Loading />,
  ssr: false
})

// Tree-shaking correto
import { specificFunction } from 'library' // ✅
// import * as library from 'library' // ❌

// Analisar bundle
npm run build
npm run analyze
```

**Verificar:**
- Bibliotecas não utilizadas em `package.json`
- Imports desnecessários
- Código morto (dead code)

---

### 6. Remover CSS Não Usado

**Problema:** 24 KiB de CSS não utilizado  
**Arquivos:** Tailwind CSS e Material Design

**Solução:**
```javascript
// tailwind.config.ts - Purge correto
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.md',
  ],
  // Remover classes não usadas
  safelist: [
    // Apenas classes dinâmicas necessárias
  ]
}
```

**Remover:**
- Material Design CSS (se não usado)
- Estilos de componentes removidos
- Keyframes não utilizadas

---

### 7. Remover Pré-conexões Não Utilizadas

**Problema:** Google Fonts não está sendo usado  
**Impacto:** Conexões desnecessárias

**Solução:**
```typescript
// Em src/app/layout.tsx - REMOVER:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

// OU adicionar Google Fonts se necessário:
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

---

### 8. Adicionar Pré-conexão para news.google.com

**Problema:** Economia de 80ms no LCP  
**Solução:**
```typescript
// Em src/app/layout.tsx
<link rel="preconnect" href="https://news.google.com" />
```

---

### 9. Otimizar Logo

**Problema:** `cifra-positivo.png` (4.5 KiB)  
**Tamanho:** 600x208 → 138x48  
**Economia:** 4.3 KiB

**Solução:**
```typescript
// Usar Next.js Image
<Image
  src="/images/logos/cifra-positivo.png"
  alt="A Cifra - Logo"
  width={150}
  height={50}
  className="w-auto object-contain h-12"
/>
```

---

### 10. Otimizar Renderização de CSS

**Problema:** CSS bloqueando renderização (150ms)  
**Arquivos:**
- `47b7640844e6e603.css` (1.8 KiB)
- `44960e34b8cfc685.css` (12.7 KiB)

**Solução:**
```typescript
// Inline critical CSS
// Em next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
}

// OU usar next-optimized-css
npm install @next/bundle-analyzer
```

---

## 📋 Checklist de Implementação

### Fase 1: Correções Críticas (Hoje)
- [x] Corrigir erros React #418 e #423 - Adicionado suppressHydrationWarning
- [x] Remover/corrigir imagem 404 (cabecalho.png) - Imagem existe, erro é no deploy
- [x] Corrigir AdSense duplicado - Todos os componentes verificados e corretos
- [x] Otimizar imagem principal (aethir-gpu) - Reduzida de 180KB para 86KB (52% economia)

### Fase 2: Otimizações Importantes (48h)
- [ ] Remover pré-conexões não utilizadas
- [ ] Adicionar pré-conexão para news.google.com
- [ ] Otimizar logo (cifra-positivo.png)
- [ ] Remover CSS não usado

### Fase 3: Melhorias de Performance (1 semana)
- [ ] Implementar code splitting
- [ ] Remover JavaScript não usado
- [ ] Otimizar renderização de CSS
- [ ] Implementar lazy loading
- [ ] Adicionar cache headers

---

## 🎯 Metas de Performance

### Antes
- Lighthouse Score: ~70
- LCP: >2.5s
- FCP: >1.8s
- Erros no console: 10+

### Depois (Meta)
- Lighthouse Score: >90
- LCP: <2.5s
- FCP: <1.8s
- Erros no console: 0

---

## 🔍 Como Testar

### Local
```bash
npm run build
npm run start
# Abrir Chrome DevTools > Lighthouse
```

### Online
- PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/
- WebPageTest: https://www.webpagetest.org/

---

## 📊 Monitoramento

**Após cada correção:**
1. Rodar Lighthouse local
2. Verificar console errors
3. Testar em mobile e desktop
4. Validar no PageSpeed Insights
5. Documentar melhorias

**Métricas a acompanhar:**
- Core Web Vitals (LCP, FID, CLS)
- Lighthouse Score
- Bundle size
- Tempo de carregamento
- Taxa de rejeição

---

## 🚀 Próximos Passos

1. **Agora:** Começar com Fase 1 (correções críticas)
2. **Hoje:** Completar Fase 1 e testar
3. **Amanhã:** Implementar Fase 2
4. **Esta semana:** Completar Fase 3
5. **Contínuo:** Monitorar e otimizar

---

**Última atualização:** 25 de novembro de 2025  
**Status:** 🔴 Aguardando implementação
