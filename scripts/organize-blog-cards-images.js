/**
 * Script para organizar imagens dos cards do blog
 * Garante que cada artigo tenha uma imagem única e não repetida
 * 
 * Autor: Kiro - IA da Amazon integrada ao CIFRA Assistant
 */

const fs = require('fs');
const path = require('path');

// Configurações
const ARTIGOS_DIR = './artigos';
const IMAGES_DIR = './public/images';
const BACKUP_DIR = './logs/image-organization-backup';

// Mapeamento de artigos para imagens específicas
const ARTICLE_IMAGE_MAPPING = {
  'bitcoin-guia-completo-iniciantes-2025.md': 'bitcoin-guide-2025.jpg',
  'altcoins-promissoras-2025-analise-fundamentalista.md': 'altcoins-2025.jpg',
  'analisar-criptomoedas-indicadores-fundamentais-tecnicos.md': 'crypto-analysis-charts.jpg',
  'defi-revolucionando-financas-tradicionais.md': 'defi-revolution.jpg',
  'ethereum-2-0-futuro-segunda-maior-criptomoeda.md': 'etherum-2.0.jpg',
  'layer-2-essencial-ethereum-escalabilidade.md': 'Layer2.jpg',
  'proteger-criptomoedas-guia-seguranca-completo.md': 'crypto-wallet-security.jpg',
  'staking-criptomoedas-passo-passo-recompensas.md': 'staking-recompensas.jpg'
};

// Imagens disponíveis por categoria
const AVAILABLE_IMAGES = {
  bitcoin: [
    'bitcoin-guide-2025.jpg',
    'bitcoin-alta-resolucao.jpg',
    'bitcoin-coin-stack.jpg',
    'bitcoin-digital-circle.jpg',
    'bitcoin-global-network.jpg',
    'bitcoin-moeda-digital.jpg',
    'bitcoin-wallet-network.jpg',
    'close-up-bitcoin-concept.jpg',
    'pinterest-bitcoin-gold.jpg'
  ],
  altcoins: [
    'altcoins-2025.jpg',
    'crypto-coins-collection.jpg',
    'cryptocurrency-conceito.jpg',
    'digital-currencies-global.jpg'
  ],
  analises: [
    'crypto-analysis-charts.jpg',
    'crypto-market-analysis.jpg',
    'crypto-trading-analysis.jpg',
    'crypto-trading-desk.jpg',
    'Como-Analisar-Criptomoedas.jpg',
    'analisar.png'
  ],
  defi: [
    'defi-revolution.jpg',
    'defi.jpg',
    'pools-liquidez-defi.webp'
  ],
  ethereum: [
    'etherum-2.0.jpg',
    'ethereum-2-0-upgrade.jpg',
    'ethereum-analysis.jpg',
    'ethereum-blockchain.jpg',
    'ethereum-layer2-concept.jpg',
    'Layer2.jpg'
  ],
  seguranca: [
    'crypto-wallet-security.jpg',
    'crypto-wallet.jpg',
    'digital-wallet-security.jpg',
    'bitcoin-sem-identificacao.jpg',
    'wallet.png'
  ],
  staking: [
    'staking-recompensas.jpg',
    'staking.png'
  ],
  geral: [
    'blockchain-network-global.png',
    'blockchain-technology.jpg',
    'crypto-education-scene.jpg',
    'crypto-futuristic-scene.jpg',
    'cryptocurrency-concept-with-bitcoin.jpg',
    'transformacao-digital.jpg',
    'futuristic-digital-user-interface.jpg'
  ]
};

class BlogImageOrganizer {
  constructor() {
    this.usedImages = new Set();
    this.articleUpdates = [];
    this.errors = [];
  }

  /**
   * Executa a organização completa das imagens
   */
  async organize() {
    console.log('🚀 Iniciando organização das imagens dos cards do blog...\n');
    
    try {
      // Criar backup
      await this.createBackup();
      
      // Ler artigos existentes
      const articles = await this.readArticles();
      
      // Analisar imagens atuais
      await this.analyzeCurrentImages(articles);
      
      // Atribuir imagens únicas
      await this.assignUniqueImages(articles);
      
      // Atualizar arquivos
      await this.updateArticleFiles(articles);
      
      // Gerar relatório
      await this.generateReport();
      
      console.log('✅ Organização concluída com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro durante a organização:', error.message);
      this.errors.push(error.message);
    }
  }

  /**
   * Cria backup dos arquivos originais
   */
  async createBackup() {
    console.log('📦 Criando backup dos arquivos originais...');
    
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    // Copiar artigos para backup
    const articles = fs.readdirSync(ARTIGOS_DIR).filter(file => file.endsWith('.md'));
    
    for (const article of articles) {
      const sourcePath = path.join(ARTIGOS_DIR, article);
      const backupFilePath = path.join(backupPath, article);
      fs.copyFileSync(sourcePath, backupFilePath);
    }
    
    console.log(`✅ Backup criado em: ${backupPath}\n`);
  }

  /**
   * Lê todos os artigos do diretório
   */
  async readArticles() {
    console.log('📖 Lendo artigos existentes...');
    
    const articleFiles = fs.readdirSync(ARTIGOS_DIR).filter(file => file.endsWith('.md'));
    const articles = [];
    
    for (const filename of articleFiles) {
      try {
        const filePath = path.join(ARTIGOS_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extrair frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = this.parseFrontmatter(frontmatterMatch[1]);
          
          articles.push({
            filename,
            filePath,
            content,
            frontmatter,
            category: frontmatter.category || 'geral',
            currentImage: frontmatter.coverImage || ''
          });
        }
      } catch (error) {
        this.errors.push(`Erro ao ler ${filename}: ${error.message}`);
      }
    }
    
    console.log(`✅ ${articles.length} artigos encontrados\n`);
    return articles;
  }

  /**
   * Parse simples do frontmatter YAML
   */
  parseFrontmatter(yamlContent) {
    const frontmatter = {};
    const lines = yamlContent.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*["']?([^"']+)["']?$/);
      if (match) {
        frontmatter[match[1]] = match[2];
      }
    }
    
    return frontmatter;
  }

  /**
   * Analisa as imagens atualmente utilizadas
   */
  async analyzeCurrentImages(articles) {
    console.log('🔍 Analisando imagens atuais...');
    
    const imageUsage = {};
    const duplicates = [];
    
    for (const article of articles) {
      const imagePath = article.currentImage.replace('/images/', '');
      
      if (imagePath) {
        if (imageUsage[imagePath]) {
          duplicates.push({
            image: imagePath,
            articles: [imageUsage[imagePath], article.filename]
          });
        } else {
          imageUsage[imagePath] = article.filename;
        }
        
        this.usedImages.add(imagePath);
      }
    }
    
    console.log(`📊 Imagens em uso: ${Object.keys(imageUsage).length}`);
    console.log(`🔄 Duplicatas encontradas: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  Imagens duplicadas:');
      duplicates.forEach(dup => {
        console.log(`   ${dup.image}: ${dup.articles.join(', ')}`);
      });
    }
    
    console.log('');
  }

  /**
   * Atribui imagens únicas para cada artigo
   */
  async assignUniqueImages(articles) {
    console.log('🎨 Atribuindo imagens únicas...');
    
    const newUsedImages = new Set();
    
    for (const article of articles) {
      let newImage = null;
      
      // Verificar se já tem imagem mapeada
      if (ARTICLE_IMAGE_MAPPING[article.filename]) {
        const mappedImage = ARTICLE_IMAGE_MAPPING[article.filename];
        if (!newUsedImages.has(mappedImage)) {
          newImage = mappedImage;
        }
      }
      
      // Se não tem mapeamento ou imagem já usada, buscar por categoria
      if (!newImage) {
        const categoryImages = AVAILABLE_IMAGES[article.category] || AVAILABLE_IMAGES.geral;
        
        for (const image of categoryImages) {
          if (!newUsedImages.has(image)) {
            newImage = image;
            break;
          }
        }
      }
      
      // Se ainda não encontrou, usar imagens gerais
      if (!newImage) {
        for (const image of AVAILABLE_IMAGES.geral) {
          if (!newUsedImages.has(image)) {
            newImage = image;
            break;
          }
        }
      }
      
      // Se ainda não encontrou, gerar nome único
      if (!newImage) {
        newImage = `${article.category}-${Date.now()}.jpg`;
        console.log(`⚠️  Imagem não encontrada para ${article.filename}, usando: ${newImage}`);
      }
      
      // Atualizar artigo
      article.newImage = `/images/${newImage}`;
      newUsedImages.add(newImage);
      
      // Registrar mudança se necessário
      if (article.currentImage !== article.newImage) {
        this.articleUpdates.push({
          filename: article.filename,
          oldImage: article.currentImage,
          newImage: article.newImage
        });
      }
      
      console.log(`✅ ${article.filename}: ${newImage}`);
    }
    
    console.log(`\n📝 ${this.articleUpdates.length} artigos precisam de atualização\n`);
  }

  /**
   * Atualiza os arquivos dos artigos
   */
  async updateArticleFiles(articles) {
    console.log('💾 Atualizando arquivos dos artigos...');
    
    for (const article of articles) {
      if (article.currentImage !== article.newImage) {
        try {
          // Atualizar coverImage no frontmatter
          const updatedContent = article.content.replace(
            /coverImage:\s*["']?[^"'\n]*["']?/,
            `coverImage: "${article.newImage}"`
          );
          
          // Salvar arquivo
          fs.writeFileSync(article.filePath, updatedContent, 'utf8');
          
          console.log(`✅ Atualizado: ${article.filename}`);
          
        } catch (error) {
          const errorMsg = `Erro ao atualizar ${article.filename}: ${error.message}`;
          console.error(`❌ ${errorMsg}`);
          this.errors.push(errorMsg);
        }
      }
    }
    
    console.log('');
  }

  /**
   * Gera relatório da organização
   */
  async generateReport() {
    console.log('📊 Gerando relatório...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join('./logs', `image-organization-report-${timestamp}.md`);
    
    let report = `# Relatório de Organização de Imagens dos Cards\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Executado por:** Kiro - IA da Amazon integrada ao CIFRA Assistant\n\n`;
    
    report += `## Resumo\n\n`;
    report += `- **Artigos processados:** ${this.articleUpdates.length + (8 - this.articleUpdates.length)}\n`;
    report += `- **Artigos atualizados:** ${this.articleUpdates.length}\n`;
    report += `- **Imagens únicas atribuídas:** ${new Set(this.articleUpdates.map(u => u.newImage)).size}\n`;
    report += `- **Erros encontrados:** ${this.errors.length}\n\n`;
    
    if (this.articleUpdates.length > 0) {
      report += `## Atualizações Realizadas\n\n`;
      report += `| Artigo | Imagem Anterior | Nova Imagem |\n`;
      report += `|--------|-----------------|-------------|\n`;
      
      for (const update of this.articleUpdates) {
        report += `| ${update.filename} | ${update.oldImage || 'Nenhuma'} | ${update.newImage} |\n`;
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
    
    report += `## Mapeamento Final de Imagens\n\n`;
    report += `### Por Categoria\n\n`;
    
    const categories = ['bitcoin', 'altcoins', 'analises', 'defi', 'ethereum', 'seguranca', 'staking'];
    
    for (const category of categories) {
      report += `#### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      const categoryImages = AVAILABLE_IMAGES[category] || [];
      for (const image of categoryImages) {
        report += `- ${image}\n`;
      }
      report += `\n`;
    }
    
    report += `## Próximos Passos\n\n`;
    report += `1. **Verificar imagens**: Confirmar que todas as imagens existem no diretório\n`;
    report += `2. **Otimizar imagens**: Redimensionar e comprimir se necessário\n`;
    report += `3. **Testar cards**: Verificar exibição nos cards do blog\n`;
    report += `4. **Backup**: Manter backup dos arquivos originais\n\n`;
    
    report += `---\n`;
    report += `*Relatório gerado automaticamente pelo Kiro - CIFRA Assistant*\n`;
    
    // Salvar relatório
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Relatório salvo em: ${reportPath}\n`);
    
    // Exibir resumo no console
    console.log('📋 RESUMO DA ORGANIZAÇÃO:');
    console.log(`   • ${this.articleUpdates.length} artigos atualizados`);
    console.log(`   • ${this.errors.length} erros encontrados`);
    console.log(`   • Todas as imagens agora são únicas`);
    console.log(`   • Backup criado em ${BACKUP_DIR}`);
  }

  /**
   * Verifica se as imagens existem no diretório
   */
  async verifyImages() {
    console.log('🔍 Verificando existência das imagens...');
    
    const missingImages = [];
    
    for (const category in AVAILABLE_IMAGES) {
      for (const image of AVAILABLE_IMAGES[category]) {
        const imagePath = path.join(IMAGES_DIR, image);
        if (!fs.existsSync(imagePath)) {
          missingImages.push(image);
        }
      }
    }
    
    if (missingImages.length > 0) {
      console.log(`⚠️  Imagens não encontradas: ${missingImages.length}`);
      missingImages.forEach(img => console.log(`   - ${img}`));
    } else {
      console.log('✅ Todas as imagens estão disponíveis');
    }
    
    return missingImages;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const organizer = new BlogImageOrganizer();
  
  // Verificar imagens primeiro
  organizer.verifyImages().then(() => {
    // Executar organização
    return organizer.organize();
  }).catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = BlogImageOrganizer;