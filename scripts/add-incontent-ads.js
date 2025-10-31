#!/usr/bin/env node

/**
 * Script para adicionar InContentAd nos artigos restantes
 */

const fs = require('fs');
const path = require('path');

const articlesNeedingAds = [
  'erro-fatal-cem-por-cento',
  'diferenca-temperatura',
  'fantasma-golpes',
  'o-que-e-dinheiro',
  'primeira-compra'
];

console.log('📝 Adicionando InContentAd nos artigos restantes...\n');

articlesNeedingAds.forEach(slug => {
  const filePath = path.join('src', 'app', 'tema', slug, 'page.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar se já tem InContentAd
  if (content.includes('InContentAd')) {
    console.log(`⏭️  ${slug} - já tem InContentAd`);
    return;
  }
  
  // Adicionar import se não existir
  if (!content.includes("import { InContentAd }")) {
    // Encontrar a linha de imports e adicionar
    const importLines = content.split('\n');
    let importIndex = -1;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].includes("import") && importLines[i].includes("from")) {
        importIndex = i;
      }
      if (importLines[i].includes("import") && importLines[i].includes("styles")) {
        // Adicionar antes do import de styles
        importLines.splice(i, 0, "import { InContentAd } from '@/components/ads/InContentAd';");
        break;
      }
    }
    
    content = importLines.join('\n');
  }
  
  // Adicionar InContentAd no meio do conteúdo
  // Procurar por padrão de seções
  const sectionPattern = /(\s+<\/section>\s+)(\s+<section className={styles\.section}>)/;
  
  if (sectionPattern.test(content)) {
    // Adicionar após a primeira seção
    content = content.replace(
      sectionPattern,
      '$1\n            {/* Anúncio no meio do conteúdo */}\n            <InContentAd />\n$2'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${slug} - InContentAd adicionado`);
  } else {
    console.log(`⚠️  ${slug} - padrão de seção não encontrado`);
  }
});

console.log('\n✨ Processo concluído!');
