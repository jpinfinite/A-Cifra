# 🚀 Guia de Setup - Cloudflare Workers AI

**Data:** 3 de dezembro de 2025
**Tempo esFREado:** 30-60 minutos

---

## 📋 PRÉ-REQUISITOS

1. ✅ Conta Cloudflare (gratuita)
2. ✅ Site no Cloudflare Pages (já temos!)
3. ✅ Node.js 18+ instalado
4. ✅ Git configurado

---

## 🔧 PASSO 1: Instalar Wrangler CLI

```bash
# Instalar Wrangler globalmente
npm install -g wrangler

# Verificar instalação
wrangler --version

# Login no Cloudflare
wrangler login
```

---

## 🗄️ PASSO 2: Criar KV Namespace (Armazenar Embeddings)

```bash
# Criar namespace para embeddings
wrangler kv:namespace create "EMBEDDINGS"

# Output exemplo:
# 🌀 Creating namespace with title "a-cifra-EMBEDDINGS"
# ✨ Success!
# Add the following to your wrangler.toml:
# [[kv_namespaces]]
# binding = "EMBEDDINGS"
# id = "abc123def456..."

# Copiar o ID e atualizar wrangler.toml
```

**Atualizar `wrangler.toml`:**
```toml
[[kv_namespaces]]
binding = "EMBEDDINGS"
id = "SEU_KV_ID_AQUI" # Substituir pelo ID gerado
```

---

## 📦 PASSO 3: Criar R2 Bucket (Armazenar Imagens/Áudio)

```bash
# Criar bucket R2
wrangler r2 bucket create a-cifra-media

# Output:
# ✨ Created bucket 'a-cifra-media'

# Configurar domínio público (opcional)
wrangler r2 bucket domain add a-cifra-media --domain media.a-cifra.com.br
```

**Atualizar `wrangler.toml`:**
```toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "a-cifra-media"
```

---

## 🤖 PASSO 4: Habilitar Workers AI

```bash
# Workers AI já está habilitado por padrão!
# Apenas certifique-se que wrangler.toml tem:

[ai]
binding = "AI"
```

---

## 🧪 PASSO 5: Testar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor local com Wrangler
wrangler pages dev out --compatibility-date=2025-12-03

# Servidor rodando em: http://localhost:8788
```

**Testar APIs:**

```bash
# 1. Gerar embeddings
curl -X POST http://localhost:8788/api/generate-embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "articles": [
      {
        "id": "test-1",
        "slug": "bitcoin-guia",
        "title": "Guia Completo de Bitcoin",
        "excerpt": "Aprenda tudo sobre Bitcoin",
        "category": "bitcoin",
        "content": "Bitcoin é uma criptomoeda..."
      }
    ]
  }'

# 2. Busca semântica
curl -X POST http://localhost:8788/api/semantic-search \
  -H "Content-Type": application/json" \
  -d '{"query": "como investir em bitcoin", "limit": 5}'

# 3. Gerar conteúdo
curl -X POST http://localhost:8788/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "O que é Bitcoin",
    "keywords": ["bitcoin", "criptomoeda", "blockchain"],
    "type": "article",
    "length": "medium"
  }'

# 4. Gerar imagem
curl -X POST http://localhost:8788/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Bitcoin cryptocurrency chart",
    "style": "professional"
  }'

# 5. Text-to-speech
curl -X POST http://localhost:8788/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bitcoin é uma criptomoeda descentralizada",
    "voice": "professional"
  }' --output audio.mp3
```

---

## 🚀 PASSO 6: Deploy para Produção

```bash
# Fazer commit das mudanças
git add -A
git commit -m "feat: adiciona Cloudflare Workers AI"
git push origin main

# Cloudflare Pages faz deploy automático!
# Aguarde 2-3 minutos
```

**Verificar deploy:**
- Acesse: https://dash.cloudflare.com
- Pages → a-cifra → Deployments
- Verificar se build passou

---

## 📊 PASSO 7: Gerar Embeddings de Todos os Artigos

```bash
# Executar script
CLOUDFLARE_API_URL=https://a-cifra.com.br node scripts/generate-all-embeddings.js

# Output esperado:
# 🚀 Iniciando geração de embeddings...
# 📚 Carregando artigos...
# ✅ 165 artigos carregados
# 🤖 Gerando embeddings para 165 artigos...
# ✅ Embeddings gerados com sucesso!
# 📊 Processados: 165/165
# 💾 Salvos no Cloudflare KV
# 🎉 Processo concluído!
```

---

## 🧪 PASSO 8: Testar em Produção

```bash
# 1. Busca semântica
curl -X POST https://a-cifra.com.br/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query": "como comprar bitcoin", "limit": 5}'

# 2. Gerar conteúdo
curl -X POST https://a-cifra.com.br/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Ethereum 2.0",
    "type": "article",
    "length": "medium"
  }'
```

---

## 🔗 PASSO 9: Integrar no Frontend

### Busca Semântica

**Atualizar `src/components/search/SearchBar.tsx`:**

```typescript
// Adicionar opção de busca semântica
const [useSemanticSearch, setUseSemanticSearch] = useState(true)

async function performSemanticSearch(query: string) {
  const response = await fetch('/api/semantic-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit: 10 })
  })

  const data = await response.json()
  return data.results
}
```

### Gerador de Conteúdo (Admin)

**Criar `src/app/admin/ai-writer/page.tsx`:**

```typescript
'use client'

import { useState } from 'react'

export default function AIWriter() {
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function generateContent() {
    setLoading(true)

    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        type: 'article',
        length: 'medium'
      })
    })

    const data = await response.json()
    setContent(data.content)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1>AI Writer</h1>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Tópico do artigo..."
      />
      <button onClick={generateContent} disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar Artigo'}
      </button>
      {content && (
        <div className="mt-8">
          <h2>Conteúdo Gerado:</h2>
          <pre>{content}</pre>
        </div>
      )}
    </div>
  )
}
```

---

## 📊 PASSO 10: Monitorar Uso

**Cloudflare Dashboard:**
1. Acesse: https://dash.cloudflare.com
2. Workers & Pages → a-cifra
3. Analytics → Workers AI

**Métricas importantes:**
- Requests/dia
- Neurons usados
- Latência média
- Taxa de erro

**Limites Free Tier:**
- 10.000 neurons/dia
- ~100-500 requests/dia
- Suficiente para começar!

---

## 💰 CUSTOS

### Free Tier (Atual)
- ✅ 10.000 neurons/dia
- ✅ KV: 100k reads/dia
- ✅ R2: 10GB storage
- ✅ **Custo: $0/mês**

### Paid Plan (Se necessário)
- 1M neurons/mês: $5
- Adicional: $0.011/1k neurons
- KV: $0.50/GB
- R2: $0.015/GB
- **Estimativa: $5-20/mês**

---

## 🐛 TROUBLESHOOTING

### Erro: "AI binding not found"
```bash
# Verificar wrangler.toml tem:
[ai]
binding = "AI"

# Reiniciar servidor local
wrangler pages dev out
```

### Erro: "KV namespace not found"
```bash
# Criar namespace
wrangler kv:namespace create "EMBEDDINGS"

# Atualizar ID no wrangler.toml
```

### Erro: "R2 bucket not found"
```bash
# Criar bucket
wrangler r2 bucket create a-cifra-media

# Atualizar wrangler.toml
```

### Erro: "Rate limit exceeded"
- Free tier: 10k neurons/dia
- Solução: Upgrade para paid plan ($5/mês)

---

## ✅ CHECKLIST FINAL

- [ ] Wrangler CLI instalado
- [ ] Login no Cloudflare feito
- [ ] KV namespace criado
- [ ] R2 bucket criado
- [ ] wrangler.toml configurado
- [ ] APIs testadas localmente
- [ ] Deploy feito
- [ ] Embeddings gerados
- [ ] Busca semântica funcionando
- [ ] Monitoramento configurado

---

## 🎯 PRÓXIMOS PASSOS

1. **Integrar busca semântica** no SearchBar
2. **Criar interface admin** para AI Writer
3. **Automatizar geração de imagens** para novos artigos
4. **Implementar podcast automático**
5. **Monitorar métricas** e otimizar

---

## 📚 RECURSOS

**Documentação:**
- https://developers.cloudflare.com/workers-ai/
- https://developers.cloudflare.com/kv/
- https://developers.cloudflare.com/r2/

**Exemplos:**
- https://github.com/cloudflare/workers-ai-examples

**Suporte:**
- Discord: https://discord.gg/cloudflaredev
- Forum: https://community.cloudflare.com/

---

**Setup completo! Agora você tem IA rodando no A Cifra! 🚀**

**Última atualização:** 3 de dezembro de 2025
**Autor:** Agente A Cifra (Beast Mode)
