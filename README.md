# 🪙 A Cifra - Blog sobre Criptomoedas

<div align="center">

![A Cifra Logo](public/images/cifra-principal.png)

**Blog moderno e otimizado sobre criptomoedas, blockchain e finanças digitais**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare)](https://pages.cloudflare.com/)

[🌐 Site Oficial](https://a-cifra.pages.dev) • [📖 Documentação](docs/) • [🐛 Reportar Bug](issues) • [💡 Sugerir Feature](issues)

</div>

---

## 📋 Sobre o Projeto

**A Cifra** é um blog especializado em criptomoedas, blockchain e finanças descentralizadas, desenvolvido com foco em **performance**, **acessibilidade** e **SEO**. O projeto utiliza as mais modernas tecnologias web para entregar uma experiência excepcional aos usuários interessados no universo crypto.

### 🎯 Missão
Democratizar o conhecimento sobre criptomoedas e blockchain, oferecendo conteúdo educativo, análises técnicas e notícias atualizadas para a comunidade brasileira.

## ✨ Características Principais

### 🚀 Performance & Tecnologia
- **Next.js 14** com App Router para renderização otimizada
- **TypeScript** para desenvolvimento type-safe
- **Tailwind CSS** para estilização eficiente
- **Bundle Analyzer** para otimização de tamanho
- **Image Optimization** com WebP/AVIF
- **Code Splitting** automático

### 🎨 Design System
- **Paleta de Cores Profissional**:
  - Azul Escuro: `#041924` (textos principais)
  - Azul Médio: `#00283B` (elementos secundários)
  - Azul Principal: `#155C8B` (CTAs e links)
  - Off-white: `#F5F7FA` (backgrounds)
  - Dourado: `#E1A441` (destaques)

- **Tipografia Premium**:
  - **Headings**: Poppins (400-800)
  - **Body**: Inter (300-700)

### 🔍 SEO & Acessibilidade
- **Meta tags dinâmicas** por página
- **Structured Data** (Schema.org)
- **Sitemap automático**
- **WCAG AA/AAA compliance**
- **Screen reader support**
- **Navegação por teclado**
- **Touch targets** otimizados (44px+)

### 📱 Mobile-First
- **Design responsivo** para todos os dispositivos
- **Touch interactions** otimizadas
- **Safe area support**
- **Performance 3G** otimizada

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão | Descrição |
|-----------|------------|--------|-----------|
| **Framework** | Next.js | 14.2.0 | React framework com SSR/SSG |
| **Linguagem** | TypeScript | 5.4+ | Superset tipado do JavaScript |
| **Estilização** | Tailwind CSS | 3.4+ | Framework CSS utility-first |
| **Ícones** | Lucide React | 0.547+ | Biblioteca de ícones moderna |
| **Hospedagem** | Cloudflare Pages | - | CDN global e edge computing |
| **Analytics** | Google Analytics | 4 | Análise de tráfego e comportamento |

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### 🚀 Início Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/a-cifra-blog.git
cd a-cifra-blog

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Execute em desenvolvimento
npm run dev
```

### ⚙️ Variáveis de Ambiente

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://a-cifra.pages.dev
NEXT_PUBLIC_SITE_NAME="A Cifra"

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Development
ANALYZE=false
NODE_ENV=development
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build de produção
npm run start           # Servidor de produção
npm run lint            # Linting com ESLint
npm run type-check      # Verificação de tipos TypeScript
npm run analyze         # Análise de bundle
```

## 📁 Estrutura do Projeto

```
a-cifra-blog/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 artigo/[slug]/     # Páginas dinâmicas de artigos
│   │   ├── 📁 categoria/[slug]/  # Páginas de categorias
│   │   ├── 📁 contatos/          # Página de contato
│   │   ├── 📁 sobre/             # Página sobre
│   │   ├── 📄 layout.tsx         # Layout principal
│   │   ├── 📄 page.tsx           # Homepage
│   │   ├── 📄 sitemap.ts         # Sitemap dinâmico
│   │   └── 📄 robots.ts          # Robots.txt dinâmico
│   ├── 📁 components/            # Componentes React
│   │   ├── 📁 ui/               # Componentes base (Button, Card, etc.)
│   │   ├── 📁 layout/           # Componentes de layout
│   │   └── 📁 content/          # Componentes de conteúdo
│   ├── 📁 data/                 # Dados estáticos
│   │   └── 📄 articles.ts       # Base de dados de artigos
│   ├── 📁 lib/                  # Configurações e utilitários
│   │   └── 📄 config.ts         # Configuração do site
│   ├── 📁 styles/               # Estilos globais
│   │   └── 📄 globals.css       # CSS global
│   ├── 📁 types/                # Definições TypeScript
│   │   └── 📄 index.ts          # Tipos principais
│   └── 📁 utils/                # Funções utilitárias
│       ├── 📄 seo.ts            # Utilitários SEO
│       ├── 📄 accessibility.ts  # Utilitários de acessibilidade
│       └── 📄 image.ts          # Otimização de imagens
├── 📁 artigos/                  # Artigos em Markdown
│   ├── 📄 bitcoin-guia-completo-iniciantes-2025.md
│   ├── 📄 defi-revolucionando-financas-tradicionais.md
│   └── 📄 README.md             # Documentação dos artigos
├── 📁 public/                   # Assets estáticos
│   ├── 📁 images/               # Imagens do site
│   ├── 📄 favicon.ico           # Favicon
│   └── 📄 manifest.json         # Web App Manifest
├── 📁 docs/                     # Documentação
├── 📁 scripts/                  # Scripts de automação
├── 📄 _headers                  # Headers do Cloudflare
├── 📄 _redirects               # Redirects do Cloudflare
├── 📄 wrangler.toml            # Configuração Cloudflare
└── 📄 README.md                # Este arquivo
```

## 📝 Conteúdo e Categorias

### 🏷️ Categorias Disponíveis

| Categoria | Descrição | Cor |
|-----------|-----------|-----|
| **Bitcoin** | Guias, análises e novidades sobre BTC | `#F7931A` |
| **Altcoins** | Criptomoedas alternativas e análises | `#155C8B` |
| **DeFi** | Finanças descentralizadas e protocolos | `#E1A441` |
| **NFTs** | Tokens não fungíveis e arte digital | `#00283B` |
| **Análises** | Análises técnicas e fundamentais | `#041924` |
| **Educação** | Conteúdo educativo para iniciantes | `#155C8B` |

### 📚 Artigos Destacados

- **Bitcoin: Guia Completo para Iniciantes 2025**
- **DeFi: Revolucionando as Finanças Tradicionais**
- **Altcoins Promissoras 2025: Análise Fundamentalista**
- **Centralização vs Descentralização: O Dilema do Poder**
- **Pools de Liquidez: O Coração do DeFi**

## 🌐 Deploy e Hospedagem

### Cloudflare Pages

O projeto está configurado para deploy automático no **Cloudflare Pages**:

```toml
# wrangler.toml
name = "blog-a-cifra"
compatibility_date = "2024-10-20"
pages_build_output_dir = "out"
```

### Configurações de Performance

- **Headers de Segurança**: CSP, HSTS, X-Frame-Options
- **Cache Otimizado**: Assets estáticos com cache longo
- **Compressão**: Gzip/Brotli automático
- **CDN Global**: Distribuição mundial via Cloudflare

## 📊 Métricas e Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🔧 Customização

### Alterando Cores
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        'dark-blue': '#041924',
        'medium-blue': '#00283B',
        'primary-blue': '#155C8B',
        'off-white': '#F5F7FA',
        'gold': '#E1A441'
      }
    }
  }
}
```

### Adicionando Artigos
```typescript
// src/data/articles.ts
export const sampleArticles: Article[] = [
  {
    id: 'novo-artigo',
    title: 'Título do Novo Artigo',
    slug: 'titulo-novo-artigo',
    // ... outros campos
  }
]
```

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

### 📝 Tipos de Contribuição
- **Artigos**: Novos conteúdos sobre crypto
- **Correções**: Bugs, typos, melhorias
- **Features**: Novas funcionalidades
- **Documentação**: Melhorias na documentação

### 🔄 Processo de Contribuição

1. **Fork** o projeto
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
   ```bash
   git checkout -b feature/nova-feature
   ```
4. **Commit** suas mudanças
   ```bash
   git commit -m 'feat: adiciona nova feature'
   ```
5. **Push** para a branch
   ```bash
   git push origin feature/nova-feature
   ```
6. **Abra** um Pull Request

### 📋 Diretrizes

- Use **Conventional Commits** para mensagens
- Mantenha o **código limpo** e **documentado**
- **Teste** suas mudanças antes de enviar
- **Respeite** o style guide do projeto

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato e Suporte

<div align="center">

### 🌐 Links Oficiais

[![Website](https://img.shields.io/badge/Website-a-cifra.pages.dev-blue?style=for-the-badge&logo=google-chrome)](https://a-cifra.pages.dev)
[![Twitter](https://img.shields.io/badge/Twitter-@acifra-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/acifra)
[![Instagram](https://img.shields.io/badge/Instagram-@acifra-E4405F?style=for-the-badge&logo=instagram)](https://instagram.com/acifra)

### 📧 Contato Direto

**Email**: contato@a-cifra.pages.dev  
**WhatsApp**: [+55 11 99999-9999](https://wa.me/5511999999999)

</div>

---

<div align="center">

**Feito com ❤️ para a comunidade crypto brasileira**

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐

</div>