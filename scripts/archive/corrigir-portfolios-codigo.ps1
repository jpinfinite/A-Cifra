# Script para corrigir portfolios formatados como blocos de codigo
# Transforma blocos de codigo de portfolio em listas markdown normais

$artigos = Get-ChildItem "content/articles/*.md" -Recurse
$corrigidos = 0

foreach($arquivo in $artigos) {
    $conteudo = Get-Content $arquivo.FullName -Raw -Encoding UTF8
    $conteudoOriginal = $conteudo
    
    # Padrao para identificar blocos de codigo de portfolio
    # Procura por blocos que contem linhas no formato: "XX% - Nome (SIMBOLO)"
    $pattern = '```text\s*\r?\n((?:\d+%\s*-\s*[^\r\n]+\r?\n)+)```'
    
    if($conteudo -match $pattern) {
        Write-Host "Processando: $($arquivo.Name)" -ForegroundColor Yellow
        
        # Substituir cada bloco encontrado
        $conteudo = [regex]::Replace($conteudo, $pattern, {
            param($match)
            
            $linhas = $match.Groups[1].Value.Trim() -split '\r?\n'
            $resultado = ""
            
            foreach($linha in $linhas) {
                if($linha -match '^\s*(\d+%)\s*-\s*(.+)$') {
                    $percentual = $matches[1]
                    $resto = $matches[2]
                    # Transformar em lista markdown com percentual em negrito
                    $resultado += "- **$percentual** - $resto`r`n"
                }
            }
            
            return $resultado.TrimEnd()
        })
        
        # Verificar se houve mudanca
        if($conteudo -ne $conteudoOriginal) {
            Set-Content $arquivo.FullName -Value $conteudo -Encoding UTF8 -NoNewline
            $corrigidos++
            Write-Host "  Corrigido!" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Total de arquivos corrigidos: $corrigidos" -ForegroundColor Cyan
