# 🚀 Guia Rápido: Sistema de Imagens

## ⚡ Início Rápido

### 1. Interface Visual (Mais Fácil)

Acesse o gerenciador visual:
```
http://localhost:3000/admin/images
```

**Passos:**
1. Navegue ou busque a imagem desejada
2. Clique na imagem
3. Copie o código gerado
4. Cole no seu artigo

---

### 2. Usando no Código

#### Opção A: Hook React (Recomendado)

```tsx
import { useArticleImage } from '@/hooks/useArticleImage'

function MeuComponente() {
  const image = useArticleImage({
    category: 'bitcoin',
    tags: ['guia', 'iniciantes'],
    title: 'Bitcoin: Guia Completo'
  })

  return (
    <img 
      src={image.src} 
      alt={image.alt}
      width={image.width}
      height={image.height}
    />
  )
}
```

#### Opção B: Função Direta

```typescript
import { findBestImage } from '@/utils/imageMapper'

const image = findBestImage('bitcoin', ['guia', 'iniciantes'])

const coverImage = {
  src: image.src,
  alt: image.alt,
  width: 1200,
  height: 630
}
```

#### Opção C: Para Múltiplos Artigos

```tsx
import { useArticleImages } from '@/hooks/useArticleImage'

function ArticleList({ articles }) {
  const imageMap = useArticleImages(articles)

  return articles.map((article, index) => {
    const image = imageMap.get(index)
    return (
      <ArticleCard 
        key={article.id}
        article={article}
        image={image}
      />
    )
  })
}
```

---

### 3. Adicionando em Artigos

```typescript
// src/data/meuArtigo.ts
import { BlogPost } from '@/types'
import { categories } from '@/lib/config'

export const meuArtigo: BlogPost = {
  id: '20',
  title: 'Título do Artigo',
  slug: 'slug-do-artigo',
  excerpt: 'Resumo...',
  content: `...`,
  
  // ✅ Cole aqui o código copiado do gerenciador
  coverImage: {
    src: '/images/bitcoin-guide-2025.jpg',
    alt: 'Bitcoin - Guia completo para iniciantes 2025',
    width: 1200,
    height: 630
  },
  
  author: {
    name: 'Jonatha Pereira',
    avatar: '/Jonatha-Pereira-SEO.png'
  },
  publishedAt: new Date('2025-10-27'),
  category: categories.find(c => c.slug === 'bitcoin')!,
  tags: ['bitcoin', 'guia', 'iniciantes'],
  seo: {
    metaTitle: 'Título SEO | A Cifra',
    metaDescription: 'Descrição...',
    keywords: ['bitcoin', 'guia']
  }
}
```

---

## 📋 Categorias Disponíveis

| Categoria | Imagens | Uso |
|-----------|---------|-----|
| `bitcoin` | 6 | Artigos sobre Bitcoin |
| `ethereum` | 2 | Artigos sobre Ethereum |
| `defi` | 3 | DeFi e finanças descentralizadas |
| `nfts` | 4 | NFTs e GameFi |
| `altcoins` | 2 | Altcoins e outras moedas |
| `analises` | 6 | Análises de mercado |
| `seguranca` | 4 | Segurança e carteiras |
| `educacao` | 5 | Tutoriais e educação |
| `geral` | 3 | Artigos gerais |

---

## 🎯 Exemplos Práticos

### Exemplo 1: Artigo sobre Bitcoin

```typescript
coverImage: {
  src: '/images/bitcoin-guide-2025.jpg',
  alt: 'Bitcoin - Guia completo para iniciantes 2025',
  width: 1200,
  height: 630
}
```

### Exemplo 2: Artigo sobre DeFi

```typescript
coverImage: {
  src: '/images/defi-revolution.jpg',
  alt: 'Revolução DeFi - Finanças descentralizadas transformando o mundo',
  width: 1200,
  height: 630
}
```

### Exemplo 3: Artigo sobre NFTs

```typescript
coverImage: {
  src: '/images/nft-digital-art.jpg',
  alt: 'NFTs e arte digital - Tokens não fungíveis',
  width: 1200,
  height: 630
}
```

### Exemplo 4: Análise de Mercado

```typescript
coverImage: {
  src: '/images/crypto-analysis-charts.jpg',
  alt: 'Análise de mercado cripto - Gráficos e indicadores',
  width: 1200,
  height: 630
}
```

---

## ⚠️ Regras Importantes

### ✅ FAZER

- Usar imagens relevantes para o conteúdo
- Verificar se a imagem já foi usada em artigo similar
- Manter texto alternativo descritivo e com palavras-chave
- Usar resolução 1200x630 para Open Graph

### ❌ NÃO FAZER

- Repetir imagens em artigos da mesma categoria
- Usar imagens genéricas quando há específicas disponíveis
- Esquecer o texto alternativo (alt)
- Usar imagens de baixa qualidade

---

## 🔍 Busca Rápida

### Por Palavra-chave

```typescript
// Bitcoin
findBestImage('bitcoin', ['guia', 'iniciantes'])
findBestImage('bitcoin', ['investimento', 'acumulação'])
findBestImage('bitcoin', ['análise', 'técnica'])

// DeFi
findBestImage('defi', ['pools', 'liquidez'])
findBestImage('defi', ['staking', 'yield'])

// NFTs
findBestImage('nfts', ['arte', 'digital'])
findBestImage('nfts', ['gamefi', 'jogos'])

// Análises
findBestImage('analises', ['mercado', 'tendências'])
findBestImage('analises', ['trading', 'profissional'])
```

---

## 🛠️ Ferramentas

### Gerenciador Visual
```
http://localhost:3000/admin/images
```

### Script de Atualização
```bash
npx ts-node scripts/update-article-images.ts
```

### Documentação Completa
```
docs/MAPEAMENTO_IMAGENS_ARTIGOS.md
```

---

## 💡 Dicas

1. **Use o gerenciador visual** para explorar todas as imagens disponíveis
2. **Filtre por categoria** para encontrar rapidamente
3. **Busque por palavra-chave** para resultados específicos
4. **Copie o código pronto** - não digite manualmente
5. **Verifique o preview** antes de usar

---

## 🆘 Problemas Comuns

### Imagem não aparece
- Verifique se o caminho está correto (`/images/...`)
- Confirme que a imagem existe em `/public/images/`

### Imagem repetida
- Use o gerenciador para ver quais já foram usadas
- Escolha uma alternativa da mesma categoria

### Imagem não relevante
- Revise as palavras-chave do artigo
- Use o sistema de busca para encontrar melhor match

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte `docs/MAPEAMENTO_IMAGENS_ARTIGOS.md`
2. Use o gerenciador visual em `/admin/images`
3. Verifique o código em `src/utils/imageMapper.ts`

---

**Última Atualização**: 27 de Outubro de 2025
