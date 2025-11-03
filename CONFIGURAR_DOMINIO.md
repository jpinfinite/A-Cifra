# 🌐 Configurar Domínio a-cifra.com.br

## ✅ Domínio Comprado

**Domínio:** a-cifra.com.br
**Registrador:** Registro.br
**Valor:** R$ 39,99/ano
**Email de confirmação:** j.p.designgraficoinfinte@gmail.com

---

## 🎯 Benefícios do Domínio Próprio

### Para o Google AdSense:
- ✅ **Maior credibilidade** (domínio próprio vs subdomínio)
- ✅ **Melhor aprovação** (AdSense prefere domínios próprios)
- ✅ **Profissionalismo** (a-cifra.com.br é mais confiável)
- ✅ **SEO melhor** (domínio próprio ranqueia melhor)

### Para o Site:
- ✅ Marca própria
- ✅ Email profissional (contato@a-cifra.com.br)
- ✅ Melhor memorização
- ✅ Mais confiança dos usuários

---

## 📋 Passo a Passo de Configuração

### 1. Configurar DNS no Registro.br

**Acesse:** https://registro.br

**Login com:**
- Email: j.p.designgraficoinfinte@gmail.com
- Senha: [sua senha]

**Passos:**
1. Faça login no painel
2. Clique em "Meus Domínios"
3. Selecione **a-cifra.com.br**
4. Clique em "Editar Zona DNS" ou "DNS"

---

### 2. Adicionar Registros DNS para Cloudflare Pages

**Você tem 2 opções:**

#### Opção A: Usar Cloudflare Nameservers (Recomendado)

**Vantagens:**
- Mais fácil de gerenciar
- CDN grátis
- SSL automático
- Proteção DDoS
- Analytics

**Passos:**

1. **No Cloudflare:**
   - Acesse: https://dash.cloudflare.com
   - Clique em "Add a Site"
   - Digite: a-cifra.com.br
   - Escolha plano Free
   - Cloudflare vai mostrar 2 nameservers

2. **No Registro.br:**
   - Vá em DNS do domínio
   - Altere os nameservers para os fornecidos pelo Cloudflare
   - Exemplo:
     ```
     ns1.cloudflare.com
     ns2.cloudflare.com
     ```
   - Salve as alterações

3. **Aguarde propagação:** 2-24 horas

4. **No Cloudflare Pages:**
   - Vá no seu projeto (blog-a-cifra)
   - Custom Domains → Add Domain
   - Digite: a-cifra.com.br
   - Cloudflare configura automaticamente

---

#### Opção B: Usar DNS do Registro.br

**Passos:**

1. **No Cloudflare Pages:**
   - Vá no projeto
   - Custom Domains → Add Domain
   - Digite: a-cifra.com.br
   - Cloudflare mostrará os registros DNS necessários

2. **No Registro.br, adicione:**

   **Para domínio raiz (a-cifra.com.br):**
   ```
   Tipo: CNAME
   Nome: @
   Valor: a-cifra.pages.dev
   TTL: 3600
   ```

   **Para www (www.a-cifra.com.br):**
   ```
   Tipo: CNAME
   Nome: www
   Valor: a-cifra.pages.dev
   TTL: 3600
   ```

   **OU se CNAME não funcionar para @:**
   ```
   Tipo: A
   Nome: @
   Valor: [IP fornecido pelo Cloudflare]
   TTL: 3600
   ```

3. **Salve e aguarde:** 2-24 horas

---

### 3. Verificar Propagação

**Após configurar, teste:**

```bash
# Windows (PowerShell)
nslookup a-cifra.com.br

# Ou use site:
https://dnschecker.org
```

**Resultado esperado:**
- a-cifra.com.br aponta para Cloudflare
- www.a-cifra.com.br aponta para Cloudflare

---

### 4. Configurar SSL/HTTPS

**No Cloudflare:**
1. Vá em SSL/TLS
2. Escolha "Full" ou "Full (strict)"
3. Ative "Always Use HTTPS"
4. Ative "Automatic HTTPS Rewrites"

**Resultado:**
- ✅ https://a-cifra.com.br (seguro)
- ✅ https://www.a-cifra.com.br (seguro)

---

### 5. Atualizar URLs no Site

**Arquivos para atualizar:**

```bash
# Executar script de atualização
node scripts/update-urls.js
```

**Ou manualmente atualizar:**
- .env.example
- .env.local
- README.md
- Documentação
- Política de Privacidade
- Página de Contato

**De:** a-cifra.pages.dev
**Para:** a-cifra.com.br

---

### 6. Configurar Redirecionamentos

**No Cloudflare Pages:**

1. Criar arquivo `_redirects` na pasta `public/`:

```
# Redirecionar www para não-www
https://www.a-cifra.com.br/* https://a-cifra.com.br/:splat 301

# Redirecionar domínio antigo
https://a-cifra.pages.dev/* https://a-cifra.com.br/:splat 301
```

2. Ou criar `_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📧 Configurar Email Profissional (Opcional)

### Opção 1: Google Workspace (Pago)
- R$ 30/mês por usuário
- contato@a-cifra.com.br
- Gmail interface

### Opção 2: Zoho Mail (Gratuito até 5 usuários)
- Gratuito para 1 domínio
- contato@a-cifra.com.br
- 5GB de armazenamento

### Opção 3: Cloudflare Email Routing (Gratuito)
- Encaminhamento de emails
- contato@a-cifra.com.br → cifraaessenciacoin@gmail.com
- Não envia, só recebe

**Recomendação:** Cloudflare Email Routing (grátis e fácil)

**Configurar:**
1. Cloudflare Dashboard
2. Email → Email Routing
3. Enable Email Routing
4. Adicionar: contato@a-cifra.com.br
5. Encaminhar para: cifraaessenciacoin@gmail.com

---

## ✅ Checklist de Configuração

### DNS
- [ ] Nameservers configurados (Opção A)
- [ ] OU Registros CNAME/A configurados (Opção B)
- [ ] Propagação verificada (dnschecker.org)
- [ ] Domínio acessível

### Cloudflare
- [ ] Domínio adicionado ao Cloudflare
- [ ] Custom Domain configurado no Pages
- [ ] SSL/TLS ativo (Full)
- [ ] Always Use HTTPS ativo
- [ ] Redirecionamentos configurados

### Site
- [ ] URLs atualizadas no código
- [ ] .env.local atualizado
- [ ] Política de Privacidade atualizada
- [ ] Página de Contato atualizada
- [ ] README atualizado

### Email (Opcional)
- [ ] Email routing configurado
- [ ] Teste de recebimento OK
- [ ] Assinatura de email criada

### Google AdSense
- [ ] Atualizar URL no AdSense
- [ ] Verificar propriedade do domínio
- [ ] Reaplicar (se necessário)

---

## 🔧 Troubleshooting

### Domínio não resolve
**Problema:** a-cifra.com.br não abre

**Soluções:**
1. Aguardar propagação (até 24h)
2. Verificar DNS: `nslookup a-cifra.com.br`
3. Limpar cache DNS: `ipconfig /flushdns`
4. Testar em modo anônimo

### SSL não funciona
**Problema:** Aviso de "Não seguro"

**Soluções:**
1. Aguardar emissão do certificado (até 24h)
2. Verificar SSL/TLS no Cloudflare
3. Ativar "Always Use HTTPS"
4. Limpar cache do navegador

### Redirecionamento não funciona
**Problema:** www não redireciona

**Soluções:**
1. Verificar arquivo `_redirects`
2. Adicionar regra no Cloudflare (Page Rules)
3. Aguardar propagação

---

## 📊 Após Configuração

### 1. Testar Tudo
- [ ] https://a-cifra.com.br abre
- [ ] https://www.a-cifra.com.br redireciona
- [ ] SSL ativo (cadeado verde)
- [ ] Todas as páginas funcionam
- [ ] Imagens carregam
- [ ] Newsletter funciona

### 2. Atualizar Google
- [ ] Google Search Console (adicionar propriedade)
- [ ] Google Analytics (atualizar URL)
- [ ] Google AdSense (atualizar domínio)
- [ ] Sitemap (enviar novo)

### 3. Atualizar Redes Sociais
- [ ] Instagram (bio)
- [ ] Twitter (bio)
- [ ] GitHub (about)

---

## 🎯 Próximos Passos

### Imediato (Hoje)
1. Configurar DNS no Registro.br
2. Adicionar domínio no Cloudflare
3. Aguardar propagação

### Amanhã
1. Verificar se domínio está ativo
2. Atualizar URLs no código
3. Fazer commit e push

### Próxima Semana
1. Configurar email profissional
2. Atualizar Google AdSense
3. Reaplicar no AdSense

---

## 💡 Dicas Importantes

1. **Aguarde a propagação** - DNS pode levar até 24h
2. **Não apague a-cifra.pages.dev** - Mantenha como backup
3. **Teste antes de divulgar** - Verifique tudo funciona
4. **Faça backup** - Antes de qualquer mudança
5. **Monitore** - Verifique se tudo continua funcionando

---

## 📞 Suporte

### Registro.br
- **Site:** https://registro.br
- **Suporte:** https://registro.br/ajuda
- **Telefone:** 0800 940 0000

### Cloudflare
- **Dashboard:** https://dash.cloudflare.com
- **Docs:** https://developers.cloudflare.com/pages
- **Community:** https://community.cloudflare.com

---

## 🎉 Parabéns!

Você agora tem um domínio profissional! Isso vai:
- ✅ Aumentar chances de aprovação no AdSense
- ✅ Melhorar credibilidade do site
- ✅ Melhorar SEO
- ✅ Profissionalizar a marca

**Vamos configurar agora?**
