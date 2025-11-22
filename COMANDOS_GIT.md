🚀 Comandos para Atualizar o GitHub

## 📋 Passo a Passo

### 1️⃣ Verificar Status
```bash
git status
```

### 2️⃣ Adicionar Todos os Arquivos
```bash
git add .
```

### 3️⃣ Fazer Commit
```bash
git commit -m "fix: corrigir erros do console e adicionar página de categorias

- Corrigir scripts do Google (AdSense e News) com lazyOnload
- Adicionar tratamento de erros nos scripts
- Criar página de categorias (/categorias)
- Adicionar utilitários de validação para categorias
- Adicionar ícones às categorias
- Corrigir tipagem TypeScript
- Melhorar error boundary
- Adicionar documentação completa"
```

### 4️⃣ Enviar para o GitHub
```bash
git push origin main
```

**OU** se sua branch principal for `master`:
```bash
git push origin master
```

---

## 🔍 Verificar Branch Atual

Se não souber qual é sua branch:
```bash
git branch
```

A branch com * é a atual.

---

## 📦 Arquivos que Serão Enviados

### Modificados
- ✏️ `src/app/layout.tsx` - Scripts corrigidos
- ✏️ `src/lib/config.ts` - Ícones e tipagem

### Criados
- 📄 `src/app/categorias/page.tsx` - Nova página
- 📄 `src/utils/validation.ts` - Validações
- 📄 `INICIO_AQUI.md` - Documentação
- 📄 `README_CORRECOES.md` - Resumo
- 📄 `GUIA_RAPIDO_IMPLEMENTACAO.md` - Guia
- 📄 `EXEMPLOS_PRATICOS.md` - Exemplos
- 📄 `CORRECOES_ERROS_CONSOLE.md` - Detalhes
- 📄 `RESUMO_CORRECOES_IMPLEMENTADAS.md` - Status
- 📄 `COMANDOS_WINDOWS.md` - Comandos
- 📄 `INDICE_CORRECOES.md` - Índice
- 📄 `CORRECAO_FINAL.md` - Correção TypeScript
- 📄 `scripts/find-category-links.sh` - Script

---

## ⚡ Comando Único (Tudo de Uma Vez)

```bash
git add . && git commit -m "fix: corrigir erros do console e adicionar página de categorias" && git push
```

---

## 🔧 Se Houver Conflitos

### Atualizar antes de enviar
```bash
git pull origin main
```

### Resolver conflitos (se houver)
1. Abra os arquivos com conflito
2. Resolva manualmente
3. Adicione os arquivos resolvidos:
```bash
git add .
git commit -m "fix: resolver conflitos"
git push
```

---

## 📊 Verificar Histórico

```bash
# Ver últimos commits
git log --oneline -5

# Ver mudanças
git diff
```

---

## 🆘 Comandos de Emergência

### Desfazer último commit (mantém mudanças)
```bash
git reset --soft HEAD~1
```

### Ver o que será commitado
```bash
git diff --cached
```

### Remover arquivo do staging
```bash
git reset HEAD arquivo.txt
```

---

## ✅ Checklist

Antes de fazer push:
- [ ] Testei localmente (`npm run dev`)
- [ ] Código compila sem erros (`npm run build`)
- [ ] Verifiquei o status (`git status`)
- [ ] Revisei as mudanças (`git diff`)
- [ ] Commit com mensagem descritiva
- [ ] Push para o GitHub

---

## 🎯 Mensagem de Commit Sugerida

```bash
git commit -m "fix: corrigir erros do console e melhorar estrutura

✅ Correções:
- Scripts do Google com lazyOnload e error handling
- Página de categorias criada
- Validações de categoria implementadas
- Ícones adicionados às categorias
- Tipagem TypeScript corrigida

📚 Documentação:
- Guias de implementação
- Exemplos práticos
- Comandos úteis

🎨 Melhorias:
- Error boundary aprimorado
- Performance otimizada
- SEO melhorado"
```

---

**Dica**: Copie e cole os comandos no terminal! 💻
