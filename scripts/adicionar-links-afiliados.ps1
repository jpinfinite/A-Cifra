# Script para adicionar ExchangeAffiliateLinks em todos os artigos

Write-Host "=== Adicionando links de afiliados nos artigos ===" -ForegroundColor Green

$articles = Get-ChildItem "content/articles" -Filter "*.md" -File | Where-Object { 
    $_.Name -ne "_template.md" -and $_.Name -ne "README.md" 
}

$addedCount = 0
$skippedCount = 0

foreach ($article in $articles) {
    $content = Get-Content $article.FullName -Raw -Encoding UTF8
    
    # Verificar se já tem o componente
    if ($content -match "ExchangeAffiliateLinks") {
        Write-Host "  Ja tem: $($article.Name)" -ForegroundColor Gray
        $skippedCount++
        continue
    }
    
    # Texto a adicionar
    $newLine = [Environment]::NewLine
    $affiliateSection = "$newLine$newLine## 🚀 Comece a Investir em Criptomoedas$newLine$newLine"
    $affiliateSection += "Para comprar as criptomoedas mencionadas neste artigo, use uma das exchanges recomendadas:$newLine$newLine"
    $affiliateSection += "<ExchangeAffiliateLinks />$newLine$newLine"
    $affiliateSection += "---$newLine"
    
    # Se o artigo termina com ---, substituir
    if ($content -match '---\s*$') {
        $content = $content -replace '---\s*$', $affiliateSection
    }
    # Caso contrário, adicionar no final
    else {
        $content = $content.TrimEnd() + $affiliateSection
    }
    
    # Salvar arquivo
    Set-Content -Path $article.FullName -Value $content -Encoding UTF8 -NoNewline
    $addedCount++
    Write-Host "  Adicionado: $($article.Name)" -ForegroundColor Cyan
}

Write-Host "`nLinks adicionados: $addedCount" -ForegroundColor Green
Write-Host "Artigos que ja tinham: $skippedCount" -ForegroundColor White
$total = $addedCount + $skippedCount
Write-Host "Total processado: $total" -ForegroundColor White
