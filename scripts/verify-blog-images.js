/**
 * Script de verificação final das imagens dos cards do blog
 * Confirma que todas as imagens estão únicas e funcionais
 * 
 * Autor: Kiro - IA da Amazon integrada ao CIFRA Assistant
 */

const fs = require('fs');
const path = require('path');

// Configurações
const ARTIGOS_DIR = './artigos';
const IMAGES_DIR = './public/images';

class BlogImageVerifier {
  constructor() {
    this.results = {
      articles: [],
      duplicates: [],
      missing: [],
      unused: [],
      summary: {}
    };
  }

  /**
   * Executa verificação completa
   */
  async verify() {
    console.log('🔍 Verificando organização das imagens dos cards...\n');
    
    try {
      // Ler artigos
      const articles = await this.readArticles();
      
      // Verificar duplicatas
      await this.checkDuplicates(articles);
      
      // Verificar imagens existentes
      await this.checkMissingImages(articles);
      
      // Verificar imagens não utilizadas
      await this.checkUnusedImages(articles);
      
      // Gerar relatório final
      await this.generateFinalReport();
      
      console.log('✅ Verificação concluída!');
      
    } catch (error) {
      console.error('❌ Erro durante verificação:', error.message);
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
      
      // Extrair coverImage
      const coverImageMatch = content.match(/coverImage:\s*["']([^"']+)["']/);
      const categoryMatch = content.match(/category:\s*["']?([^"'\n]+)["']?/);
      const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
      
      if (coverImageMatch) {
        articles.push({
          filename,
          title: titleMatch ? titleMatch[1] : filename,
          category: categoryMatch ? categoryMatch[1] : 'geral',
          coverImage: coverImageMatch[1],
          imageName: coverImageMatch[1].replace('/images/', '')
        });
      }
    }
    
    this.results.articles = articles;
    console.log(`📖 ${articles.length} artigos processados`);
    return articles;
  }

  /**
   * Verifica duplicatas
   */
  async checkDuplicates(articles) {
    console.log('🔄 Verificando duplicatas...');
    
    const imageUsage = {};
    
    for (const article of articles) {
      const imageName = article.imageName;
      
      if (imageUsage[imageName]) {
        this.results.duplicates.push({
          image: imageName,
          articles: [imageUsage[imageName], article.filename]
        });
      } else {
        imageUsage[imageName] = article.filename;
      }
    }
    
    if (this.results.duplicates.length === 0) {
      console.log('✅ Nenhuma duplicata encontrada');
    } else {
      console.log(`⚠️  ${this.results.duplicates.length} duplicatas encontradas`);
      this.results.duplicates.forEach(dup => {
        console.log(`   ${dup.image}: ${dup.articles.join(', ')}`);
      });
    }
  }

  /**
   * Verifica imagens faltantes
   */
  async checkMissingImages(articles) {
    console.log('🖼️  Verificando imagens existentes...');
    
    for (const article of articles) {
      const imagePath = path.join(IMAGES_DIR, article.imageName);
      
      if (!fs.existsSync(imagePath)) {
        this.results.missing.push({
          article: article.filename,
          image: article.imageName,
          path: imagePath
        });
      }
    }
    
    if (this.results.missing.length === 0) {
      console.log('✅ Todas as imagens existem');
    } else {
      console.log(`❌ ${this.results.missing.length} imagens não encontradas`);
      this.results.missing.forEach(missing => {
        console.log(`   ${missing.article}: ${missing.image}`);
      });
    }
  }

  /**
   * Verifica imagens não utilizadas
   */
  async checkUnusedImages(articles) {
    console.log('📊 Verificando imagens não utilizadas...');
    
    const usedImages = new Set(articles.map(a => a.imageName));
    const allImages = fs.readdirSync(IMAGES_DIR).filter(file => 
      file.match(/\.(jpg|jpeg|png|webp|gif)$/i)
    );
    
    for (const image of allImages) {
      if (!usedImages.has(image)) {
        // Verificar se é imagem de categoria específica que pode ser usada
        const isRelevant = this.isRelevantImage(image);
        if (isRelevant) {
          this.results.unused.push(image);
        }
      }
    }
    
    console.log(`📈 ${usedImages.size} imagens em uso`);
    console.log(`📉 ${this.results.unused.length} imagens relevantes não utilizadas`);
  }

  /**
   * Verifica se imagem é relevante para o blog
   */
  isRelevantImage(imageName) {
    const relevantKeywords = [
      'bitcoin', 'crypto', 'blockchain', 'ethereum', 'defi', 'staking',
      'altcoin', 'trading', 'analysis', 'wallet', 'security', 'layer'
    ];
    
    const lowerName = imageName.toLowerCase();
    return relevantKeywords.some(keyword => lowerName.includes(keyword));
  }

  /**
   * Gera relatório final
   */
  async generateFinalReport() {
    console.log('\n📋 Gerando relatório final...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join('./logs', `blog-images-verification-${timestamp}.md`);
    
    let report = `# Verificação Final das Imagens dos Cards do Blog\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Executado por:** Kiro - IA da Amazon integrada ao CIFRA Assistant\n\n`;
    
    // Resumo
    report += `## ✅ Resumo da Verificação\n\n`;
    report += `- **Total de artigos:** ${this.results.articles.length}\n`;
    report += `- **Imagens duplicadas:** ${this.results.duplicates.length}\n`;
    report += `- **Imagens faltantes:** ${this.results.missing.length}\n`;
    report += `- **Imagens não utilizadas:** ${this.results.unused.length}\n`;
    report += `- **Status:** ${this.getOverallStatus()}\n\n`;
    
    // Mapeamento atual
    report += `## 🗂️ Mapeamento Atual dos Cards\n\n`;
    report += `| Artigo | Categoria | Imagem | Status |\n`;
    report += `|--------|-----------|--------|--------|\n`;
    
    for (const article of this.results.articles) {
      const status = this.results.missing.some(m => m.article === article.filename) ? '❌ Faltante' : '✅ OK';
      report += `| ${article.title} | ${article.category} | ${article.imageName} | ${status} |\n`;
    }
    report += `\n`;
    
    // Problemas encontrados
    if (this.results.duplicates.length > 0) {
      report += `## ⚠️ Imagens Duplicadas\n\n`;
      for (const dup of this.results.duplicates) {
        report += `- **${dup.image}**: ${dup.articles.join(', ')}\n`;
      }
      report += `\n`;
    }
    
    if (this.results.missing.length > 0) {
      report += `## ❌ Imagens Faltantes\n\n`;
      for (const missing of this.results.missing) {
        report += `- **${missing.article}**: ${missing.image}\n`;
      }
      report += `\n`;
    }
    
    // Sugestões de melhoria
    if (this.results.unused.length > 0) {
      report += `## 💡 Imagens Disponíveis para Uso\n\n`;
      report += `As seguintes imagens estão disponíveis e podem ser utilizadas:\n\n`;
      for (const unused of this.results.unused.slice(0, 10)) {
        report += `- ${unused}\n`;
      }
      if (this.results.unused.length > 10) {
        report += `- ... e mais ${this.results.unused.length - 10} imagens\n`;
      }
      report += `\n`;
    }
    
    // Recomendações
    report += `## 🎯 Recomendações\n\n`;
    
    if (this.results.duplicates.length === 0 && this.results.missing.length === 0) {
      report += `✅ **Organização Perfeita!** Todos os cards têm imagens únicas e funcionais.\n\n`;
      report += `### Próximos Passos:\n`;
      report += `1. Otimizar imagens para web (compressão, dimensões)\n`;
      report += `2. Adicionar alt text para acessibilidade\n`;
      report += `3. Implementar lazy loading nos cards\n`;
      report += `4. Considerar WebP para melhor performance\n`;
    } else {
      if (this.results.duplicates.length > 0) {
        report += `1. **Resolver duplicatas**: Atribuir imagens únicas para cada artigo\n`;
      }
      if (this.results.missing.length > 0) {
        report += `2. **Adicionar imagens faltantes**: Criar ou encontrar imagens para os artigos\n`;
      }
      report += `3. **Verificar novamente**: Executar verificação após correções\n`;
    }
    
    report += `\n---\n`;
    report += `*Relatório gerado automaticamente pelo Kiro - CIFRA Assistant*\n`;
    
    // Salvar relatório
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Relatório salvo em: ${reportPath}`);
    
    // Exibir status no console
    console.log('\n🎯 STATUS FINAL:');
    console.log(`   • ${this.results.articles.length} artigos verificados`);
    console.log(`   • ${this.results.duplicates.length} duplicatas`);
    console.log(`   • ${this.results.missing.length} imagens faltantes`);
    console.log(`   • Status: ${this.getOverallStatus()}`);
  }

  /**
   * Determina status geral
   */
  getOverallStatus() {
    if (this.results.duplicates.length === 0 && this.results.missing.length === 0) {
      return '✅ PERFEITO - Todas as imagens são únicas e existem';
    } else if (this.results.missing.length > 0) {
      return '❌ CRÍTICO - Imagens faltantes encontradas';
    } else if (this.results.duplicates.length > 0) {
      return '⚠️ ATENÇÃO - Duplicatas encontradas';
    }
    return '❓ DESCONHECIDO';
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const verifier = new BlogImageVerifier();
  verifier.verify().catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = BlogImageVerifier;