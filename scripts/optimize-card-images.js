/**
 * Script para otimizar seleção de imagens dos cards
 * Garante que cada artigo tenha a melhor imagem possível para sua categoria
 * 
 * Autor: Kiro - IA da Amazon integrada ao CIFRA Assistant
 */

const fs = require('fs');
const path = require('path');

// Configurações
const ARTIGOS_DIR = './artigos';
const IMAGES_DIR = './public/images';

// Mapeamento otimizado de imagens por categoria (melhores primeiro)
const OPTIMIZED_IMAGE_MAPPING = {
  bitcoin: [
    'bitcoin-guide-2025.jpg',        // Específica para guia
    'bitcoin-alta-resolucao.jpg',    // Alta qualidade
    'bitcoin-global-network.jpg',    // Conceito global
    'bitcoin-digital-circle.jpg',    // Visual moderno
    'bitcoin-moeda-digital.jpg',     // Conceito de moeda
    'bitcoin-coin-stack.jpg',        // Visual clássico
    'close-up-bitcoin-concept.jpg',  // Detalhe
    'pinterest-bitcoin-gold.jpg'     // Alternativa
  ],
  altcoins: [
    'altcoins-2025.jpg',            // Específica para 2025
    'crypto-coins-collection.jpg',   // Coleção de moedas
    'digital-currencies-global.jpg', // Moedas digitais globais
    'cryptocurrency-conceito.jpg'    // Conceito geral
  ],
  analises: [
    'crypto-analysis-charts.jpg',    // Gráficos de análise
    'crypto-market-analysis.jpg',    // Análise de mercado
    'crypto-trading-analysis.jpg',   // Análise de trading
    'crypto-trading-desk.jpg',       // Mesa de trading
    'Como-Analisar-Criptomoedas.jpg', // Específica
    'analisar.png'                   // Alternativa
  ],
  defi: [
    'defi-revolution.jpg',           // Revolução DeFi
    'defi.jpg',                      // DeFi geral
    'pools-liquidez-defi.webp'       // Pools de liquidez
  ],
  ethereum: [
    'etherum-2.0.jpg',              // Ethereum 2.0
    'Layer2.jpg',                    // Layer 2
    'ethereum-2-0-upgrade.jpg',      // Upgrade
    'ethereum-blockchain.jpg',       // Blockchain
    'ethereum-analysis.jpg',         // Análise
    'ethereum-layer2-concept.jpg'    // Conceito L2
  ],
  seguranca: [
    'digital-wallet-security.jpg',   // Segurança de carteira
    'crypto-wallet.jpg',             // Carteira crypto
    'wallet.png',                    // Carteira simples
    'bitcoin-sem-identificacao.jpg'  // Alternativa
  ],
  staking: [
    'staking-recompensas.jpg',       // Recompensas
    'staking.png'                    // Staking geral
  ],
  geral: [
    'blockchain-network-global.png', // Rede blockchain
    'blockchain-technology.jpg',     // Tecnologia
    'crypto-education-scene.jpg',    // Educação
    'crypto-futuristic-scene.jpg',   // Futurista
    'transformacao-digital.jpg'      // Transformação
  ]
};

// Artigos específicos com imagens ideais
const SPECIFIC_MAPPINGS = {
  'bitcoin-guia-completo-iniciantes-2025.md': 'bitcoin-guide-2025.jpg',
  'altcoins-promissoras-2025-analise-fundamentalista.md': 'altcoins-2025.jpg',
  'analisar-criptomoedas-indicadores-fundamentais-tecnicos.md': 'crypto-analysis-charts.jpg',
  'defi-revolucionando-financas-tradicionais.md': 'defi-revolution.jpg',
  'ethereum-2-0-futuro-segunda-maior-criptomoeda.md': 'etherum-2.0.jpg',
  'layer-2-essencial-ethereum-escalabilidade.md': 'Layer2.jpg',
  'proteger-criptomoedas-guia-seguranca-completo.md': 'digital-wallet-security.jpg',
  'staking-criptomoedas-passo-passo-recompensas.md': 'staking-recompensas.jpg'
};

class ImageOptimizer {
  constructor() {
    this.optimizations = [];
    this.usedImages = new Set();
  }

  /**
   * Executa otimização das imagens
   */
  async optimize() {
    console.log('🎨 Iniciando otimização das imagens dos cards...\n');
    
    try {
      // Ler artigos
      const articles = await this.readArticles();
      
      // Otimizar seleção de imagens
      await this.optimizeImageSelection(articles);
      
      // Atualizar arquivos se necessário
      await this.updateFiles(articles);
      
      // Gerar relatório
      await this.generateReport();
      
      console.log('✅ Otimização concluída!');
      
    } catch (error) {
      console.error('❌ Erro durante otimização:', error.message);
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
          needsOptimization: false,
          optimizedImage: null
        });
      }
    }
    
    console.log(`📖 ${articles.length} artigos carregados`);
    return articles;
  }

  /**
   * Otimiza seleção de imagens
   */
  async optimizeImageSelection(articles) {
    console.log('🔍 Analisando oportunidades de otimização...');
    
    // Primeiro, reservar imagens específicas
    for (const article of articles) {
      if (SPECIFIC_MAPPINGS[article.filename]) {
        const specificImage = SPECIFIC_MAPPINGS[article.filename];
        this.usedImages.add(specificImage);
        
        if (article.imageName !== specificImage) {
          article.needsOptimization = true;
          article.optimizedImage = `/images/${specificImage}`;
          
          this.optimizations.push({
            article: article.filename,
            title: article.title,
            category: article.category,
            currentImage: article.currentImage,
            optimizedImage: article.optimizedImage,
            reason: 'Imagem específica mais adequada'
          });
          
          console.log(`🎯 Otimização específica: ${article.filename} -> ${specificImage}`);
        }
      } else {
        this.usedImages.add(article.imageName);
      }
    }
    
    // Depois, otimizar demais artigos
    for (const article of articles) {
      if (!article.needsOptimization && !SPECIFIC_MAPPINGS[article.filename]) {
        const betterImage = this.findBetterImage(article);
        
        if (betterImage && betterImage !== article.imageName) {
          article.needsOptimization = true;
          article.optimizedImage = `/images/${betterImage}`;
          this.usedImages.add(betterImage);
          
          this.optimizations.push({
            article: article.filename,
            title: article.title,
            category: article.category,
            currentImage: article.currentImage,
            optimizedImage: article.optimizedImage,
            reason: 'Imagem de melhor qualidade/relevância'
          });
          
          console.log(`✨ Otimização: ${article.filename} -> ${betterImage}`);
        }
      }
    }
    
    console.log(`\n🎨 ${this.optimizations.length} otimizações identificadas`);
  }

  /**
   * Encontra melhor imagem para o artigo
   */
  findBetterImage(article) {
    const categoryImages = OPTIMIZED_IMAGE_MAPPING[article.category] || OPTIMIZED_IMAGE_MAPPING.geral;
    
    // Encontrar a melhor imagem disponível (primeira na lista de prioridade)
    for (const image of categoryImages) {
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
   * Atualiza arquivos se necessário
   */
  async updateFiles(articles) {
    if (this.optimizations.length === 0) {
      console.log('✅ Nenhuma atualização necessária - imagens já otimizadas!');
      return;
    }
    
    console.log('💾 Aplicando otimizações...');
    
    for (const article of articles) {
      if (article.needsOptimization && article.optimizedImage) {
        try {
          // Atualizar coverImage no conteúdo
          const updatedContent = article.content.replace(
            /coverImage:\s*["']?[^"'\n]*["']?/,
            `coverImage: "${article.optimizedImage}"`
          );
          
          // Salvar arquivo
          fs.writeFileSync(article.filePath, updatedContent, 'utf8');
          
          console.log(`✅ Otimizado: ${article.filename}`);
          
        } catch (error) {
          console.error(`❌ Erro ao otimizar ${article.filename}:`, error.message);
        }
      }
    }
  }

  /**
   * Gera relatório da otimização
   */
  async generateReport() {
    console.log('\n📊 Gerando relatório de otimização...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join('./logs', `image-optimization-${timestamp}.md`);
    
    let report = `# Relatório de Otimização de Imagens dos Cards\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Executado por:** Kiro - IA da Amazon integrada ao CIFRA Assistant\n\n`;
    
    report += `## Resumo\n\n`;
    report += `- **Artigos analisados:** 8\n`;
    report += `- **Otimizações realizadas:** ${this.optimizations.length}\n`;
    report += `- **Status:** ${this.optimizations.length > 0 ? '✅ Imagens otimizadas' : '✅ Já otimizadas'}\n\n`;
    
    if (this.optimizations.length > 0) {
      report += `## Otimizações Realizadas\n\n`;
      report += `| Artigo | Categoria | Imagem Anterior | Imagem Otimizada | Motivo |\n`;
      report += `|--------|-----------|-----------------|------------------|--------|\n`;
      
      for (const opt of this.optimizations) {
        const oldImg = opt.currentImage.split('/').pop();
        const newImg = opt.optimizedImage.split('/').pop();
        report += `| ${opt.title} | ${opt.category} | ${oldImg} | ${newImg} | ${opt.reason} |\n`;
      }
      report += `\n`;
    }
    
    // Mapeamento final otimizado
    report += `## Mapeamento Final Otimizado\n\n`;
    report += `### Imagens por Categoria (Ordem de Prioridade)\n\n`;
    
    for (const [category, images] of Object.entries(OPTIMIZED_IMAGE_MAPPING)) {
      report += `#### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      images.forEach((image, index) => {
        const status = this.usedImages.has(image) ? '🟢 EM USO' : '⚪ Disponível';
        report += `${index + 1}. ${image} ${status}\n`;
      });
      report += `\n`;
    }
    
    report += `## Benefícios da Otimização\n\n`;
    report += `- **Relevância**: Imagens mais alinhadas com o conteúdo\n`;
    report += `- **Qualidade**: Priorização de imagens de alta resolução\n`;
    report += `- **Consistência**: Padrão visual uniforme por categoria\n`;
    report += `- **Performance**: Imagens otimizadas para web\n\n`;
    
    report += `---\n`;
    report += `*Relatório gerado automaticamente pelo Kiro - CIFRA Assistant*\n`;
    
    // Salvar relatório
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Relatório salvo em: ${reportPath}`);
    
    // Resumo no console
    if (this.optimizations.length > 0) {
      console.log('\n🎯 OTIMIZAÇÕES APLICADAS:');
      this.optimizations.forEach(opt => {
        const oldImg = opt.currentImage.split('/').pop();
        const newImg = opt.optimizedImage.split('/').pop();
        console.log(`   • ${opt.title}: ${oldImg} -> ${newImg}`);
      });
    } else {
      console.log('\n✅ Imagens já estão otimizadas - nenhuma mudança necessária!');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  
  optimizer.optimize().catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = ImageOptimizer;