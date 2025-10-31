#!/usr/bin/env node

/**
 * A-Cifra Project Reorganizer - Node.js CLI
 * Ponto de entrada principal para o sistema de reorganização de projetos
 */

import { Command } from 'commander';
import { ProjectReorganizer } from './ProjectReorganizer';
import chalk from 'chalk';
import * as path from 'path';

const program = new Command();

program
  .name('acifra-reorganizer')
  .description('Sistema de reorganização de projetos A-Cifra')
  .version('1.0.0');

// Comando para reorganizar imagens
program
  .command('reorganize-images')
  .description('Reorganiza imagens do projeto em estrutura categorizada')
  .option('-d, --dry-run', 'Executa em modo simulação sem fazer alterações')
  .option('-s, --source <path>', 'Caminho de origem das imagens', './public/images')
  .option('--no-backup', 'Não criar backup antes da reorganização')
  .option('-c, --config <path>', 'Caminho para arquivo de configuração customizado')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔄 Iniciando reorganização de imagens...'));
      
      const reorganizer = new ProjectReorganizer(options.config);
      
      const stats = await reorganizer.moveUsedImages({
        dryRun: options.dryRun,
        sourcePath: options.source,
        backupBeforeMove: options.backup
      });

      // Gerar relatório
      await reorganizer.generateReport({
        operationName: 'Reorganização de Imagens via CLI',
        statistics: {
          'Arquivos Processados': stats.filesProcessed,
          'Arquivos Movidos': stats.filesMovedOrCopied,
          'Diretórios Criados': stats.directoriesCreated,
          'Arquivos Ignorados': stats.skipped,
          'Erros': stats.errors,
          'Duração (ms)': stats.totalDuration || 0,
          'Modo Dry-Run': options.dryRun
        }
      });

      if (options.dryRun) {
        console.log(chalk.yellow('✅ Simulação concluída com sucesso!'));
      } else {
        console.log(chalk.green('✅ Reorganização concluída com sucesso!'));
      }

    } catch (error) {
      console.error(chalk.red('❌ Erro durante reorganização:'), error);
      process.exit(1);
    }
  });

// Comando para criar backup
program
  .command('backup')
  .description('Cria backup de arquivos ou diretórios')
  .argument('<source>', 'Caminho de origem para backup')
  .option('-n, --name <name>', 'Nome personalizado para o backup')
  .option('-c, --config <path>', 'Caminho para arquivo de configuração customizado')
  .action(async (source: string, options: any) => {
    try {
      console.log(chalk.blue(`🗄️  Criando backup de: ${source}`));
      
      const reorganizer = new ProjectReorganizer(options.config);
      
      const backupPath = await reorganizer.createBackup({
        sourcePath: source,
        backupName: options.name
      });

      console.log(chalk.green(`✅ Backup criado: ${backupPath}`));

    } catch (error) {
      console.error(chalk.red('❌ Erro ao criar backup:'), error);
      process.exit(1);
    }
  });

// Comando para validar integridade
program
  .command('validate')
  .description('Valida integridade de arquivos usando checksums')
  .argument('<file>', 'Caminho do arquivo para validar')
  .option('-e, --expected <checksum>', 'Checksum esperado para comparação')
  .option('-a, --algorithm <algo>', 'Algoritmo de hash (md5, sha1, sha256)', 'sha256')
  .option('-c, --config <path>', 'Caminho para arquivo de configuração customizado')
  .action(async (file: string, options: any) => {
    try {
      console.log(chalk.blue(`🔍 Validando integridade de: ${file}`));
      
      const reorganizer = new ProjectReorganizer(options.config);
      
      const result = await reorganizer.validateFileIntegrity({
        filePath: file,
        expectedChecksum: options.expected,
        algorithm: options.algorithm
      });

      if (!result) {
        console.log(chalk.red('❌ Arquivo não encontrado ou inacessível'));
        process.exit(1);
      }

      console.log(chalk.green('✅ Validação concluída:'));
      console.log(`   Arquivo: ${result.filePath}`);
      console.log(`   Checksum: ${result.checksum}`);
      console.log(`   Algoritmo: ${result.algorithm}`);
      console.log(`   Tamanho: ${result.size} bytes`);
      console.log(`   Modificado: ${result.lastModified}`);
      console.log(`   Válido: ${result.verified ? '✅' : '❌'}`);

    } catch (error) {
      console.error(chalk.red('❌ Erro durante validação:'), error);
      process.exit(1);
    }
  });

// Comando para gerar relatório
program
  .command('report')
  .description('Gera relatório de operações')
  .argument('<operation>', 'Nome da operação para o relatório')
  .option('-s, --stats <json>', 'Estatísticas em formato JSON')
  .option('-o, --output <path>', 'Caminho de saída para o relatório')
  .option('-c, --config <path>', 'Caminho para arquivo de configuração customizado')
  .action(async (operation: string, options: any) => {
    try {
      console.log(chalk.blue(`📊 Gerando relatório para: ${operation}`));
      
      const reorganizer = new ProjectReorganizer(options.config);
      
      let statistics = {};
      if (options.stats) {
        try {
          statistics = JSON.parse(options.stats);
        } catch (error) {
          console.warn(chalk.yellow('⚠️  Erro ao parsear estatísticas JSON, usando objeto vazio'));
        }
      }

      const reportPath = await reorganizer.generateReport({
        operationName: operation,
        statistics,
        outputPath: options.output
      });

      console.log(chalk.green(`✅ Relatório gerado: ${reportPath}`));

    } catch (error) {
      console.error(chalk.red('❌ Erro ao gerar relatório:'), error);
      process.exit(1);
    }
  });

// Comando para rollback
program
  .command('rollback')
  .description('Executa rollback usando backup')
  .argument('<backup>', 'Caminho do arquivo de backup')
  .option('-t, --target <path>', 'Caminho de destino para restauração', './')
  .option('-d, --dry-run', 'Executa em modo simulação')
  .option('-c, --config <path>', 'Caminho para arquivo de configuração customizado')
  .action(async (backup: string, options: any) => {
    try {
      console.log(chalk.blue(`🔄 Executando rollback de: ${backup}`));
      
      const reorganizer = new ProjectReorganizer(options.config);
      
      await reorganizer.invokeRollback(backup, options.target, options.dryRun);

      if (options.dryRun) {
        console.log(chalk.yellow('✅ Simulação de rollback concluída!'));
      } else {
        console.log(chalk.green('✅ Rollback executado com sucesso!'));
      }

    } catch (error) {
      console.error(chalk.red('❌ Erro durante rollback:'), error);
      process.exit(1);
    }
  });

// Comando de informações do sistema
program
  .command('info')
  .description('Exibe informações sobre o sistema e configuração')
  .option('-c, --config <path>', 'Caminho para arquivo de configuração customizado')
  .action(async (options) => {
    try {
      const reorganizer = new ProjectReorganizer(options.config);
      
      console.log(chalk.blue('ℹ️  Informações do Sistema A-Cifra Project Reorganizer'));
      console.log('');
      console.log(`📁 Diretório atual: ${process.cwd()}`);
      console.log(`🔧 Node.js: ${process.version}`);
      console.log(`💻 Plataforma: ${process.platform}`);
      console.log(`🏗️  Arquitetura: ${process.arch}`);
      console.log('');
      console.log(chalk.green('✅ Sistema funcionando corretamente!'));

    } catch (error) {
      console.error(chalk.red('❌ Erro ao obter informações:'), error);
      process.exit(1);
    }
  });

// Tratar erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Erro não tratado:'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Exceção não capturada:'), error);
  process.exit(1);
});

// Executar programa
program.parse(process.argv);

export { ProjectReorganizer };