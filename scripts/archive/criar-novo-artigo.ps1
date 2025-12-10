# Script para criar novo artigo com estrutura padronizada
param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [Parameter(Mandatory=$true)]
    [string]$Category,
    
    [string]$Author = "Equipe A Cifra",
    
    [string[]]$Tags = @(),
    
    [ValidateSet("high", "medium", "low")]
    [string]$MonetizationPriority = "medium"
)

# Gerar slug a partir do título
$slug = $Title.ToLower() -replace '[^a-z0-9\s-]', '' -replace '\s+', '-'

# Gerar ID único
$date = Get-Date -Format "yyyy-MM-dd"
$id = "$slug-$date"

# Gerar nome do arquivo
$filename = "$slug.md"
$filepath = "content/articles/$filename"

# Verificar se arquivo já existe
if (Test-Path $filepath) {
    Write-Error "Artigo já existe: $filepath"
    exit 1
}

# Template do frontmatter
$frontmatter = @"
---
id: '$id'
title: '$Title'
slug: '$slug'
excerpt: 'Resumo em 160 caracteres com keywords principais do artigo'
coverImage:
  src: '/images/$Category/$(Get-Date -Format "yyyy-MM")/imagem.webp'
  alt: 'Descrição detalhada da imagem'
  width: 1200
  height: 630
author:
  name: '$Author'
  avatar: '/Jonatha-Pereira-SEO.png'
publishedAt: '$date'
updatedAt: '$date'
categorySlug: '$Category'
tags: [$($Tags | ForEach-Object { "'$_'" } | Join-String -Separator ', ')]
seo:
  metaTitle: '$Title | A Cifra'
  metaDescription: 'Descrição SEO otimizada de 120-160 caracteres'
  keywords: [$($Tags | ForEach-Object { "'$_'" } | Join-String -Separator ', ')]
monetization:
  priority: '$MonetizationPriority'
  affiliateLinks: ['bitget', 'binance', 'coinbase']
---

# $Title

Introdução do artigo com contexto e overview do que será abordado. Explique por que o tópico é importante e o que o leitor vai aprender.

## 📖 O Que é [Tópico Principal]?

Definição clara e explicação do conceito principal.

### Características Principais

- ✅ Característica 1
- ✅ Característica 2
- ✅ Característica 3

## 💡 Por Que é Importante?

Explique a relevância e benefícios.

## 🎯 Como Funciona?

Explicação detalhada do funcionamento.

### Passo a Passo

1. **Passo 1:** Descrição
2. **Passo 2:** Descrição
3. **Passo 3:** Descrição

## 📊 Comparação / Análise

Tabelas comparativas ou análises detalhadas.

## ⚠️ Riscos e Cuidados

Sempre incluir seção sobre riscos quando aplicável.

## 🚀 Comece a Investir em Criptomoedas

Para comprar as criptomoedas mencionadas neste artigo, use uma das exchanges recomendadas:

<ExchangeAffiliateLinks />

## 💡 Perguntas Frequentes

**Pergunta 1?**
Resposta detalhada.

**Pergunta 2?**
Resposta detalhada.

**Pergunta 3?**
Resposta detalhada.

## 🎯 Conclusão

Resumo dos pontos principais e call-to-action.

**Principais pontos:**
- ✅ Ponto 1
- ✅ Ponto 2
- ✅ Ponto 3

## 📚 Próximos Passos

- [Artigo Relacionado 1](/artigo/slug-1)
- [Artigo Relacionado 2](/artigo/slug-2)
- [Artigo Relacionado 3](/artigo/slug-3)

---

**Última atualização:** $date

*Disclaimer: Este artigo é apenas informativo e não constitui recomendação de investimento. Sempre faça sua própria pesquisa (DYOR).*
"@

# Criar o arquivo
Set-Content -Path $filepath -Value $frontmatter -Encoding UTF8

Write-Host "✅ Artigo criado com sucesso!" -ForegroundColor Green
Write-Host "📁 Arquivo: $filepath" -ForegroundColor Cyan
Write-Host "🔗 Slug: $slug" -ForegroundColor Cyan
Write-Host "🆔 ID: $id" -ForegroundColor Cyan

Write-Host "`n📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Edite o conteúdo do artigo"
Write-Host "2. Adicione a imagem de capa em /public/images/$Category/$(Get-Date -Format "yyyy-MM")/"
Write-Host "3. Execute: npm run lint"
Write-Host "4. Execute: npm run build"
Write-Host "5. Faça commit e push"
"@