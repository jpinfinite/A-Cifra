# reorganize-project.ps1
# Script principal para reorganização do projeto A-Cifra
# Utiliza o módulo ProjectReorganizer.psm1

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false,
    [string]$ConfigPath = "./scripts/config/scripts-config.json"
)

# Importar módulo ProjectReorganizer
$modulePath = Join-Path $PSScriptRoot "../modules/ProjectReorganizer.psm1"
Import-Module $modulePath -Force

# Função principal
function Main {
    try {
        Write-AuditLog -Message "=== INICIANDO REORGANIZAÇÃO DO PROJETO A-CIFRA ===" -Level "INFO"
        Write-AuditLog -Message "Modo Dry-Run: $DryRun" -Level "INFO"
        Write-AuditLog -Message "Modo Force: $Force" -Level "INFO"
        
        # Carregar configuração
        if (Test-Path $ConfigPath) {
            $config = Get-Content $ConfigPath | ConvertFrom-Json
            Write-AuditLog -Message "Configuração carregada de: $ConfigPath" -Level "INFO"
        } else {
            Write-AuditLog -Message "Arquivo de configuração não encontrado: $ConfigPath" -Level "WARN"
            Write-AuditLog -Message "Usando configurações padrão" -Level "INFO"
        }
        
        # Verificar se deve solicitar confirmação
        if (-not $Force -and -not $DryRun) {
            $confirmed = Confirm-Action -Message "Deseja continuar com a reorganização do projeto?"
            if (-not $confirmed) {
                Write-AuditLog -Message "Operação cancelada pelo usuário" -Level "INFO"
                return
            }
        }
        
        # Estatísticas da operação
        $stats = @{
            FilesProcessed = 0
            DirectoriesCreated = 0
            FilesMovedOrCopied = 0
            BackupsCreated = 0
            Errors = 0
            StartTime = Get-Date
        }
        
        # Criar backup do estado atual se não for dry-run
        if (-not $DryRun) {
            Write-AuditLog -Message "Criando backup do estado atual..." -Level "INFO"
            $backupPath = Create-Backup -SourcePath "./public" -BackupName "public-before-reorganization"
            $stats.BackupsCreated++
            Write-AuditLog -Message "Backup criado: $backupPath" -Level "INFO"
        } else {
            Write-AuditLog -Message "[DRY-RUN] Backup seria criado para ./public" -Level "INFO"
        }
        
        # Executar reorganização das imagens
        Reorganize-Images -DryRun:$DryRun -Statistics $stats
        
        # Executar reorganização dos scripts
        Reorganize-Scripts -DryRun:$DryRun -Statistics $stats
        
        # Calcular tempo total
        $stats.EndTime = Get-Date
        $stats.TotalDuration = $stats.EndTime - $stats.StartTime
        
        Write-AuditLog -Message "=== REORGANIZAÇÃO CONCLUÍDA ===" -Level "INFO"
        Write-AuditLog -Message "Arquivos processados: $($stats.FilesProcessed)" -Level "INFO"
        Write-AuditLog -Message "Diretórios criados: $($stats.DirectoriesCreated)" -Level "INFO"
        Write-AuditLog -Message "Arquivos movidos/copiados: $($stats.FilesMovedOrCopied)" -Level "INFO"
        Write-AuditLog -Message "Backups criados: $($stats.BackupsCreated)" -Level "INFO"
        Write-AuditLog -Message "Erros: $($stats.Errors)" -Level "INFO"
        Write-AuditLog -Message "Duração total: $($stats.TotalDuration.ToString('hh\:mm\:ss'))" -Level "INFO"
        
        # Gerar relatório final
        $reportPath = Generate-Report -OperationName "Reorganização do Projeto" -Statistics $stats
        Write-AuditLog -Message "Relatório gerado: $reportPath" -Level "INFO"
        
    }
    catch {
        Write-AuditLog -Message "Erro crítico durante a reorganização: $_" -Level "ERROR"
        throw
    }
}

# Função para reorganizar imagens
function Reorganize-Images {
    param(
        [switch]$DryRun,
        [hashtable]$Statistics
    )
    
    Write-AuditLog -Message "--- Iniciando reorganização de imagens ---" -Level "INFO"
    
    try {
        # Definir estrutura de diretórios de imagens
        $imageDirectories = @(
            "./public/images/articles",
            "./public/images/brand/v1",
            "./public/images/icons",
            "./public/images/logos"
        )
        
        # Criar diretórios se não existirem
        foreach ($dir in $imageDirectories) {
            if (-not (Test-Path $dir)) {
                if ($DryRun) {
                    Write-AuditLog -Message "[DRY-RUN] Criaria diretório: $dir" -Level "INFO"
                } else {
                    New-Item -ItemType Directory -Path $dir -Force | Out-Null
                    Write-AuditLog -Message "Diretório criado: $dir" -Level "INFO"
                    $Statistics.DirectoriesCreated++
                }
            }
        }
        
        # Verificar imagens existentes em ./public/images/
        $existingImages = Get-ChildItem -Path "./public/images/" -File -Recurse -Include "*.jpg", "*.jpeg", "*.png", "*.webp", "*.svg" -ErrorAction SilentlyContinue
        
        Write-AuditLog -Message "Encontradas $($existingImages.Count) imagens para processar" -Level "INFO"
        
        foreach ($image in $existingImages) {
            $Statistics.FilesProcessed++
            
            # Validar integridade do arquivo
            $integrity = Validate-FileIntegrity -FilePath $image.FullName
            if (-not $integrity.IsValid) {
                Write-AuditLog -Message "Arquivo corrompido detectado: $($image.FullName)" -Level "ERROR"
                $Statistics.Errors++
                continue
            }
            
            # Determinar categoria baseada no nome do arquivo
            $category = Determine-ImageCategory -FileName $image.Name
            $targetDir = "./public/images/$category"
            
            # Verificar se o arquivo já está no local correto
            $currentDir = Split-Path $image.FullName -Parent
            $currentDirNormalized = $currentDir.Replace('\', '/').TrimEnd('/')
            $targetDirNormalized = $targetDir.Replace('\', '/').TrimEnd('/')
            
            if ($currentDirNormalized -eq $targetDirNormalized) {
                Write-AuditLog -Message "Arquivo já está no local correto: $($image.Name)" -Level "DEBUG"
                continue
            }
            
            # Mover arquivo para categoria apropriada
            $targetPath = Join-Path $targetDir $image.Name
            
            if ($DryRun) {
                Write-AuditLog -Message "[DRY-RUN] Moveria: $($image.FullName) -> $targetPath" -Level "INFO"
            } else {
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    $Statistics.DirectoriesCreated++
                }
                
                Move-Item -Path $image.FullName -Destination $targetPath -Force
                Write-AuditLog -Message "Arquivo movido: $($image.Name) -> $category/" -Level "INFO"
                $Statistics.FilesMovedOrCopied++
            }
        }
        
        Write-AuditLog -Message "--- Reorganização de imagens concluída ---" -Level "INFO"
    }
    catch {
        Write-AuditLog -Message "Erro durante reorganização de imagens: $_" -Level "ERROR"
        $Statistics.Errors++
        throw
    }
}

# Função para determinar categoria da imagem baseada no nome
function Determine-ImageCategory {
    param([string]$FileName)
    
    $fileName = $FileName.ToLower()
    
    # Regras de categorização
    if ($fileName -match "logo|brand|marca") {
        return "brand/v1"
    }
    elseif ($fileName -match "icon|icone|favicon") {
        return "icons"
    }
    elseif ($fileName -match "article|artigo|post|blog") {
        return "articles"
    }
    else {
        # Padrão para artigos se não conseguir determinar
        return "articles"
    }
}

# Função para reorganizar scripts
function Reorganize-Scripts {
    param(
        [switch]$DryRun,
        [hashtable]$Statistics
    )
    
    Write-AuditLog -Message "--- Iniciando reorganização de scripts ---" -Level "INFO"
    
    try {
        # Scripts PowerShell na raiz que devem ser movidos
        $rootScripts = Get-ChildItem -Path "./" -File -Include "*.ps1" -ErrorAction SilentlyContinue
        
        foreach ($script in $rootScripts) {
            $targetPath = Join-Path "./scripts/legacy" $script.Name
            
            if ($DryRun) {
                Write-AuditLog -Message "[DRY-RUN] Moveria script: $($script.Name) -> scripts/legacy/" -Level "INFO"
            } else {
                if (-not (Test-Path "./scripts/legacy")) {
                    New-Item -ItemType Directory -Path "./scripts/legacy" -Force | Out-Null
                    $Statistics.DirectoriesCreated++
                }
                
                Move-Item -Path $script.FullName -Destination $targetPath -Force
                Write-AuditLog -Message "Script movido: $($script.Name) -> scripts/legacy/" -Level "INFO"
                $Statistics.FilesMovedOrCopied++
            }
            
            $Statistics.FilesProcessed++
        }
        
        Write-AuditLog -Message "--- Reorganização de scripts concluída ---" -Level "INFO"
    }
    catch {
        Write-AuditLog -Message "Erro durante reorganização de scripts: $_" -Level "ERROR"
        $Statistics.Errors++
        throw
    }
}

# Executar função principal
Main