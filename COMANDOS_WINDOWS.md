# 💻 Comandos para Windows

## 🚀 Comandos Essenciais

### Iniciar Desenvolvimento
```powershell
# Limpar cache
Remove-Item -Recurse -Force .next

# Iniciar servidor
npm run dev
```

### Verificar Erros
```powershell
# Verificar TypeScript
npx tsc --noEmit

# Build de produção
npm run build

# Verificar se porta 3000 está em uso
netstat -ano | findstr :3000
```

### Buscar Arquivos com Problemas
```powershell
# Buscar links de categoria (PowerShell)
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "categoria" | Select-String -NotMatch "getCategoryUrl"

# Buscar interpolações de categoria
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String '\$\{.*category'

# Buscar imports que precisam ser adicionados
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "getCategoryUrl" -NotMatch | Select-String "categoria"
```

---

## 🔧 Comandos de Manutenção

### Limpar Tudo
```powershell
# Limpar cache e node_modules
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
npm install
```

### Verificar Dependências
```powershell
# Ver dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit
```

### Git
```powershell
# Ver status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "fix: corrigir erros do console"

# Push
git push
```

---

## 🐛 Debug e Troubleshooting

### Matar Processo na Porta 3000
```powershell
# Encontrar PID
netstat -ano | findstr :3000

# Matar processo (substitua <PID> pelo número encontrado)
taskkill /PID <PID> /F
```

### Verificar Logs
```powershell
# Ver últimas linhas do log
Get-Content -Path .next/trace -Tail 50

# Monitorar em tempo real
Get-Content -Path .next/trace -Wait
```

### Limpar Cache do Navegador
```
Chrome: Ctrl + Shift + Delete
Edge: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
```

---

## 📁 Navegação de Arquivos

### Abrir Arquivos no VS Code
```powershell
# Abrir arquivo específico
code src/app/layout.tsx

# Abrir pasta
code src/app/categorias

# Abrir projeto
code .
```

### Listar Arquivos
```powershell
# Listar arquivos TypeScript
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts

# Contar arquivos
(Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts).Count

# Ver tamanho dos arquivos
Get-ChildItem -Path src -Recurse | Measure-Object -Property Length -Sum
```

---

## 🔍 Busca e Substituição

### Buscar Texto em Arquivos
```powershell
# Buscar em todos os arquivos
Get-ChildItem -Path src -Recurse | Select-String "categoria"

# Buscar com contexto (linhas antes/depois)
Get-ChildItem -Path src -Recurse | Select-String "categoria" -Context 2,2

# Buscar case-sensitive
Get-ChildItem -Path src -Recurse | Select-String "Categoria" -CaseSensitive
```

### Substituir Texto (Cuidado!)
```powershell
# Backup antes de substituir
Copy-Item src src_backup -Recurse

# Substituir em arquivo específico
(Get-Content src/components/ArticleCard.tsx) -replace 'oldText', 'newText' | Set-Content src/components/ArticleCard.tsx

# Substituir em múltiplos arquivos
Get-ChildItem -Path src -Recurse -Include *.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace 'oldText', 'newText' | Set-Content $_.FullName
}
```

---

## 📊 Análise de Código

### Contar Linhas de Código
```powershell
# Total de linhas
(Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Get-Content).Count

# Por tipo de arquivo
Get-ChildItem -Path src -Recurse -Include *.tsx | ForEach-Object {
    $lines = (Get-Content $_.FullName).Count
    "$($_.Name): $lines linhas"
}
```

### Verificar Imports
```powershell
# Buscar imports de validation
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "from '@/utils/validation'"

# Buscar imports faltando
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "getCategoryUrl" | Select-String -NotMatch "import.*validation"
```

---

## 🧪 Testes

### Executar Testes (se configurado)
```powershell
# Todos os testes
npm test

# Testes específicos
npm test -- ArticleCard

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📦 Build e Deploy

### Build Local
```powershell
# Build de produção
npm run build

# Verificar tamanho do build
Get-ChildItem -Path .next -Recurse | Measure-Object -Property Length -Sum

# Testar build localmente
npm run start
```

### Preparar para Deploy
```powershell
# Limpar e buildar
Remove-Item -Recurse -Force .next
npm run build

# Verificar se build passou
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build OK!" -ForegroundColor Green
} else {
    Write-Host "❌ Build falhou!" -ForegroundColor Red
}
```

---

## 🎨 Formatação e Linting

### ESLint
```powershell
# Verificar erros
npm run lint

# Corrigir automaticamente
npm run lint -- --fix
```

### Prettier (se configurado)
```powershell
# Verificar formatação
npx prettier --check src

# Formatar arquivos
npx prettier --write src
```

---

## 📝 Criar Arquivos Rapidamente

### Criar Componente
```powershell
# Criar arquivo
New-Item -Path src/components/NovoComponente.tsx -ItemType File

# Com conteúdo básico
@"
export function NovoComponente() {
  return (
    <div>
      <h1>Novo Componente</h1>
    </div>
  )
}
"@ | Set-Content src/components/NovoComponente.tsx
```

### Criar Página
```powershell
# Criar diretório e arquivo
New-Item -Path src/app/nova-pagina -ItemType Directory
New-Item -Path src/app/nova-pagina/page.tsx -ItemType File
```

---

## 🔐 Variáveis de Ambiente

### Ver Variáveis
```powershell
# Ver todas
Get-ChildItem Env:

# Ver específica
$env:NODE_ENV

# Definir temporariamente
$env:NODE_ENV = "development"
```

### Arquivo .env
```powershell
# Criar .env
@"
NEXT_PUBLIC_SITE_URL=https://acifra.com
NODE_ENV=development
"@ | Set-Content .env.local

# Ver conteúdo
Get-Content .env.local
```

---

## 🚨 Comandos de Emergência

### Reverter Mudanças
```powershell
# Reverter arquivo específico
git checkout -- src/app/layout.tsx

# Reverter tudo
git reset --hard HEAD

# Voltar para commit anterior
git reset --hard HEAD~1
```

### Backup Rápido
```powershell
# Criar backup
$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
Copy-Item src "backup_$date" -Recurse

# Restaurar backup
Copy-Item backup_2024-01-15_10-30 src -Recurse -Force
```

---

## 💡 Aliases Úteis

### Criar Aliases (PowerShell Profile)
```powershell
# Editar profile
notepad $PROFILE

# Adicionar aliases
Set-Alias dev "npm run dev"
Set-Alias build "npm run build"
Set-Alias lint "npm run lint"

function Clean-Next {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Cache limpo!" -ForegroundColor Green
}

# Recarregar profile
. $PROFILE
```

---

## 📊 Monitoramento

### Ver Uso de Recursos
```powershell
# CPU e memória do Node
Get-Process node | Select-Object CPU, WorkingSet, ProcessName

# Espaço em disco
Get-PSDrive C | Select-Object Used, Free
```

### Logs em Tempo Real
```powershell
# Seguir logs do Next.js
npm run dev | Tee-Object -FilePath dev.log

# Ver logs
Get-Content dev.log -Wait
```

---

## 🎯 Checklist de Comandos Diários

```powershell
# 1. Atualizar código
git pull

# 2. Limpar cache
Remove-Item -Recurse -Force .next

# 3. Instalar dependências (se necessário)
npm install

# 4. Iniciar desenvolvimento
npm run dev

# 5. Verificar erros
# Abrir http://localhost:3000 e ver console

# 6. Antes de commit
npm run lint
npm run build
git status
```

---

## 🆘 Ajuda Rápida

### Comandos PowerShell Básicos
```powershell
Get-Help <comando>           # Ajuda sobre comando
Get-Command *npm*            # Buscar comandos
Get-History                  # Ver histórico
Clear-Host                   # Limpar tela (ou cls)
```

### Atalhos do Terminal
```
Ctrl + C     - Parar processo
Ctrl + L     - Limpar tela
Tab          - Autocompletar
↑ ↓          - Navegar histórico
Ctrl + R     - Buscar no histórico
```

---

**Dica**: Salve este arquivo e consulte sempre que precisar! 📌
