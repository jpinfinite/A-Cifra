# Scripts Utilitários - A Cifra

Este diretório contém scripts PowerShell para automatizar tarefas comuns do projeto A Cifra.

## 📜 Scripts Disponíveis

### 🆕 criar-novo-artigo.ps1
Cria um novo artigo com estrutura padronizada.

```powershell
# Criar artigo básico
.\scripts\criar-novo-artigo.ps1 -Title "Bitcoin em 2026" -Category "bitcoin"

# Criar artigo completo
.\scripts\criar-novo-artigo.ps1 -Title "DeFi para Iniciantes" -Category "defi" -Author "João Silva" -Tags @("defi", "iniciantes", "tutorial") -MonetizationPriority "high"
```

**Parâmetros:**
- `-Title` (obrigatório): Título do artigo
- `-Category` (obrigatório): Categoria (bitcoin, altcoins, defi, etc.)
- `-Author`: Nome do autor (padrão: "Equipe A Cifra")
- `-Tags`: Array de tags
- `-MonetizationPriority`: high, medium ou low (padrão: medium)

### ✅ validar-artigo.ps1
Valida artigos verificando estrutura, SEO e conteúdo.

```powershell
# Validar artigo específico
.\scripts\validar-artigo.ps1 -ArticlePath "content/articles/bitcoin-2026.md"

# Validar todos os artigos
.\scripts\validar-artigo.ps1 -All
```

**Verificações:**
- Frontmatter completo
- Estrutura de headings
- Tamanho do conteúdo
- Links de afiliados
- Meta tags SEO
- Links internos

### 🖼️ otimizar-imagens.ps1
Otimiza imagens para web com múltiplos formatos e tamanhos.

```powershell
# Otimização básica
.\scripts\otimizar-imagens.ps1

# Otimização personalizada
.\scripts\otimizar-imagens.ps1 -Quality 90 -Formats @("webp", "avif") -Sizes @(400, 800, 1200) -Backup
```

**Parâmetros:**
- `-InputDir`: Diretório de entrada (padrão: public/images)
- `-OutputDir`: Diretório de saída (padrão: public/images/optimized)
- `-Quality`: Qualidade 1-100 (padrão: 85)
- `-Formats`: Formatos de saída (padrão: webp, avif)
- `-Sizes`: Tamanhos em pixels (padrão: 400, 800, 1200, 1920)
- `-Backup`: Criar backup antes de otimizar

**Requisitos:** ImageMagick instalado

### 🔧 corrigir-portfolios-codigo.ps1
Corrige portfólios formatados incorretamente como blocos de código.

```powershell
.\scripts\corrigir-portfolios-codigo.ps1
```

Transforma:
```text
40% - Ethereum (ETH)
25% - Solana (SOL)
```

Em:
- **40%** - Ethereum (ETH)
- **25%** - Solana (SOL)

### 🚀 deploy.ps1
Script de deploy com validações e testes.

```powershell
# Deploy para produção
.\scripts\deploy.ps1

# Deploy pulando testes
.\scripts\deploy.ps1 -SkipTests

# Deploy forçado (ignora validações)
.\scripts\deploy.ps1 -Force
```

**Parâmetros:**
- `-Environment`: development, staging ou production (padrão: production)
- `-SkipTests`: Pula validações e testes
- `-SkipBuild`: Pula o build
- `-Force`: Ignora validações de branch e mudanças

## 🛠️ Pré-requisitos

### PowerShell
Todos os scripts requerem PowerShell 5.1+ (Windows) ou PowerShell Core 6+ (multiplataforma).

### Ferramentas Externas

**ImageMagick** (para otimização de imagens):
- Windows: https://imagemagick.org/script/download.php#windows
- macOS: `brew install imagemagick`
- Linux: `sudo apt-get install imagemagick`

**Git** (para deploy):
- Configurado com acesso ao repositório
- Branch main para deploy de produção

### Node.js
- Node.js 18.20.8+
- npm com dependências instaladas

## 📋 Workflow Recomendado

### Criando Novo Artigo
1. Criar artigo: `.\scripts\criar-novo-artigo.ps1 -Title "Meu Artigo" -Category "bitcoin"`
2. Editar conteúdo no arquivo gerado
3. Adicionar imagem de capa
4. Validar: `.\scripts\validar-artigo.ps1 -ArticlePath "content/articles/meu-artigo.md"`
5. Fazer commit e push

### Deploy
1. Validar todos os artigos: `.\scripts\validar-artigo.ps1 -All`
2. Fazer build local: `npm run build`
3. Deploy: `.\scripts\deploy.ps1`

### Otimização de Imagens
1. Adicionar imagens em `public/images/categoria/YYYY-MM/`
2. Otimizar: `.\scripts\otimizar-imagens.ps1 -Backup`
3. Usar imagens otimizadas nos artigos

## 🚨 Troubleshooting

### Erro de Execução de Scripts
Se receber erro de política de execução:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ImageMagick não encontrado
Instale o ImageMagick e adicione ao PATH do sistema.

### Erro de Git
Verifique se está autenticado no GitHub e tem permissões no repositório.

### Validação falhando
Execute `npm run lint` para ver erros específicos de código.

## 📚 Exemplos Completos

### Criar artigo sobre Solana
```powershell
.\scripts\criar-novo-artigo.ps1 `
  -Title "Solana: Análise Completa 2026" `
  -Category "altcoins" `
  -Author "João Silva" `
  -Tags @("solana", "altcoins", "análise", "2026") `
  -MonetizationPriority "high"
```

### Validar e fazer deploy
```powershell
# Validar tudo
.\scripts\validar-artigo.ps1 -All

# Se passou, fazer deploy
if ($LASTEXITCODE -eq 0) {
    .\scripts\deploy.ps1
}
```

### Otimizar imagens com backup
```powershell
.\scripts\otimizar-imagens.ps1 `
  -Quality 90 `
  -Formats @("webp", "avif", "jpeg") `
  -Sizes @(400, 800, 1200, 1920) `
  -Backup
```

---

**Última atualização:** 23 de novembro de 2025  
**Mantido por:** Equipe A Cifra