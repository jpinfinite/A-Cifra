# 📚 Exemplos Práticos de Correções

## 🎯 Cenários Reais e Como Corrigir

---

## Exemplo 1: ArticleCard com Link de Categoria

### ❌ ANTES (Problemático)

```tsx
// src/components/content/ArticleCard.tsx
import Link from 'next/link'

export function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      
      {/* PROBLEMA: Se article.category for undefined, gera /categoria/undefined */}
      <Link href={`/categoria/${article.category}`}>
        <span className="category-badge">
          {article.categoryName}
        </span>
      </Link>
    </div>
  )
}
```

### ✅ DEPOIS (Corrigido)

```tsx
// src/components/content/ArticleCard.tsx
import Link from 'next/link'
import { getCategoryUrl, hasValidCategory } from '@/utils/validation'

export function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      
      {/* SOLUÇÃO 1: Sempre mostrar link, mas com URL válida */}
      <Link href={getCategoryUrl(article.category)}>
        <span className="category-badge">
          {article.categoryName || 'Sem categoria'}
        </span>
      </Link>
      
      {/* OU SOLUÇÃO 2: Só mostrar se categoria for válida */}
      {hasValidCategory(article) && (
        <Link href={`/categoria/${article.category}`}>
          <span className="category-badge">
            {article.categoryName}
          </span>
        </Link>
      )}
    </div>
  )
}
```

---

## Exemplo 2: Filtro de Artigos por Categoria

### ❌ ANTES (Problemático)

```tsx
// src/components/ArticleFilter.tsx
export function ArticleFilter({ articles, selectedCategory }) {
  // PROBLEMA: Pode filtrar por undefined
  const filtered = articles.filter(
    article => article.category === selectedCategory
  )
  
  return (
    <div>
      {filtered.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

### ✅ DEPOIS (Corrigido)

```tsx
// src/components/ArticleFilter.tsx
import { hasValidCategory } from '@/utils/validation'

export function ArticleFilter({ articles, selectedCategory }) {
  // SOLUÇÃO: Validar categoria antes de filtrar
  const filtered = articles.filter(article => {
    // Só incluir artigos com categoria válida
    if (!hasValidCategory(article)) return false
    
    // Se não há filtro selecionado, mostrar todos
    if (!selectedCategory) return true
    
    // Filtrar pela categoria selecionada
    return article.category === selectedCategory
  })
  
  return (
    <div>
      {filtered.length > 0 ? (
        filtered.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <p>Nenhum artigo encontrado nesta categoria.</p>
      )}
    </div>
  )
}
```

---

## Exemplo 3: Breadcrumb com Categoria

### ❌ ANTES (Problemático)

```tsx
// src/components/Breadcrumb.tsx
export function Breadcrumb({ article }) {
  return (
    <nav>
      <Link href="/">Início</Link>
      <span>/</span>
      
      {/* PROBLEMA: Link quebrado se category for undefined */}
      <Link href={`/categoria/${article.category}`}>
        {article.categoryName}
      </Link>
      <span>/</span>
      
      <span>{article.title}</span>
    </nav>
  )
}
```

### ✅ DEPOIS (Corrigido)

```tsx
// src/components/Breadcrumb.tsx
import { getCategoryUrl, hasValidCategory } from '@/utils/validation'

export function Breadcrumb({ article }) {
  return (
    <nav>
      <Link href="/">Início</Link>
      <span>/</span>
      
      {/* SOLUÇÃO: Usar validação e fallback */}
      {hasValidCategory(article) ? (
        <>
          <Link href={getCategoryUrl(article.category)}>
            {article.categoryName}
          </Link>
          <span>/</span>
        </>
      ) : (
        <>
          <Link href="/artigos">Artigos</Link>
          <span>/</span>
        </>
      )}
      
      <span>{article.title}</span>
    </nav>
  )
}
```

---

## Exemplo 4: Menu de Categorias

### ❌ ANTES (Problemático)

```tsx
// src/components/CategoryMenu.tsx
import { categories } from '@/lib/config'

export function CategoryMenu() {
  return (
    <nav>
      {categories.map(category => (
        // PROBLEMA: Se slug vier vazio ou undefined
        <Link key={category.id} href={`/categoria/${category.slug}`}>
          {category.name}
        </Link>
      ))}
    </nav>
  )
}
```

### ✅ DEPOIS (Corrigido)

```tsx
// src/components/CategoryMenu.tsx
import { categories } from '@/lib/config'
import { getCategoryUrl, sanitizeSlug } from '@/utils/validation'

export function CategoryMenu() {
  // SOLUÇÃO: Filtrar e validar categorias
  const validCategories = categories.filter(cat => 
    cat.slug && cat.slug.trim() !== ''
  )
  
  return (
    <nav>
      {validCategories.map(category => (
        <Link 
          key={category.id} 
          href={getCategoryUrl(sanitizeSlug(category.slug))}
        >
          {category.name}
        </Link>
      ))}
      
      {/* Link adicional para ver todas */}
      <Link href="/categorias">
        Ver todas as categorias
      </Link>
    </nav>
  )
}
```

---

## Exemplo 5: Página de Artigo com Categoria

### ❌ ANTES (Problemático)

```tsx
// src/app/artigo/[slug]/page.tsx
export default function ArticlePage({ article }) {
  return (
    <article>
      <h1>{article.title}</h1>
      
      {/* PROBLEMA: Pode gerar link inválido */}
      <div className="meta">
        <Link href={`/categoria/${article.category}`}>
          {article.categoryName}
        </Link>
      </div>
      
      <div>{article.content}</div>
    </article>
  )
}
```

### ✅ DEPOIS (Corrigido)

```tsx
// src/app/artigo/[slug]/page.tsx
import { getCategoryUrl, hasValidCategory } from '@/utils/validation'

export default function ArticlePage({ article }) {
  return (
    <article>
      <h1>{article.title}</h1>
      
      {/* SOLUÇÃO: Validar antes de mostrar */}
      <div className="meta">
        {hasValidCategory(article) ? (
          <Link href={getCategoryUrl(article.category)}>
            <span className="category-badge">
              {article.categoryName}
            </span>
          </Link>
        ) : (
          <span className="category-badge category-badge--disabled">
            Sem categoria
          </span>
        )}
        
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString('pt-BR')}
        </time>
      </div>
      
      <div>{article.content}</div>
    </article>
  )
}
```

---

## Exemplo 6: API Route com Validação

### ❌ ANTES (Problemático)

```tsx
// src/app/api/articles/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  // PROBLEMA: Pode buscar por undefined ou string vazia
  const articles = await getArticlesByCategory(category)
  
  return Response.json(articles)
}
```

### ✅ DEPOIS (Corrigido)

```tsx
// src/app/api/articles/route.ts
import { validateCategorySlug } from '@/utils/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryParam = searchParams.get('category')
  
  // SOLUÇÃO: Validar parâmetro antes de usar
  if (!categoryParam || categoryParam === 'undefined') {
    return Response.json({ 
      error: 'Categoria inválida' 
    }, { status: 400 })
  }
  
  const category = validateCategorySlug(categoryParam)
  const articles = await getArticlesByCategory(category)
  
  return Response.json(articles)
}
```

---

## Exemplo 7: Hook Customizado para Categoria

### ✅ Criar Hook Reutilizável

```tsx
// src/hooks/useCategory.ts
import { useMemo } from 'react'
import { categories } from '@/lib/config'
import { validateCategorySlug } from '@/utils/validation'

export function useCategory(slug: string | undefined) {
  return useMemo(() => {
    if (!slug) return null
    
    const validSlug = validateCategorySlug(slug)
    const category = categories.find(cat => cat.slug === validSlug)
    
    return category || null
  }, [slug])
}

// Uso:
export function CategoryBadge({ categorySlug }) {
  const category = useCategory(categorySlug)
  
  if (!category) return null
  
  return (
    <Link href={`/categoria/${category.slug}`}>
      <span className="badge">{category.name}</span>
    </Link>
  )
}
```

---

## Exemplo 8: Componente de Erro Personalizado

### ✅ Criar Componente de Fallback

```tsx
// src/components/CategoryError.tsx
import Link from 'next/link'

export function CategoryError({ 
  message = 'Categoria não encontrada',
  showBackButton = true 
}) {
  return (
    <div className="category-error">
      <div className="error-icon">🔍</div>
      <h2>{message}</h2>
      <p>A categoria que você procura não existe ou foi removida.</p>
      
      {showBackButton && (
        <div className="error-actions">
          <Link href="/categorias">
            Ver todas as categorias
          </Link>
          <Link href="/">
            Voltar ao início
          </Link>
        </div>
      )}
    </div>
  )
}

// Uso na página de categoria:
export default function CategoryPage({ params }) {
  const category = categories.find(c => c.slug === params.slug)
  
  if (!category) {
    return <CategoryError />
  }
  
  // ... resto do código
}
```

---

## 🎓 Padrões de Boas Práticas

### ✅ Sempre Fazer

1. **Validar antes de usar**
```tsx
const validSlug = validateCategorySlug(slug)
```

2. **Usar funções helper**
```tsx
const url = getCategoryUrl(category)
```

3. **Verificar existência**
```tsx
if (hasValidCategory(article)) { /* ... */ }
```

4. **Fornecer fallbacks**
```tsx
{category || 'Sem categoria'}
```

5. **Sanitizar inputs**
```tsx
const clean = sanitizeSlug(userInput)
```

### ❌ Nunca Fazer

1. **Usar valores diretamente sem validar**
```tsx
// ❌ NÃO FAÇA ISSO
href={`/categoria/${article.category}`}
```

2. **Ignorar valores undefined**
```tsx
// ❌ NÃO FAÇA ISSO
if (article.category) { /* pode ser string 'undefined' */ }
```

3. **Confiar em dados externos**
```tsx
// ❌ NÃO FAÇA ISSO
const category = searchParams.get('category')
// usar diretamente sem validar
```

---

## 🔧 Ferramentas de Debug

### Console Helpers

```tsx
// src/utils/debug.ts
export function debugCategory(category: any, context: string) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🐛 Debug: ${context}`)
    console.log('Valor:', category)
    console.log('Tipo:', typeof category)
    console.log('É válido?', hasValidCategory({ category }))
    console.log('URL gerada:', getCategoryUrl(category))
    console.groupEnd()
  }
}

// Uso:
debugCategory(article.category, 'ArticleCard')
```

---

## 📝 Checklist de Revisão de Código

Antes de fazer commit, verifique:

- [ ] Todos os links de categoria usam `getCategoryUrl()`
- [ ] Validações aplicadas em filtros e buscas
- [ ] Fallbacks definidos para valores inválidos
- [ ] Error boundaries em páginas críticas
- [ ] Logs de debug removidos (ou em modo dev only)
- [ ] TypeScript sem erros (`npx tsc --noEmit`)
- [ ] Testes manuais realizados
- [ ] Console do navegador sem erros críticos

---

**Dica Final**: Sempre que trabalhar com categorias, pense: "E se esse valor for undefined?" 🤔
