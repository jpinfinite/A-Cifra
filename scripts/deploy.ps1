# Script de deploy para A Cifra
param(
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "production",
    
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$Force
)

Write-Host "🚀 Iniciando deploy para $Environment..." -ForegroundColor Cyan

# Verificar se estamos na branch correta
$currentBranch = git branch --show-current
if ($Environment -eq "production" -and $currentBranch -ne "main") {
    if (!$Force) {
        Write-Error "Deploy para produção deve ser feito da branch 'main'. Use -Force para ignorar."
        exit 1
    } else {
        Write-Host "⚠️  Fazendo deploy da branch '$currentBranch' para produção (forçado)" -ForegroundColor Yellow
    }
}

# Verificar se há mudanças não commitadas
$status = git status --porcelain
if ($status -and !$Force) {
    Write-Error "Há mudanças não commitadas. Faça commit ou use -Force para ignorar."
    exit 1
}

# Executar testes se não foi pulado
if (!$SkipTests) {
    Write-Host "🧪 Executando testes..." -ForegroundColor Yellow
    
    # Lint
    Write-Host "  📝 ESLint..." -ForegroundColor Gray
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ESLint falhou"
        exit 1
    }
    
    # Validar artigos
    Write-Host "  📄 Validando artigos..." -ForegroundColor Gray
    .\scripts\validar-artigo.ps1 -All
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Validação de artigos falhou"
        exit 1
    }
    
    Write-Host "  ✅ Todos os testes passaram!" -ForegroundColor Green
}

# Build se não foi pulado
if (!$SkipBuild) {
    Write-Host "🔨 Fazendo build..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build falhou"
        exit 1
    }
    Write-Host "  ✅ Build concluído!" -ForegroundColor Green
}

# Push para GitHub (Cloudflare Pages faz deploy automático)
Write-Host "📤 Fazendo push para GitHub..." -ForegroundColor Yellow
git push origin $currentBranch
if ($LASTEXITCODE -ne 0) {
    Write-Error "Push falhou"
    exit 1
}

Write-Host "✅ Deploy iniciado com sucesso!" -ForegroundColor Green
Write-Host "🌐 O Cloudflare Pages fará o deploy automaticamente" -ForegroundColor Cyan
Write-Host "📊 Acompanhe em: https://dash.cloudflare.com/" -ForegroundColor Cyan

# Informações do deploy
Write-Host "`n📋 Informações do Deploy:" -ForegroundColor White
Write-Host "Environment: $Environment"
Write-Host "Branch: $currentBranch"
Write-Host "Commit: $(git rev-parse --short HEAD)"
Write-Host "Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

if ($Environment -eq "production") {
    Write-Host "`n🎉 Site será atualizado em: https://a-cifra.com.br" -ForegroundColor Green
}