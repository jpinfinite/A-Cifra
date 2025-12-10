# 🔧 Correção do robots.txt - Cloudflare

## ⚠️ Problema Identificado

O Cloudflare está gerenciando automaticamente seu `robots.txt` e adicionando regras que:
1. Duplicam as suas regras
2. Causam conflitos
3. Usam URL errada no sitemap (`acifra.com` em vez de `a-cifra.com.br`)

## ✅ Solução

### Opção 1: Desabilitar Cloudflare Managed Content (Recomendado)

1. **Acesse o Cloudflare Dashboard**
   - Vá em: https://dash.cloudflare.com
   - Selecione seu domínio `a-cifra.com.br`

2. **Desabilitar o robots.txt gerenciado**
   - Menu lateral: **Scrape Shield** ou **Security**
   - Procure por: **"Managed robots.txt"** ou **"Content Signals"**
   - **Desative** essa opção

3. **Limpar Cache**
   - Vá em: **Caching** > **Configuration**
   - Clique em: **Purge Everything**
   - Confirme a limpeza

4. **Verificar**
   - Aguarde 5-10 minutos
   - Acesse: https://a-cifra.com.br/robots.txt
   - Verifique se o conteúdo duplicado sumiu

### Opção 2: Usar Page Rules (Alternativa)

Se não encontrar a opção acima:

1. **Criar Page Rule**
   - Vá em: **Rules** > **Page Rules**
   - Clique em: **Create Page Rule**

2. **Configurar**
   - URL: `a-cifra.com.br/robots.txt`
   - Setting: **Cache Level** = **Bypass**
   - Salvar

3. **Limpar Cache**
   - Caching > Purge Everything

### Opção 3: Usar Transform Rules (Mais Avançado)

1. **Criar Transform Rule**
   - Vá em: **Rules** > **Transform Rules**
   - Clique em: **Create rule**

2. **Configurar**
   - Rule name: `Bypass robots.txt`
   - When incoming requests match: `URI Path equals /robots.txt`
   - Then: **Rewrite to** > Static
   - Path: `/robots.txt`

## 📋 Novo robots.txt Limpo

O arquivo `public/robots.txt` foi atualizado com:

✅ **Sem duplicações**
✅ **URL correta do sitemap** (a-cifra.com.br)
✅ **Content Signals** (EU Directive 2019/790)
✅ **Bots de busca permitidos** (Google, Bing)
✅ **Bots de IA bloqueados** (GPT, Claude, etc.)
✅ **Bots de scraping bloqueados** (Ahrefs, Semrush)

## 🧪 Como Testar

### 1. Após fazer as alterações no Cloudflare:

```bash
# Limpar cache local
Ctrl + Shift + Del (navegador)

# Verificar robots.txt
https://a-cifra.com.br/robots.txt
```

### 2. Testar no Bing Webmaster Tools:

1. Vá em: **Ferramentas** > **Testador de robots.txt**
2. Clique em: **Buscar mais recente**
3. Verifique se não há mais duplicações

### 3. Testar no Google Search Console:

1. Vá em: **Configurações** > **Rastreamento**
2. Clique em: **robots.txt**
3. Verifique o conteúdo

## 🎯 Resultado Esperado

Após as correções, seu robots.txt deve mostrar:

```
# robots.txt para A Cifra - Blog de Criptomoedas
# https://a-cifra.com.br

User-Agent: *
Content-signal: search=yes,ai-train=no
Allow: /
Disallow: /api/
Disallow: /admin/
...

Sitemap: https://a-cifra.com.br/sitemap.xml
```

**SEM** as linhas:
- ❌ `# BEGIN Cloudflare Managed content`
- ❌ `# END Cloudflare Managed Content`
- ❌ Duplicações de User-Agent

## 📊 Checklist

- [ ] Desabilitar Cloudflare Managed robots.txt
- [ ] Limpar cache do Cloudflare
- [ ] Verificar https://a-cifra.com.br/robots.txt
- [ ] Testar no Bing Webmaster Tools
- [ ] Testar no Google Search Console
- [ ] Confirmar sitemap correto (a-cifra.com.br)

## 🆘 Se Não Conseguir Desabilitar

Se você não encontrar a opção no Cloudflare:

1. **Contate o suporte do Cloudflare**
2. **Ou** use o arquivo `.htaccess` (se tiver Apache)
3. **Ou** configure no Next.js para sobrescrever

### Sobrescrever via Next.js:

Adicione no `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/robots.txt',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
      ],
    },
  ]
}
```

---

**Última atualização:** 23 de novembro de 2025

**Status:** ✅ Arquivo robots.txt corrigido, aguardando desabilitar Cloudflare Managed Content
