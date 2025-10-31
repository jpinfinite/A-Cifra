# A-Cifra Project Reorganizer - Node.js

Alternativa Node.js/TypeScript para o sistema de reorganização de projetos A-Cifra, fornecendo compatibilidade multiplataforma e funcionalidades equivalentes ao módulo PowerShell.

## Características

- ✅ **Multiplataforma**: Funciona em Windows, macOS e Linux
- ✅ **TypeScript**: Tipagem forte e melhor experiência de desenvolvimento
- ✅ **CLI Intuitiva**: Interface de linha de comando fácil de usar
- ✅ **Testes Abrangentes**: Cobertura completa com Jest
- ✅ **Logging Detalhado**: Sistema de auditoria com cores e níveis
- ✅ **Modo Dry-Run**: Simulação segura antes de executar operações
- ✅ **Backup Automático**: Proteção contra perda de dados
- ✅ **Validação de Integridade**: Checksums SHA-256 para verificação

## Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Executar testes
npm test

# Executar em modo desenvolvimento
npm run dev
```

## Uso da CLI

### Reorganizar Imagens

```bash
# Modo normal
node dist/index.js reorganize-images

# Modo dry-run (simulação)
node dist/index.js reorganize-images --dry-run

# Especificar diretório de origem
node dist/index.js reorganize-images --source ./assets/images

# Sem backup automático
node dist/index.js reorganize-images --no-backup

# Com configuração customizada
node dist/index.js reorganize-images --config ./custom-config.json
```

### Criar Backup

```bash
# Backup de arquivo
node dist/index.js backup ./public/images

# Backup com nome personalizado
node dist/index.js backup ./public/images --name "images-backup"
```

### Validar Integridade

```bash
# Validação básica
node dist/index.js validate ./logo.png

# Com checksum esperado
node dist/index.js validate ./logo.png --expected "abc123..."

# Algoritmo específico
node dist/index.js validate ./logo.png --algorithm md5
```

### Gerar Relatório

```bash
# Relatório básico
node dist/index.js report "Operação de Teste"

# Com estatísticas
node dist/index.js report "Reorganização" --stats '{"files":10,"errors":0}'

# Arquivo de saída específico
node dist/index.js report "Teste" --output ./relatorio-custom.md
```

### Rollback

```bash
# Rollback básico
node dist/index.js rollback ./logs/backups/backup-20231028.zip

# Dry-run do rollback
node dist/index.js rollback ./logs/backups/backup-20231028.zip --dry-run

# Destino específico
node dist/index.js rollback ./backup.zip --target ./restore-here/
```

### Informações do Sistema

```bash
node dist/index.js info
```

## Uso Programático

```typescript
import { ProjectReorganizer } from './ProjectReorganizer';

const reorganizer = new ProjectReorganizer('./config.json');

// Reorganizar imagens
const stats = await reorganizer.moveUsedImages({
  dryRun: false,
  sourcePath: './public/images',
  backupBeforeMove: true
});

// Criar backup
const backupPath = await reorganizer.createBackup({
  sourcePath: './important-files',
  backupName: 'daily-backup'
});

// Validar integridade
const integrity = await reorganizer.validateFileIntegrity({
  filePath: './document.pdf',
  algorithm: 'sha256'
});

// Gerar relatório
const reportPath = await reorganizer.generateReport({
  operationName: 'Manutenção Diária',
  statistics: { files: 100, errors: 0 }
});
```

## Configuração

O sistema usa um arquivo JSON para configuração:

```json
{
  "logging": {
    "enabled": true,
    "level": "info",
    "outputPath": "./logs/operations.log",
    "maxFileSize": "10MB",
    "retentionDays": 30
  },
  "backup": {
    "enabled": true,
    "retentionDays": 30,
    "compressionEnabled": true,
    "backupPath": "./logs/backups"
  },
  "validation": {
    "checksumAlgorithm": "sha256",
    "verifyBeforeOperation": true,
    "verifyAfterOperation": true
  },
  "dryRun": {
    "defaultMode": false,
    "confirmationRequired": true
  },
  "projectStructure": {
    "assetsPath": "./public",
    "imagesPath": "./public/images",
    "scriptsPath": "./scripts",
    "docsPath": "./docs"
  },
  "namingConventions": {
    "imagePattern": "[tema]-[palavra-chave]-[ano].[ext]",
    "altTextPattern": "{tema} - {descrição}",
    "enforceConventions": true
  }
}
```

## Estrutura do Projeto

```
scripts/node/
├── src/
│   ├── types/
│   │   └── index.ts           # Interfaces TypeScript
│   ├── __tests__/
│   │   └── ProjectReorganizer.test.ts  # Testes Jest
│   ├── ProjectReorganizer.ts  # Classe principal
│   └── index.ts              # CLI e ponto de entrada
├── dist/                     # Código compilado
├── coverage/                 # Relatórios de cobertura
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Scripts Disponíveis

- `npm run build` - Compila TypeScript para JavaScript
- `npm run test` - Executa testes com Jest
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com relatório de cobertura
- `npm run dev` - Executa em modo desenvolvimento com ts-node
- `npm run lint` - Executa ESLint
- `npm run clean` - Remove arquivos compilados

## Testes

O projeto inclui testes abrangentes usando Jest:

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm run test:watch

# Executar teste específico
npm test -- --testNamePattern="writeAuditLog"
```

## Compatibilidade

- **Node.js**: >= 16.0.0
- **Sistemas Operacionais**: Windows, macOS, Linux
- **PowerShell**: Funcionalidade equivalente ao módulo PowerShell

## Diferenças do PowerShell

| Recurso | PowerShell | Node.js |
|---------|------------|---------|
| Plataforma | Windows (principalmente) | Multiplataforma |
| Linguagem | PowerShell | TypeScript/JavaScript |
| Testes | Pester | Jest |
| CLI | Scripts .ps1 | Commander.js |
| Configuração | JSON | JSON |
| Logging | Write-Host | Chalk + Console |
| Backup | Compress-Archive | Archiver |
| Validação | Get-FileHash | Crypto |

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

MIT - Veja o arquivo LICENSE para detalhes.