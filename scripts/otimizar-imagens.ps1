# Script para otimizar imagens do site
param(
    [string]$InputDir = "public/images",
    [string]$OutputDir = "public/images/optimized",
    [int]$Quality = 85,
    [string[]]$Formats = @("webp", "avif"),
    [int[]]$Sizes = @(400, 800, 1200, 1920),
    [switch]$Backup
)

# Verificar se ImageMagick está instalado
try {
    $null = Get-Command "magick" -ErrorAction Stop
} catch {
    Write-Error "ImageMagick não encontrado. Instale em: https://imagemagick.org/script/download.php"
    exit 1
}

Write-Host "🖼️  Otimizando imagens..." -ForegroundColor Cyan
Write-Host "📁 Diretório de entrada: $InputDir"
Write-Host "📁 Diretório de saída: $OutputDir"
Write-Host "🎨 Qualidade: $Quality%"
Write-Host "📐 Formatos: $($Formats -join ', ')"
Write-Host "📏 Tamanhos: $($Sizes -join ', ')px"

# Criar diretório de saída
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Criar backup se solicitado
if ($Backup) {
    $backupDir = "$InputDir-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "💾 Criando backup em: $backupDir" -ForegroundColor Yellow
    Copy-Item -Path $InputDir -Destination $backupDir -Recurse
}

# Encontrar todas as imagens
$extensoes = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.tiff")
$imagens = Get-ChildItem -Path $InputDir -Include $extensoes -Recurse

Write-Host "📊 Encontradas $($imagens.Count) imagens para processar" -ForegroundColor Cyan

$processadas = 0
$erros = 0

foreach ($imagem in $imagens) {
    try {
        Write-Host "`n🔄 Processando: $($imagem.Name)" -ForegroundColor White
        
        # Obter informações da imagem
        $info = & magick identify -format "%wx%h" $imagem.FullName
        $originalSize = (Get-Item $imagem.FullName).Length
        
        Write-Host "  📐 Dimensões originais: $info"
        Write-Host "  📦 Tamanho original: $([math]::Round($originalSize / 1KB, 2)) KB"
        
        # Criar estrutura de diretórios no output
        $relativePath = $imagem.FullName.Replace($InputDir, "").TrimStart("\")
        $outputSubDir = Split-Path (Join-Path $OutputDir $relativePath) -Parent
        
        if (!(Test-Path $outputSubDir)) {
            New-Item -ItemType Directory -Path $outputSubDir -Force | Out-Null
        }
        
        # Processar cada formato
        foreach ($formato in $Formats) {
            # Processar cada tamanho
            foreach ($size in $Sizes) {
                $outputName = [System.IO.Path]::GetFileNameWithoutExtension($imagem.Name)
                $outputFile = Join-Path $outputSubDir "$outputName-$size.$formato"
                
                # Comando ImageMagick
                $cmd = @(
                    "magick",
                    $imagem.FullName,
                    "-resize", "${size}x${size}>",
                    "-quality", $Quality,
                    "-strip",
                    "-interlace", "Plane",
                    $outputFile
                )
                
                & $cmd[0] $cmd[1..($cmd.Length-1)]
                
                if ($LASTEXITCODE -eq 0) {
                    $newSize = (Get-Item $outputFile).Length
                    $reduction = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
                    Write-Host "    ✅ $formato ${size}px: $([math]::Round($newSize / 1KB, 2)) KB (-$reduction%)" -ForegroundColor Green
                } else {
                    Write-Host "    ❌ Erro ao processar $formato ${size}px" -ForegroundColor Red
                    $erros++
                }
            }
        }
        
        # Criar versão original otimizada
        $originalFormat = $imagem.Extension.TrimStart(".")
        $outputOriginal = Join-Path $outputSubDir "$($imagem.BaseName)-original.$originalFormat"
        
        & magick $imagem.FullName -quality $Quality -strip -interlace Plane $outputOriginal
        
        if ($LASTEXITCODE -eq 0) {
            $newSize = (Get-Item $outputOriginal).Length
            $reduction = [math]::Round((1 - ($newSize / $originalSize)) * 100, 1)
            Write-Host "    ✅ Original otimizado: $([math]::Round($newSize / 1KB, 2)) KB (-$reduction%)" -ForegroundColor Green
        }
        
        $processadas++
        
    } catch {
        Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        $erros++
    }
}

# Gerar HTML de exemplo para responsive images
$htmlExample = @"
<!-- Exemplo de uso das imagens otimizadas -->
<picture>
  <source 
    srcset="
      /images/optimized/exemplo-400.avif 400w,
      /images/optimized/exemplo-800.avif 800w,
      /images/optimized/exemplo-1200.avif 1200w,
      /images/optimized/exemplo-1920.avif 1920w
    " 
    type="image/avif"
  />
  <source 
    srcset="
      /images/optimized/exemplo-400.webp 400w,
      /images/optimized/exemplo-800.webp 800w,
      /images/optimized/exemplo-1200.webp 1200w,
      /images/optimized/exemplo-1920.webp 1920w
    " 
    type="image/webp"
  />
  <img 
    src="/images/optimized/exemplo-800-original.jpg"
    alt="Descrição da imagem"
    loading="lazy"
    decoding="async"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</picture>
"@

Set-Content -Path "$OutputDir/exemplo-responsive.html" -Value $htmlExample -Encoding UTF8

# Resumo final
Write-Host "`n📊 Resumo da Otimização:" -ForegroundColor Cyan
Write-Host "Imagens processadas: $processadas"
Write-Host "Erros: $erros" -ForegroundColor $(if ($erros -gt 0) { "Red" } else { "Green" })
Write-Host "Formatos gerados: $($Formats -join ', ')"
Write-Host "Tamanhos gerados: $($Sizes -join ', ')px"
Write-Host "📁 Resultado em: $OutputDir"
Write-Host "📄 Exemplo HTML: $OutputDir/exemplo-responsive.html"

if ($erros -eq 0) {
    Write-Host "`n✅ Otimização concluída com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Otimização concluída com $erros erro(s)" -ForegroundColor Yellow
}