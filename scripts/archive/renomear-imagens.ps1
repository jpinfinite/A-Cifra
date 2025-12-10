# Script para renomear imagens e atualizar referências nos artigos

Write-Host "=== Iniciando renomeação de imagens ===" -ForegroundColor Green

# 1. Criar mapeamento de nomes antigos para novos
$images = Get-ChildItem "public/images" -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp|gif)$' } | Sort-Object Name
$counter = 1
$mapping = @{}

Write-Host "`nCriando mapeamento de $($images.Count) imagens..." -ForegroundColor Yellow

foreach ($img in $images) {
    $newName = "{0:D3}{1}" -f $counter, $img.Extension
    $mapping[$img.Name] = $newName
    $counter++
}

# 2. Salvar mapeamento em arquivo para referência
$mappingLines = @()
$mappingLines += "# Mapeamento de Imagens - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$mappingLines += ""
$mappingLines += "| Nome Original | Nome Novo |"
$mappingLines += "|---------------|-----------|"

foreach ($entry in $mapping.GetEnumerator() | Sort-Object Value) {
    $mappingLines += "| $($entry.Key) | $($entry.Value) |"
}

$mappingLines | Out-File "MAPEAMENTO_IMAGENS.md" -Encoding UTF8
Write-Host "Mapeamento salvo em MAPEAMENTO_IMAGENS.md" -ForegroundColor Green

# 3. Atualizar referências nos artigos ANTES de renomear
Write-Host "`nAtualizando referências nos artigos..." -ForegroundColor Yellow

$articles = Get-ChildItem "content/articles" -Filter "*.md" -File
$updatedCount = 0

foreach ($article in $articles) {
    $content = Get-Content $article.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $changed = $false
    
    foreach ($entry in $mapping.GetEnumerator()) {
        $oldName = $entry.Key
        $newName = $entry.Value
        $oldPath = "/images/$oldName"
        $newPath = "/images/$newName"
        
        if ($content -like "*$oldPath*") {
            $content = $content.Replace($oldPath, $newPath)
            $changed = $true
        }
    }
    
    if ($changed) {
        $content | Out-File $article.FullName -Encoding UTF8 -NoNewline
        $updatedCount++
        Write-Host "  Atualizado: $($article.Name)" -ForegroundColor Cyan
    }
}

Write-Host "`n$updatedCount artigos atualizados" -ForegroundColor Green

# 4. Renomear arquivos de imagem
Write-Host "`nRenomeando arquivos de imagem..." -ForegroundColor Yellow

# Primeiro, renomear para nomes temporários para evitar conflitos
$tempMapping = @{}
foreach ($img in $images) {
    $guid = [guid]::NewGuid().ToString()
    $tempName = "temp_$guid$($img.Extension)"
    Rename-Item -Path $img.FullName -NewName $tempName
    $tempMapping[$tempName] = $mapping[$img.Name]
}

# Depois, renomear para os nomes finais
$renamedCount = 0
$tempFiles = Get-ChildItem "public/images" -File | Where-Object { $_.Name -like "temp_*" }

foreach ($tempFile in $tempFiles) {
    $finalName = $tempMapping[$tempFile.Name]
    Rename-Item -Path $tempFile.FullName -NewName $finalName
    $renamedCount++
    
    if ($renamedCount % 50 -eq 0) {
        Write-Host "  Processadas: $renamedCount/$($images.Count)" -ForegroundColor Gray
    }
}

Write-Host "`n$renamedCount imagens renomeadas" -ForegroundColor Green

# 5. Resumo final
Write-Host "`n=== Renomeação Concluída ===" -ForegroundColor Green
Write-Host "Total de imagens renomeadas: $renamedCount" -ForegroundColor White
Write-Host "Total de artigos atualizados: $updatedCount" -ForegroundColor White
Write-Host "Mapeamento salvo em: MAPEAMENTO_IMAGENS.md" -ForegroundColor White
