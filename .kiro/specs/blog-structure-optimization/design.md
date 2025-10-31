# Design Document: Blog A Cifra - Estrutura e Otimização

## Overview

Este documento detalha o design técnico e visual para a otimização completa do blog A Cifra, focando em uma experiência educacional profissional sobre criptomoedas com identidade visual consistente e performance otimizada.

## Architecture

### Arquitetura de Páginas

```
├── Home (/)
│   ├── Hero Section
│   ├── Artigos Destacados
│   ├── Newsletter Signup
│   └── Sobre A Cifra
├── Artigos (/tema/[slug])
│   ├── Header com Breadcrumbs
│   ├── Conteúdo Principal
│   ├── Sidebar (Índice + Relacionados)
│   └── Newsletter CTA
├── Categorias (/categoria/[categoria])
│   ├── Header da Categoria
│   ├── Grid de Artigos
│   ├── Filtros por Tag
│   └── Paginação
├── Busca (/busca)
│   ├── Campo de Busca
│   ├── Filtros Avançados
│   ├── Resultados
│   └── Sugestões
├── Sobre (/sobre)
│   ├── Biografia do Autor
│   ├── Filosofia do Blog
│   ├── Princípios Educacionais
│   └── Contato
├── Newsletter (/newsletter)
│   ├── Formulário de Inscrição
│   ├── Benefícios
│   ├── Arquivo de Edições
│   └── Política de Privacidade
└── Páginas Legais
    ├── Disclaimer (/disclaimer)
    ├── Privacidade (/privacidade)
    └── Termos (/termos)
```

### Sistema de Roteamento

```typescript
// Next.js App Router Structure
app/
├── page.tsx                    // Home
├── tema/
│   └── [slug]/
│       └── page.tsx           // Artigos dinâmicos
├── categoria/
│   └── [categoria]/
│       └── page.tsx           // Páginas de categoria
├── busca/
│   └── page.tsx               // Busca avançada
├── sobre/
│   └── page.tsx               // Sobre o autor
├── newsletter/
│   └── page.tsx               // Newsletter signup
├── disclaimer/
│   └── page.tsx               // Disclaimer legal
├── privacidade/
│   └── page.tsx               // Política de privacidade
└── termos/
    └── page.tsx               // Termos de uso
```

## Components and Interfaces

### Componentes de Layout

#### 1. Header Component
```typescript
interface HeaderProps {
  transparent?: boolean;
  fixed?: boolean;
}

// Features:
// - Logo A Cifra
// - Menu principal responsivo
// - Busca rápida
// - Dark/Light mode toggle
// - Mobile hamburger menu
```

#### 2. Navigation Component
```typescript
interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  icon?: string;
}

// Menu Structure:
// - Home
// - Artigos (dropdown com categorias)
// - Sobre
// - Newsletter
// - Contato
```

#### 3. Footer Component
```typescript
interface FooterProps {
  newsletter?: boolean;
  social?: boolean;
}

// Sections:
// - Links rápidos
// - Categorias populares
// - Newsletter signup
// - Redes sociais
// - Informações legais
```

### Componentes de Conteúdo

#### 1. ArticleCard Component
```typescript
interface ArticleCardProps {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  readingTime: string;
  publishedDate: string;
  image?: string;
  featured?: boolean;
}
```

#### 2. CategoryGrid Component
```typescript
interface CategoryGridProps {
  articles: Article[];
  category: string;
  pagination: PaginationData;
  filters: FilterOptions;
}
```

#### 3. SearchResults Component
```typescript
interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  filters: SearchFilters;
  totalResults: number;
}
```

### Componentes Educacionais (Existentes - Otimizar)

#### ArticleComponents (Já implementados)
- IntroBox
- QuestionCards
- StepCards
- ProcessFlow
- WarningBox
- FinalMessage
- Checklist

## Data Models

### Article Model
```typescript
interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: Category;
  tags: Tag[];
  author: Author;
  publishedDate: Date;
  modifiedDate: Date;
  readingTime: string;
  image?: string;
  featured: boolean;
  seo: SEOData;
}
```

### Category Model
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  articleCount: number;
}
```

### SEO Model
```typescript
interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  openGraph: OpenGraphData;
  structuredData: StructuredData;
}
```

## Error Handling

### Error Pages
```typescript
// 404 - Página não encontrada
// 500 - Erro interno do servidor
// Offline - Sem conexão
// Loading - Estados de carregamento

interface ErrorPageProps {
  statusCode: number;
  title: string;
  message: string;
  suggestions?: string[];
}
```

### Error Boundaries
```typescript
// React Error Boundaries para:
// - Componentes de artigo
// - Sistema de busca
// - Newsletter signup
// - Formulários de contato
```

## Testing Strategy

### Unit Tests
- Componentes de UI isolados
- Funções de utilidade
- Hooks customizados
- Validação de formulários

### Integration Tests
- Fluxo de navegação
- Sistema de busca
- Newsletter signup
- SEO metadata generation

### E2E Tests
- Jornada completa do usuário
- Performance em diferentes dispositivos
- Acessibilidade com screen readers
- Core Web Vitals

### Performance Tests
- Lighthouse CI
- Bundle size analysis
- Image optimization
- Loading speed metrics

## Design System Detalhado

### Paleta de Cores A Cifra

```scss
// Cores Primárias
$primary-dark: #041924;      // Azul petróleo escuro
$primary-medium: #00283B;    // Azul profundo  
$primary-light: #155C8B;     // Azul médio

// Cores Neutras
$neutral-white: #FFFFFF;     // Branco neutro
$neutral-light: #F5F7FA;     // Branco gelo
$neutral-medium: #DCE4EB;    // Cinza azulado

// Cores de Destaque
$accent-golden: #E1A441;     // Dourado discreto
$accent-teal: #3BAEAB;       // Verde azulado
$accent-coral: #E46B6B;      // Vermelho coral

// Cores de Estado
$success: #28a745;
$warning: #ffc107;
$error: #dc3545;
$info: #17a2b8;
```

### Tipografia

```scss
// Famílias de Fonte
$font-heading: 'Montserrat', sans-serif;
$font-body: 'Inter', sans-serif;
$font-mono: 'Fira Code', monospace;

// Escala Tipográfica
$font-size-xs: 0.75rem;     // 12px
$font-size-sm: 0.875rem;    // 14px
$font-size-base: 1rem;      // 16px
$font-size-lg: 1.125rem;    // 18px
$font-size-xl: 1.25rem;     // 20px
$font-size-2xl: 1.5rem;     // 24px
$font-size-3xl: 1.875rem;   // 30px
$font-size-4xl: 2.25rem;    // 36px

// Hierarquia
h1: $font-size-4xl, $font-heading, 700
h2: $font-size-3xl, $font-heading, 600
h3: $font-size-2xl, $font-heading, 600
h4: $font-size-xl, $font-heading, 500
body: $font-size-base, $font-body, 400
```

### Espaçamento

```scss
// Escala 8pt
$space-1: 0.25rem;   // 4px
$space-2: 0.5rem;    // 8px
$space-3: 0.75rem;   // 12px
$space-4: 1rem;      // 16px
$space-6: 1.5rem;    // 24px
$space-8: 2rem;      // 32px
$space-12: 3rem;     // 48px
$space-16: 4rem;     // 64px
```

### Componentes Visuais

#### Cards
```scss
.card {
  background: $neutral-white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba($primary-dark, 0.1);
  padding: $space-6;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba($primary-dark, 0.15);
  }
}
```

#### Buttons
```scss
.button {
  padding: $space-3 $space-6;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &--primary {
    background: $primary-light;
    color: $neutral-white;
    
    &:hover {
      background: $primary-medium;
    }
  }
  
  &--secondary {
    background: $accent-golden;
    color: $neutral-white;
    
    &:hover {
      background: darken($accent-golden, 10%);
    }
  }
}
```

## Layout Responsivo

### Breakpoints
```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

### Grid System
```scss
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $space-4;
  
  @media (min-width: $breakpoint-lg) {
    padding: 0 $space-8;
  }
}

.grid {
  display: grid;
  gap: $space-6;
  
  &--articles {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  &--sidebar {
    grid-template-columns: 1fr 300px;
    
    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }
}
```

## SEO e Performance

### Meta Tags Template
```typescript
interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: 'website' | 'article';
}

// Implementação automática para:
// - Title tags otimizados
// - Meta descriptions únicas
// - Open Graph tags
// - Twitter Cards
// - Canonical URLs
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Título do Artigo",
  "description": "Descrição do artigo",
  "author": {
    "@type": "Person",
    "name": "Jonatha Pereira"
  },
  "publisher": {
    "@type": "Organization",
    "name": "A Cifra",
    "logo": "https://acifra.com/logo.png"
  },
  "datePublished": "2025-10-24",
  "dateModified": "2025-10-24"
}
```

### Performance Optimizations
```typescript
// Image Optimization
const OptimizedImage = {
  formats: ['avif', 'webp', 'jpg'],
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality: 80,
  lazy: true,
  placeholder: 'blur'
};

// Code Splitting
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
  ssr: false
});

// Bundle Analysis
const bundleAnalyzer = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false
};
```

## Acessibilidade

### WCAG 2.1 AA Compliance
```scss
// Contraste mínimo 4.5:1
$text-on-light: $primary-dark;    // Contraste: 16.75:1
$text-on-primary: $neutral-white; // Contraste: 8.59:1

// Focus indicators
.focusable {
  &:focus {
    outline: 2px solid $accent-golden;
    outline-offset: 2px;
  }
}

// Skip links
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: $primary-dark;
  color: $neutral-white;
  padding: 8px;
  text-decoration: none;
  
  &:focus {
    top: 6px;
  }
}
```

### Semantic HTML
```html
<!-- Estrutura semântica -->
<header role="banner">
  <nav role="navigation" aria-label="Menu principal">
    <!-- Navigation items -->
  </nav>
</header>

<main role="main">
  <article>
    <header>
      <h1>Título do Artigo</h1>
      <p>Metadados do artigo</p>
    </header>
    <section>
      <!-- Conteúdo do artigo -->
    </section>
  </article>
</main>

<aside role="complementary" aria-label="Conteúdo relacionado">
  <!-- Sidebar content -->
</aside>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

## Analytics e Monitoramento

### Google Analytics 4 Setup
```typescript
// Event tracking
const trackEvent = (eventName: string, parameters: object) => {
  gtag('event', eventName, parameters);
};

// Custom events
trackEvent('newsletter_signup', { method: 'footer_form' });
trackEvent('article_read', { article_title: title, category: category });
trackEvent('search_performed', { search_term: query });
```

### Core Web Vitals Monitoring
```typescript
// Performance monitoring
const reportWebVitals = (metric: Metric) => {
  switch (metric.name) {
    case 'LCP':
      // Largest Contentful Paint
      break;
    case 'FID':
      // First Input Delay
      break;
    case 'CLS':
      // Cumulative Layout Shift
      break;
  }
};
```

Este design document fornece a base técnica completa para implementar todas as otimizações e melhorias especificadas nos requisitos, mantendo a identidade visual A Cifra e focando na experiência educacional de qualidade.