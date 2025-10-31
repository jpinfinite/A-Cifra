/**
 * Script para corrigir imagens quebradas dos cards do blog
 * Remove imagens problemáticas e substitui por alternativas funcionais
 * 
 * Autor: Kiro - IA da Amazon integrada ao CIFRA Assistant
 */

const fs = require('fs');
const path = require('path');

// Configurações
const ARTIGOS_DIR = './artigos';
const IMAGES_DIR = './public/images';

// Imagens problemáticas identificadas
const PROBLEMATIC_IMAGES = [
  'crypto-wallet-security.jpg', // Parece estar com problema
  'bitcoin-sem-identificacao.jpg' // Imagem genérica
];

// Mapeamento de substituições por categoria
const REPLACEMENT_MAPPING = {
  seguranca: [
    'digital-wallet-security.jpg',
    'crypto-wallet.jpg',
    'wallet.png'
  ],
  bitcoin: [
    'bitcoin-alta-resolucao.jpg',
    'bitcoin-coin-stack.jpg',
    'bitcoin-digital-circle.jpg',
    'bitcoin-global-network.jpg',
    'bitcoin-moeda-digital.jpg'
  ],
  defi: [
    'defi.jpg',
    'pools-liquidez-defi.webp'
  ],
  ethereum: [
    'ethereum-2-0-upgrade.jpg',
    'ethereum-analysis.jpg',
    'ethereum-blockchain.jpg',
    'ethereum-layer2-concept.jpg'
  ],
  analises: [
    'crypto-market-analysis.jpg',
    'crypto-trading-analysis.jpg',
    'crypto-trading-desk.jpg',
    'Como-Analisar-Criptomoedas.jpg'
  ],
  altcoins: [
    'crypto-coins-collection.jpg',
    'cryptocurrency-conceito.jpg',
    'digital-currencies-global.jpg'
  ],
  geral: [
    'blockchain-network-global.png',
    'blockchain-technology.jpg',
    'crypto-education-scene.jpg',
    'crypto-futuristic-scene.jpg',
    'transformacao-digital.jpg'
  ]
};

class ImageFixer {
  constructor() {
    this.fixes = [];
    this.usedImages = new Set();
  }

  /**
   * Executa correção das imagens
   */
  async fix() {
    console.log('🔧 Iniciando correção de imagens problemáticas...\n');
    
    try {
      // Ler artigos atuais
      const articles = await this.readArticles();
      
      // Identificar imagens em uso
      this.mapUsedImages(articles);
      
      // Corrigir imagens problemáticas
      await this.fixProblematicImages(articles);
      
      // Atualizar arquivos
      await this.updateFiles(articles);
      
      // Gerar relatório
      await this.generateReport();
      
      console.log('✅ Correção concluída!');
      
    } catch (error) {
      console.error('❌ Erro durante correção:', error.message);
    }
  }

  /**
   * Lê todos os artigos
   */
  async readArticles() {
    const articleFiles = fs.readdirSync(ARTIGOS_DIR)
      .filter(file => file.endsWith('.md') && file !== 'README.md');
    
    const articles = [];
    
    for (const filename of articleFiles) {
      const filePath = path.join(ARTIGOS_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extrair informações
      const coverImageMatch = content.match(/coverImage:\s*["']([^"']+)["']/);
      const categoryMatch = content.match(/category:\s*["']?([^"'\n]+)["']?/);
      const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
      
      if (coverImageMatch) {
        articles.push({
          filename,
          filePath,
          content,
          title: titleMatch ? titleMatch[1] : filename,
          category: categoryMatch ? categoryMatch[1] : 'geral',
          currentImage: coverImageMatch[1],
          imageName: coverImageMatch[1].replace('/images/', ''),
          needsFix: false,
          newImage: null
        });
      }
    }
    
    console.log(`📖 ${articles.length} artigos carregados`);
    return articles;
  }

  /**
   * Mapeia imagens já em uso
   */
  mapUsedImages(articles) {
    for (const article of articles) {
      this.usedImages.add(article.imageName);
    }
    console.log(`🗂️ ${this.usedImages.size} imagens mapeadas como em uso`);
  }

  /**
   * Corrige imagens problemáticas
   */
  async fixProblematicImages(articles) {
    console.log('🔍 Verificando imagens problemáticas...');
    
    for (const article of articles) {
      const imagePath = path.join(IMAGES_DIR, article.imageName);
      const isProblematic = PROBLEMATIC_IMAGES.includes(article.imageName);
      const imageExists = fs.existsSync(imagePath);
      
      // Verificar se precisa de correção
      if (isProblematic || !imageExists) {
        console.log(`⚠️  Problema detectado: ${article.filename} -> ${article.imageName}`);
        
        // Encontrar substituto
        const replacement = this.findReplacement(article.category);
        
        if (replacement) {
          article.needsFix = true;
          article.newImage = `/images/${replacement}`;
          this.usedImages.add(replacement);
          
          this.fixes.push({
            article: article.filename,
            title: article.title,
            category: article.category,
            oldImage: article.currentImage,
            newImage: article.newImage,
            reason: isProblematic ? 'Imagem problemática' : 'Imagem não encontrada'
          });
          
          console.log(`✅ Substituição: ${article.imageName} -> ${replacement}`);
        } else {
          console.log(`❌ Nenhuma substituição encontrada para ${article.filename}`);
        }
      }
    }
    
    console.log(`\n🔧 ${this.fixes.length} correções necessárias`);
  }

  /**
   * Encontra imagem substituta
   */
  findReplacement(category) {
    // Tentar categoria específica primeiro
    const categoryImages = REPLACEMENT_MAPPING[category] || [];
    
    for (const image of categoryImages) {
      if (!this.usedImages.has(image)) {
        const imagePath = path.join(IMAGES_DIR, image);
        if (fs.existsSync(imagePath)) {
          return image;
        }
      }
    }
    
    // Tentar imagens gerais
    for (const image of REPLACEMENT_MAPPING.geral) {
      if (!this.usedImages.has(image)) {
        const imagePath = path.join(IMAGES_DIR, image);
        if (fs.existsSync(imagePath)) {
          return image;
        }
      }
    }
    
    return null;
  }

  /**
   * Atualiza arquivos dos artigos
   */
  async updateFiles(articles) {
    console.log('💾 Atualizando arquivos...');
    
    for (const article of articles) {
      if (article.needsFix && article.newImage) {
        try {
          // Atualizar coverImage no conteúdo
          const updatedContent = article.content.replace(
            /coverImage:\s*["']?[^"'\n]*["']?/,
            `coverImage: "${article.newImage}"`
          );
          
          // Salvar arquivo
          fs.writeFileSync(article.filePath, updatedContent, 'utf8');
          
          console.log(`✅ Atualizado: ${article.filename}`);
          
        } catch (error) {
          console.error(`❌ Erro ao atualizar ${article.filename}:`, error.message);
        }
      }
    }
  }

  /**
   * Gera relatório da correção
   */
  async generateReport() {
    console.log('\n📊 Gerando relatório...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join('./logs', `image-fixes-${timestamp}.md`);
    
    let report = `# Relatório de Correção de Imagens\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Executado por:** Kiro - IA da Amazon integrada ao CIFRA Assistant\n\n`;
    
    report += `## Resumo\n\n`;
    report += `- **Correções realizadas:** ${this.fixes.length}\n`;
    report += `- **Status:** ${this.fixes.length > 0 ? '✅ Problemas corrigidos' : '✅ Nenhum problema encontrado'}\n\n`;
    
    if (this.fixes.length > 0) {
      report += `## Correções Realizadas\n\n`;
      report += `| Artigo | Categoria | Imagem Anterior | Nova Imagem | Motivo |\n`;
      report += `|--------|-----------|-----------------|-------------|--------|\n`;
      
      for (const fix of this.fixes) {
        report += `| ${fix.title} | ${fix.category} | ${fix.oldImage} | ${fix.newImage} | ${fix.reason} |\n`;
      }
      report += `\n`;
    }
    
    report += `## Próximos Passos\n\n`;
    report += `1. Verificar exibição dos cards no frontend\n`;
    report += `2. Testar carregamento das novas imagens\n`;
    report += `3. Otimizar imagens se necessário\n`;
    report += `4. Monitorar performance visual\n\n`;
    
    report += `---\n`;
    report += `*Relatório gerado automaticamente pelo Kiro - CIFRA Assistant*\n`;
    
    // Salvar relatório
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Relatório salvo em: ${reportPath}`);
    
    // Resumo no console
    if (this.fixes.length > 0) {
      console.log('\n🎯 CORREÇÕES REALIZADAS:');
      this.fixes.forEach(fix => {
        console.log(`   • ${fix.article}: ${fix.oldImage.split('/').pop()} -> ${fix.newImage.split('/').pop()}`);
      });
    } else {
      console.log('\n✅ Nenhuma correção necessária - todas as imagens estão funcionais!');
    }
  }

  /**
   * Remove imagens problemáticas do diretório
   */
  async cleanupProblematicImages() {
    console.log('\n🗑️ Limpando imagens problemáticas...');
    
    for (const image of PROBLEMATIC_IMAGES) {
      const imagePath = path.join(IMAGES_DIR, image);
      
      if (fs.existsSync(imagePath)) {
        try {
          // Mover para pasta de backup ao invés de deletar
          const backupDir = './logs/removed-images';
          if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
          }
          
          const backupPath = path.join(backupDir, image);
          fs.renameSync(imagePath, backupPath);
          
          console.log(`🗑️ Removida: ${image} -> backup em ${backupPath}`);
        } catch (error) {
          console.error(`❌ Erro ao remover ${image}:`, error.message);
        }
      }
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const fixer = new ImageFixer();
  
  fixer.fix().then(() => {
    // Opcionalmente limpar imagens problemáticas
    // return fixer.cleanupProblematicImages();
  }).catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = ImageFixer;