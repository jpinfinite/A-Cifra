# 📸 Guia: Buscar Imagens do Pixabay para Artigos

## 🎯 Objetivo

Automatizar a busca e download de imagens gratuitas e de alta qualidade do Pixabay para usar como capas de artigos do A Cifra.

---

## 🔑 Passo 1: Obter API Key do Pixabay

### 1.1 Criar Conta

1. Acesse: https://pixabay.com/
2. Clique em "Sign Up" (Cadastrar)
3. Criea conta gratuita

### 1.2 Obter API Key

1. Acesse: https://pixabay.com/api/docs/
2. Faça login
3. Sua API key estará visível na página
4. Copie a chave (formato: `1234567-abcdef1234567890abcdef1234567890`)

### 1.3 Configurar API Key

**Windows (PowerShell):**
```powershell
$env:PIXABAY_API_KEY="sua_chave_aqui"
```

**Windows (CMD):**
```cmd
set PIXABAY_API_KEY=sua_chave_aqui
```

**Linux/Mac:**
```bash
export PIXABAY_API_KEY="sua_chave_aqui"
```

**Ou edite o arquivo `scripts/pixabay-image-fetcher.js`:**
```javascript
const PIXABAY_API_KEY = 'sua_chave_aqui';
```

---

## 🚀 Passo 2: Usar o Script

### 2.1 Busca Simples

```bash
node scripts/pixabay-image-fetcher.js "bitcoin cryptocurrency"
```

**Resultado:**
- Lista de 20 imagens relacionadas
- Informações: tamanho, visualizações, likes, autor
- URLs para download

### 2.2 Busca por Categoria

```bash
node scripts/pixabay-image-fetcher.js --category bitcoin
```

**Categorias disponíveis:**
- `bitcoin` - Bitcoin e blockchain
- `ethereum` - Ethereum
- `defi` - Finanças descentralizadas
- `nfts` - NFTs e arte digital
- `altcoins` - Altcoins
- `trading` - Trading e gráficos
- `seguranca` - Segurança
- `educacao` - Educação
- `analises` - Análises e dados
- `memecoin` - Memecoins
- `stablecoins` - Stablecoins
- `regulacao` - Regulação

### 2.3 Salvar Imagem Automaticamente

```bash
node scripts/pixabay-image-fetcher.js "bitcoin" --save bitcoin-article.jpg
```

**O que acontece:**
1. Busca imagens de "bitcoin"
2. Baixa a melhor imagem (mais relevante)
3. Salva em `public/images/articles/bitcoin-article.jpg`
4. Mostra o código para usar no frontmatter

### 2.4 Limitar Resultados

```bash
node scripts/pixabay-image-fetcher.js "ethereum" --count 10
```

---

## 📋 Exemplos Práticos

### Exemplo 1: Artigo sobre Bitcoin

```bash
node scripts/pixabay-image-fetcher.js --category bitcoin --save bitcoin-100k.jpg
```

**Saída:**
```
✅ Imagem salva em: /images/articles/bitcoin-100k.jpg

📋 Use no frontmatter do artigo:
coverImage:
  src: '/images/articles/bitcoin-100k.jpg'
  alt: 'bitcoin cryptocurrency blockchain'
  width: 1920
  height: 1280
```

### Exemplo 2: Artigo sobre DeFi

```bash
node scripts/pixabay-image-fetcher.js "decentralized finance" --save defi-guide.jpg
```

### Exemplo 3: Artigo sobre Stablecoins

```bash
node scripts/pixabay-image-fetcher.js --category stablecoins --save usdt-analysis.jpg
```

### Exemplo 4: Buscar sem Salvar (Preview)

```bash
node scripts/pixabay-image-fetcher.js "zcash privacy coin"
```

---

## 🎨 Workflow Recomendado

### Para Cada Artigo Novo:

1. **Identificar tema do artigo**
   - Ex: "Bitcoin $100K"

2. **Buscar imagens relevantes**
   ```bash
   node scripts/pixabay-image-fetcher.js "bitcoin price chart"
   ```

3. **Revisar resultados**
   - Verificar qualidade
   - Verificar relevância
   - Verificar tamanho (mínimo 1200x630)

4. **Salvar melhor imagem**
   ```bash
   node scripts/pixabay-image-fetcher.js "bitcoin price chart" --save bitcoin-100k-2025.jpg
   ```

5. **Copiar código do frontmatter**
   - O script já gera o código pronto

6. **Colar no artigo**
   ```yaml
   coverImage:
     src: '/images/articles/bitcoin-100k-2025.jpg'
     alt: 'bitcoin price chart cryptocurrency'
     width: 1920
     height: 1280
   ```

---

## 🔍 Dicas de Busca

### Termos em Inglês Funcionam Melhor

❌ **Evite:**
```bash
node scripts/pixabay-image-fetcher.js "criptomoedas bitcoin"
```

✅ **Prefira:**
```bash
node scripts/pixabay-image-fetcher.js "cryptocurrency bitcoin"
```

### Seja Específico

❌ **Genérico:**
```bash
node scripts/pixabay-image-fetcher.js "crypto"
```

✅ **Específico:**
```bash
node scripts/pixabay-image-fetcher.js "bitcoin blockchain technology"
```

### Combine Termos Relevantes

**Para artigo sobre trading:**
```bash
node scripts/pixabay-image-fetcher.js "cryptocurrency trading chart analysis"
```

**Para artigo sobre segurança:**
```bash
node scripts/pixabay-image-fetcher.js "blockchain security lock protection"
```

**Para artigo sobre DeFi:**
```bash
node scripts/pixabay-image-fetcher.js "decentralized finance defi protocol"
```

---

## 📏 Especificações de Imagem

### Tamanhos Recomendados

**Mínimo:**
- Largura: 1200px
- Altura: 630px
- Proporção: 1.91:1 (Open Graph)

**Ideal:**
- Largura: 1920px
- Altura: 1080px
- Proporção: 16:9

**Máximo:**
- Tamanho do arquivo: <500KB
- Formato: JPG, PNG, WebP

### O Script Já Filtra Automaticamente

O script busca apenas imagens que atendem:
- ✅ Mínimo 1200x630px
- ✅ Orientação horizontal
- ✅ Alta qualidade
- ✅ Safe search ativado

---

## 🎯 Casos de Uso Específicos

### 1. Artigos sobre Bitcoin

```bash
# Análise de preço
node scripts/pixabay-image-fetcher.js "bitcoin price chart" --save btc-price.jpg

# Conceito geral
node scripts/pixabay-image-fetcher.js "bitcoin cryptocurrency" --save btc-concept.jpg

# Mineração
node scripts/pixabay-image-fetcher.js "bitcoin mining" --save btc-mining.jpg
```

### 2. Artigos sobre Ethereum

```bash
# Ethereum geral
node scripts/pixabay-image-fetcher.js "ethereum blockchain" --save eth-blockchain.jpg

# Smart contracts
node scripts/pixabay-image-fetcher.js "smart contract blockchain" --save eth-contracts.jpg

# DeFi
node scripts/pixabay-image-fetcher.js "ethereum defi" --save eth-defi.jpg
```

### 3. Artigos sobre Trading

```bash
# Análise técnica
node scripts/pixabay-image-fetcher.js "trading chart analysis" --save trading-analysis.jpg

# Candlesticks
node scripts/pixabay-image-fetcher.js "candlestick chart" --save candlestick.jpg

# Trading desk
node scripts/pixabay-image-fetcher.js "cryptocurrency trading" --save crypto-trading.jpg
```

### 4. Artigos sobre Segurança

```bash
# Segurança geral
node scripts/pixabay-image-fetcher.js "blockchain security" --save security.jpg

# Carteiras
node scripts/pixabay-image-fetcher.js "cryptocurrency wallet" --save wallet.jpg

# Proteção
node scripts/pixabay-image-fetcher.js "cyber security lock" --save protection.jpg
```

---

## ⚖️ Licença e Créditos

### Pixabay License

**Todas as imagens do Pixabay são:**
- ✅ Gratuitas para uso comercial
- ✅ Sem necessidade de atribuição
- ✅ Podem ser modificadas
- ✅ Podem ser redistribuídas

**Mas é boa prática:**
- Dar créditos ao autor (opcional)
- Não redistribuir como coleção de imagens
- Não vender a imagem sem modificação

### Como Dar Créditos (Opcional)

**No final do artigo:**
```markdown
---

*Imagem de capa por [Nome do Autor](link) via Pixabay*
```

**Ou no alt text:**
```yaml
coverImage:
  src: '/images/articles/bitcoin.jpg'
  alt: 'Bitcoin cryptocurrency - Imagem por Autor via Pixabay'
```

---

## 🔧 Troubleshooting

### Erro: "Configure sua API key"

**Solução:**
```bash
# Verificar se está configurada
echo $PIXABAY_API_KEY

# Se não estiver, configurar
export PIXABAY_API_KEY="sua_chave_aqui"
```

### Erro: "Nenhuma imagem encontrada"

**Causas possíveis:**
1. Termo de busca muito específico
2. Termo em português (use inglês)
3. Filtros muito restritivos

**Solução:**
- Use termos mais genéricos
- Use termos em inglês
- Tente categorias pré-definidas

### Imagem não baixa

**Verificar:**
1. Conexão com internet
2. Permissões de escrita na pasta `public/images/articles/`
3. Espaço em disco

---

## 📊 Limites da API Gratuita

**Pixabay API Gratuita:**
- ✅ 5.000 requisições por hora
- ✅ Acesso a todas as imagens
- ✅ Sem marca d'água
- ✅ Uso comercial permitido

**Mais que suficiente para:**
- Buscar imagens para artigos
- Testar diferentes termos
- Baixar múltiplas opções

---

## 🎨 Alternativas ao Pixabay

Se precisar de mais variedade:

**Unsplash:**
- https://unsplash.com/
- API gratuita similar
- Fotos de alta qualidade

**Pexels:**
- https://www.pexels.com/
- API gratuita
- Vídeos também disponíveis

**Freepik:**
- https://www.freepik.com/
- Ilustrações e vetores
- Requer atribuição (plano gratuito)

---

## ✅ Checklist: Adicionar Imagem a um Artigo

- [ ] Identificar tema do artigo
- [ ] Buscar imagens relevantes com o script
- [ ] Revisar qualidade e relevância
- [ ] Salvar melhor imagem
- [ ] Copiar código do frontmatter
- [ ] Colar no artigo .md
- [ ] Verificar se imagem carrega no site
- [ ] Commit e push para GitHub
- [ ] Verificar no site publicado

---

## 🚀 Próximos Passos

1. **Obter API key do Pixabay**
2. **Configurar no ambiente**
3. **Testar com um artigo**
4. **Adicionar imagens a todos os artigos sem capa**
5. **Criar biblioteca de imagens reutilizáveis**

---

**Dúvidas?** Consulte a documentação oficial: https://pixabay.com/api/docs/

**Problemas?** Abra uma issue no repositório ou me pergunte!

