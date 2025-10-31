# ProjectReorganizer.Tests.ps1
# Testes unitários para o módulo ProjectReorganizer usando Pester

# Configuração inicial dos testes
$ModulePath = Join-Path $PSScriptRoot "../modules/ProjectReorganizer.psm1"
Import-Module $ModulePath -Force

# Criar diretório temporário para testes
$script:TestDir = Join-Path $env:TEMP "ProjectReorganizer-Tests-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $script:TestDir -Force | Out-Null

# Configurar caminhos de teste
$script:TestLogPath = Join-Path $script:TestDir "test-operations.log"
$script:TestBackupPath = Join-Path $script:TestDir "backups"

# Criar arquivos de teste
$script:TestFile1 = Join-Path $script:TestDir "test-file-1.txt"
$script:TestFile2 = Join-Path $script:TestDir "test-file-2.jpg"
$script:TestDir1 = Join-Path $script:TestDir "test-subdir"

Set-Content -Path $script:TestFile1 -Value "Conteúdo de teste 1"
Set-Content -Path $script:TestFile2 -Value "Conteúdo de teste 2"
New-Item -ItemType Directory -Path $script:TestDir1 -Force | Out-Null
Set-Content -Path (Join-Path $script:TestDir1 "nested-file.txt") -Value "Arquivo aninhado"

Describe "Write-AuditLog" {
    
    It "Deve criar arquivo de log se não existir" {
        Write-AuditLog -Message "Teste de criação de log" -Level "INFO"
        
        Test-Path $script:TestLogPath | Should -Be $true
    }
    
    It "Deve escrever mensagem com timestamp no log" {
        $testMessage = "Mensagem de teste $(Get-Date -Format 'HHmmss')"
        
        Write-AuditLog -Message $testMessage -Level "INFO"
        
        $logContent = Get-Content -Path $script:TestLogPath -Raw
        $logContent | Should -Match $testMessage
        $logContent | Should -Match "\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]"
        $logContent | Should -Match "\[INFO\]"
    }
    
    It "Deve suportar diferentes níveis de log" {
        $levels = @("INFO", "WARN", "ERROR", "DEBUG")
        
        foreach ($level in $levels) {
            Write-AuditLog -Message "Teste $level" -Level $level
        }
        
        $logContent = Get-Content -Path $script:TestLogPath -Raw
        foreach ($level in $levels) {
            $logContent | Should -Match "\[$level\]"
        }
    }
    
    It "Deve usar INFO como nível padrão" {
        Write-AuditLog -Message "Teste sem nível especificado"
        
        $logContent = Get-Content -Path $script:TestLogPath -Raw
        $logContent | Should -Match "\[INFO\]"
    }
}

Describe "Confirm-Action" {
    It "Deve retornar true para resposta 'S'" {
        # Mock da função Read-Host para simular entrada do usuário
        Mock Read-Host { return "S" }
        
        $result = Confirm-Action -Message "Teste de confirmação"
        
        $result | Should -Be $true
    }
    
    It "Deve retornar false para resposta 'N'" {
        Mock Read-Host { return "N" }
        
        $result = Confirm-Action -Message "Teste de negação"
        
        $result | Should -Be $false
    }
    
    It "Deve aceitar variações de resposta positiva" {
        $positiveResponses = @("s", "S", "sim", "SIM", "yes", "YES")
        
        foreach ($response in $positiveResponses) {
            Mock Read-Host { return $response }
            $result = Confirm-Action -Message "Teste"
            $result | Should -Be $true
        }
    }
    
    It "Deve usar padrão correto com DefaultYes" {
        Mock Read-Host { return "" }  # Resposta vazia
        
        $result = Confirm-Action -Message "Teste" -DefaultYes
        
        $result | Should -Be $true
    }
}

Describe "Create-Backup" {
    BeforeEach {
        # Limpar diretório de backup antes de cada teste
        if (Test-Path $script:TestBackupPath) {
            Remove-Item -Path $script:TestBackupPath -Recurse -Force
        }
    }
    
    It "Deve criar backup de arquivo único" {
        $backupPath = Create-Backup -SourcePath $script:TestFile1 -BackupName "test-single-file"
        
        Test-Path $backupPath | Should -Be $true
        $backupPath | Should -Match "test-single-file-backup-\d{8}-\d{6}\.zip"
    }
    
    It "Deve criar backup de diretório" {
        $backupPath = Create-Backup -SourcePath $script:TestDir1 -BackupName "test-directory"
        
        Test-Path $backupPath | Should -Be $true
        $backupPath | Should -Match "test-directory-backup-\d{8}-\d{6}\.zip"
    }
    
    It "Deve falhar para caminho inexistente" {
        $nonExistentPath = Join-Path $script:TestDir "nao-existe.txt"
        
        { Create-Backup -SourcePath $nonExistentPath } | Should -Throw "*não encontrado*"
    }
    
    It "Deve gerar nome automático se não especificado" {
        $backupPath = Create-Backup -SourcePath $script:TestFile1
        
        Test-Path $backupPath | Should -Be $true
        $backupPath | Should -Match "test-file-1\.txt-backup-\d{8}-\d{6}\.zip"
    }
}

Describe "Validate-FileIntegrity" {
    It "Deve calcular checksum para arquivo existente" {
        $result = Validate-FileIntegrity -FilePath $script:TestFile1
        
        $result.FilePath | Should -Be $script:TestFile1
        $result.Checksum | Should -Not -BeNullOrEmpty
        $result.Checksum.Length | Should -Be 64  # SHA-256 tem 64 caracteres
        $result.IsValid | Should -Be $true
    }
    
    It "Deve validar checksum esperado corretamente" {
        # Primeiro, obter o checksum real
        $firstResult = Validate-FileIntegrity -FilePath $script:TestFile1
        $expectedChecksum = $firstResult.Checksum
        
        # Depois, validar com o checksum esperado
        $result = Validate-FileIntegrity -FilePath $script:TestFile1 -ExpectedChecksum $expectedChecksum
        
        $result.IsValid | Should -Be $true
        $result.Expected | Should -Be $expectedChecksum.ToUpper()
    }
    
    It "Deve detectar checksum incorreto" {
        $wrongChecksum = "0123456789ABCDEF" * 4  # Checksum falso de 64 caracteres
        
        $result = Validate-FileIntegrity -FilePath $script:TestFile1 -ExpectedChecksum $wrongChecksum
        
        $result.IsValid | Should -Be $false
    }
    
    It "Deve retornar null para arquivo inexistente" {
        $nonExistentFile = Join-Path $script:TestDir "nao-existe.txt"
        
        $result = Validate-FileIntegrity -FilePath $nonExistentFile
        
        $result | Should -Be $null
    }
}

Describe "Generate-Report" {
    BeforeEach {
        # Limpar relatórios anteriores
        Get-ChildItem -Path $script:TestDir -Filter "relatorio-*.md" | Remove-Item -Force -ErrorAction SilentlyContinue
    }
    
    It "Deve gerar relatório básico" {
        $reportPath = Generate-Report -OperationName "Teste Básico"
        
        Test-Path $reportPath | Should -Be $true
        $reportPath | Should -Match "relatorio-\d{8}-\d{6}\.md"
        
        $content = Get-Content -Path $reportPath -Raw
        $content | Should -Match "# Relatório de Operação: Teste Básico"
        $content | Should -Match "Data/Hora:"
    }
    
    It "Deve incluir estatísticas no relatório" {
        $stats = @{
            FilesProcessed = 10
            Errors = 2
            Duration = "00:05:30"
        }
        
        $reportPath = Generate-Report -OperationName "Teste com Estatísticas" -Statistics $stats
        
        $content = Get-Content -Path $reportPath -Raw
        $content | Should -Match "FilesProcessed.*10"
        $content | Should -Match "Errors.*2"
        $content | Should -Match "Duration.*00:05:30"
    }
    
    It "Deve criar relatório mesmo sem estatísticas" {
        $reportPath = Generate-Report -OperationName "Teste Sem Stats"
        
        $content = Get-Content -Path $reportPath -Raw
        $content | Should -Match "Nenhuma estatística específica coletada"
    }
}

Describe "Get-ImageCategory" {
    It "Deve categorizar logos corretamente" {
        $logoFiles = @("logo-acifra.png", "brand-image.jpg", "marca-empresa.svg", "logotipo.png")
        
        foreach ($file in $logoFiles) {
            $category = Get-ImageCategory -FileName $file
            $category | Should -Be "brand"
        }
    }
    
    It "Deve categorizar ícones corretamente" {
        $iconFiles = @("icon-bitcoin.svg", "icone-menu.png", "favicon.ico")
        
        foreach ($file in $iconFiles) {
            $category = Get-ImageCategory -FileName $file
            $category | Should -Be "icons"
        }
    }
    
    It "Deve categorizar artigos corretamente" {
        $articleFiles = @("article-bitcoin.jpg", "artigo-defi.png", "post-crypto.webp", "blog-image.jpg")
        
        foreach ($file in $articleFiles) {
            $category = Get-ImageCategory -FileName $file
            $category | Should -Be "articles"
        }
    }
    
    It "Deve categorizar imagens crypto como artigos" {
        $cryptoFiles = @("bitcoin-price.jpg", "ethereum-analysis.png", "blockchain-tech.svg", "defi-protocol.webp")
        
        foreach ($file in $cryptoFiles) {
            $category = Get-ImageCategory -FileName $file
            $category | Should -Be "articles"
        }
    }
    
    It "Deve usar 'articles' como categoria padrão" {
        $unknownFiles = @("random-image.jpg", "unknown-file.png", "misc-photo.webp")
        
        foreach ($file in $unknownFiles) {
            $category = Get-ImageCategory -FileName $file
            $category | Should -Be "articles"
        }
    }
}

Describe "Move-UsedImages" {
    BeforeEach {
        # Criar estrutura de teste para imagens
        $script:TestImagesDir = Join-Path $script:TestDir "test-images"
        New-Item -ItemType Directory -Path $script:TestImagesDir -Force | Out-Null
        
        # Criar imagens de teste
        Set-Content -Path (Join-Path $script:TestImagesDir "logo-test.png") -Value "Logo content"
        Set-Content -Path (Join-Path $script:TestImagesDir "icon-menu.svg") -Value "Icon content"
        Set-Content -Path (Join-Path $script:TestImagesDir "article-bitcoin.jpg") -Value "Article content"
        Set-Content -Path (Join-Path $script:TestImagesDir "random-image.webp") -Value "Random content"
    }
    
    AfterEach {
        # Limpar estrutura de teste
        if (Test-Path $script:TestImagesDir) {
            Remove-Item -Path $script:TestImagesDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    It "Deve executar em modo dry-run sem mover arquivos" {
        $stats = Move-UsedImages -DryRun:$true -SourcePath $script:TestImagesDir -BackupBeforeMove:$false
        
        $stats.FilesProcessed | Should -BeGreaterThan 0
        $stats.FilesMovedOrCopied | Should -Be 0
        
        # Verificar que arquivos ainda estão no local original
        Test-Path (Join-Path $script:TestImagesDir "logo-test.png") | Should -Be $true
        Test-Path (Join-Path $script:TestImagesDir "icon-menu.svg") | Should -Be $true
    }
    
    It "Deve falhar para diretório inexistente" {
        $nonExistentDir = Join-Path $script:TestDir "nao-existe"
        
        { Move-UsedImages -SourcePath $nonExistentDir -BackupBeforeMove:$false } | Should -Throw "*não encontrado*"
    }
    
    It "Deve processar diferentes tipos de arquivo de imagem" {
        $imageExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif")
        
        foreach ($ext in $imageExtensions) {
            $testFile = Join-Path $script:TestImagesDir "test-image$ext"
            Set-Content -Path $testFile -Value "Test content"
        }
        
        $stats = Move-UsedImages -DryRun:$true -SourcePath $script:TestImagesDir -BackupBeforeMove:$false
        
        $stats.FilesProcessed | Should -BeGreaterOrEqual $imageExtensions.Count
    }
}

Describe "Invoke-Rollback" {
    BeforeEach {
        # Criar backup de teste
        $script:TestBackupFile = Create-Backup -SourcePath $script:TestDir1 -BackupName "test-rollback"
    }
    
    It "Deve executar rollback em modo dry-run" {
        Mock Confirm-Action { return $true }
        
        { Invoke-Rollback -BackupPath $script:TestBackupFile -DryRun:$true } | Should -Not -Throw
    }
    
    It "Deve falhar para backup inexistente" {
        $nonExistentBackup = Join-Path $script:TestBackupPath "nao-existe.zip"
        
        { Invoke-Rollback -BackupPath $nonExistentBackup -DryRun:$true } | Should -Throw "*não encontrado*"
    }
    
    It "Deve cancelar se usuário não confirmar" {
        Mock Confirm-Action { return $false }
        
        { Invoke-Rollback -BackupPath $script:TestBackupFile -DryRun:$true } | Should -Not -Throw
    }
}

# Testes de integração básicos
Describe "Integração - Fluxo Completo" {
    It "Deve executar fluxo completo de backup e validação" {
        # 1. Criar backup
        $backupPath = Create-Backup -SourcePath $script:TestFile1 -BackupName "integration-test"
        Test-Path $backupPath | Should -Be $true
        
        # 2. Validar integridade do arquivo original
        $integrity = Validate-FileIntegrity -FilePath $script:TestFile1
        $integrity.IsValid | Should -Be $true
        
        # 3. Gerar relatório
        $stats = @{
            BackupsCreated = 1
            FilesValidated = 1
            Errors = 0
        }
        $reportPath = Generate-Report -OperationName "Teste de Integração" -Statistics $stats
        Test-Path $reportPath | Should -Be $true
        
        # 4. Verificar conteúdo do relatório
        $reportContent = Get-Content -Path $reportPath -Raw
        $reportContent | Should -Match "BackupsCreated.*1"
        $reportContent | Should -Match "FilesValidated.*1"
        $reportContent | Should -Match "Errors.*0"
    }
}