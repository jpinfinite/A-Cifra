# 🚀 Setup Rápido - Cloudflare AI (15 minutos)

**Status:** ✅ Wrangler instalado | ⏳ Aguardando login

---

## 📋 CHECKLIST RÁPIDO

### ✅ Concluído
- [x] Código das APIs criado
- [x] Wrangler CLI instalado (v4.52.1)
- [x] Documentação pronta

### ⏳ Falta Fazer (15 min)

#### 1. Login no Cloudflare (2 min)
```bash
wrangler login
```
- Abrirá navegador
- Fazer login na conta Cloudflare
- Autorizar Wrangler

#### 2. Criar KV Namespace (2 min)
```bash
wrangler kv:namespace create "EMBEDDINGS"
```
- Copiar o ID gerado
- Atualizar `wrangler.toml` linha 14

#### 3. Criar R2 Bucket (2 min)
```bash
wrangler r2 bucket create a-cifra-media
```
- Bucket criado automaticamente

#### 4. Testar Localmente (5 min)
```bash
# Build do projeto
npm run build

# Iniciar servidor local
wrangler pages dev out --compatibility-date=2025-12-03
```
- Servidor em: http://localhost:8788
- Testar: http://localhost:8788/api/generate-content

#### 5. Deploy (2 min)
```bash
git push origin main
```
- Cloudflare Pages faz deploy automático
- Aguardar 2-3 minutos

#### 6. Gerar Embeddings (2 min)
```bash
node scripts/generate-all-embeddings.js
```
- Processa 165 artigos
- Salva no KV

---

## 🎯 COMANDOS RÁPIDOS

### Login
```bash
wrangler login
```

### Criar KV
```bash
wrangler kv:namespace create "EMBEDDINGS"
# Copiar ID e colar no wrangler.toml linha 14
```

### Criar R2
```bash
wrangler r2 bucket create a-cifra-media
```

### Testar Local
```bash
npm run build
wrangler pages dev out
```

### Deploy
```bash
git push origin main
```

### Gerar Embeddings
```bash
CLOUDFLARE_API_URL=https://a-cifra.com.br node scripts/generate-all-embeddings.js
```

---

## 🧪 TESTAR APIs

### 1. Gerar Conteúdo
```bash
curl -X POST https://a-cifra.com.br/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "O que é Bitcoin",
    "type": "article",
    "length": "medium"
  }'
```

### 2. Busca Semântica
```bash
curl -X POST https://a-cifra.com.br/api/semantic-search \
  -H "Content-Type: application/json" \
  -d '{"query": "como investir em bitcoin", "limit": 5}'
```

### 3. Gerar Imagem
```bash
curl -X POST https://a-cifra.com.br/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Bitcoin cryptocurrency chart",
    "style": "professional"
  }'
```

---

## 💰 CUSTOS

- **Free Tier:** $0/mês (10k neurons/dia)
- **Suficiente para:** ~100-500 requests/dia
- **Upgrade:** $5/mês se necessário

---

## ❓ PROBLEMAS COMUNS

### "Not logged in"
```bash
wrangler login
```

### "KV namespace not found"
```bash
wrangler kv:namespace create "EMBEDDINGS"
# Atualizar wrangler.toml com o ID
```

### "R2 bucket not found"
```bash
wrangler r2 bucket create a-cifra-media
```

---

## 🎉 PRÓXIMO PASSO

**Execute agora:**
```bash
wrangler login
```

Depois me avise que eu continuo o setup! 🚀
