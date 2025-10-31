# ProjectReorganizer.psm1
# Módulo PowerShell para reorganização e manutenção do projeto A-Cifra
# Versão: 1.0.0
# Autor: A-Cifra Team

# Configuração global do módulo
$script:LogPath = "./logs/operations.log"
$script:BackupPath = "./logs/backups"

<#
.SYNOPSIS
    Escreve uma entrada no log de auditoria com timestamp
.DESCRIPTION
    Registra todas as operações realizadas pelos scripts com timestamp detalhado
.PARAMETER Message
    Mensagem a ser registrada no log
.PARAMETER Level
    Nível do log (INFO, WARN, ERROR, DEBUG)
.EXAMPLE
    Write-AuditLog -Message "Iniciando reorganização do projeto" -Level "INFO"
#>
function Write-AuditLog {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [ValidateSet("INFO", "WARN", "ERROR", "DEBUG")]
        [string]$Level = "INFO"
    )
    
    try {
        # Garantir que o diretório de logs existe
        $logDir = Split-Path $script:LogPath -Parent
        if (-not (Test-Path $logDir)) {
            New-Item -ItemType Directory -Path $logDir -Force | Out-Null
        }
        
        # Formatar timestamp
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # Formatar entrada do log
        $logEntry = "[$timestamp] [$Level] $Message"
        
        # Escrever no arquivo de log
        Add-Content -Path $script:LogPath -Value $logEntry -Encoding UTF8
        
        # Também exibir no console com cores
        switch ($Level) {
            "INFO"  { Write-Host $logEntry -ForegroundColor Green }
            "WARN"  { Write-Host $logEntry -ForegroundColor Yellow }
            "ERROR" { Write-Host $logEntry -ForegroundColor Red }
            "DEBUG" { Write-Host $logEntry -ForegroundColor Cyan }
        }
    }
    catch {
        Write-Error "Erro ao escrever no log de auditoria: $_"
    }
}

<#
.SYNOPSIS
    Solicita confirmação do usuário para ações críticas
.DESCRIPTION
    Exibe uma mensagem de confirmação e aguarda resposta do usuário (S/N)
.PARAMETER Message
    Mensagem de confirmação a ser exibida
.PARAMETER DefaultYes
    Se verdadeiro, assume "Sim" como padrão se o usuário apenas pressionar Enter
.EXAMPLE
    $confirmed = Confirm-Action -Message "Deseja continuar com a reorganização?"
#>
function Confirm-Action {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [switch]$DefaultYes
    )
    
    Write-AuditLog -Message "Solicitando confirmação: $Message" -Level "DEBUG"
    
    do {
        if ($DefaultYes) {
            $prompt = "$Message (S/n): "
        } else {
            $prompt = "$Message (s/N): "
        }
        
        $response = Read-Host $prompt
        
        # Se resposta vazia, usar padrão
        if ([string]::IsNullOrWhiteSpace($response)) {
            $response = if ($DefaultYes) { "S" } else { "N" }
        }
        
        $response = $response.ToUpper()
        
    } while ($response -notin @("S", "N", "SIM", "NAO", "NÃO", "YES", "NO"))
    
    $confirmed = $response -in @("S", "SIM", "YES")
    
    Write-AuditLog -Message "Confirmação recebida: $confirmed" -Level "DEBUG"
    
    return $confirmed
}

<#
.SYNOPSIS
    Cria backup de arquivos ou diretórios antes de operações destrutivas
.DESCRIPTION
    Cria backup comprimido com timestamp para permitir rollback de operações
.PARAMETER SourcePath
    Caminho do arquivo ou diretório a ser copiado
.PARAMETER BackupName
    Nome personalizado para o backup (opcional)
.EXAMPLE
    $backupPath = Create-Backup -SourcePath "./public/images" -BackupName "images-reorganization"
#>
function Create-Backup {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$SourcePath,
        
        [Parameter(Mandatory=$false)]
        [string]$BackupName
    )
    
    try {
        Write-AuditLog -Message "Iniciando backup de: $SourcePath" -Level "INFO"
        
        # Garantir que o diretório de backup existe
        if (-not (Test-Path $script:BackupPath)) {
            New-Item -ItemType Directory -Path $script:BackupPath -Force | Out-Null
        }
        
        # Verificar se o caminho de origem existe
        if (-not (Test-Path $SourcePath)) {
            Write-AuditLog -Message "Caminho de origem não encontrado: $SourcePath" -Level "ERROR"
            throw "Caminho de origem não encontrado: $SourcePath"
        }
        
        # Gerar nome do backup
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        if ([string]::IsNullOrWhiteSpace($BackupName)) {
            $BackupName = Split-Path $SourcePath -Leaf
        }
        $backupFileName = "${BackupName}-backup-${timestamp}.zip"
        $backupFullPath = Join-Path $script:BackupPath $backupFileName
        
        # Criar backup comprimido
        if (Test-Path $SourcePath -PathType Container) {
            # É um diretório
            Compress-Archive -Path "$SourcePath\*" -DestinationPath $backupFullPath -Force
        } else {
            # É um arquivo
            Compress-Archive -Path $SourcePath -DestinationPath $backupFullPath -Force
        }
        
        Write-AuditLog -Message "Backup criado com sucesso: $backupFullPath" -Level "INFO"
        
        return $backupFullPath
    }
    catch {
        Write-AuditLog -Message "Erro ao criar backup: $_" -Level "ERROR"
        throw
    }
}

<#
.SYNOPSIS
    Valida a integridade de arquivos usando checksums
.DESCRIPTION
    Calcula e verifica checksums SHA-256 para garantir integridade dos arquivos
.PARAMETER FilePath
    Caminho do arquivo a ser validado
.PARAMETER ExpectedChecksum
    Checksum esperado para comparação (opcional)
.EXAMPLE
    $checksum = Validate-FileIntegrity -FilePath "./public/logo.png"
#>
function Validate-FileIntegrity {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$FilePath,
        
        [Parameter(Mandatory=$false)]
        [string]$ExpectedChecksum
    )
    
    try {
        Write-AuditLog -Message "Validando integridade do arquivo: $FilePath" -Level "DEBUG"
        
        if (-not (Test-Path $FilePath)) {
            Write-AuditLog -Message "Arquivo não encontrado: $FilePath" -Level "ERROR"
            return $null
        }
        
        # Calcular checksum SHA-256
        $hash = Get-FileHash -Path $FilePath -Algorithm SHA256
        $checksum = $hash.Hash
        
        Write-AuditLog -Message "Checksum calculado para $FilePath : $checksum" -Level "DEBUG"
        
        # Se checksum esperado foi fornecido, comparar
        if (-not [string]::IsNullOrWhiteSpace($ExpectedChecksum)) {
            $isValid = $checksum -eq $ExpectedChecksum.ToUpper()
            Write-AuditLog -Message "Validação de integridade: $isValid" -Level "INFO"
            
            return @{
                FilePath = $FilePath
                Checksum = $checksum
                Expected = $ExpectedChecksum.ToUpper()
                IsValid = $isValid
            }
        }
        
        return @{
            FilePath = $FilePath
            Checksum = $checksum
            IsValid = $true
        }
    }
    catch {
        Write-AuditLog -Message "Erro ao validar integridade do arquivo: $_" -Level "ERROR"
        throw
    }
}

<#
.SYNOPSIS
    Gera relatório detalhado em Markdown das operações realizadas
.DESCRIPTION
    Cria relatório com estatísticas e resumo das ações executadas
.PARAMETER OperationName
    Nome da operação para o relatório
.PARAMETER Statistics
    Hashtable com estatísticas da operação
.EXAMPLE
    Generate-Report -OperationName "Reorganização de Imagens" -Statistics @{FilesProcessed=50; Errors=0}
#>
function Generate-Report {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$OperationName,
        
        [Parameter(Mandatory=$false)]
        [hashtable]$Statistics = @{}
    )
    
    try {
        Write-AuditLog -Message "Gerando relatório para: $OperationName" -Level "INFO"
        
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $reportFileName = "relatorio-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
        $reportPath = Join-Path "./logs" $reportFileName
        
        # Garantir que o diretório existe
        $logDir = Split-Path $reportPath -Parent
        if (-not (Test-Path $logDir)) {
            New-Item -ItemType Directory -Path $logDir -Force | Out-Null
        }
        
        # Construir conteúdo do relatório
        $reportContent = @"
# Relatório de Operação: $OperationName

**Data/Hora:** $timestamp  
**Operação:** $OperationName  

## Resumo Executivo

Esta operação foi executada como parte da modernização da infraestrutura do projeto A-Cifra.

## Estatísticas

"@
        
        # Adicionar estatísticas se fornecidas
        if ($Statistics.Count -gt 0) {
            foreach ($key in $Statistics.Keys) {
                $value = $Statistics[$key]
                $reportContent += "- **$key** $value`n"
            }
        } else {
            $reportContent += "- Nenhuma estatística específica coletada`n"
        }
        
        $reportContent += @"

## Logs da Operação

Para logs detalhados, consulte: ``$script:LogPath``

## Backups Criados

Backups estão disponíveis em: ``$script:BackupPath``

---
*Relatório gerado automaticamente pelo sistema de scripts A-Cifra*
"@
        
        # Escrever relatório
        Set-Content -Path $reportPath -Value $reportContent -Encoding UTF8
        
        Write-AuditLog -Message "Relatório gerado: $reportPath" -Level "INFO"
        
        return $reportPath
    }
    catch {
        Write-AuditLog -Message "Erro ao gerar relatório: $_" -Level "ERROR"
        throw
    }
}

<#
.SYNOPSIS
    Move imagens utilizadas para diretórios organizados com suporte a dry-run
.DESCRIPTION
    Reorganiza imagens do projeto em estrutura categorizada com validação e backup
.PARAMETER DryRun
    Se verdadeiro, apenas simula as operações sem executá-las
.PARAMETER SourcePath
    Caminho de origem das imagens (padrão: ./public/images)
.PARAMETER BackupBeforeMove
    Se verdadeiro, cria backup antes de mover arquivos
.EXAMPLE
    Move-UsedImages -DryRun:$true
    Move-UsedImages -SourcePath "./assets" -BackupBeforeMove:$true
#>
function Move-UsedImages {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false)]
        [switch]$DryRun = $false,
        
        [Parameter(Mandatory=$false)]
        [string]$SourcePath = "./public/images",
        
        [Parameter(Mandatory=$false)]
        [switch]$BackupBeforeMove = $true
    )
    
    try {
        Write-AuditLog -Message "=== INICIANDO MOVIMENTAÇÃO DE IMAGENS ===" -Level "INFO"
        Write-AuditLog -Message "Modo Dry-Run: $DryRun" -Level "INFO"
        Write-AuditLog -Message "Caminho de origem: $SourcePath" -Level "INFO"
        Write-AuditLog -Message "Backup antes de mover: $BackupBeforeMove" -Level "INFO"
        
        # Verificar se o caminho de origem existe
        if (-not (Test-Path $SourcePath)) {
            Write-AuditLog -Message "Caminho de origem não encontrado: $SourcePath" -Level "ERROR"
            throw "Caminho de origem não encontrado: $SourcePath"
        }
        
        # Criar backup se solicitado e não for dry-run
        if ($BackupBeforeMove -and -not $DryRun) {
            Write-AuditLog -Message "Criando backup antes da movimentação..." -Level "INFO"
            $backupPath = Create-Backup -SourcePath $SourcePath -BackupName "images-before-reorganization"
            Write-AuditLog -Message "Backup criado: $backupPath" -Level "INFO"
        } elseif ($BackupBeforeMove -and $DryRun) {
            Write-AuditLog -Message "[DRY-RUN] Backup seria criado para: $SourcePath" -Level "INFO"
        }
        
        # Definir estrutura de diretórios alvo
        $targetDirectories = @{
            "articles" = "$SourcePath/articles"
            "brand" = "$SourcePath/brand/v1"
            "icons" = "$SourcePath/icons"
            "logos" = "$SourcePath/logos"
        }
        
        # Criar diretórios alvo se necessário
        foreach ($category in $targetDirectories.Keys) {
            $targetDir = $targetDirectories[$category]
            if (-not (Test-Path $targetDir)) {
                if ($DryRun) {
                    Write-AuditLog -Message "[DRY-RUN] Criaria diretório: $targetDir" -Level "INFO"
                } else {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    Write-AuditLog -Message "Diretório criado: $targetDir" -Level "INFO"
                }
            }
        }
        
        # Encontrar todas as imagens
        $imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.webp", "*.svg", "*.gif")
        $images = Get-ChildItem -Path $SourcePath -File -Include $imageExtensions -Recurse -ErrorAction SilentlyContinue
        
        Write-AuditLog -Message "Encontradas $($images.Count) imagens para processar" -Level "INFO"
        
        $stats = @{
            FilesProcessed = 0
            FilesMovedOrCopied = 0
            DirectoriesCreated = 0
            Errors = 0
            Skipped = 0
        }
        
        foreach ($image in $images) {
            $stats.FilesProcessed++
            
            try {
                # Validar integridade do arquivo
                $integrity = Validate-FileIntegrity -FilePath $image.FullName
                if (-not $integrity.IsValid) {
                    Write-AuditLog -Message "Arquivo corrompido detectado: $($image.FullName)" -Level "ERROR"
                    $stats.Errors++
                    continue
                }
                
                # Determinar categoria baseada no nome do arquivo
                $category = Get-ImageCategory -FileName $image.Name
                $targetDir = $targetDirectories[$category]
                
                # Verificar se o arquivo já está no local correto
                $currentDir = Split-Path $image.FullName -Parent
                $currentDirNormalized = $currentDir.Replace('\', '/').TrimEnd('/')
                $targetDirNormalized = $targetDir.Replace('\', '/').TrimEnd('/')
                
                if ($currentDirNormalized -eq $targetDirNormalized) {
                    Write-AuditLog -Message "Arquivo já está no local correto: $($image.Name)" -Level "DEBUG"
                    $stats.Skipped++
                    continue
                }
                
                # Preparar caminho de destino
                $targetPath = Join-Path $targetDir $image.Name
                
                # Verificar se já existe arquivo com mesmo nome no destino
                if (Test-Path $targetPath) {
                    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
                    $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($image.Name)
                    $extension = [System.IO.Path]::GetExtension($image.Name)
                    $newName = "${nameWithoutExt}-${timestamp}${extension}"
                    $targetPath = Join-Path $targetDir $newName
                    Write-AuditLog -Message "Arquivo duplicado detectado, renomeando para: $newName" -Level "WARN"
                }
                
                # Executar movimentação
                if ($DryRun) {
                    Write-AuditLog -Message "[DRY-RUN] Moveria: $($image.FullName) -> $targetPath" -Level "INFO"
                } else {
                    Move-Item -Path $image.FullName -Destination $targetPath -Force
                    Write-AuditLog -Message "Arquivo movido: $($image.Name) -> $category/" -Level "INFO"
                    $stats.FilesMovedOrCopied++
                }
            }
            catch {
                Write-AuditLog -Message "Erro ao processar arquivo $($image.FullName): $_" -Level "ERROR"
                $stats.Errors++
            }
        }
        
        # Relatório final
        Write-AuditLog -Message "=== MOVIMENTAÇÃO DE IMAGENS CONCLUÍDA ===" -Level "INFO"
        Write-AuditLog -Message "Arquivos processados: $($stats.FilesProcessed)" -Level "INFO"
        Write-AuditLog -Message "Arquivos movidos/copiados: $($stats.FilesMovedOrCopied)" -Level "INFO"
        Write-AuditLog -Message "Arquivos ignorados (já no local correto): $($stats.Skipped)" -Level "INFO"
        Write-AuditLog -Message "Erros: $($stats.Errors)" -Level "INFO"
        
        return $stats
    }
    catch {
        Write-AuditLog -Message "Erro crítico durante movimentação de imagens: $_" -Level "ERROR"
        throw
    }
}

<#
.SYNOPSIS
    Determina a categoria de uma imagem baseada no nome do arquivo
.DESCRIPTION
    Analisa o nome do arquivo para categorizar em articles, brand, icons ou logos
.PARAMETER FileName
    Nome do arquivo de imagem
.EXAMPLE
    $category = Get-ImageCategory -FileName "logo-acifra.png"
#>
function Get-ImageCategory {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$FileName
    )
    
    $fileName = $FileName.ToLower()
    
    # Regras de categorização baseadas no nome
    if ($fileName -match "logo|brand|marca|logotipo") {
        return "brand"
    }
    elseif ($fileName -match "icon|icone|favicon|ico") {
        return "icons"
    }
    elseif ($fileName -match "article|artigo|post|blog|content|conteudo") {
        return "articles"
    }
    elseif ($fileName -match "bitcoin|ethereum|crypto|blockchain|defi|nft") {
        return "articles"  # Imagens relacionadas a criptomoedas vão para artigos
    }
    else {
        # Padrão: artigos
        return "articles"
    }
}

<#
.SYNOPSIS
    Executa rollback de operações usando backups criados
.DESCRIPTION
    Restaura estado anterior usando arquivos de backup comprimidos
.PARAMETER BackupPath
    Caminho do arquivo de backup a ser restaurado
.PARAMETER TargetPath
    Caminho onde restaurar os arquivos (padrão: local original)
.PARAMETER DryRun
    Se verdadeiro, apenas simula a operação de rollback
.EXAMPLE
    Invoke-Rollback -BackupPath "./logs/backups/images-backup-20231028.zip"
#>
function Invoke-Rollback {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$BackupPath,
        
        [Parameter(Mandatory=$false)]
        [string]$TargetPath,
        
        [Parameter(Mandatory=$false)]
        [switch]$DryRun = $false
    )
    
    try {
        Write-AuditLog -Message "=== INICIANDO ROLLBACK ===" -Level "INFO"
        Write-AuditLog -Message "Backup: $BackupPath" -Level "INFO"
        Write-AuditLog -Message "Modo Dry-Run: $DryRun" -Level "INFO"
        
        # Verificar se o backup existe
        if (-not (Test-Path $BackupPath)) {
            Write-AuditLog -Message "Arquivo de backup não encontrado: $BackupPath" -Level "ERROR"
            throw "Arquivo de backup não encontrado: $BackupPath"
        }
        
        # Determinar caminho de destino se não especificado
        if ([string]::IsNullOrWhiteSpace($TargetPath)) {
            $TargetPath = "./"
        }
        
        # Solicitar confirmação
        $confirmed = Confirm-Action -Message "Confirma o rollback? Esta operação pode sobrescrever arquivos atuais."
        if (-not $confirmed) {
            Write-AuditLog -Message "Rollback cancelado pelo usuário" -Level "INFO"
            return
        }
        
        # Criar backup do estado atual antes do rollback
        if (-not $DryRun) {
            Write-AuditLog -Message "Criando backup do estado atual antes do rollback..." -Level "INFO"
            $preRollbackBackup = Create-Backup -SourcePath $TargetPath -BackupName "pre-rollback-backup"
            Write-AuditLog -Message "Backup pré-rollback criado: $preRollbackBackup" -Level "INFO"
        }
        
        # Executar rollback
        if ($DryRun) {
            Write-AuditLog -Message "[DRY-RUN] Restauraria backup $BackupPath para $TargetPath" -Level "INFO"
        } else {
            Expand-Archive -Path $BackupPath -DestinationPath $TargetPath -Force
            Write-AuditLog -Message "Rollback executado com sucesso" -Level "INFO"
        }
        
        Write-AuditLog -Message "=== ROLLBACK CONCLUÍDO ===" -Level "INFO"
    }
    catch {
        Write-AuditLog -Message "Erro durante rollback: $_" -Level "ERROR"
        throw
    }
}

# Exportar todas as funções do módulo
Export-ModuleMember -Function Write-AuditLog, Confirm-Action, Create-Backup, Validate-FileIntegrity, Generate-Report, Move-UsedImages, Get-ImageCategory, Invoke-Rollback