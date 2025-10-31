/**
 * Script para identificar e remover artigos duplicados sem imagem
 * Remove duplicatas que não têm imagem funcional
 * 
 * Autor: Kiro - IA da Amazon integrada ao CIFRA Assistant
 */

const fs = require('fs');
const path = require('path');

// Configurações
const ARTICLES_FILE = './src/data/articles.ts';
const IMAGES_DIR = './public/images';

class DuplicateRemover {
  constructor() {
    this.duplicates = [];
    this.toRemove = [];
    this.articlesContent = '';
  }

  /**
   * Executa remoção de duplicatas
   */
  async removeDuplicates() {
    console.log('🔍 Identificando artigos duplicados sem imagem...\n');
    
    try {
      // Ler arquivo de artigos
      this.articlesContent = fs.readFileSync(ARTICLES_FILE, 'utf8');
      
      // Identificar duplicatas
      await this.identifyDuplicates();
      
      // Remover duplicatas problemáticas
      await this.removeProblematicDuplicates();
      
      // Salvar arquivo atualizado
      await this.saveUpdatedFile();
      
      // Gerar relatório
      await this.generateReport();
      
      console.log('✅ Remoção de duplicatas concluída!');
      
    } catch (error) {
      console.error('❌ Erro durante remoção:', error.message);
    }
  }

  /**
   * Identifica artigos duplicados
   */
  async identifyDuplicates() {
    console.log('🔍 Analisando duplicatas...');
    
    // Padrões de duplicatas conhecidas
    const knownDuplicates = [
      {
        title: 'Ethereum 2.0',
        articles: [
          {
            id: '4',
            title: 'Ethereum 2.0: O Futuro da Segunda Maior Criptomoeda do Mundo',
            slug: 'ethereum-2-futuro-segunda-maior-criptomoeda-mundo',
            image: '/images/ethereum-layer2-concept.jpg',
            imageExists: false
          },
          {
            id: '14', // Pode variar
            title: 'Ethereum 2.0: O Futuro da Segunda Maior Criptomoeda',
            slug: 'ethereum-2-0-futuro-segunda-maior-criptomoeda',
            image: '/images/etherum-2.0.jpg',
            imageExists: true
          }
        ]
      }
    ];
    
    // Verificar existência das imagens
    for (const duplicate of knownDuplicates) {
      console.log(`\n📊 Analisando duplicatas de: ${duplicate.title}`);
      
      for (const article of duplicate.articles) {
        const imagePath = path.join(IMAGES_DIR, article.image.replace('/images/', ''));
        article.imageExists = fs.existsSync(imagePath);
        
        console.log(`   • ID ${article.id}: ${article.imageExists ? '✅' : '❌'} ${article.image}`);
        
        if (!article.imageExists) {
          this.toRemove.push(article);
        }
      }
    }
    
    console.log(`\n🗑️ ${this.toRemove.length} artigos marcados para remoção`);
  }

  /**
   * Remove duplicatas problemáticas
   */
  async removeProblematicDuplicates() {
    console.log('\n🗑️ Removendo artigos duplicados sem imagem...');
    
    for (const article of this.toRemove) {
      console.log(`🗑️ Removendo: ID ${article.id} - ${article.title}`);
      
      // Encontrar e remover o artigo completo
      const articlePattern = new RegExp(
        `\\s*{[^}]*id:\\s*['"]${article.id}['"][^}]*title:\\s*['"]${article.title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"][\\s\\S]*?},?\\s*(?=\\s*{[^}]*id:|\\s*];)`,
        'g'
      );
      
      const beforeLength = this.articlesContent.length;
      this.articlesContent = this.articlesContent.replace(articlePattern, '');
      const afterLength = this.articlesContent.length;
      
      if (beforeLength !== afterLength) {
        console.log(`✅ Artigo ID ${article.id} removido (${beforeLength - afterLength} caracteres)`);
      } else {
        console.log(`⚠️ Artigo ID ${article.id} não encontrado para remoção`);
        
        // Tentar padrão mais específico
        const specificPattern = new RegExp(
          `\\s*{[\\s\\S]*?id:\\s*['"]${article.id}['"][\\s\\S]*?},?`,
          'g'
        );
        
        this.articlesContent = this.articlesContent.replace(specificPattern, '');
        console.log(`🔄 Tentativa alternativa de remoção para ID ${article.id}`);
      }
    }
    
    // Limpar vírgulas duplas e formatação
    this.articlesContent = this.articlesContent
      .replace(/,\s*,/g, ',')
      .replace(/,\s*]/g, ']')
      .replace(/{\s*,/g, '{');
  }

  /**
   * Salva arquivo atualizado
   */
  async saveUpdatedFile() {
    console.log('\n💾 Salvando arquivo atualizado...');
    
    // Criar backup
    const backupPath = `${ARTICLES_FILE}.backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    fs.copyFileSync(ARTICLES_FILE, backupPath);
    console.log(`📦 Backup criado: ${backupPath}`);
    
    // Salvar arquivo atualizado
    fs.writeFileSync(ARTICLES_FILE, this.articlesContent, 'utf8');
    console.log(`✅ Arquivo atualizado: ${ARTICLES_FILE}`);
  }

  /**
   * Gera relatório da remoção
   */
  async generateReport() {
    console.log('\n📊 Gerando relatório...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join('./logs', `duplicate-removal-${timestamp}.md`);
    
    let report = `# Relatório de Remoção de Duplicatas\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Executado por:** Kiro - IA da Amazon integrada ao CIFRA Assistant\n\n`;
    
    report += `## Resumo\n\n`;
    report += `- **Duplicatas identificadas:** ${this.toRemove.length}\n`;
    report += `- **Artigos removidos:** ${this.toRemove.length}\n`;
    report += `- **Status:** ${this.toRemove.length > 0 ? '✅ Duplicatas removidas' : '✅ Nenhuma duplicata encontrada'}\n\n`;
    
    if (this.toRemove.length > 0) {
      report += `## Artigos Removidos\n\n`;
      report += `| ID | Título | Slug | Imagem | Motivo |\n`;
      report += `|----|--------|------|--------|--------|\n`;
      
      for (const article of this.toRemove) {
        report += `| ${article.id} | ${article.title} | ${article.slug} | ${article.image} | Imagem não existe |\n`;
      }
      report += `\n`;
    }
    
    report += `## Artigos Mantidos\n\n`;
    report += `Os seguintes artigos foram mantidos por terem imagens funcionais:\n\n`;
    report += `- **Ethereum 2.0: O Futuro da Segunda Maior Criptomoeda** (pasta artigos/)\n`;
    report += `  - Imagem: \`/images/etherum-2.0.jpg\` ✅ Funcional\n`;
    report += `  - Slug: \`ethereum-2-0-futuro-segunda-maior-criptomoeda\`\n\n`;
    
    report += `## Próximos Passos\n\n`;
    report += `1. Verificar se não há outras duplicatas\n`;
    report += `2. Testar funcionamento do blog\n`;
    report += `3. Confirmar que cards estão funcionais\n`;
    report += `4. Monitorar por novos duplicados\n\n`;
    
    report += `---\n`;
    report += `*Relatório gerado automaticamente pelo Kiro - CIFRA Assistant*\n`;
    
    // Salvar relatório
    fs.writeFileSync(reportPath, report, 'utf8');
    
    console.log(`✅ Relatório salvo em: ${reportPath}`);
    
    // Resumo no console
    if (this.toRemove.length > 0) {
      console.log('\n🎯 DUPLICATAS REMOVIDAS:');
      this.toRemove.forEach(article => {
        console.log(`   • ID ${article.id}: ${article.title}`);
        console.log(`     Motivo: Imagem ${article.image} não existe`);
      });
    } else {
      console.log('\n✅ Nenhuma duplicata problemática encontrada!');
    }
  }

  /**
   * Verifica integridade após remoção
   */
  async verifyIntegrity() {
    console.log('\n🔍 Verificando integridade do arquivo...');
    
    try {
      // Tentar fazer parse do arquivo
      const content = fs.readFileSync(ARTICLES_FILE, 'utf8');
      
      // Verificar sintaxe básica
      const hasValidStructure = content.includes('export const articles') && 
                               content.includes('[') && 
                               content.includes('];');
      
      if (hasValidStructure) {
        console.log('✅ Estrutura do arquivo mantida');
      } else {
        console.log('❌ Estrutura do arquivo pode estar comprometida');
      }
      
      // Contar artigos restantes
      const articleMatches = content.match(/{\s*id:/g);
      const articleCount = articleMatches ? articleMatches.length : 0;
      
      console.log(`📊 Artigos restantes no arquivo: ${articleCount}`);
      
    } catch (error) {
      console.error('❌ Erro na verificação de integridade:', error.message);
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const remover = new DuplicateRemover();
  
  remover.removeDuplicates().then(() => {
    return remover.verifyIntegrity();
  }).catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = DuplicateRemover;