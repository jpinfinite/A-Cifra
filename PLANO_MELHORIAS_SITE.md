# 🔧 PLANO DE MELHORIAS COMPLETO - A CIFRA

**Data:** 26 de novembro de 2025
**Status:** Em Execu
-

## 🎯 PROBLEMAS IDENTIFICADOS E SOLUÇÕES

### 🔴 CRÍTICOS (Implementar Agora)

#### 1. Imagens Não Aparecendo nos Artigos Novos
- **Status**: ✅ RESOLVIDO
- **Causa**: Imagem 227.jpg não estava no Git
- **Solução**: Imagem adicionada e enviada
- **Deploy**: Em andamento

#### 2. Warnings do SafeImage.tsx
- **Status**: 🔄 EM CORREÇÃO
- **Problema**: Usando `<img>` ao invés de `next/image`
- **Impacto**: Performance LCP e bandwidth
- **Solução**: Suprimir warnings ou migrar para next/image

#### 3. Falta Schema Markup para FAQ
- **Status**: 🔄 EM CORREÇÃO
- **Problema**: FAQs não têm JSON-LD
- **Impacto**: Perde featured snippets no Google
- **Solução**: Adicionar schema.org/FAQPage

---

### 🟡 IMPORTANTES (Esta Semana)

#### 4. Falta Breadcrumbs
- **Problema**: Navegação não tem breadcrumbs
- **Impacto**: UX e SEO
- **Solução**: Implementar componente Breadcrumb

#### 5. Imagens Não Otimizadas
- **Problema**: Muitas imagens em JPG/PNG
- **Impacto**: Performance e velocidade
- **Solução**: Converter para WebP/AVIF

#### 6. Falta Submissão ao Google Search Console
- **Problema**: Artigos novos não submetidos
- **Impacto**: Indexação lenta
- **Solução**: Submeter manualmente

#### 7. Links Internos Insuficientes
- **Problema**: Artigos novos sem links de artigos antigos
- **Impacto**: SEO interno fraco
- **Solução**: Adicionar 3-5 links em artigos relacionados

---

### 🟢 MELHORIAS (Este Mês)

#### 8. Otimizar Bundle Size
- **Atual**: 250 KB (bom)
- **Meta**: 200 KB (excelente)
- **Ação**: Code splitting, lazy loading

#### 9. Adicionar Sitemap de Imagens
- **Problema**: Imagens não têm sitemap próprio
- **Solução**: Gerar image-sitemap.xml

#### 10. Implementar Cache de API
- **Problema**: Crypto prices sem cache
- **Solução**: Adicionar cache de 5 minutos

#### 11. Melhorar Acessibilidade
- **Problema**: Alguns elementos sem ARIA labels
- **Solução**: Adicionar labels e roles

#### 12. Adicionar Testes Automatizados
- **Problema**: Sem testes unitários
- **Solução**: Jest + React Testing Library

---

## 📊 PRIORIZAÇÃO

### Fase 1 - HOJE (2-3 horas)
1. ✅ Corrigir imagens (FEITO)
2. 🔄 Suprimir warnings SafeImage
3. 🔄 Adicionar Schema FAQ
4. 🔄 Criar script de validação pré-commit

### Fase 2 - ESTA SEMANA (5-8 horas)
5. Implementar Breadcrumbs
6. Otimizar imagens principais (top 20)
7. Submeter ao Google Search Console
8. Adicionar links internos (10 artigos)

### Fase 3 - ESTE MÊS (10-15 horas)
9. Converter todas imagens para WebP
10. Implementar cache de API
11. Melhorar acessibilidade
12. Adicionar testes básicos

---

## 🛠️ IMPLEMENTAÇÃO

### Correção 1: Suprimir Warnings SafeImage
```typescript
// eslint-disable-next-line @next/next/no-img-element
<img ... />
```

### Correção 2: Schema FAQ
```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
}
```

### Correção 3: Breadcrumbs
```typescript
<nav aria-label="breadcrumb">
  <ol itemScope itemType="https://schema.org/BreadcrumbList">
    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
      <a itemProp="item" href="/">
        <span itemProp="name">Home</span>
      </a>
      <meta itemProp="position" content="1" />
    </li>
  </ol>
</nav>
```

---

## 📈 MÉTRICAS DE SUCESSO

### Performance
- **Atual**: Lighthouse 85-90
- **Meta**: Lighthouse 95+
- **Ações**: Otimizar imagens, lazy loading, code splitting

### SEO
- **Atual**: 88/100
- **Meta**: 95/100
- **Ações**: Schema markup, breadcrumbs, links internos

### Acessibilidade
- **Atual**: 90/100
- **Meta**: 100/100
- **Ações**: ARIA labels, contraste, keyboard navigation

### Conversão
- **Atual**: 0% (novo)
- **Meta**: 2-3%
- **Ações**: CTAs otimizados, A/B testing

---

## 🎯 CHECKLIST DE EXECUÇÃO

### Hoje
- [x] Identificar todos os problemas
- [x] Criar plano de ação
- [x] Corrigir imagens faltantes
- [ ] Suprimir warnings SafeImage
- [ ] Adicionar Schema FAQ
- [ ] Criar Git hooks

### Esta Semana
- [ ] Implementar Breadcrumbs
- [ ] Otimizar top 20 imagens
- [ ] Submeter ao GSC
- [ ] Adicionar links internos

### Este Mês
- [ ] Converter todas imagens
- [ ] Implementar cache
- [ ] Melhorar a11y
- [ ] Adicionar testes

---

**Última atualização:** 26/11/2025 22:00
**Responsável:** Kiro - Agente Especialista A Cifra
