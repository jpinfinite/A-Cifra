# 📸 Guia: Buscar Imagens do Unsplash para Artigos

## 🎯 Por Que Unsplash?

- ✅ **Imagens de altíssima qualidade** - Fotógrafos profissionais
- ✅ **API gratuita e fácil** - 50 requisições por hora (Demo)
- ✅ **Uso comercial permitido** - Licença Unsplash
- ✅ **Sem marca d'água** - Imagens limpas
- ✅ **Créditos simples** - Apenas mencionar o fotógrafo

---

## 🔑 Passo 1: Obter Access Key (5 minutos)

### 1.1 Criar Conta no Unsplash

1. Acesse: https://unsplash.com/
2. Clique em "Join" (Cadastrar)
3. Crie sua conta gratuita

### 1.2 Criar Aplicativo

1. Acesse: https://unsplash.com/developers
2. Clique em "Your apps"
3. Clique em "New Application"
4. Aceite os termos de uso
5. Preencha:
   - **Application name:** A Cifra Blog
   - **Description:** Blog sobre criptomoedas
6. Clique em "Create application"

### 1.3 Copiar Access Key

1. Na página do seu app, você verá:
   - **Access Key** (pública) ← Esta que vamos usar
   - **Secret Key** (privada) ← Não precisa

2. Copie a **Access Key**

### 1.4 Configurar Access Key

**Windows (PowerShell):**
```powershell
$env:UNSPLASH_ACCESS_KEY="sua_access_key_aqui"
```

**Windows (CMD):**
```cmd
set UNSPLASH_ACCESS_KEY=sua_access_key_aqui
```

**Linux/Mac:**
```bash
export UNSPLASH_ACCESS_KEY="sua_access_key_aqui"
```

**Ou edite o arquivo `scripts/unsplash-image-fetcher.js`:**
```javascript
const UNSPLASH_ACCESS_KEY = 'sua_access_key_aqui';
```

---

## 🚀 Passo 2: Usar o Script

### 2.1 Busca Simples

```bash
node scripts/unsplash-image-fetcher.js "bitcoin cryptocurrency"
```

**Resultado:**
- Lista de 20 fotos relacionadas
- Informações: tamanho, likes, views, autor
- URLs para download

### 2.2 Busca por Categoria

```bash
node scripts/unsplash-image-fetcher.js --category bitcoin
```

**Categorias disponíveis:**
- `bitcoin`, `ethereum`, `defi`, `nfts`, `altcoins`
- `trading`, `seguranca`, `educacao`, `analises`
- `memecoin`, `stablecoins`, `regulacao`

### 2.3 Salvar Imagem Automaticamente

```bash
node scripts/unsplash-image-fetcher.js "bitcoin" --save bitcoin-article.jpg
```

**O que acontece:**
1. Busca fotos de "bitcoin"
2. Baixa a melhor foto (mais relevante)
3. Salva em `public/images/articles/bitcoin-article.jpg`
4. Registra o download na API (obrigatório)
5. Mostra código para frontmatter + créditos

### 2.4 Limitar Resultados

```bash
node scripts/unsplash-image-fetcher.js "ethereum" --count 10
```

---

## 📋 Exemplos Práticos

### Exemplo 1: Artigo sobre Bitcoin

```bash
node scripts/unsplash-image-fetcher.js --category bitcoin --save bitcoin-100k.jpg
```

**Saída:**
```
✅ Imagem salva em: /images/articles/bitcoin-100k.jpg

📋 Use no frontmatter do artigo:
coverImage:
  src: '/images/articles/bitcoin-100k.jpg'
  alt: 'Bitcoin cryptocurrency on dark background'
  width: 4000
  height: 2667

👤 Créditos (OBRIGATÓRIO):
Foto por John Doe no Unsplash
Link: https://unsplash.com/@johndoe

📝 Adicione no final do artigo:
*Foto de capa por [John Doe](https://unsplash.com/@johndoe) no [Unsplash](https://unsplash.com)*
```

### Exemplo 2: Artigo sobre Trading

```bash
node scripts/unsplash-image-fetcher.js "cryptocurrency trading chart" --save trading-guide.jpg
```

### Exemplo 3: Artigo sobre Segurança

```bash
node scripts/unsplash-image-fetcher.js --category seguranca --save security-crypto.jpg
```

---

## ⚖️ Licença e Créditos (IMPORTANTE!)

### Licença Unsplash

**Você PODE:**
- ✅ Usar para fins comerciais
- ✅ Modificar as imagens
- ✅ Usar sem pedir permissão
- ✅ Não pagar nada

**Você DEVE:**
- ✅ **Dar créditos ao fotógrafo** (obrigatório)
- ✅ Não vender a foto sem modificação
- ✅ Não criar serviço concorrente ao Unsplash

### Como Dar Créditos

**No final do artigo (OBRIGATÓRIO):**

```markdown
---

*Foto de capa por [Nome do Fotógrafo](link-perfil) no [Unsplash](https://unsplash.com)*
```

**Exemplo real:**
```markdown
---

*Foto de capa por [André François McKenzie](https://unsplash.com/@silverhousehd) no [Unsplash](https://unsplash.com)*
```

---

## 🎨 Workflow Recomendado

### Para Cada Artigo Novo:

1. **Identificar tema**
   - Ex: "Bitcoin análise de preço"

2. **Buscar fotos**
   ```bash
   node scripts/unsplash-image-fetcher.js "bitcoin price chart"
   ```

3. **Revisar resultados**
   - Verificar qualidade
   - Verificar relevância
   - Ver informações do fotógrafo

4. **Salvar melhor foto**
   ```bash
   node scripts/unsplash-image-fetcher.js "bitcoin price chart" --save btc-price-2025.jpg
   ```

5. **Copiar código do frontmatter**
   - O script gera tudo pronto

6. **Adicionar no artigo**
   - Frontmatter com coverImage
   - Créditos no final do artigo

---

## 🔍 Dicas de Busca

### Termos em Inglês

❌ **Evite:**
```bash
node scripts/unsplash-image-fetcher.js "criptomoedas"
```

✅ **Prefira:**
```bash
node scripts/unsplash-image-fetcher.js "cryptocurrency"
```

### Seja Específico

❌ **Genérico:**
```bash
node scripts/unsplash-image-fetcher.js "crypto"
```

✅ **Específico:**
```bash
node scripts/unsplash-image-fetcher.js "bitcoin blockchain technology"
```

### Combine Termos

**Trading:**
```bash
node scripts/unsplash-image-fetcher.js "cryptocurrency trading chart candlestick"
```

**Segurança:**
```bash
node scripts/unsplash-image-fetcher.js "blockchain security lock protection"
```

**DeFi:**
```bash
node scripts/unsplash-imacher.js "decentralized finance defi"
```

---

## 📊 Limites da API

### Plano Demo (Gratuito)

- ✅ **50 requisições por hora**
- ✅ Acesso a todas as fotos
- ✅ Sem marca d'água
- ✅ Uso comercial

**Suficiente para:**
- Buscar fotos para artigos
- Testar diferentes termos
- Baixar múltiplas opções

### Plano Production (Se precisar mais)

- 5.000 requisições por hora
- Gratuito também!
- Apenas precisa de aprovação

---

## 🎯 Casos de Uso Específicos

### Bitcoin

```bash
# Conceito geral
node scripts/unsplash-image-fetcher.js "bitcoin cryptocurrency" --save btc-concept.jpg

# Análise de preço
node scripts/unsplash-image-fetcher.js "bitcoin chart price" --save btc-price.jpg

# Mineração
node scripts/unsplash-image-fetcher.js "bitcoin mining" --save btc-mining.jpg

# Físico (moeda)
node scripts/unsplash-image-fetcher.js "bitcoin coin gold" --save btc-coin.jpg
```

### Ethereum

```bash
# Ethereum geral
node scripts/unsplash-image-fetcher.js "ethereum blockchain" --save eth-blockchain.jpg

# Logo/conceito
node scripts/unsplash-image-fetcher.js "ethereum logo" --save eth-logo.jpg

# DeFi
node scripts/unsplash-image-fetcher.js "ethereum defi" --save eth-defi.jpg
```

### Trading

```bash
# Gráficos
node scripts/unsplash-image-fetcher.js "trading chart candlestick" --save trading-chart.jpg

# Análise técnica
node scripts/unsplash-image-fetcher.js "stock market analysis" --save analysis.jpg

# Trading desk
node scripts/unsplash-image-fetcher.js "trading desk computer" --save trading-desk.jpg
```

### Conceitos Abstratos

```bash
# Tecnologia
node scripts/unsplash-image-fetcher.js "technology network" --save tech.jpg

# Segurança
node scripts/unsplash-image-fetcher.js "security lock cyber" --save security.jpg

# Finanças
node scripts/unsplash-image-fetcher.js "finance money investment" --save finance.jpg

# Dados
node scripts/unsplash-image-fetcher.js "data analytics chart" --save data.jpg
```

---

## 🔧 Troubleshooting

### Erro: "Configure sua Access Key"

**Solução:**
```bash
# Verificar se está configurada
echo $UNSPLASH_ACCESS_KEY

# Se não estiver, configurar
export UNSPLASH_ACCESS_KEY="sua_chave"
```

### Erro: "401 Unauthorized"

**Causas:**
- Access Key incorreta
- Access Key não configurada
- App do Unsplash desativado

**Solução:**
1. Verificar Access Key no dashboard
2. Reconfigurar variável de ambiente
3. Verificar se app está ativo

### Erro: "429 Rate Limit"

**Causa:** Excedeu 50 requisições/hora

**Solução:**
- Aguardar 1 hora
- Ou criar novo app (novo limite)
- Ou solicitar plano Production

### Nenhuma foto encontrada

**Causas:**
- Termo muito específico
- Termo em português
- Termo sem resultados

**Solução:**
- Use termos mais genéricos
- Use termos em inglês
- Tente categorias pré-definidas

---

## ✅ Checklist: Adicionar Foto a um Artigo

- [ ] Obter Access Key do Unsplash
- [ ] Configurar no ambiente
- [ ] Identificar tema do artigo
- [ ] Buscar fotos relevantes
- [ ] Revisar qualidade e relevância
- [ ] Salvar melhor foto
- [ ] Copiar código do frontmatter
- [ ] Colar no artigo .md
- [ ] **Adicionar créditos no final do artigo**
- [ ] Verificar se foto carrega no site
- [ ] Commit e push para GitHub
- [ ] Verificar no site publicado

---

## 🚀 Próximos Passos

1. **Obter Access Key do Unsplash** ← Comece aqui!
2. **Configurar no ambiente**
3. **Testar com um artigo**
4. **Adicionar fotos a todos os artigos**
5. **Manter biblioteca organizada**

---

## 📚 Recursos

**Documentação Oficial:**
- https://unsplash.com/documentation

**Guidelines:**
- https://unsplash.com/license

**API Reference:**
- https://unsplash.com/documentation#search-photos

---

**Dúvidas?** Me pergunte que eu te ajudo!

