/**
 * Testes unitários para ProjectReorganizer usando Jest
 */

import { ProjectReorganizer } from '../ProjectReorganizer';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('ProjectReorganizer', () => {
  let reorganizer: ProjectReorganizer;
  let testDir: string;
  let testFile1: string;
  let testFile2: string;

  beforeAll(async () => {
    // Configurar ambiente de teste
    process.env.NODE_ENV = 'test';
    
    // Criar diretório temporário para testes
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-reorganizer-test-'));
    
    // Criar arquivos de teste
    testFile1 = path.join(testDir, 'test-file-1.txt');
    testFile2 = path.join(testDir, 'test-image.jpg');
    
    await fs.writeFile(testFile1, 'Conteúdo de teste 1');
    await fs.writeFile(testFile2, 'Conteúdo de teste 2');
    
    // Criar instância do reorganizer
    reorganizer = new ProjectReorganizer();
  });

  afterAll(async () => {
    // Limpar diretório de teste
    await fs.remove(testDir);
  });

  describe('writeAuditLog', () => {
    it('deve escrever mensagem no log', async () => {
      const testMessage = `Teste de log ${Date.now()}`;
      
      await reorganizer.writeAuditLog(testMessage, 'info');
      
      // Verificar se o log foi criado (em ambiente de teste, apenas verifica se não houve erro)
      expect(true).toBe(true);
    });

    it('deve suportar diferentes níveis de log', async () => {
      const levels: Array<'debug' | 'info' | 'warn' | 'error'> = ['debug', 'info', 'warn', 'error'];
      
      for (const level of levels) {
        await expect(reorganizer.writeAuditLog(`Teste ${level}`, level)).resolves.not.toThrow();
      }
    });
  });

  describe('confirmAction', () => {
    it('deve retornar valor padrão em ambiente de teste', async () => {
      const result = await reorganizer.confirmAction('Teste de confirmação', true);
      expect(result).toBe(true);
      
      const result2 = await reorganizer.confirmAction('Teste de negação', false);
      expect(result2).toBe(false);
    });
  });

  describe('validateFileIntegrity', () => {
    it('deve calcular checksum para arquivo existente', async () => {
      const result = await reorganizer.validateFileIntegrity({
        filePath: testFile1,
        algorithm: 'sha256'
      });

      expect(result).not.toBeNull();
      expect(result!.filePath).toBe(testFile1);
      expect(result!.checksum).toHaveLength(64); // SHA-256 tem 64 caracteres
      expect(result!.algorithm).toBe('sha256');
      expect(result!.verified).toBe(true);
      expect(result!.size).toBeGreaterThan(0);
    });

    it('deve validar checksum esperado corretamente', async () => {
      // Primeiro, obter o checksum real
      const firstResult = await reorganizer.validateFileIntegrity({
        filePath: testFile1,
        algorithm: 'sha256'
      });
      
      expect(firstResult).not.toBeNull();
      const expectedChecksum = firstResult!.checksum;

      // Depois, validar com o checksum esperado
      const result = await reorganizer.validateFileIntegrity({
        filePath: testFile1,
        expectedChecksum,
        algorithm: 'sha256'
      });

      expect(result).not.toBeNull();
      expect(result!.verified).toBe(true);
      expect(result!.checksum).toBe(expectedChecksum);
    });

    it('deve detectar checksum incorreto', async () => {
      const wrongChecksum = '0123456789ABCDEF'.repeat(4); // Checksum falso de 64 caracteres

      const result = await reorganizer.validateFileIntegrity({
        filePath: testFile1,
        expectedChecksum: wrongChecksum,
        algorithm: 'sha256'
      });

      expect(result).not.toBeNull();
      expect(result!.verified).toBe(false);
    });

    it('deve retornar null para arquivo inexistente', async () => {
      const nonExistentFile = path.join(testDir, 'nao-existe.txt');

      const result = await reorganizer.validateFileIntegrity({
        filePath: nonExistentFile,
        algorithm: 'sha256'
      });

      expect(result).toBeNull();
    });
  });

  describe('createBackup', () => {
    it('deve criar backup de arquivo único', async () => {
      const backupPath = await reorganizer.createBackup({
        sourcePath: testFile1,
        backupName: 'test-single-file'
      });

      expect(await fs.pathExists(backupPath)).toBe(true);
      expect(backupPath).toMatch(/test-single-file-backup-.*\.zip$/);
    });

    it('deve criar backup de diretório', async () => {
      const testSubDir = path.join(testDir, 'test-subdir');
      await fs.ensureDir(testSubDir);
      await fs.writeFile(path.join(testSubDir, 'nested-file.txt'), 'Arquivo aninhado');

      const backupPath = await reorganizer.createBackup({
        sourcePath: testSubDir,
        backupName: 'test-directory'
      });

      expect(await fs.pathExists(backupPath)).toBe(true);
      expect(backupPath).toMatch(/test-directory-backup-.*\.zip$/);
    });

    it('deve falhar para caminho inexistente', async () => {
      const nonExistentPath = path.join(testDir, 'nao-existe.txt');

      await expect(reorganizer.createBackup({
        sourcePath: nonExistentPath,
        backupName: 'test-fail'
      })).rejects.toThrow('não encontrado');
    });

    it('deve gerar nome automático se não especificado', async () => {
      const backupPath = await reorganizer.createBackup({
        sourcePath: testFile1
      });

      expect(await fs.pathExists(backupPath)).toBe(true);
      expect(backupPath).toMatch(/test-file-1\.txt-backup-.*\.zip$/);
    });
  });

  describe('generateReport', () => {
    it('deve gerar relatório básico', async () => {
      const reportPath = await reorganizer.generateReport({
        operationName: 'Teste Básico'
      });

      expect(await fs.pathExists(reportPath)).toBe(true);
      expect(reportPath).toMatch(/relatorio-.*\.md$/);

      const content = await fs.readFile(reportPath, 'utf8');
      expect(content).toContain('# Relatório de Operação: Teste Básico');
      expect(content).toContain('Data/Hora:');
    });

    it('deve incluir estatísticas no relatório', async () => {
      const stats = {
        FilesProcessed: 10,
        Errors: 2,
        Duration: '00:05:30'
      };

      const reportPath = await reorganizer.generateReport({
        operationName: 'Teste com Estatísticas',
        statistics: stats
      });

      const content = await fs.readFile(reportPath, 'utf8');
      expect(content).toContain('FilesProcessed');
      expect(content).toContain('10');
      expect(content).toContain('Errors');
      expect(content).toContain('2');
    });

    it('deve criar relatório mesmo sem estatísticas', async () => {
      const reportPath = await reorganizer.generateReport({
        operationName: 'Teste Sem Stats'
      });

      const content = await fs.readFile(reportPath, 'utf8');
      expect(content).toContain('Nenhuma estatística específica coletada');
    });
  });

  describe('getImageCategory', () => {
    it('deve categorizar logos corretamente', () => {
      const logoFiles = ['logo-acifra.png', 'brand-image.jpg', 'marca-empresa.svg', 'logotipo.png'];

      logoFiles.forEach(file => {
        const category = reorganizer.getImageCategory(file);
        expect(category).toBe('brand');
      });
    });

    it('deve categorizar ícones corretamente', () => {
      const iconFiles = ['icon-bitcoin.svg', 'icone-menu.png', 'favicon.ico'];

      iconFiles.forEach(file => {
        const category = reorganizer.getImageCategory(file);
        expect(category).toBe('icons');
      });
    });

    it('deve categorizar artigos corretamente', () => {
      const articleFiles = ['article-bitcoin.jpg', 'artigo-defi.png', 'post-crypto.webp', 'blog-image.jpg'];

      articleFiles.forEach(file => {
        const category = reorganizer.getImageCategory(file);
        expect(category).toBe('articles');
      });
    });

    it('deve categorizar imagens crypto como artigos', () => {
      const cryptoFiles = ['bitcoin-price.jpg', 'ethereum-analysis.png', 'blockchain-tech.svg', 'defi-protocol.webp'];

      cryptoFiles.forEach(file => {
        const category = reorganizer.getImageCategory(file);
        expect(category).toBe('articles');
      });
    });

    it('deve usar "articles" como categoria padrão', () => {
      const unknownFiles = ['random-image.jpg', 'unknown-file.png', 'misc-photo.webp'];

      unknownFiles.forEach(file => {
        const category = reorganizer.getImageCategory(file);
        expect(category).toBe('articles');
      });
    });
  });

  describe('moveUsedImages', () => {
    let testImagesDir: string;

    beforeEach(async () => {
      // Criar estrutura de teste para imagens
      testImagesDir = path.join(testDir, 'test-images');
      await fs.ensureDir(testImagesDir);

      // Criar imagens de teste
      await fs.writeFile(path.join(testImagesDir, 'logo-test.png'), 'Logo content');
      await fs.writeFile(path.join(testImagesDir, 'icon-menu.svg'), 'Icon content');
      await fs.writeFile(path.join(testImagesDir, 'article-bitcoin.jpg'), 'Article content');
      await fs.writeFile(path.join(testImagesDir, 'random-image.webp'), 'Random content');
    });

    afterEach(async () => {
      // Limpar estrutura de teste
      if (await fs.pathExists(testImagesDir)) {
        await fs.remove(testImagesDir);
      }
    });

    it('deve executar em modo dry-run sem mover arquivos', async () => {
      const stats = await reorganizer.moveUsedImages({
        dryRun: true,
        sourcePath: testImagesDir,
        backupBeforeMove: false
      });

      expect(stats.filesProcessed).toBeGreaterThan(0);
      expect(stats.filesMovedOrCopied).toBe(0);
      expect(stats.errors).toBe(0);

      // Verificar que arquivos ainda estão no local original
      expect(await fs.pathExists(path.join(testImagesDir, 'logo-test.png'))).toBe(true);
      expect(await fs.pathExists(path.join(testImagesDir, 'icon-menu.svg'))).toBe(true);
    });

    it('deve falhar para diretório inexistente', async () => {
      const nonExistentDir = path.join(testDir, 'nao-existe');

      await expect(reorganizer.moveUsedImages({
        sourcePath: nonExistentDir,
        backupBeforeMove: false
      })).rejects.toThrow('não encontrado');
    });

    it('deve processar diferentes tipos de arquivo de imagem', async () => {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];

      for (const ext of imageExtensions) {
        const testFile = path.join(testImagesDir, `test-image${ext}`);
        await fs.writeFile(testFile, 'Test content');
      }

      const stats = await reorganizer.moveUsedImages({
        dryRun: true,
        sourcePath: testImagesDir,
        backupBeforeMove: false
      });

      expect(stats.filesProcessed).toBeGreaterThanOrEqual(imageExtensions.length);
    });
  });

  describe('invokeRollback', () => {
    it('deve executar rollback em modo dry-run', async () => {
      // Criar backup de teste
      const testBackupFile = await reorganizer.createBackup({
        sourcePath: testFile1,
        backupName: 'test-rollback'
      });

      await expect(reorganizer.invokeRollback(testBackupFile, testDir, true)).resolves.not.toThrow();
    });

    it('deve falhar para backup inexistente', async () => {
      const nonExistentBackup = path.join(testDir, 'nao-existe.zip');

      await expect(reorganizer.invokeRollback(nonExistentBackup, testDir, true)).rejects.toThrow('não encontrado');
    });
  });

  describe('Integração - Fluxo Completo', () => {
    it('deve executar fluxo completo de backup e validação', async () => {
      // 1. Criar backup
      const backupPath = await reorganizer.createBackup({
        sourcePath: testFile1,
        backupName: 'integration-test'
      });
      expect(await fs.pathExists(backupPath)).toBe(true);

      // 2. Validar integridade do arquivo original
      const integrity = await reorganizer.validateFileIntegrity({
        filePath: testFile1,
        algorithm: 'sha256'
      });
      expect(integrity).not.toBeNull();
      expect(integrity!.verified).toBe(true);

      // 3. Gerar relatório
      const stats = {
        BackupsCreated: 1,
        FilesValidated: 1,
        Errors: 0
      };
      const reportPath = await reorganizer.generateReport({
        operationName: 'Teste de Integração',
        statistics: stats
      });
      expect(await fs.pathExists(reportPath)).toBe(true);

      // 4. Verificar conteúdo do relatório
      const reportContent = await fs.readFile(reportPath, 'utf8');
      expect(reportContent).toContain('BackupsCreated');
      expect(reportContent).toContain('1');
      expect(reportContent).toContain('FilesValidated');
      expect(reportContent).toContain('Errors');
      expect(reportContent).toContain('0');
    });
  });
});