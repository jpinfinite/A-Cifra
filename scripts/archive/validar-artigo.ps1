# Script para validar artigos usando as funções TypeScript
param(
    [string]$ArticlePath = "",
    [switch]$All
)

if ($All) {
    Write-Host "🔍 Validando todos os artigos..." -ForegroundColor Yellow
    $artigos = Get-ChildItem "content/articles/*.md" -Recurse
} elseif ($ArticlePath) {
    if (!(Test-Path $ArticlePath)) {
        Write-Error "Arquivo não encontrado: $ArticlePath"
        exit 1
    }
    $artigos = @(Get-Item $ArticlePath)
} else {
    Write-Error "Especifique um arquivo com -ArticlePath ou use -All para validar todos"
    exit 1
}

$totalArtigos = $artigos.Count
$artigosComErros = 0
$artigosComWarnings = 0

Write-Host "📊 Validando $totalArtigos artigo(s)..." -ForegroundColor Cyan

foreach ($artigo in $artigos) {
    Write-Host "`n📄 Validando: $($artigo.Name)" -ForegroundColor White
    
    $conteudo = Get-Content $artigo.FullName -Raw -Encoding UTF8
    
    # Separar frontmatter do conteúdo
    if ($conteudo -match '^---\r?\n(.*?)\r?\n---\r?\n(.*)$') {
        $frontmatterYaml = $matches[1]
        $conteudoMarkdown = $matches[2]
    } else {
        Write-Host "  ❌ Formato inválido: frontmatter não encontrado" -ForegroundColor Red
        $artigosComErros++
        continue
    }
    
    # Validações básicas
    $erros = @()
    $warnings = @()
    
    # Validar frontmatter
    if (!($frontmatterYaml -match "id:\s*'([^']+)'")) {
        $erros += "ID não encontrado"
    }
    
    if (!($frontmatterYaml -match "title:\s*'([^']+)'")) {
        $erros += "Título não encontrado"
    }
    
    if (!($frontmatterYaml -match "slug:\s*'([^']+)'")) {
        $erros += "Slug não encontrado"
    }
    
    if (!($frontmatterYaml -match "excerpt:\s*'([^']+)'")) {
        $erros += "Excerpt não encontrado"
    } else {
        $excerpt = $matches[1]
        if ($excerpt.Length > 160) {
            $warnings += "Excerpt muito longo ($($excerpt.Length) caracteres, máximo 160)"
        }
    }
    
    if (!($frontmatterYaml -match "categorySlug:\s*'([^']+)'")) {
        $erros += "Categoria não encontrada"
    }
    
    # Validar conteúdo
    if ($conteudoMarkdown.Length -lt 800) {
        $warnings += "Conteúdo muito curto ($($conteudoMarkdown.Length) caracteres, mínimo 800)"
    }
    
    # Verificar H1
    $h1Count = ($conteudoMarkdown | Select-String "^# " -AllMatches).Matches.Count
    if ($h1Count -eq 0) {
        $erros += "Nenhum H1 encontrado"
    } elseif ($h1Count -gt 1) {
        $warnings += "Múltiplos H1s encontrados ($h1Count)"
    }
    
    # Verificar H2s
    $h2Count = ($conteudoMarkdown | Select-String "^## " -AllMatches).Matches.Count
    if ($h2Count -lt 2) {
        $warnings += "Poucos H2s ($h2Count, recomendado: 2+)"
    }
    
    # Verificar links de afiliados
    if (!($conteudoMarkdown -match "ExchangeAffiliateLinks")) {
        $warnings += "Links de afiliados não encontrados"
    }
    
    # Verificar links internos
    $linksInternos = ($conteudoMarkdown | Select-String "\[.*\]\(/artigo/" -AllMatches).Matches.Count
    if ($linksInternos -lt 3) {
        $warnings += "Poucos links internos ($linksInternos, recomendado: 3-5)"
    }
    
    # Verificar SEO
    if (!($frontmatterYaml -match "metaTitle:")) {
        $warnings += "Meta title não encontrado"
    }
    
    if (!($frontmatterYaml -match "metaDescription:")) {
        $warnings += "Meta description não encontrada"
    }
    
    # Mostrar resultados
    if ($erros.Count -eq 0 -and $warnings.Count -eq 0) {
        Write-Host "  ✅ Artigo válido!" -ForegroundColor Green
    } else {
        if ($erros.Count -gt 0) {
            $artigosComErros++
            Write-Host "  ❌ Erros encontrados:" -ForegroundColor Red
            foreach ($erro in $erros) {
                Write-Host "    • $erro" -ForegroundColor Red
            }
        }
        
        if ($warnings.Count -gt 0) {
            if ($erros.Count -eq 0) { $artigosComWarnings++ }
            Write-Host "  ⚠️  Avisos:" -ForegroundColor Yellow
            foreach ($warning in $warnings) {
                Write-Host "    • $warning" -ForegroundColor Yellow
            }
        }
    }
}

# Resumo final
Write-Host "`n📊 Resumo da Validação:" -ForegroundColor Cyan
Write-Host "Total de artigos: $totalArtigos"
Write-Host "Artigos com erros: $artigosComErros" -ForegroundColor $(if ($artigosComErros -gt 0) { "Red" } else { "Green" })
Write-Host "Artigos com avisos: $artigosComWarnings" -ForegroundColor $(if ($artigosComWarnings -gt 0) { "Yellow" } else { "Green" })
Write-Host "Artigos válidos: $($totalArtigos - $artigosComErros)" -ForegroundColor Green

if ($artigosComErros -gt 0) {
    exit 1
} else {
    exit 0
}