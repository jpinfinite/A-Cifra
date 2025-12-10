# ============================================
# Setup Master Cifra Agent
# Configura o agente especialista do A Cifra
# ============================================

Write-Host "🚀 Configurando Assistente Especialista A Cifra..." -ForegroundColor Cyan
Write-Host ""

# Criar diretório se não existir
$agentDir = ".kiro/agents"
if (-not (Test-Path $agentDir)) {
    New-Item -ItemType Directory -Path $agentDir -Force | Out-Null
    Write-Host "✅ Diretório $agentDir criado" -ForegroundColor Green
}

# Verificar se arquivo já existe
$configFile = "$agentDir/master-cifra.json"
if (Test-Path $configFile) {
    Write-Host "⚠️  Arquivo de configuração já existe" -ForegroundColor Yellow
    $overwrite = Read-Host "Deseja sobrescrever? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit
    }
}

# Criar configuração completa
$config = @{
    name = "Assistente Especialista A Cifra"
    version = "3.0"
    role = "supervisor"
    description = "Agente especialista responsável por criar, revisar e otimizar todo o conteúdo editorial do A Cifra"
    
    responsibilities = @{
        editorial = @(
            "Criar artigos completos (1500-3000 palavras)",
            "Revisar gramática e estilo",
            "Garantir tom educacional",
            "Verificar fatos e dados",
            "Manter consistência"
        )
        seo = @(
            "Otimizar títulos (50-60 chars)",
            "Meta descriptions (150-160 chars)",
            "Densidade keywords (1-2%)",
            "3-5 links internos",
            "Estrutura headings correta"
        )
        technical = @(
            "Validar frontmatter",
            "Verificar categorySlug",
            "Garantir markdown correto",
            "Testar build",
            "Otimizar performance"
        )
        monetization = @(
            "Incluir ExchangeAffiliateLinks",
            "Posicionar CTAs",
            "Garantir disclaimers"
        )
    }
    
    rules = @{
        strictSEO = $true
        autoFixIssues = $true
        enhanceCitations = $true
        requireFAQ = $true
        minWordCount = 1500
        maxWordCount = 5000
        internalLinksMin = 3
        internalLinksMax = 5
        affiliateLinksRequired = $true
        disclaimerRequired = $true
    }
    
    metrics = @{
        content = @{
            articlesPerMonth = @{ min = 15; max = 20 }
            wordsPerArticle = @{ min = 1500; max = 3000 }
        }
        technical = @{
            buildTime = @{ max = 180 }
            lighthouseScore = @{ min = 90 }
            buildErrors = @{ max = 0 }
        }
        seo = @{
            organicGrowth = "10%/mês"
            bounceRate = @{ max = 60 }
            timeOnPage = @{ min = 120 }
        }
    }
    
    lastUpdated = (Get-Date -Format "yyyy-MM-dd")
    maintainedBy = "Equipe A Cifra"
}

# Converter para JSON e salvar
$jsonConfig = $config | ConvertTo-Json -Depth 10
Set-Content -Path $configFile -Value $jsonConfig -Encoding UTF8

Write-Host ""
Write-Host "✅ Configuração criada com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Arquivo: $configFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Configurações aplicadas:" -ForegroundColor Yellow
Write-Host "   • SEO estrito: Ativado" -ForegroundColor White
Write-Host "   • Auto-correção: Ativada" -ForegroundColor White
Write-Host "   • FAQ obrigatório: Sim" -ForegroundColor White
Write-Host "   • Palavras mínimas: 1500" -ForegroundColor White
Write-Host "   • Links internos: 3-5" -ForegroundColor White
Write-Host "   • Links afiliados: Obrigatório" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Revisar configuração em $configFile" -ForegroundColor White
Write-Host "   2. Ajustar métricas conforme necessário" -ForegroundColor White
Write-Host "   3. Testar criação de artigo" -ForegroundColor White
Write-Host ""
Write-Host "✨ Agente Master Cifra configurado e pronto!" -ForegroundColor Green
