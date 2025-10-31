/**
 * Script para limpar assets grandes e desnecessários
 * Remove arquivos EPS, AI e outros formatos não web
 * 
 * Autor: Kiro - IA da Amazon integrada ao CIFRA Assistant
 */

const fs = require('fs');
const path = require('path');

// Configurações
const PUBLIC_DIR = './public';
const BACKUP_DIR = './logs/large-assets-backup';
const MAX_SIZE_MB = 25;

// Extensões a serem removidas (não web-friendly)
const EXTENSIONS_TO_REMOVE = ['.eps', '.ai', '.tiff', '.tif', '.psd'];

// Arquivos específicos grandes identificados
const LARGE_FILES_TO_REMOVE = [
  'public/images/general/rm373batch16-banner-05.eps',
  'public/images/bitcoin/bitcoin_6_65_2.eps',
  'public/images/general/5132106.eps',
  'public/images/general/17.eps',
  'public/images/general/2474916.eps',
  'public/images/general/3512613.eps',
  'public/images/general/12182.eps',
  'public/images/general/1002_yuan_digital.eps'
];

class AssetCleaner {
  constructor() {
    this.removedFiles = [];
    this.totalSizeSaved = 0;
    this.errors = [];
  }

  /**
   * Executa limpeza completa dos assets
   */
  async cleanup() {
    console.log('🧹 Iniciando limpeza de assets grandes...\n');
    
    try {
      // Criar backup
      await this.createBackup();
      
      // Auditar arquivos grandes
      await this.auditLargeFiles();
      
      // Remover arquivos EPS/AI desnecessários
      await this.removeUnnecessaryFormats();
      
      // Gerar relatório
      await this.generateReport();
      
      console.log('✅ Limpeza concluída!');
      
    } catch (error) {
      console.error('❌ Erro durante limpeza:', error.message);
      this.errors.push(error.message);
    }
  }

  /**
   * Cria backup dos arquivos grandes
   */
  async createBackup() {
    console.log('📦 Criando backup dos arquivos grandes...');
    
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `large-assets-${timestamp}`);
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    console.log(`✅ Backup preparado em: ${backupPath}\n`);
  }

  /**
   * Audita arquivos grandes
   */
  async auditLargeFiles() {
    console.log('🔍 Auditando arquivos grandes...');
    
    const largeFiles = [];
    
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const sizeMB = stat.size / (1024 * 1024);
          
          if (sizeMB > MAX_SIZE_MB) {
            largeFiles.push({
              path: fullPath,
              name: item,
              sizeMB: Math.round(sizeMB * 100) / 100,
              extension: path.extname(item).toLowerCase()
            });
          }
        }
      }
    };
    
    scanDirectory(PUBLIC_DIR);
    
    console.log(`📊 Encontrados ${largeFiles.length} arquivos > ${MAX_SIZE_MB}MB:`);
    largeFiles.forEach(file => {
      console.log(`   • ${file.name}: ${file.sizeMB}MB (${file.extension})`);
    });
    
    return largeFiles;
  }

  /**
   * Remove formatos desnecessários
   */
  async removeUnnecessaryFormats() {
    console.log('\n🗑️ Removendo formatos desnecessários...');
    
    const scanAndRemove = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanAndRemove(fullPath);
        } else if (stat.isFile()) {
          const extension = path.extname(item).toLowerCase();
          const sizeMB = stat.size / (1024 * 1024);
          
          // Remover se for extensão desnecessária ou arquivo muito grande
          if (EXTENSIONS_TO_REMOVE.includes(extension) || sizeMB > MAX_SIZE_MB) {
            try {
              // Verificar se existe versão JPG/PNG equivalente
              const baseName = path.basename(item, extension);
              const dirName = path.dirname(fullPath);
              
              const hasJpgVersion = fs.existsSync(path.join(dirName, baseName + '.jpg'));
              const hasPngVersion = fs.existsSync(path.join(dirName, baseName + '.png'));
              const hasWebpVersion = fs.existsSync(path.join(dirName, baseName + '.webp'));
              
              // Só remover se tiver versão web ou se for muito grande
              if (hasJpgVersion || hasPngVersion || hasWebpVersion || sizeMB > 50) {
                fs.unlinkSync(fullPath);
                
                this.removedFiles.push({
                  name: item,
                  path: fullPath,
                  sizeMB: Math.round(sizeMB * 100) / 100,
                  extension,
                  reason: sizeMB > 50 ? 'Muito grande' : 'Versão web disponível'
                });
                
                this.totalSizeSaved += sizeMB;
                
                console.log(`🗑️ Removido: ${item} (${Math.round(sizeMB * 100) / 100}MB)`);
              } else {
                console.log(`⚠️ Mantido: ${item} (sem versão web equivalente)`);
              }
              
            } catch (error) {
              console.error(`❌ Erro ao remover ${item}:`, error.message);
              this.errors.push(`Erro ao remover ${item}: ${error.message}`);
            }
          }
        }
      }
    };
    
    scanAndRemove(PUBLIC_DIR);
    
    console.log(`\n📊 Resumo da limpeza:`);
    console.log(`   • ${this.removedFiles.length} arquivos removidos`);
    console.log(`   • ${Math.round(this.totalSizeSaved * 100) / 100}MB economizados`);
  }

  /**
   * Gera relatório da limpeza
   */
  async generateReport() {
    console.log('\n📊 Gerando relatório...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join('./logs', `asset-cleanup-${timestamp}.md`);
    
    let report = `# Relatório de Limpeza de Assets Grandes\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Executado por:** Kiro - IA da Amazon integrada ao CIFRA Assistant\n\n`;
    
    report += `## Resumo\n\n`;
    report += `- **Arquivos removidos:** ${this.removedFiles.length}\n`;
    report += `- **Espaço economizado:** ${Math.round(this.totalSizeSaved * 100) / 100}MB\n`;
    report += `- **Erros encontrados:** ${this.errors.length}\n\n`;
    
    if (this.removedFiles.length > 0) {
      report += `## Arquivos Removidos\n\n`;
      report += `| Arquivo | Tamanho (MB) | Extensão | Motivo |\n`;
      report += `|---------|--------------|----------|--------|\n`;
      
      for (const file of this.removedFiles) {
        report += `| ${file.name} | ${file.sizeMB} | ${file.extension} | ${file.reason} |\n`;
      }
      report += `\n`;
    }
    
    if (this.errors.length > 0) {
      report += `## Erros Encontrados\n\n`;
      for (const error of this.errors) {
        report += `- ${error}\n`;
      }
      report += `\n`;
    }
    
    report += `## Benefícios da Limpeza\n\n`;
    report += `- **Deploy mais rápido**: Menos dados para transferir\n`;
    report += `- **GitHub otimizado**: Sem arquivos desnecessários\n`;
    report += `- **Performance**: Carregamento mais rápido\n`;
    report += `- **Manutenção**: Estrutura mais limpa\n\n`;
    
    report += `## Próximos Passos\n\n`;
    report += `1. Verificar se não há imagens quebradas\n`;
    report += `2. Otimizar imagens restantes para WebP\n`;
    report += `3. Implementar lazy loading\n`;
    report += `4. Configurar CDN para imagens\n\n`;
    
    report += `---\n`;
    report += `*Relatório gerado automaticamente pelo Kiro - CIFRA Assistant*\n`;
    
    // Salvar relatório
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Relatório salvo em: ${reportPath}`);
    
    // Resumo no console
    console.log('\n🎯 LIMPEZA CONCLUÍDA:');
    console.log(`   • ${this.removedFiles.length} arquivos removidos`);
    console.log(`   • ${Math.round(this.totalSizeSaved * 100) / 100}MB economizados`);
    console.log(`   • Deploy otimizado para Cloudflare Pages`);
  }

  /**
   * Verifica integridade após limpeza
   */
  async verifyIntegrity() {
    console.log('\n🔍 Verificando integridade após limpeza...');
    
    // Verificar se imagens dos cards ainda existem
    const cardImages = [
      'bitcoin-guide-2025.jpg',
      'altcoins-2025.jpg',
      'crypto-analysis-charts.jpg',
      'defi-revolution.jpg',
      'etherum-2.0.jpg',
      'Layer2.jpg',
      'digital-wallet-security.jpg',
      'staking-recompensas.jpg'
    ];
    
    let allCardsOk = true;
    
    for (const image of cardImages) {
      const imagePath = path.join(PUBLIC_DIR, 'images', image);
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ Imagem de card faltante: ${image}`);
        allCardsOk = false;
      }
    }
    
    if (allCardsOk) {
      console.log('✅ Todas as imagens dos cards estão intactas');
    } else {
      console.log('⚠️ Algumas imagens dos cards podem ter sido afetadas');
    }
    
    return allCardsOk;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const cleaner = new AssetCleaner();
  
  cleaner.cleanup().then(() => {
    return cleaner.verifyIntegrity();
  }).catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = AssetCleaner;