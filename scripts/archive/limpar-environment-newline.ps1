# Script para remover codigo PowerShell dos artigos

Write-Host "=== Limpando codigo PowerShell dos artigos ===" -ForegroundColor Green

$articles = Get-ChildItem "content/articles" -Filter "*.md" -File
$fixedCount = 0

foreach ($article in $articles) {
    $content = Get-Content $article.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Remover codigo PowerShell
    $content = $content -replace '\$\(\[Environment\]::NewLine\)', ''
    
    # Limpar blocos de codigo mal formatados
    $content = $content -replace '```text\s*\n', "```text`n"
    $content = $content -replace '\s*```\s*\n```', '```'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $article.FullName -Value $content -Encoding UTF8 -NoNewline
        $fixedCount++
        $name = $article.Name
        Write-Host "  Corrigido: $name" -ForegroundColor Cyan
    }
}

$total = $fixedCount
Write-Host "`nTotal de artigos corrigidos: $total" -ForegroundColor Green
