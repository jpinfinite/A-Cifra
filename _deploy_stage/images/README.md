# 🖼️ Imagens do Blog A Cifra

Esta pasta contém todas as imagens utilizadas no blog, incluindo logos, ícones e imagens dos artigos.

## 📁 Estrutura Organizada

### 🎨 Logos e Identidade Visual
- `cifra-*.png` - Variações do logo A Cifra
- `icon-*.png` - Ícones em diferentes cores
- `Favicon.png` - Favicon do site
- `rede social.png` - Imagem para redes sociais

### 📰 Imagens dos Artigos
- `bitcoin-guide-2025.jpg` - Artigo sobre Bitcoin
- `defi-revolution.jpg` - Artigo sobre DeFi
- `altcoins-2025.jpg` - Artigo sobre Altcoins
- `ethereum-analysis.jpg` - Análise do Ethereum
- `nfts-use-cases.jpg` - Casos de uso de NFTs

### 👥 Autores
- `authors/` - Fotos dos autores dos artigos

### 🔧 Utilitários
- `placeholder.svg` - Imagem placeholder para fallback
- `og-default.jpg/png` - Imagens padrão para Open Graph

## 📐 Padrões para Novas Imagens

### Imagens de Artigos
- **Tamanho**: 1200x630px (proporção 1.91:1)
- **Formato**: JPG, PNG ou WebP
- **Qualidade**: Alta, otimizada para web (máx. 500KB)
- **Nomenclatura**: `nome-descritivo-ano.jpg`

### Como Adicionar Nova Imagem de Artigo

1. **Prepare a imagem** (1200x630px)
2. **Salve em** `public/images/`
3. **Use nomenclatura clara**: `bitcoin-analise-2025.jpg`
4. **Referencie no artigo**: `/images/bitcoin-analise-2025.jpg`

### Exemplo de Uso nos Artigos

```markdown
# No frontmatter do Markdown
coverImage: "/images/bitcoin-guide-2025.jpg"

# No conteúdo do artigo
![Descrição da imagem](/images/bitcoin-guide-2025.jpg)
```

```typescript
// No arquivo src/data/articles.ts
coverImage: {
  src: '/images/bitcoin-guide-2025.jpg',
  alt: 'Descrição da imagem',
  width: 1200,
  height: 630
}
```

## ✅ Vantagens deste Padrão

- **Simplicidade**: Todas as imagens em um local
- **Padrão Next.js**: Usa a pasta `public/` nativa
- **Performance**: Otimização automática do Next.js
- **Manutenção**: Fácil de gerenciar e organizar
- **SEO**: URLs limpos e consistentes

## 🚀 Próximos Passos

Para adicionar novas imagens:
1. Coloque a imagem em `public/images/`
2. Use o caminho `/images/nome-da-imagem.jpg`
3. Reinicie o servidor se necessário

---

**Nota**: O Next.js serve automaticamente todos os arquivos da pasta `public/` na raiz do domínio.