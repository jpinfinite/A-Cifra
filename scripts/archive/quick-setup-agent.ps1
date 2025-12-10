# Quick Setup - Master Cifra Agent
# Uso: .\scripts\quick-setup-agent.ps1

$config = @"
{
  "name": "Assistente Especialista A Cifra",
  "version": "3.0",
  "role": "supervisor",
  "description": "Agente especialista do A Cifra - Criação, revisão e otimização de conteúdo",
  "rules": {
    "strictSEO": true,
    "autoFixIssues": true,
    "enhanceCitations": true,
    "requireFAQ": true,
    "minWordCount": 1500,
    "maxWordCount": 5000,
    "internalLinksMin": 3,
    "internalLinksMax": 5,
    "affiliateLinksRequired": true,
    "disclaimerRequired": true
  },
  "seoTargets": {
    "titleLength": { "min": 50, "max": 60 },
    "descriptionLength": { "min": 150, "max": 160 },
    "keywordDensity": { "min": 1, "max": 2 }
  },
  "metrics": {
    "lighthouseScore": { "min": 90 },
    "buildErrors": { "max": 0 },
    "buildWarnings": { "max": 5 }
  },
  "lastUpdated": "$(Get-Date -Format 'yyyy-MM-dd')",
  "maintainedBy": "Equipe A Cifra"
}
"@

# Criar diretório
New-Item -ItemType Directory -Path ".kiro/agents" -Force | Out-Null

# Salvar configuração
Set-Content -Path ".kiro/agents/master-cifra.json" -Value $config -Encoding UTF8

Write-Host "✅ Master Cifra Agent configurado!" -ForegroundColor Green
Write-Host "📍 Arquivo: .kiro/agents/master-cifra.json" -ForegroundColor Cyan
