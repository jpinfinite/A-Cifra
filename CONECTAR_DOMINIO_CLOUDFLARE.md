# 🚀 Como Conectar Domínio a-cifra.com.br no Cloudflare Pages

## 📋 Pré-requisitos
- ✅ Domínio registrado: a-cifra.com.br (Registro.br)
- ✅ Conta Cloudflare: https://dash.cloudflare.com
- ✅ Repositório GitHub: jpinfinite/A-Cifra
- ✅ Projeto já deployado no Cloudflare Pages

---

## 🎯 OPÇÃO 1: Adicionar Domínio Customizado (RECOMENDADO - Mais Rápido)

### Passo 1: Acessar seu Projeto no Cloudflare Pages
1. Acesse: https://dash.cloudflare.com
2. Clique em **"Workers & Pages"** no menu lateral
3. Encontre seu projeto **"a-cifra"** (ou nome do projeto)
4. Clique no projeto

### Passo 2: Adicionar Custom Domain
1. Clique na aba **"Custom domains"**
2. Clique em **"Set up a custom domain"**
3. Digite: `a-cifra.com.br`
4. Clique em **"Continue"**
5. Cloudflare vai mostrar os registros DNS necessários

### Passo 3: Configurar DNS no Registro.br
1. Acesse: https://registro.br
2. Login com: j.p.designgraficoinfinte@gmail.com
3. Clique em **"Domínios"** → **"a-cifra.com.br"**
4. Clique em **"Editar Zona"** ou **"DNS"**

### Passo 4: Adicionar Registros DNS
Adicione estes registros (Cloudflare vai mostrar os IPs corretos):

```
Tipo: A
Nome: @
Valor: [IP fornecido pelo Cloudflare]
TTL: 3600

Tipo: CNAME
Nome: www
Valor: a-cifra.com.br
TTL: 3600
```

**OU** se Cloudflare mostrar CNAME:
```
Tipo: CNAME
Nome: @
Valor: a-cifra.pages.dev
TTL: 3600

Tipo: CNAME
Nome: www
Valor: a-cifra.pages.dev
TTL: 3600
```

### Passo 5: Aguardar Ativação
- ⏱️ Tempo: 5 minutos a 24 horas
- ✅ Cloudflare vai verificar automaticamente
- ✅ SSL será configurado automaticamente

---

## 🎯 OPÇÃO 2: Adicionar Site Completo no Cloudflare (Mais Controle)

### Passo 1: Adicionar Site no Cloudflare
1. Acesse: https://dash.cloudflare.com
2. Clique em **"Add a site"**
3. Digite: `a-cifra.com.br`
4. Clique em **"Add site"**
5. Escolha plano **"Free"**
6. Clique em **"Continue"**

### Passo 2: Cloudflare Vai Escanear DNS
- Aguarde o scan automático
- Cloudflare vai importar registros existentes
- Clique em **"Continue"**

### Passo 3: Mudar Nameservers no Registro.br
Cloudflare vai fornecer 2 nameservers, exemplo:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

**No Registro.br:**
1. Acesse: https://registro.br
2. Login: j.p.designgraficoinfinte@gmail.com
3. Clique em **"Domínios"** → **"a-cifra.com.br"**
4. Clique em **"Alterar Servidores DNS"**
5. Remova os DNS atuais
6. Adicione os nameservers do Cloudflare
7. Salve

### Passo 4: Aguardar Propagação
- ⏱️ Tempo: 2 a 24 horas
- 📧 Cloudflare vai enviar email quando ativar
- ✅ Status muda para "Active"

### Passo 5: Configurar DNS no Cloudflare
Após ativação, no Cloudflare:
1. Vá em **"DNS"** → **"Records"**
2. Adicione:

```
Tipo: CNAME
Nome: @
Destino: a-cifra.pages.dev
Proxy: ✅ Proxied (laranja)

Tipo: CNAME
Nome: www
Destino: a-cifra.pages.dev
Proxy: ✅ Proxied (laranja)
```

### Passo 6: Conectar ao Pages
1. Vá em **"Workers & Pages"**
2. Clique no projeto **"a-cifra"**
3. Aba **"Custom domains"**
4. Clique **"Set up a custom domain"**
5. Digite: `a-cifra.com.br`
6. Como o domínio já está no Cloudflare, vai conectar automaticamente

---

## ✅ Verificar se Funcionou

### Teste 1: DNS Propagado
```bash
nslookup a-cifra.com.br
```
Deve mostrar IPs do Cloudflare

### Teste 2: Site Acessível
Abra no navegador:
- https://a-cifra.com.br
- https://www.a-cifra.com.br

### Teste 3: SSL Ativo
- 🔒 Deve mostrar cadeado verde
- ✅ Certificado válido

### Teste 4: Verificar Propagação Global
- https://dnschecker.org
- Digite: a-cifra.com.br
- Deve estar verde em vários países

---

## 🔧 Configurações Adicionais Recomendadas

### 1. Redirecionar www para domínio principal
No Cloudflare Pages:
1. **"Custom domains"**
2. Adicione ambos: `a-cifra.com.br` e `www.a-cifra.com.br`
3. Cloudflare redireciona automaticamente

### 2. Forçar HTTPS
No Cloudflare:
1. **"SSL/TLS"** → **"Edge Certificates"**
2. **"Always Use HTTPS"**: ✅ ON
3. **"Automatic HTTPS Rewrites"**: ✅ ON

### 3. Otimizar Performance
No Cloudflare:
1. **"Speed"** → **"Optimization"**
2. **"Auto Minify"**: ✅ JavaScript, CSS, HTML
3. **"Brotli"**: ✅ ON
4. **"Rocket Loader"**: ✅ ON (teste se não quebrar)

### 4. Configurar Cache
No Cloudflare:
1. **"Caching"** → **"Configuration"**
2. **"Caching Level"**: Standard
3. **"Browser Cache TTL"**: 4 hours

---

## 🚨 Troubleshooting

### Problema: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solução:**
- DNS ainda não propagou
- Aguarde mais tempo (até 24h)
- Verifique registros no Registro.br

### Problema: "Too Many Redirects"
**Solução:**
- No Cloudflare: SSL/TLS → **"Full"** ou **"Full (strict)"**
- Limpe cache do navegador

### Problema: "Site não carrega"
**Solução:**
- Verifique se projeto está deployado no Pages
- Verifique se build foi bem-sucedido
- Veja logs no Cloudflare Pages

### Problema: "Certificado SSL inválido"
**Solução:**
- Aguarde até 24h para emissão automática
- No Cloudflare: SSL/TLS → **"Edge Certificates"**
- Verifique se **"Universal SSL"** está ativo

---

## 📊 Checklist Final

### Antes de Começar
- [ ] Domínio registrado no Registro.br
- [ ] Acesso ao painel Registro.br
- [ ] Conta Cloudflare criada
- [ ] Projeto deployado no Cloudflare Pages

### Durante Configuração
- [ ] Custom domain adicionado no Pages
- [ ] Registros DNS configurados
- [ ] Nameservers atualizados (se Opção 2)
- [ ] SSL/TLS configurado

### Após Configuração
- [ ] Site acessível em a-cifra.com.br
- [ ] www redireciona corretamente
- [ ] HTTPS funcionando (cadeado verde)
- [ ] DNS propagado globalmente
- [ ] Performance otimizada

---

## 🎯 Qual Opção Escolher?

### Use OPÇÃO 1 se:
- ✅ Quer rapidez (5-30 minutos)
- ✅ Já tem DNS configurado em outro lugar
- ✅ Quer apenas conectar o domínio

### Use OPÇÃO 2 se:
- ✅ Quer controle total do DNS
- ✅ Quer usar outros recursos Cloudflare (firewall, analytics)
- ✅ Quer melhor performance (proxy Cloudflare)
- ✅ Não se importa em esperar propagação (2-24h)

---

## 📞 Suporte

### Cloudflare
- Docs: https://developers.cloudflare.com/pages
- Community: https://community.cloudflare.com

### Registro.br
- Suporte: https://registro.br/suporte
- Docs DNS: https://registro.br/tecnologia/ferramentas/dns

---

## 🚀 Próximos Passos Após Domínio Ativo

1. **Testar tudo**: Navegue pelo site completo
2. **Google Search Console**: Adicionar novo domínio
3. **Google Analytics**: Atualizar propriedade
4. **AdSense**: Atualizar URL do site
5. **Redes Sociais**: Atualizar links
6. **Email Marketing**: Atualizar URLs nos templates

---

**💡 Dica:** A OPÇÃO 1 é mais rápida e simples. Use ela primeiro!

**🎉 Boa sorte com seu domínio próprio! Isso vai aumentar muito suas chances no AdSense!**
