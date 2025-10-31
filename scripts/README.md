# Sistema de Scripts A-Cifra

Este diretório contém o sistema modular de scripts para automação e manutenção do projeto A-Cifra.

## Estrutura

```
scripts/
├── modules/                    # Módulos PowerShell reutilizáveis
│   └── ProjectReorganizer.psm1 # Módulo principal de reorganização
├── config/                     # Arquivos de configuração
│   └── scripts-config.json     # Configuração principal dos scripts
├── main/                       # Scripts principais de execução
│   └── reorganize-project.ps1  # Script de reorganização do projeto
├── node/                       # Alternativas Node.js (futuro)
└── legacy/                     # Scripts antigos movidos da raiz
```

## Módulos Disponíveis

### ProjectReorganizer.psm1

Módulo principal que fornece funcionalidades essenciais para reorganização e manutenção do projeto.

#### Funções Disponíveis

- **Write-AuditLog**: Registra operações com timestamp no log de auditoria
- **Confirm-Action**: Solicita confirmação do usuário para ações críticas
- **Create-Backup**: Cria backups comprimidos antes de operações destrutivas
- **Validate-FileIntegrity**: Valida integridade de arquivos usando checksums SHA-256
- **Generate-Report**: Gera relatórios detalhados em Markdown

## Como Usar

### 1. Importar o Módulo

```powershell
Import-Module "./scripts/modules/ProjectReorganizer.psm1" -Force
```

### 2. Executar Script Principal

```powershell
# Modo normal
./scripts/main/reorganize-project.ps1

# Modo dry-run (simulação)
./scripts/main/reorganize-project.ps1 -DryRun

# Modo force (sem confirmações)
./scripts/main/reorganize-project.ps1 -Force

# Com configuração customizada
./scripts/main/reorganize-project.ps1 -ConfigPath "./custom-config.json"
```

### 3. Usar Funções Individualmente

```powershell
# Registrar no log
Write-AuditLog -Message "Operação iniciada" -Level "INFO"

# Solicitar confirmação
$confirmed = Confirm-Action -Message "Continuar?"

# Criar backup
$backupPath = Create-Backup -SourcePath "./public/images"

# Validar arquivo
$integrity = Validate-FileIntegrity -FilePath "./logo.png"

# Gerar relatório
Generate-Report -OperationName "Teste" -Statistics @{Files=10}
```

## Configuração

O arquivo `scripts/config/scripts-config.json` contém todas as configurações do sistema:

- **logging**: Configurações de log (nível, arquivo, retenção)
- **backup**: Configurações de backup (retenção, compressão)
- **validation**: Configurações de validação (algoritmo de checksum)
- **dryRun**: Configurações de modo simulação
- **notifications**: Configurações de notificações (email, Slack)
- **projectStructure**: Caminhos da estrutura do projeto
- **namingConventions**: Convenções de nomenclatura

## Logs e Backups

- **Logs**: Armazenados em `./logs/operations.log`
- **Backups**: Armazenados em `./logs/backups/`
- **Relatórios**: Gerados em `./logs/relatorio-*.md`

## Recursos de Segurança

1. **Modo Dry-Run**: Simula operações sem executá-las
2. **Backups Automáticos**: Cria backups antes de operações destrutivas
3. **Validação de Integridade**: Verifica checksums dos arquivos
4. **Confirmações**: Solicita confirmação para ações críticas
5. **Logs Detalhados**: Registra todas as operações para auditoria

## Exemplos de Uso

### Reorganizar Projeto Completo

```powershell
# Primeiro, fazer um teste
./scripts/main/reorganize-project.ps1 -DryRun

# Se tudo estiver correto, executar
./scripts/main/reorganize-project.ps1
```

### Criar Backup Manual

```powershell
Import-Module "./scripts/modules/ProjectReorganizer.psm1"
$backup = Create-Backup -SourcePath "./public" -BackupName "manual-backup"
Write-Host "Backup criado: $backup"
```

### Validar Integridade de Arquivos

```powershell
Import-Module "./scripts/modules/ProjectReorganizer.psm1"
$files = Get-ChildItem "./public/images" -Recurse -File
foreach ($file in $files) {
    $result = Validate-FileIntegrity -FilePath $file.FullName
    if (-not $result.IsValid) {
        Write-Warning "Arquivo corrompido: $($file.FullName)"
    }
}
```

## Próximos Passos

1. Implementar alternativas Node.js no diretório `node/`
2. Adicionar testes automatizados
3. Integrar com CI/CD pipeline
4. Adicionar mais módulos especializados (ImageOptimizer, DocumentationGenerator)

## Suporte

Para dúvidas ou problemas:
1. Consulte os logs em `./logs/operations.log`
2. Verifique a configuração em `scripts/config/scripts-config.json`
3. Execute em modo dry-run primeiro para testar
4. Consulte a documentação dos módulos PowerShell