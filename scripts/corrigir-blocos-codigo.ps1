# Script para corrigir blocos de código vazios ou mal formatados

Write-Host "=== Corrigindo blocos de código nos artigos ===" -ForegroundColor Green

$articles = Get-ChildItem "content/articles" -Filter "*.md" -File
$fixedCount = 0

foreach ($article in $articles) {
    $content = Get-Content $article.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $articleFixed = $false
    
    # Padrão 1: Blocos com apenas ``` (sem linguagem) que têm conteúdo
    # Substituir por ```text para melhor renderização
    $pattern1 = '(?m)^```\s*\n((?:(?!```)[\s\S])+?)\n```'
    if ($content -match $pattern1) {
        $content = $content -replace $pattern1, '```text$([Environment]::NewLine)$1$([Environment]::NewLine)```'
        $articleFixed = $true
    }
    
    # Padrão 2: Blocos completamente vazios
    $pattern2 = '(?m)^```\s*\n\s*\n```'
    if ($content -match $pattern2) {
        $content = $content -replace $pattern2, ''
        $articleFixed = $true
    }
    
    # Padrão 3: Blocos com apenas espaços em branco
    $pattern3 = '(?m)^```[a-z]*\s*\n\s+\n```'
    if ($content -match $pattern3) {
        $content = $content -replace $pattern3, ''
        $articleFixed = $true
    }
    
    if ($articleFixed -and $content -ne $originalContent) {
        Set-Content -Path $article.FullName -Value $content -Encoding UTF8 -NoNewline
        $fixedCount++
        Write-Host "  Corrigido: $($article.Name)" -ForegroundColor Cyan
    }
}

Write-Host "`nTotal de artigos corrigidos: $fixedCount" -ForegroundColor Green
