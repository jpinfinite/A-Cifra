const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, '../content/articles');

// Campos obrigatórios para o Next.js reconhecer o artigo
const REQUIRED_FIELDS = ['title', 'publishedAt', 'categorySlug'];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixed = false;

  // 1. Remove BOM se existir
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
    fixed = true;
  }

  // 2. Garante que começa com ---
  if (!content.trim().startsWith('---')) {
    content = `---\n${content.trim()}`;
    fixed = true;
  }

  // 3. Verifica se tem o segundo ---
  const parts = content.split('---');
  if (parts.length < 3) {
    // Tenta encontrar onde acaba o frontmatter (primeira linha vazia ou #)
    const endOfFrontmatter = content.indexOf('\n\n') > -1 ? content.indexOf('\n\n') : content.indexOf('\n#');

    if (endOfFrontmatter > -1) {
      content = content.slice(0, endOfFrontmatter) + '\n---\n' + content.slice(endOfFrontmatter);
      fixed = true;
    }
  }

  // 4. Limpa colchetes quebrados que sobraram (ex: [defi](/artigo/...) no título)
  // Isso pode impedir o parser de YAML de ler corretamente
  const frontmatter = content.split('---')[1];
  if (frontmatter && (frontmatter.includes('](') || frontmatter.includes('['))) {
    let cleanFm = frontmatter.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Remove links markdown
    cleanFm = cleanFm.replace(/[\[\]]/g, ''); // Remove colchetes soltos

    // Reconstrói
    const parts = content.split('---');
    parts[1] = cleanFm;
    content = parts.join('---');
    fixed = true;
  }

  // 5. Verifica aspas quebradas em campos
  // Ex: title: 'Investindo em [Bitcoin]' -> title: 'Investindo em Bitcoin'
  // Às vezes o parser YAML quebra se tiver caracteres estranhos

  if (fixed && content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Reparado: ${path.basename(filePath)}`);
    return true;
  }

  return false;
}

function main() {
  console.log('🚑 Iniciando Diagnóstico e Reparo de Artigos...\n');

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  let repairedCount = 0;
  let validCount = 0;

  files.forEach(file => {
    try {
      if (fixFile(path.join(articlesDir, file))) {
        repairedCount++;
      }

      // Validação básica
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
      const fm = content.split('---')[1];
      if (fm && fm.includes('title:') && fm.includes('publishedAt:')) {
        validCount++;
      } else {
        console.log(`❌ INVÁLIDO (Ainda com problemas): ${file}`);
      }

    } catch (e) {
      console.log(`❌ ERRO CRÍTICO em ${file}: ${e.message}`);
    }
  });

  console.log(`\n📊 Relatório Final:`);
  console.log(`   Total de arquivos: ${files.length}`);
  console.log(`   Arquivos reparados agora: ${repairedCount}`);
  console.log(`   Arquivos válidos (estimado): ${validCount}`);

  if (validCount < files.length) {
    console.log(`\n⚠️  Ainda existem ${files.length - validCount} arquivos que o Next.js pode não ler.`);
  } else {
    console.log(`\n✅ Todos os arquivos parecem válidos!`);
  }
}

main();
