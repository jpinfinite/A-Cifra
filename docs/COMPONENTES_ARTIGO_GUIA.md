# Guia de Componentes de Artigo - A Cifra

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Componentes Disponíveis](#componentes-disponíveis)
3. [Exemplos de Uso](#exemplos-de-uso)
4. [Boas Práticas](#boas-práticas)
5. [Customização](#customização)

---

## 🎯 Visão Geral

Este guia documenta os componentes reutilizáveis criados para artigos do A Cifra, seguindo a identidade visual premium com paleta azul (#00283B → #155C8B).

### Características Principais

- ✅ **Componentes modulares e reutilizáveis**
- ✅ **Design premium com gradientes azuis**
- ✅ **Totalmente responsivos**
- ✅ **Acessíveis (ARIA, semântica HTML)**
- ✅ **Otimizados para SEO**
- ✅ **Suporte a dark mode**
- ✅ **Tipografia premium (Inter + Poppins)**

---

## 🧩 Componentes Disponíveis

### 1. AlertBox

Caixas de alerta para informações críticas ou importantes.

**Props:**
- `children`: ReactNode - Conteúdo do alerta
- `variant`: 'critical' | 'warning' | 'info' | 'success' - Tipo de alerta (padrão: 'info')
- `icon`: string - Emoji customizado (opcional)

**Exemplo:**
```tsx
import { AlertBox } from '@/components/content'

<AlertBox variant="critical">
  <strong>🔐 CRÍTICO:</strong> Nunca compartilhe sua seed phrase com ninguém!
</AlertBox>
```

**Variantes:**
- `critical`: Vermelho - Para avisos críticos de segurança
- `warning`: Laranja - Para avisos importantes
- `info`: Azul - Para informações gerais (padrão)
- `success`: Verde - Para confirmações e sucessos

---

### 2. TipBox

Caixas de dicas e sugestões úteis.

**Props:**
- `children`: ReactNode - Conteúdo da dica
- `title`: string - Título da dica (padrão: 'Dica')
- `icon`: string - Emoji customizado (padrão: '💡')

**Exemplo:**
```tsx
import { TipBox } from '@/components/content'

<TipBox title="Economize em Taxas" icon="💰">
  <ul>
    <li>Use Layer 2 para taxas menores</li>
    <li>Faça transações em horários de baixa demanda</li>
  </ul>
</TipBox>
```

---

### 3. WarningBox

Caixas de aviso com diferentes níveis de severidade.

**Props:**
- `children`: ReactNode - Conteúdo do aviso
- `title`: string - Título do aviso (padrão: 'Atenção')
- `severity`: 'high' | 'medium' | 'low' - Nível de severidade (padrão: 'medium')

**Exemplo:**
```tsx
import { WarningBox } from '@/components/content'

<WarningBox severity="high" title="ATENÇÃO: Transações são Irreversíveis!">
  <p>Sempre verifique 3 vezes antes de confirmar uma transação.</p>
</WarningBox>
```

**Níveis de Severidade:**
- `high`: Vermelho intenso com animação pulsante
- `medium`: Laranja - Avisos importantes
- `low`: Amarelo - Avisos leves

---

### 4. InfoBox

Caixas informativas versáteis para destacar conteúdo.

**Props:**
- `children`: ReactNode - Conteúdo da caixa
- `title`: string - Título (opcional)
- `icon`: string - Emoji (padrão: 'ℹ️')
- `variant`: 'default' | 'premium' | 'highlight' - Estilo visual (padrão: 'default')

**Exemplo:**
```tsx
import { InfoBox } from '@/components/content'

<InfoBox title="Por que MetaMask é popular?" icon="🌟" variant="highlight">
  <ul>
    <li>✅ Gratuita e open-source</li>
    <li>✅ Fácil de usar</li>
    <li>✅ Multi-plataforma</li>
  </ul>
</InfoBox>
```

**Variantes:**
- `default`: Fundo claro com borda azul
- `premium`: Gradiente azul escuro com efeito glass
- `highlight`: Fundo dourado para destaque especial

---

### 5. TableOfContents

Índice dinâmico com navegação suave e destaque do item ativo.

**Props:**
- `contentId`: string - ID do container do artigo (padrão: 'article-content')
- `className`: string - Classes CSS adicionais (opcional)

**Exemplo:**
```tsx
import { TableOfContents } from '@/components/content'

<aside className="lg:col-span-4">
  <div className="sticky top-24">
    <TableOfContents />
  </div>
</aside>
```

**Funcionalidades:**
- ✅ Extração automática de headings (h2, h3, h4)
- ✅ Navegação suave ao clicar
- ✅ Destaque do item ativo durante scroll
- ✅ Sticky positioning
- ✅ Scrollbar customizada

---

## 💡 Exemplos de Uso

### Estrutura Completa de Artigo

```tsx
import { 
  AlertBox, 
  TipBox, 
  WarningBox, 
  InfoBox,
  TableOfContents 
} from '@/components/content'

export const MeuArtigo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Conteúdo Principal */}
      <main className="lg:col-span-8">
        <article id="article-content" className="prose prose-lg max-w-none">
          <h1>Título do Artigo</h1>
          
          <InfoBox title="Introdução" icon="📌" variant="highlight">
            Informação importante para começar...
          </InfoBox>

          <h2 id="secao-1">Seção 1</h2>
          <p>Conteúdo da seção...</p>

          <TipBox title="Dica Útil" icon="💡">
            Uma dica valiosa para o leitor...
          </TipBox>

          <h2 id="secao-2">Seção 2</h2>
          
          <WarningBox severity="high" title="ATENÇÃO">
            Aviso importante sobre segurança...
          </WarningBox>

          <AlertBox variant="critical">
            <strong>CRÍTICO:</strong> Informação crítica...
          </AlertBox>
        </article>
      </main>

      {/* Sidebar com Índice */}
      <aside className="lg:col-span-4">
        <div className="sticky top-24">
          <TableOfContents />
        </div>
      </aside>
    </div>
  )
}
```

### Criando um Novo Artigo

1. **Criar arquivo de dados:**

```typescript
// src/data/meuArtigo.ts
import { BlogPost } from '@/types'
import { categories } from '@/lib/config'

export const meuArtigo: BlogPost = {
  id: '20',
  title: 'Título do Artigo',
  slug: 'titulo-do-artigo',
  excerpt: 'Resumo do artigo...',
  content: '', // Renderizado via componente
  coverImage: {
    src: '/images/cover.jpg',
    alt: 'Descrição da imagem',
    width: 1200,
    height: 630
  },
  author: {
    name: 'Jonatha Pereira',
    avatar: '/Jonatha-Pereira-SEO.png'
  },
  publishedAt: new Date('2025-10-27'),
  updatedAt: new Date('2025-10-27'),
  category: categories.find(c => c.slug === 'tutoriais')!,
  tags: ['tag1', 'tag2', 'tag3'],
  seo: {
    metaTitle: 'Título SEO | A Cifra',
    metaDescription: 'Descrição para SEO...',
    keywords: ['palavra1', 'palavra2']
  }
}
```

2. **Criar componente do artigo:**

```tsx
// src/components/content/MeuArtigo.tsx
'use client'

import { AlertBox, TipBox, InfoBox } from '@/components/content'

export const MeuArtigo = () => {
  return (
    <article id="article-content" className="prose prose-lg max-w-none">
      {/* Seu conteúdo aqui */}
    </article>
  )
}
```

3. **Criar página:**

```tsx
// src/app/artigo/titulo-do-artigo/page.tsx
import { Metadata } from 'next'
import { MeuArtigo } from '@/components/content/MeuArtigo'
import { TableOfContents } from '@/components/content/TableOfContents'
import { meuArtigo } from '@/data/meuArtigo'

export const metadata: Metadata = {
  title: meuArtigo.seo.metaTitle,
  description: meuArtigo.seo.metaDescription,
  // ... outros metadados
}

export default function MeuArtigoPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <main className="lg:col-span-8">
        <MeuArtigo />
      </main>
      <aside className="lg:col-span-4">
        <TableOfContents />
      </aside>
    </div>
  )
}
```

---

## 🎨 Boas Práticas

### 1. Hierarquia de Informação

Use os componentes de forma hierárquica:

```tsx
// ✅ BOM
<InfoBox variant="highlight">
  Informação introdutória importante
</InfoBox>

<TipBox>
  Dica útil relacionada
</TipBox>

<WarningBox severity="medium">
  Aviso sobre possíveis problemas
</WarningBox>

<AlertBox variant="critical">
  Informação crítica de segurança
</AlertBox>
```

### 2. Uso de Ícones

Escolha emojis que reforcem a mensagem:

```tsx
// Segurança
<AlertBox variant="critical" icon="🔐">
<WarningBox severity="high" icon="🚨">

// Dinheiro/Economia
<TipBox icon="💰">
<InfoBox icon="💵">

// Sucesso/Confirmação
<AlertBox variant="success" icon="✅">

// Informação
<InfoBox icon="ℹ️">
<TipBox icon="💡">
```

### 3. Acessibilidade

- Use `variant` apropriado para a severidade da mensagem
- Mantenha contraste adequado (AA/AAA)
- Forneça texto alternativo descritivo
- Use headings em ordem correta (h1 → h2 → h3)

### 4. SEO

```tsx
// ✅ BOM - IDs descritivos para navegação
<h2 id="como-instalar-metamask">Como Instalar MetaMask</h2>

// ❌ RUIM - IDs genéricos
<h2 id="section-1">Como Instalar MetaMask</h2>
```

### 5. Performance

- Use `loading="lazy"` para imagens abaixo da dobra
- Use `priority` para imagens acima da dobra
- Otimize imagens (WebP, tamanho adequado)

---

## 🎨 Customização

### Cores do Tema

As cores estão definidas em `src/styles/article.css`:

```css
:root {
  --color-primary-dark: #00283B;
  --color-primary: #155C8B;
  --color-primary-light: #2E7DAF;
  --color-accent: #FFD700;
  --color-accent-dark: #B8860B;
}
```

### Tipografia

Fontes utilizadas:
- **Headings**: Poppins (700, 600)
- **Body**: Inter (400, 500, 600)

### Espaçamento

```css
:root {
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
}
```

---

## 📚 Recursos Adicionais

### Importar Estilos Globais

Adicione ao `layout.tsx`:

```tsx
import '@/styles/article.css'
```

### Componentes Relacionados

- `Breadcrumb` - Navegação estrutural
- `ArticleLayout` - Layout padrão de artigos
- `StructuredData` - Schema.org para SEO

### Ferramentas Úteis

- **Verificar Contraste**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Validar HTML**: [W3C Validator](https://validator.w3.org/)
- **Testar Acessibilidade**: [WAVE](https://wave.webaim.org/)
- **Schema.org**: [Schema Markup Validator](https://validator.schema.org/)

---

## 🤝 Contribuindo

Para adicionar novos componentes:

1. Crie o componente em `src/components/content/`
2. Adicione ao `index.ts` para exportação
3. Documente neste guia
4. Adicione exemplos de uso
5. Teste acessibilidade e responsividade

---

## 📝 Changelog

### v1.0.0 (2025-10-27)
- ✅ Componentes iniciais: AlertBox, TipBox, WarningBox, InfoBox
- ✅ TableOfContents com navegação dinâmica
- ✅ Estilos globais premium
- ✅ Artigo MetaMask como exemplo completo
- ✅ Documentação completa

---

**Desenvolvido com ❤️ para A Cifra**
