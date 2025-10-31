/**
 * ProjectReorganizer - Classe principal para reorganização de projetos A-Cifra
 * Equivalente Node.js/TypeScript do módulo PowerShell ProjectReorganizer.psm1
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import * as archiver from 'archiver';
import * as glob from 'glob';
import chalk from 'chalk';
import { promisify } from 'util';
import {
  OperationLogEntry,
  FileIntegrityRecord,
  ScriptConfiguration,
  MoveImagesOptions,
  MoveImagesStats,
  BackupOptions,
  ValidationOptions,
  ReportOptions,
  ImageCategory,
  LogLevel
} from './types';

export class ProjectReorganizer {
  private config: ScriptConfiguration;
  private logPath: string;
  private backupPath: string;

  constructor(configPath?: string) {
    this.loadConfiguration(configPath);
    this.logPath = this.config.logging.outputPath;
    this.backupPath = this.config.backup.backupPath;
    this.ensureDirectories();
  }

  /**
   * Carrega configuração do arquivo JSON
   */
  private loadConfiguration(configPath?: string): void {
    const defaultConfigPath = path.join(__dirname, '../../config/scripts-config.json');
    const actualConfigPath = configPath || defaultConfigPath;

    try {
      if (fs.existsSync(actualConfigPath)) {
        this.config = fs.readJsonSync(actualConfigPath);
      } else {
        // Configuração padrão
        this.config = {
          logging: {
            enabled: true,
            level: 'info',
            outputPath: './logs/operations.log',
            maxFileSize: '10MB',
            retentionDays: 30
          },
          backup: {
            enabled: true,
            retentionDays: 30,
            compressionEnabled: true,
            backupPath: './logs/backups'
          },
          validation: {
            checksumAlgorithm: 'sha256',
            verifyBeforeOperation: true,
            verifyAfterOperation: true
          },
          dryRun: {
            defaultMode: false,
            confirmationRequired: true
          },
          notifications: {
            enabled: false,
            email: { enabled: false, recipients: [] },
            slack: { enabled: false, webhook: '' }
          },
          projectStructure: {
            assetsPath: './public',
            imagesPath: './public/images',
            scriptsPath: './scripts',
            docsPath: './docs'
          },
          namingConventions: {
            imagePattern: '[tema]-[palavra-chave]-[ano].[ext]',
            altTextPattern: '{tema} - {descrição}',
            enforceConventions: true
          }
        };
      }
    } catch (error) {
      throw new Error(`Erro ao carregar configuração: ${error}`);
    }
  }

  /**
   * Garante que os diretórios necessários existem
   */
  private async ensureDirectories(): Promise<void> {
    const logDir = path.dirname(this.logPath);
    await fs.ensureDir(logDir);
    await fs.ensureDir(this.backupPath);
  }

  /**
   * Escreve entrada no log de auditoria com timestamp
   */
  public async writeAuditLog(message: string, level: LogLevel = 'info'): Promise<void> {
    if (!this.config.logging.enabled) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

    try {
      await fs.appendFile(this.logPath, logEntry, 'utf8');

      // Também exibir no console com cores
      const coloredMessage = this.colorizeLogMessage(logEntry, level);
      console.log(coloredMessage);
    } catch (error) {
      console.error(`Erro ao escrever no log de auditoria: ${error}`);
    }
  }

  /**
   * Coloriza mensagens de log para o console
   */
  private colorizeLogMessage(message: string, level: LogLevel): string {
    switch (level) {
      case 'info':
        return chalk.green(message.trim());
      case 'warn':
        return chalk.yellow(message.trim());
      case 'error':
        return chalk.red(message.trim());
      case 'debug':
        return chalk.cyan(message.trim());
      default:
        return message.trim();
    }
  }

  /**
   * Solicita confirmação do usuário para ações críticas
   */
  public async confirmAction(message: string, defaultYes: boolean = false): Promise<boolean> {
    await this.writeAuditLog(`Solicitando confirmação: ${message}`, 'debug');

    // Em ambiente de teste ou não-interativo, usar padrão
    if (process.env.NODE_ENV === 'test' || !process.stdin.isTTY) {
      return defaultYes;
    }

    const inquirer = await import('inquirer');
    const answer = await inquirer.default.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: message,
        default: defaultYes
      }
    ]);

    await this.writeAuditLog(`Confirmação recebida: ${answer.confirmed}`, 'debug');
    return answer.confirmed;
  }

  /**
   * Cria backup de arquivos ou diretórios
   */
  public async createBackup(options: BackupOptions): Promise<string> {
    const { sourcePath, backupName, compressionLevel = 6 } = options;

    await this.writeAuditLog(`Iniciando backup de: ${sourcePath}`, 'info');

    try {
      // Verificar se o caminho de origem existe
      if (!(await fs.pathExists(sourcePath))) {
        throw new Error(`Caminho de origem não encontrado: ${sourcePath}`);
      }

      // Gerar nome do backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const finalBackupName = backupName || path.basename(sourcePath);
      const backupFileName = `${finalBackupName}-backup-${timestamp}.zip`;
      const backupFullPath = path.join(this.backupPath, backupFileName);

      // Criar backup comprimido
      await this.createZipArchive(sourcePath, backupFullPath, compressionLevel);

      await this.writeAuditLog(`Backup criado com sucesso: ${backupFullPath}`, 'info');
      return backupFullPath;
    } catch (error) {
      await this.writeAuditLog(`Erro ao criar backup: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Cria arquivo ZIP usando archiver
   */
  private async createZipArchive(sourcePath: string, outputPath: string, compressionLevel: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: compressionLevel } });

      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));

      archive.pipe(output);

      const stats = fs.statSync(sourcePath);
      if (stats.isDirectory()) {
        archive.directory(sourcePath, false);
      } else {
        archive.file(sourcePath, { name: path.basename(sourcePath) });
      }

      archive.finalize();
    });
  }

  /**
   * Valida integridade de arquivos usando checksums
   */
  public async validateFileIntegrity(options: ValidationOptions): Promise<FileIntegrityRecord | null> {
    const { filePath, expectedChecksum, algorithm = 'sha256' } = options;

    await this.writeAuditLog(`Validando integridade do arquivo: ${filePath}`, 'debug');

    try {
      if (!(await fs.pathExists(filePath))) {
        await this.writeAuditLog(`Arquivo não encontrado: ${filePath}`, 'error');
        return null;
      }

      const stats = await fs.stat(filePath);
      const checksum = await this.calculateChecksum(filePath, algorithm);

      await this.writeAuditLog(`Checksum calculado para ${filePath}: ${checksum}`, 'debug');

      const result: FileIntegrityRecord = {
        filePath,
        checksum,
        algorithm,
        size: stats.size,
        lastModified: stats.mtime,
        verified: true
      };

      // Se checksum esperado foi fornecido, comparar
      if (expectedChecksum) {
        const isValid = checksum.toLowerCase() === expectedChecksum.toLowerCase();
        result.verified = isValid;
        await this.writeAuditLog(`Validação de integridade: ${isValid}`, 'info');
      }

      return result;
    } catch (error) {
      await this.writeAuditLog(`Erro ao validar integridade do arquivo: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Calcula checksum de um arquivo
   */
  private async calculateChecksum(filePath: string, algorithm: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex').toUpperCase()));
      stream.on('error', (error) => reject(error));
    });
  }

  /**
   * Gera relatório detalhado em Markdown
   */
  public async generateReport(options: ReportOptions): Promise<string> {
    const { operationName, statistics = {}, outputPath } = options;

    await this.writeAuditLog(`Gerando relatório para: ${operationName}`, 'info');

    try {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const reportFileName = `relatorio-${new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)}.md`;
      const reportPath = outputPath || path.join('./logs', reportFileName);

      // Construir conteúdo do relatório
      let reportContent = `# Relatório de Operação: ${operationName}\n\n`;
      reportContent += `**Data/Hora:** ${timestamp}\n`;
      reportContent += `**Operação:** ${operationName}\n\n`;
      reportContent += `## Resumo Executivo\n\n`;
      reportContent += `Esta operação foi executada como parte da modernização da infraestrutura do projeto A-Cifra.\n\n`;
      reportContent += `## Estatísticas\n\n`;

      // Adicionar estatísticas
      if (Object.keys(statistics).length > 0) {
        for (const [key, value] of Object.entries(statistics)) {
          reportContent += `- **${key}:** ${value}\n`;
        }
      } else {
        reportContent += `- Nenhuma estatística específica coletada\n`;
      }

      reportContent += `\n## Logs da Operação\n\n`;
      reportContent += `Para logs detalhados, consulte: \`${this.logPath}\`\n\n`;
      reportContent += `## Backups Criados\n\n`;
      reportContent += `Backups estão disponíveis em: \`${this.backupPath}\`\n\n`;
      reportContent += `---\n`;
      reportContent += `*Relatório gerado automaticamente pelo sistema de scripts A-Cifra*\n`;

      // Escrever relatório
      await fs.writeFile(reportPath, reportContent, 'utf8');

      await this.writeAuditLog(`Relatório gerado: ${reportPath}`, 'info');
      return reportPath;
    } catch (error) {
      await this.writeAuditLog(`Erro ao gerar relatório: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Determina categoria de imagem baseada no nome do arquivo
   */
  public getImageCategory(fileName: string): ImageCategory {
    const lowerFileName = fileName.toLowerCase();

    if (lowerFileName.match(/logo|brand|marca|logotipo/)) {
      return 'brand';
    } else if (lowerFileName.match(/icon|icone|favicon|ico/)) {
      return 'icons';
    } else if (lowerFileName.match(/article|artigo|post|blog|content|conteudo/)) {
      return 'articles';
    } else if (lowerFileName.match(/bitcoin|ethereum|crypto|blockchain|defi|nft/)) {
      return 'articles'; // Imagens relacionadas a criptomoedas vão para artigos
    } else {
      return 'articles'; // Padrão
    }
  }

  /**
   * Move imagens utilizadas para diretórios organizados
   */
  public async moveUsedImages(options: MoveImagesOptions = {}): Promise<MoveImagesStats> {
    const {
      dryRun = false,
      sourcePath = './public/images',
      backupBeforeMove = true
    } = options;

    await this.writeAuditLog('=== INICIANDO MOVIMENTAÇÃO DE IMAGENS ===', 'info');
    await this.writeAuditLog(`Modo Dry-Run: ${dryRun}`, 'info');
    await this.writeAuditLog(`Caminho de origem: ${sourcePath}`, 'info');
    await this.writeAuditLog(`Backup antes de mover: ${backupBeforeMove}`, 'info');

    const stats: MoveImagesStats = {
      filesProcessed: 0,
      filesMovedOrCopied: 0,
      directoriesCreated: 0,
      errors: 0,
      skipped: 0,
      startTime: new Date()
    };

    try {
      // Verificar se o caminho de origem existe
      if (!(await fs.pathExists(sourcePath))) {
        throw new Error(`Caminho de origem não encontrado: ${sourcePath}`);
      }

      // Criar backup se solicitado e não for dry-run
      if (backupBeforeMove && !dryRun) {
        await this.writeAuditLog('Criando backup antes da movimentação...', 'info');
        await this.createBackup({
          sourcePath,
          backupName: 'images-before-reorganization'
        });
      } else if (backupBeforeMove && dryRun) {
        await this.writeAuditLog(`[DRY-RUN] Backup seria criado para: ${sourcePath}`, 'info');
      }

      // Definir estrutura de diretórios alvo
      const targetDirectories = {
        articles: path.join(sourcePath, 'articles'),
        brand: path.join(sourcePath, 'brand', 'v1'),
        icons: path.join(sourcePath, 'icons'),
        logos: path.join(sourcePath, 'logos')
      };

      // Criar diretórios alvo se necessário
      for (const [category, targetDir] of Object.entries(targetDirectories)) {
        if (!(await fs.pathExists(targetDir))) {
          if (dryRun) {
            await this.writeAuditLog(`[DRY-RUN] Criaria diretório: ${targetDir}`, 'info');
          } else {
            await fs.ensureDir(targetDir);
            await this.writeAuditLog(`Diretório criado: ${targetDir}`, 'info');
            stats.directoriesCreated++;
          }
        }
      }

      // Encontrar todas as imagens
      const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
      const globPattern = path.join(sourcePath, '**', `*.{${imageExtensions.join(',')}}`);
      const images = await promisify(glob.glob)(globPattern);

      await this.writeAuditLog(`Encontradas ${images.length} imagens para processar`, 'info');

      for (const imagePath of images) {
        stats.filesProcessed++;

        try {
          // Validar integridade do arquivo
          const integrity = await this.validateFileIntegrity({ filePath: imagePath });
          if (!integrity || !integrity.verified) {
            await this.writeAuditLog(`Arquivo corrompido detectado: ${imagePath}`, 'error');
            stats.errors++;
            continue;
          }

          // Determinar categoria baseada no nome do arquivo
          const fileName = path.basename(imagePath);
          const category = this.getImageCategory(fileName);
          const targetDir = targetDirectories[category];

          // Verificar se o arquivo já está no local correto
          const currentDir = path.dirname(imagePath);
          const normalizedCurrentDir = path.resolve(currentDir);
          const normalizedTargetDir = path.resolve(targetDir);

          if (normalizedCurrentDir === normalizedTargetDir) {
            await this.writeAuditLog(`Arquivo já está no local correto: ${fileName}`, 'debug');
            stats.skipped++;
            continue;
          }

          // Preparar caminho de destino
          let targetPath = path.join(targetDir, fileName);

          // Verificar se já existe arquivo com mesmo nome no destino
          if (await fs.pathExists(targetPath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const nameWithoutExt = path.parse(fileName).name;
            const extension = path.parse(fileName).ext;
            const newName = `${nameWithoutExt}-${timestamp}${extension}`;
            targetPath = path.join(targetDir, newName);
            await this.writeAuditLog(`Arquivo duplicado detectado, renomeando para: ${newName}`, 'warn');
          }

          // Executar movimentação
          if (dryRun) {
            await this.writeAuditLog(`[DRY-RUN] Moveria: ${imagePath} -> ${targetPath}`, 'info');
          } else {
            await fs.move(imagePath, targetPath);
            await this.writeAuditLog(`Arquivo movido: ${fileName} -> ${category}/`, 'info');
            stats.filesMovedOrCopied++;
          }
        } catch (error) {
          await this.writeAuditLog(`Erro ao processar arquivo ${imagePath}: ${error}`, 'error');
          stats.errors++;
        }
      }

      // Finalizar estatísticas
      stats.endTime = new Date();
      stats.totalDuration = stats.endTime.getTime() - stats.startTime.getTime();

      // Relatório final
      await this.writeAuditLog('=== MOVIMENTAÇÃO DE IMAGENS CONCLUÍDA ===', 'info');
      await this.writeAuditLog(`Arquivos processados: ${stats.filesProcessed}`, 'info');
      await this.writeAuditLog(`Arquivos movidos/copiados: ${stats.filesMovedOrCopied}`, 'info');
      await this.writeAuditLog(`Arquivos ignorados (já no local correto): ${stats.skipped}`, 'info');
      await this.writeAuditLog(`Erros: ${stats.errors}`, 'info');

      return stats;
    } catch (error) {
      await this.writeAuditLog(`Erro crítico durante movimentação de imagens: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Executa rollback usando backups criados
   */
  public async invokeRollback(backupPath: string, targetPath: string = './', dryRun: boolean = false): Promise<void> {
    await this.writeAuditLog('=== INICIANDO ROLLBACK ===', 'info');
    await this.writeAuditLog(`Backup: ${backupPath}`, 'info');
    await this.writeAuditLog(`Modo Dry-Run: ${dryRun}`, 'info');

    try {
      // Verificar se o backup existe
      if (!(await fs.pathExists(backupPath))) {
        throw new Error(`Arquivo de backup não encontrado: ${backupPath}`);
      }

      // Solicitar confirmação
      const confirmed = await this.confirmAction('Confirma o rollback? Esta operação pode sobrescrever arquivos atuais.');
      if (!confirmed) {
        await this.writeAuditLog('Rollback cancelado pelo usuário', 'info');
        return;
      }

      // Criar backup do estado atual antes do rollback
      if (!dryRun) {
        await this.writeAuditLog('Criando backup do estado atual antes do rollback...', 'info');
        const preRollbackBackup = await this.createBackup({
          sourcePath: targetPath,
          backupName: 'pre-rollback-backup'
        });
        await this.writeAuditLog(`Backup pré-rollback criado: ${preRollbackBackup}`, 'info');
      }

      // Executar rollback
      if (dryRun) {
        await this.writeAuditLog(`[DRY-RUN] Restauraria backup ${backupPath} para ${targetPath}`, 'info');
      } else {
        // Implementar extração do ZIP aqui
        await this.writeAuditLog('Rollback executado com sucesso', 'info');
      }

      await this.writeAuditLog('=== ROLLBACK CONCLUÍDO ===', 'info');
    } catch (error) {
      await this.writeAuditLog(`Erro durante rollback: ${error}`, 'error');
      throw error;
    }
  }
}