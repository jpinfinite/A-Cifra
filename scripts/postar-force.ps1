Write-Host "🔴 Iniciando Postagem Forçada..." -ForegroundColor Red

# 1. Matar Chrome
Write-Host "   🔪 Matando processos do Chrome..."
Stop-Process -Name "chrome" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Remover Lockfiles teimosos
$userData = "$env:LOCALAPPDATA\Google\Chrome\User Data"
$locks = @("SingletonLock", "SingletonCookie", "Lockfile")

foreach ($lock in $locks) {
    $path = Join-Path $userData $lock
    if (Test-Path $path) {
        Write-Host "   🧹 Removendo $lock..."
        Remove-Item $path -Force -ErrorAction SilentlyContinue
    }
}

# 3. Executar Script Node
Write-Host "   🚀 Iniciando Automação..."
node scripts/twitter-poster.js $args[0]
