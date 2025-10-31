# ProjectReorganizer.Simple.Tests.ps1
# Testes unitários simplificados para compatibilidade com Pester 3.x

# Configuração inicial
$ModulePath = Join-Path $PSScriptRoot "../modules/ProjectReorganizer.psm1"
Import-Module $ModulePath -Force

$TestDir = Join-Path $env:TEMP "ProjectReorganizer-Tests-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $TestDir -Force | Out-Null

$TestFile1 = Join-Path $TestDir "test-file-1.txt"
Set-Content -Path $TestFile1 -Value "Conteúdo de teste 1"

Describe "Testes do Módulo ProjectReorganizer" {
    
    Context "Write-AuditLog" {
        It "Deve criar arquivo de log" {
            $testMessage = "Teste de log $(Get-Date -Format 'HHmmss')"
            
            Write-AuditLog -Message $testMessage -Level "INFO"
            
            Test-Path "./logs/operations.log" | Should Be $true
        }
        
        It "Deve escrever mensagem no log" {
            $testMessage = "Mensagem única $(Get-Random)"
            
            Write-AuditLog -Message $testMessage -Level "INFO"
            
            $logContent = Get-Content -Path "./logs/operations.log" -Raw
            $logContent | Should Match $testMessage
        }
    }
    
    Context "Validate-FileIntegrity" {
        It "Deve calcular checksum para arquivo existente" {
            $result = Validate-FileIntegrity -FilePath $TestFile1
            
            $result.FilePath | Should Be $TestFile1
            $result.Checksum | Should Not BeNullOrEmpty
            $result.Checksum.Length | Should Be 64
            $result.IsValid | Should Be $true
        }
        
        It "Deve retornar null para arquivo inexistente" {
            $nonExistentFile = Join-Path $TestDir "nao-existe.txt"
            
            $result = Validate-FileIntegrity -FilePath $nonExistentFile
            
            $result | Should Be $null
        }
    }
    
    Context "Create-Backup" {
        It "Deve criar backup de arquivo" {
            $backupPath = Create-Backup -SourcePath $TestFile1 -BackupName "test-backup"
            
            Test-Path $backupPath | Should Be $true
            $backupPath | Should Match "test-backup-backup-\d{8}-\d{6}\.zip"
        }
        
        It "Deve falhar para arquivo inexistente" {
            $nonExistentFile = Join-Path $TestDir "nao-existe.txt"
            
            { Create-Backup -SourcePath $nonExistentFile } | Should Throw
        }
    }
    
    Context "Get-ImageCategory" {
        It "Deve categorizar logos como brand" {
            $category = Get-ImageCategory -FileName "logo-acifra.png"
            $category | Should Be "brand"
        }
        
        It "Deve categorizar ícones como icons" {
            $category = Get-ImageCategory -FileName "icon-bitcoin.svg"
            $category | Should Be "icons"
        }
        
        It "Deve categorizar imagens crypto como articles" {
            $category = Get-ImageCategory -FileName "bitcoin-analysis.jpg"
            $category | Should Be "articles"
        }
        
        It "Deve usar articles como padrão" {
            $category = Get-ImageCategory -FileName "random-image.jpg"
            $category | Should Be "articles"
        }
    }
    
    Context "Generate-Report" {
        It "Deve gerar relatório básico" {
            $reportPath = Generate-Report -OperationName "Teste Simples"
            
            Test-Path $reportPath | Should Be $true
            $reportPath | Should Match "relatorio-\d{8}-\d{6}\.md"
        }
        
        It "Deve incluir estatísticas no relatório" {
            $stats = @{
                FilesProcessed = 5
                Errors = 0
            }
            
            $reportPath = Generate-Report -OperationName "Teste com Stats" -Statistics $stats
            
            $content = Get-Content -Path $reportPath -Raw
            $content | Should Match "FilesProcessed.*5"
            $content | Should Match "Errors.*0"
        }
    }
    
    Context "Move-UsedImages - Dry Run" {
        It "Deve executar dry-run sem erros" {
            # Criar diretório de teste com imagens
            $testImagesDir = Join-Path $TestDir "test-images"
            New-Item -ItemType Directory -Path $testImagesDir -Force | Out-Null
            Set-Content -Path (Join-Path $testImagesDir "test-logo.png") -Value "Logo test"
            Set-Content -Path (Join-Path $testImagesDir "test-icon.svg") -Value "Icon test"
            
            $stats = Move-UsedImages -DryRun:$true -SourcePath $testImagesDir -BackupBeforeMove:$false
            
            $stats.FilesProcessed | Should BeGreaterThan 0
            $stats.FilesMovedOrCopied | Should Be 0
            $stats.Errors | Should Be 0
        }
    }
}

# Limpeza
Remove-Item -Path $TestDir -Recurse -Force -ErrorAction SilentlyContinue