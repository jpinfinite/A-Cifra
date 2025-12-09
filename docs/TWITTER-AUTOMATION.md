# 🐦 Automação de Postagem no Twitter (X)

Sistema completo de automação para postar artigos do A Cifra no Twitter (@acifra_btc).

## 📋 Pré-requisitos

1. **Google Chrome instalado** no Windows
2. **Estar logado no Twitter** no perfil padrão do Chrome
3. **Chrome FECHADO** antes de executar os scripts
4. **Node.js** e dependências instaladas (`npm install`)

## 🚀 Como Usar

### 1. Testar a Integração

Primeiro, teste se tudo está funcionando:

```bash
npm run twitter:test
```

Ou diretamente:

```bash
node scripts/test-twitter.js
```

**O que acontece:**
- O script abre o Chrome automaticamente
- Acessa o Twitter usando sua sessão salva
- Gera um tweet otimizado do artigo mais recente
- Posta no Twitter
- Fecha o navegador

### 2. Gerar Tweet (sem postar)

Para apenas visualizar como ficaria o tweet:

```bash
node scripts/gerar-tweet.js "content/articles/nome-do-artigo.md"
```

Exemplo:
```bash
node scripts/gerar-tweet.js "content/articles/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md"
```

### 3. Postar Artigo Específico

```bash
node scripts/postar-twitter.js "content/articles/nome-do-artigo.md"
```

Ou com estilo específico:

```bash
# Estilo engajador (padrão - com emoji e CTA)
node scripts/postar-twitter.js "content/articles/artigo.md" engajador

# Estilo simples (apenas título + hashtags + link)
node scripts/postar-twitter.js "content/articles/artigo.md" simples
```

### 4. Postar o Artigo Mais Recente

```bash
npm run twitter:post
```

Ou:

```bash
node scripts/postar-twitter.js --latest
```

### 5. Postar Múltiplos Artigos

```bash
node scripts/postar-twitter.js --multiple "artigo1.md" "artigo2.md" "artigo3.md"
```

**Nota:** Há um delay de 30 minutos entre cada post para evitar spam.

## 🤖 Automação Completa

O sistema de automação principal (`automacao-postagem.js`) já está integrado com o Twitter.

Quando você roda:

```bash
node scripts/automacao-postagem.js
```

O fluxo completo é:

1. ✅ Busca RSS do Cointelegraph
2. ✅ Gera artigos com IA (Cloudflare)
3. ✅ Busca imagens (Pexels)
4. ✅ Salva artigos
5. ✅ Traduz para outros idiomas
6. ✅ Faz deploy no GitHub
7. ✅ Posta no Telegram
8. ✅ **Posta no Twitter** (NOVO!)

## 📝 Estilos de Tweet

### Estilo Simples
```
400 mil Bitcoins saíram das corretoras desde o ano passado, aponta Santiment

#bitcoin #onchain #santiment

https://a-cifra.com.br/artigo/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment
```

### Estilo Engajador
```
₿ 400 mil Bitcoins saíram das corretoras desde o ano passado, aponta Santiment

#Bitcoin #Crypto

📖 Leia mais:
https://a-cifra.com.br/artigo/400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment
```

## ⚙️ Configuração Técnica

### Como Funciona

O sistema usa **Puppeteer** para:
1. Abrir o Chrome com seu perfil de usuário
2. Acessar `https://x.com/compose/tweet`
3. Preencher o campo de texto
4. Enviar o tweet (Ctrl+Enter)

### Sessão do Chrome

O script acessa o perfil padrão do Chrome em:
```
C:\Users\[SEU_USUARIO]\AppData\Local\Google\Chrome\User Data
```

**Por isso você precisa:**
- Estar logado no Twitter no Chrome
- Fechar o Chrome antes de executar

## 🔧 Solução de Problemas

### ❌ Erro: "Chrome está aberto"

**Solução:** Feche TODAS as janelas do Chrome e tente novamente.

```bash
# No PowerShell, você pode forçar o fechamento:
Stop-Process -Name chrome -Force
```

### ❌ Erro: "Não está logado no Twitter"

**Solução:**
1. Abra o Chrome normalmente
2. Acesse `https://x.com`
3. Faça login
4. Feche o Chrome
5. Execute o script novamente

### ❌ Erro: "Não encontrei a caixa de tweet"

**Possíveis causas:**
- O Twitter mudou o layout
- Conexão lenta (não carregou a tempo)

**Solução:**
- Verifique sua conexão
- Tente aumentar o timeout no código

### ❌ Tweet não foi postado

**Verificar:**
1. O tweet tem menos de 280 caracteres? (o script valida isso)
2. Você está logado na conta correta?
3. A conta tem restrições de postagem?

## 📊 Monitoramento

Após cada execução, você verá logs detalhados:

```
🐦 AUTOMAÇÃO TWITTER - A CIFRA
════════════════════════════════════════════════════════════
📄 Artigo: 400-mil-bitcoins-saram-das-corretoras-desde-o-ano-passado-aponta-santiment.md

🎨 Gerando tweet (estilo: engajador)...

📝 Tweet gerado:
────────────────────────────────────────────────────────────
₿ 400 mil Bitcoins saíram das corretoras desde o ano passado, aponta Santiment

#Bitcoin #Crypto

📖 Leia mais:
https://a-cifra.com.br/artigo/...
────────────────────────────────────────────────────────────
Caracteres: 216/280

⏳ Aguardando 3 segundos antes de postar...

🚀 Postando no Twitter (@acifra_btc)...

🐦 Iniciando Twitter Poster (Modo Sessão Chrome)...
   🖥️ Usando Chrome em: C:\Program Files\Google\Chrome\Application\chrome.exe
   📂 Perfil de Usuário: C:\Users\...\AppData\Local\Google\Chrome\User Data
   ⚠️  IMPORTANTE: O Chrome deve estar FECHADO para isso funcionar.
   🔗 Indo para x.com...
   ✍️ Escrevendo Tweet...
   🚀 Enviando...
   ✅ Tweet Enviado!

✅ Processo concluído!
```

## 🎯 Melhores Práticas

1. **Teste primeiro:** Sempre use `npm run twitter:test` antes de automatizar
2. **Monitore:** Acompanhe os primeiros posts manualmente
3. **Espaçamento:** Não poste muitos tweets seguidos (use o delay)
4. **Variação:** Alterne entre estilos simples e engajador
5. **Horários:** Configure a automação para horários de pico (9h-11h, 14h-16h, 19h-21h)

## 📅 Agendamento

Para agendar posts automáticos, você pode usar o **Agendador de Tarefas do Windows**:

1. Abra o "Agendador de Tarefas"
2. Crie uma nova tarefa
3. Configure o gatilho (ex: todos os dias às 10h)
4. Ação: Executar programa
   - Programa: `node`
   - Argumentos: `scripts/postar-twitter.js --latest`
   - Iniciar em: `D:\site-cifra\A-Cifra-main`

## 🔐 Segurança

- ✅ Não armazena senhas
- ✅ Usa sessão local do Chrome
- ✅ Não envia dados para terceiros
- ✅ Código open-source e auditável

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs detalhados
2. Confirme que o Chrome está fechado
3. Teste com `npm run twitter:test`
4. Verifique se está logado no Twitter

---

**Desenvolvido para A Cifra** 🚀
Automação de conteúdo com qualidade jornalística.
